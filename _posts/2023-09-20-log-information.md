---
title: "Log information"
categories:
  - WEBCON BPS   
  - Private  
tags:    
  - Debugging
  - Setup  
excerpt:
    This post provides information where you can find which log information.
bpsVersion: 2023.1.2.44
---

# Overview  
The more capable a tool is, the more opportunities you have to cause a problem.  Even so WEBCON BPS is doing a really great job in preventing these, there will be cases, where you will see an  `Unexpected error` or similar. Especially if your fiddling around with JavaScript or you communicate with external systems.\
Depending on what caused this, more information can be retrieved within the browser directly or from log tables. 

![More information can be found in the log tables and file.](/assets/images/posts/2023-09-20-log-information/2023-09-17-20-26-29.png)

In case of diagnostic sessions / traces, you may find more information in the tables / log files.

![Trace session do not necessarily contain all information](/assets/images/posts/2023-09-20-log-information/2023-09-17-20-35-20.png)


{: .notice--info}
**Info:**
I'm using the log file output in the screenshots as it's more readable. When I started this post I also thought, that there was a case where there would be no information in the tables, but this was not the case.

# Log tables 
## Overview of important tables

| Type  | Database | Tables  |
|---|---|---|
| Workflow History  | Process database | WFActionExecutions<br/> AutomationSessionExecutions  |
| Diagnostic session  | Config database  | AdminTraceSessions<br/>AdminTraceEvents |
| Other portal errors  | Config database | AdminWFEventLogs |
| API logs | Config database | AdminAPILogs | 

## Heading explanation
I've listed all tables which contain some kind of log information. The process database contains all the log tables from the configuration database and some own, even so they are not necessarily used. In addition some tables are more important than others for the daily business. 
Therefore I'm using the following convention:
Example AdminAPILogs C*P<br/>
C = Exist in configuration database<br/>
P = Exist in process database<br/>
\* = Contains important information in the database.

Since the tables from the configuration are repeated in the process database, the missing P means, that I haven't found data there / it's not used.

{: .notice--info}
**Info:**
Process database is new name for the content database. This is at least used in the documentation.

{: .notice--info}
**Info:**
This is just an overview of the log tables and my *interpretation* how they are used. Feel free to correct me and/or provide more information.


## AdminAPILogs C*P
I have no idea when data is stored in the config database and when in the content database. I have data in both databases, but the data in the process database is old, so it was probably switched to the config database in a new release.

One is for sure, it stores all calls to public API endpoints.


## AdminDBMigrationLogs C
Used during upgrades of WEBCON BPS.

## AdminDBScriptInfos CP
Used during upgrades of WEBCON BPS.

## AdminDebugLogs P
Debugging needs to be activated, and be sure to deactivate it. It will quickly bloat the database and therefore the hard drive.

![Deactivate the debugging as soon as you are finished.](/assets/images/posts/2023-09-20-log-information/2023-09-17-20-28-40.png)

