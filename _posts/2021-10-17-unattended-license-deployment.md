---
title: "Unattended OnPrem license deployment to multiple server instances"
categories:
  - CC LS
  - BC
tags:
  - PowerShell
excerpt:
    If you are staying up late, to deploy a new BC license outside working hours you should read this post.
---

# Overview  
I just participated in a few internal newbie BC trainings to bring me up to date. After all I left the NAV world in 2010 and quite a lot has changed. One subject of the trainings was how to update a license file. There's nothing really interesting about the PowerShell command which is [documented](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/cside/cside-upload-license-file) well. There's one issue though. According to the documentation you need to restart the server instance. When the command is executed, I get the following warning:
```powershell
C:\run> Import-NAVServerLicense -LicenseFile c:\run\my\license.flf -ServerInstance NAV
WARNING: Importing a license file requires a restart of other services using the same database.
```
So, do we need to restart all server instances except the one we used for importing the license file, because the warning mentions _other_ services? Asking around my colleagues I received the reply, that I should restart all server instances. Searching the internet for an answer did only return an old, and probably deleted blog post. Using [archive.org](https://web.archive.org/web/20200806153626/https://dynamicsuser.net/nav/b/peik/posts/tips-for-wizards-in-dynamics-nav-and-365-business-central) I got a hint that it could be done, without restarting the servers. 
>Update License without rebooting the service tier\
>It is possible to install a license file without restarting the service tier:\
>Go to PowerShell and import it then it does not need restarting:\
>Waldo would be so proud of me now  \
>Thank you to all those, who taught me the above along the way.

Unfortunately, the images are missing, so this turned out to be a dead end.

Maybe the restart could be prevented by importing the license multiple times, but using a different server instance each time? I haven't tested this approach but went down another one. If I can not be sure, whether I need to restart a server instance, I just need to make sure, that I can do this in an unattended way during the night and log this.

# Unattended licenses import approach
I created a lot of PowerShell scripts in the past, which had to be executed automatically. So my first thought was, that I could easily achieve an unattended import using the Windows Task Scheduler. Knowing that it was possible I only had to solve two other 'problems'. The PowerShell script needed to be executed with administrative privileges and I needed some kind of logging, but I did want to solve this using the out of the box options provided by  PowerShell. 
I solved the administrative executed by using the System account. I used the System account, because I want to be able to export the task and reuse it on another system. On this one there may not be a dedicated service account.
{% include figure image_path="/assets/images/posts/2021-10-17-unattended-license-deployment/2021-10-17-21-49-53.png" alt="The task will be executed with administrative privileges." caption="The task will be executed with administrative privileges." %}

Importing a license doesn't happen very often, so I needed an option to create a trigger which is executed once. The one time option didn't work with the System account for some reason. So, I created a daily schedule (1) but added an expire date (2) just after the schedule. The daily schedule is executed once and due to the expiration date, a `Next run time` won't be scheduled (3).
{% include figure image_path="/assets/images/posts/2021-10-17-unattended-license-deployment/2021-10-17-22-01-35.png" alt="If a daily task (1) has an expiration date just after the schedule (2), it will only run once." caption="If a daily task (1) has an expiration date just after the schedule (2), it will only run once." %}

An easy option to log something in PowerShell is [Start-Transcript](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.host/start-transcript?view=powershell-7.1). I wasn't aware that a few bugs have been fixed over the years, so it was a pleasant surprise to find a really useful log.
{% include figure image_path="/assets/images/posts/2021-10-17-unattended-license-deployment/2021-10-17-21-59-09.png" alt="Log result of Start-Transcript." caption="Log result of Start-Transcript." %}

# Using the files
The necessary files can be [downloaded](https://github.com/Daniel-Krueger/PowerShell_Snippets/tree/main/BC) from my GitHub:
{% include figure image_path="/assets/images/posts/2021-10-17-unattended-license-deployment/2021-10-17-22-10-16.png" alt="These files are necessary for the unattended license import." caption="These files are necessary for the unattended license import." %}
1. Changing `Deploy license.xml`\
  This file is the exported task scheduler job. I recommend to change the folder path of the `Arguments` and `WorkingDirectory` nodes before importing. At least if you don't saved the files in `c:\cosmo\License`. :) This will be a little easier than from the task scheduler due to the small dialog window.
{% include figure image_path="/assets/images/posts/2021-10-17-unattended-license-deployment/2021-10-17-22-16-28.png" alt="The folder paths should be amended to your environment." caption="The folder paths should be amended to your environment." %}

1. Changing `ExecuteImportLicense.ps1`\
  This script should be placed inside the same folder as `NavHelper.psm1`. Otherwise you need to modify the path in line 1. What needs to be changed though is the path to the license file which should be updated. The log file will also be stored in the folder in which the license file exists.
  ```powershell
  Import-Module .\NAVHelper.psm1 -force
  $file = "C:\Temp\German Developer BC V14_W1.flf"
  $instancesToExclude = @()
  Import-License  -file $file -instancesToExclude $instancesToExclude
  ```
3. Importing the task\
   This task needs to be executed with administrative privileges, therefore the task scheduler needs to be run as an administrator (1). Afterwards you can use the `Import Task` option (2) to import `Deploy license.xml`
   {% include figure image_path="/assets/images/posts/2021-10-17-unattended-license-deployment/2021-10-17-22-23-27.png" alt="The task needs to be imported with administrative privileges." caption="The task needs to be imported with administrative privileges." %}
4. Setting up the schedule. \
   Just change the daily schedule and the expiration date and you are good to go.


# NAVHelper.psm1 explanations
## Administrative privileges required.
We need these privileges because the service will be restarted. 
## BC Version independent
I've tested this script against BC 14 as well as BC 18.5 and it will probably work against all other versions. At least as long as Microsoft doesn't change the naming of the service executable. I haven't seen this kind of change in my SharePoint career, and I don't expect this to happen in BC either. 

```powershell
function Get-NAVServiceFolder (){
    $services = Get-Service | where {$_.Name.toLower().StartsWith("MicrosoftDynamicsNavServer".ToLower())}
    $serviceExecutionPath = (gwmi win32_service|?{$_.name -eq $services[0].Name}).pathname
    $serviceFolder = $serviceExecutionPath.Substring(1,$serviceExecutionPath.IndexOf("Microsoft.Dynamics.Nav.Server.exe")-2)
    return $serviceFolder    
}
$serviceFolder  = Get-NAVServiceFolder
import-module "$serviceFolder\NavAdminTool.ps1" -Force
```
## Excluding some instances
If you are running multiple service instances, you can provide an array of those instance names, which should be ignored. Example: You are running a different license in a DEV instance than in the other, you may exclude the DEV instance from the script with this parameter.
```powershell
$instancesToExclude = @("DEV")
Import-License   -file $file -instancesToExclude $instancesToExclude
....
if ($service.Serverinstance.endswith('$'+$instanceToExclude)){
  Write-Host "License will not be imported to $($service.Serverinstance)"  -ForegroundColor Yellow
}                    
```

# Download
There's currently not much BC related, so I put the required script in my [PowerShell_Snippets](https://github.com/Daniel-Krueger/PowerShell_Snippets/tree/main/BC) repository.
