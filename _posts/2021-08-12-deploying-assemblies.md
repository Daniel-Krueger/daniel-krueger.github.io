---
title: "Deploying assemblies to GAC"
categories:
  - Private
  - WEBCON BPS  
tags:
  - Application Template  
excerpt:
    This post describes an approach to deploy assemblies to the GAC.
bpsVersion: 2021.1.3.205
---

# Overview  
In the previous post [Deploying database scripts](https://daniels-notes.de/posts/2021/deploying-database-scripts), I've written about reason why it can be necessary to create own SQL views, stored procedures or functions and how they can be deployed. This time it's about deploying assemblies to the GAC.

A plugin package contains all necessary assemblies. If the application is transferred to another environment, a used plugin is transferred too. If a plugin action is executed the assemblies are loaded dynamically from the database. So, everything is fine, at least in most cases.
I encountered only two exceptions:
1. A plugin action is executed in a timeout\
  The WebCon.Workflow.Service executed the plugin action. This caused a `Could not load file or assembly 'Newtonsoft.Json,...` exception. I was advised to deploy the assembly to the GAC by the WEBCON Support team. This was in 2020, so could be different with BPS 2021.
2. Using Razor\
  I'm using Razor, more precisely, the [RazorEngine](https://github.com/Antaris/RazorEngine) in a plugin. I'm no expert on how Razor works but, in the end, I needed a physical file for each assembly which is used in a template. As mentioned above, plugin assemblies don't have a physical file, therefore I needed to deploy the assemblies used within a template to the GAC.


{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-11-21-35-42.png" alt="Assemblies deployed to the GAC using a process." caption="Assemblies deployed to the GAC using a process." %}

# Taking advantage of document template processes
Document template processes work like dictionary processes. When a document template process is transported, you can choose whether the templates will be exported or imported. In combination with the [Run a PowerShell script](https://howto.webcon.com/powershell-action/) action we can transport the assemblies and deploy them to the GAC.
1. The document template processes does not store templates in the original meaning but assemblies.
2. Upon path transition the assemblies are deployed to the GAC.

This allows a controlled deployment of the required assemblies.

# Interesting, but WHY?
If you are wondering why I'm going to such length and what's the benefit of all this, here are my reasons:
1. I have an auditable history of these deployments
2. I'm in the consultancy business so it's likely that I need to deploy those assemblies not only to our environments but to those of our customers too.
3. I can provide an explanation why an assembly is necessary and can act if this reason is no longer valid.
{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-22-10-04.png" alt="" caption="" %}

# Application Artifact deployment
## Using the process Assembly deployment
The application `Artifact deployment` contains the document template process `Assembly deployment`. This process stores the assemblies which should be deploy to (activate) or removed from (deactivate) the GAC. I kept the activate/deactivate wording to keep in line with other dictionary processes. Once the path `Trigger update` is executed the following will happen:
1. A one-minute timeout will be triggered, which send a mail to the application supervisor, that it has been triggered.
2. The timeout will deploy the assembly or remove it from the GAC. This depends on the `Active` flag is set. Upon completion the `Deployed` checkbox will be set accordingly, and the application supervisor will receive a 'success' mail. The assembly will be deployed to each defined server.
3. If this fails, an error path will be executed which will send a mail to the application supervisor.


{: .notice--info}
**Info:** During the development I noticed that a failure of the deployment doesn't necessarily trigger the error path. Therefore the 'success' mail is sent.

In addition to these paths there's another one `Prepare for export`. The reason for this is explained in the chapter [Transferring the assemblies(#transferring-the-assemblies).


{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-11-22-28-07.png" alt="Assembly document template example." caption="Assembly document template example." %}

Each action changes the `State`, these are:
1. Only saved
2. Update triggered
3. Update executed
4. Update failed
5. Ready for export
  
## Transferring the assemblies
You have two options to move the assemblies from one environment to another. Either as a part of the application package or using the export/import functionality on the report.
{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-21-44-52.png" alt="You can export and import templates from the report." caption="You can export and import templates from the report." %}

Before you can export the templates though, you have to execute the `Prepare for export` path. This is available as a quick path.

{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-21-46-10.png" alt="Check all assemblies (1) and execute prepare for (2)." caption="Check all assemblies (1) and execute prepare for (2)." %}

 This will remove the Base64 string from the workflow instance. It's necessary because an excel cell can store round about 32k characters. Even so this is a lot, it's not enough. The string of Newtonsoft.Json.dll is about 871k long.

 After you have imported the assemblies or deployed the package you have to trigger the update. This can be done selecting all (1) and executing the `Mass activate/deactivate with deployment` action on the report.

 {% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-21-50-50.png" alt="You can quickly trigger the deployment/removal for multiple assemblies from the report." caption="You can quickly trigger the deployment/removal for multiple assemblies from the report." %}


## Setup
After importing the application package you have to do the following:
1. Set an application supervisor, who will receive the mails.
2. Grant privileges, ok this is obvious.
3. Most importantly, activate remote PowerShell, if you have multiple servers in your environment. This was already the case in my environment. If it's not setup in yours, you could take a look here:  
    * [About remote requirements](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_requirements?view=powershell-7.1)
    * [PowerShell action: How to prepare environment](https://howto.webcon.com/powershell-action/)
4. Set the login and password for each PowerShell action. They are stored as templates for easy access.
    {% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-21-42-10.png" alt="It's necessary to set the login and password." caption="It's necessary to set the login and password." %}
5. Define on which environment local users or AD users are used by changing the values of the `UsesLocalAccount` process constant.
    {% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-22-26-30.png" alt="Only on dev a local account is used for deployment." caption="Only on dev a local account is used for deployment." %}

## GAC deployment/removal explanation
The assembly is deployed to the GAC using the `Run a PowerShell script` action. The script will deploy the assembly to each configured target server, for the current environment, this requires a few prerequisites which are listed in chapter [Setup](#setup)
The script creates a physical copy of the 'attachment' in the temp folder which will be removed again after execution. This file will be used for deployment or removal from the GAC. The physical file is created using the `CONTENT AS BASE64` function. 

{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-11-22-41-29.png" alt="Getting the content of an attachment as BASE64" caption="Getting the content of an attachment as BASE64" %}

Using this string the file is created on the (remote) server. The file is deployed to the GAC using [GACInstall](https://docs.microsoft.com/en-us/dotnet/api/system.enterpriseservices.internal.publish.gacinstall?view=netframework-4.8#System_EnterpriseServices_Internal_Publish_GacInstall_System_String_) or removed with [GACRemove](https://docs.microsoft.com/en-us/dotnet/api/system.enterpriseservices.internal.publish.gacremove?view=netframework-4.8). This requires administrative privileges, therefore it is checked, whether the provided credentials are valid, and that the user has administrative privileges on the executing server. These credentials are validated for a local machine account as well as a domain account.

{: .notice--warning}
**Warning:** The credential validation will behave the same, as the user itself would enter his credentials. If the credentials are wrong, and the script is executed repeatable, the account will be locked.

During the tests on my _low performance_ development machine the Base64 encoding took a lot of time. Getting the Base64 encoded string and executing the script took so long, that the path transition was aborted after one minute. As a solution I moved the encoding to the `Trigger update` path and saved the value to a field.

There are six different actions. The reason for this is, that there ~~should~~ could be different users for each environment whit administrative privileges. Therefore, there have to be three actions. I distinguished install and uninstall to make it visible in the history which actions was executed. The script itself is the same in each action.

{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-21-36-31.png" alt="There are six PowerShell actions for install and uninstall." caption="There are six PowerShell actions for install and uninstall." %}

# Remarks
## Contained Business entities
Unfortunately, the package contains three business entities. Make sure that you don't overwrite yours during the import.

## Insufficient privileges
As mention in [Setup](#Setup) it's necessary that the username and passwords have been provided. In addition the user has to be an administrator on the target servers. Otherwise it's not possible to deploy the assemblies to the GAC.

## Script development
The script development was done mostly outside of BPS. I added the script itself [here](https://github.com/Daniel-Krueger/webcon_artifactDeployment/blob/main/2021.1.3.205/RemoteDeployment_fromBPS.ps1). The first part of the script contains lines used for development using the ISE (1). All lines below can be copied from/to the PowerShell action within WEBCON BPS (2).

{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-11-22-39-06.png" alt="The PS script contains lines for development (1) as well as the PowerShell action script (2). " caption="The PS script contains lines for development (1) as well as the PowerShell action script (2). " %}

The initial lines are used for development and contain the binary information of Newtonsoft.Json.dll in base 64 format. These are characters and copying the whole script to BPS will freeze or even kill it. Likewise, the assignment of the Base64 string to the PowerShell variable (1) should be removed **before** clicking on show (2). 

{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-21-26-35.png" alt="Never click on show (2) before you have removed the `AttachmentAsBase64` variable" caption="Never click on show (2) before you have removed the `AttachmentAsBase64` variable" %}

The target assignments had to be moved outside of the if clause, because the BPS variables won't be replaced otherwise. The BPS variables for fields are `{FIELDNUMBER}` (1), which could be a valid PowerShell expression. The other variables (2) have a prefix, so they can be replaced within scopes. 

{% include figure image_path="/assets/images/posts/2021-08-15-deploying-assemblies/2021-08-12-21-29-21.png" alt="Field variables can't be placed within scopes (1), they can't be distinguished from real PowerShell as the other variables (2)." caption="Field variables can't be placed within scopes (1), they can't be distinguished from real PowerShell as the other variables (2)." %}

# Download
If you would like the application template or to take a look at the script, you can go over to the GitHub [repository](https://github.com/Daniel-Krueger/webcon_artifactDeployment).

The application package does not contain any assemblies.