[Diagnostic logging mode](https://docs.webcon.com/docs/2023R2/Studio/SystemSettings/GlobalParams/#9-diagnostic-logging-mode)

## AdminFileProcessingLogs P
Probably used in context with hot folders.

## AdminHotMailboxLogs P
Probably used in context with hot mailboxes.

## AdminPluginLogs P
You can view the log from the Designer Studio, so there's no need to access this table.

Make sure you configured the logging for the plugin.
![Plugin log information can also be found in the Designer Studio.](/assets/images/posts/2023-09-20-log-information/2023-09-17-19-41-41.png)

## AdminServiceLogs C
Log information about the roles which have been taken over by a service. In a single environment all activated roles will be running on same service/machine.
![Activated services](/assets/images/posts/2023-09-20-log-information/2023-09-17-19-50-32.png)


This will give you a result with the names of the roles.
```sql
SELECT TOP (100) [SL_ID]
      ,[SL_ServiceID]
      , DicRoles.Name
      ,[SL_Title]
      ,[SL_Message]
      ,[SL_TSInsert]
      ,[SL_Category]
      ,[SL_Status]
      ,[SL_ContentDbId]
  FROM [dbo].[AdminServiceLogs] join DicRoles on SL_Role = DicRoles.TypeID
  order by SL_Id desc
```

![Service log entries](/assets/images/posts/2023-09-20-log-information/2023-09-17-20-42-29.png)
## AdminTraceEvents C
Is used in combination with `AdminTraceSessions`.

## AdminTraceSessions C
If a user activated `Enable diagnostic` mode any stored sessions can be found here. The details are stored in `AdminTraceEvents`. There's no need to access the trace tables manually. You can access them via the administration in the portal or from the Designer Studio.

![Access to the traces via Administration\Diagnostic session ](/assets/images/posts/2023-09-20-log-information/2023-09-17-19-55-42.png)

![Viewing the traces from the Designer Studio](/assets/images/posts/2023-09-20-log-information/2023-09-17-19-59-13.png)

## AdminWFEventLogs C*
If an error didn't happen in the context of a path transition or you have an error guid, you will probably find it here.

![Error ](/assets/images/posts/2023-09-20-log-information/2023-09-14-22-54-24.png)


[WFActionExecutions knowledge base post](https://community.webcon.com/posts/post/the-adminwfeventlogs-table/137)

You can view the information of this table from the Administration tools in the Designer Studio by passing the error GUID.
![Result of the error GUID.](/assets/images/posts/2023-09-20-log-information/2023-09-17-22-20-49.png)

Alternatively you a data table in an own `Log viewer` process, this is way faster and you don't need to enter the whole GUID, if you are currently debugging a problem.
![A `Log viewer` process with a data table](/assets/images/posts/2023-09-20-log-information/2023-09-17-20-05-46.png)
```sql
SELECT Top 10 WEL_CreatedBy as CreatedBy, WEL_DateAndTime as Created ,WEL_CDID as ContentDB, WEL_ErrorGuid as ErrorGuid, WEL_Details as Details,  WEL_ID
from DEV01_BPS_Config.dbo.AdminWFEventLogs
order by WEL_ID desc
```
## AutomationSessionExecutions P
Is used in combination with the `WFActionExecutions` table.
## WFActionExecutions / WFLogs P
You can find the same information in a more readable way in the workflow history, at least after activating admin mode. ;)
The view is WFLogs is just 'another name' for the table WFActionExecutions.

![](/assets/images/posts/2023-09-20-log-information/2023-09-14-22-38-54.png)

[WFActionExecutions knowledge base post](https://community.webcon.com/posts/post/wfactionexecutions-table-description/72)
# Log file
Sometimes though, you won't find it anywhere except in the log file. In the following I will describe a few configuration settings.
You may have to redo these settings after an updated of the WEBCON BPS version. I'm not sure about it.

You will find the web.config and appsettings.user.json in the WEBCON BPS Portal folder. If you don't know where it is open IIS click on the website and click the `Explore` action.
![Opening the BPS Portal folder via IIS `Explore`](/assets/images/posts/2023-09-20-log-information/2023-09-17-21-02-13.png)

## Log folder
As a precaution, create a target log folder outside of the BPS Portal folder which is not on the windows partition. In addition grant the application pool user modify permissions for it.
![Application pool user needs to have modify permissions.](/assets/images/posts/2023-09-20-log-information/2023-09-17-20-56-12.png)

## web.config
Make sure that the `stdoutLogEnabled` property is `true` and the stdoutLogFile points to your log folder.
![web.config modifcations](/assets/images/posts/2023-09-20-log-information/2023-09-17-20-59-05.png)

You can find more information in Microsoft Learn [Log creation and redirection](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/iis/logging-and-diagnostics?view=aspnetcore-7.0).
## appsettings.user.json
Here you need to move two log files:
1. Internal log file of NLog<br/>
This will contain (error) information when nLog is started/activated.
2. Cachediagnostics<br/>
Some information about the cache.

Make sure to use  `\\` and not a single '\' in the file paths.
![appsettings.user.json modifications](/assets/images/posts/2023-09-20-log-information/2023-09-17-21-04-47.png)

Number 3. is an addition which is not part of the default configuration. This adds a timestamp to the output in the standard out log file.
You can find more information in Microsoft Learn [Log creation and redirection](https://learn.microsoft.com/en-us/dotnet/core/extensions/console-log-formatter).

![Time is added in the format to the log file](/assets/images/posts/2023-09-20-log-information/2023-09-17-21-07-51.png)


## Log file cleanup
If you have read up about the standard out log file, you noticed, that there's neither a size limit nor an automatic cleanup. Therefore, we need to take car of it ourselves.
You can achieve this by adding a scheduled task with the below command. This will remove files older than 4 days.

``` dos
ForFiles /p "D:\BPSPortalLogs" /s /d -5 /c "cmd /c del /q @file"
```
More information Microsoft Learn [forFiles](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/forfiles)

Make sure that the task is executing user has write permissions to the folder, and that the task is executed whether the user is logged in or not.

![Verify which user executes the task and that it is always executed.](/assets/images/posts/2023-09-20-log-information/2023-09-17-21-21-15.png)

![The action of the task.](/assets/images/posts/2023-09-20-log-information/2023-09-17-21-27-28.png)

Execute a test run via the context menu. The result should be 0x0. If it is 0x1 there's some error in the configuration /  permissions.
![Execute the task to test it.](/assets/images/posts/2023-09-20-log-information/2023-09-17-21-29-28.png)

![Before / after the test run](/assets/images/posts/2023-09-20-log-information/2023-09-17-21-28-49.png)

# Further debugging information
I haven't found a log information which contained the request when testing a REST data source from the Designer Studio.
Therefore, these two posts are still a valid option
- [Debug a web service data source ](https://daniels-notes.de/posts/2022/debug-web-service-datasource)
- [Debug a web service data source alternative ](https://daniels-notes.de/posts/2022/debug-web-service-datasource-alternative)

If you have problems with a SQL command execution, and you don't find it in the diagnostic session, you could resort to the SQL profiler:\
[SQL profiler example](https://daniels-notes.de/posts/2021/series-expert-guide-part-3#testing-retrieval-of-all-open-tasks)