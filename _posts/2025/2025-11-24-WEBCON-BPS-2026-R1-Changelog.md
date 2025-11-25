---
regenerate: true
title: "WEBCON BPS 2026 R1 Change log excerpt and thoughts"
categories:
  - WEBCON BPS 
tags:    
excerpt:
    This is an excerpt of the change log and my thoughts on it.
bpsVersion: 2026.1.1.45
---

# Remark
When I read through the change log I have copied over a few excerpts, these are displayed as quotes in this post. Anything not in quotes are my personal thoughts. The selection criteria for these excerpts from the change log are:
- Will the changes have a direct impact on my work
- Do I have any thoughts about the change
- Is there a 'hidden' gem

I won't cover the new AI features or other new features listed in the [whitepaper](https://webcon.com/wp-content/uploads/2025/11/WEBCON_2026_Release_Notes_ENG.pdf). This is a must read anyway.

After reading the change log I would say that WEBCON focused on these areas in this order:
1. Obviously AI has been the main focus in this release, but I'm not hyped by AI. I need to see it in action for myself so I can put the prices into relation.
2. The platform infrastructure has undergone another overhaul. I would guess that in the 2027 version all components will use .Net Core. 
3. Integrating WEBCON with other systems. There are numerous improvements in the areas of SDKs, User Defined Actions and Custom Controls.
4. User experience improvements and UI enhancement, but I didn't mention these.
5. The `Related elements` will be an interesting feature

# Installation / Upgrading information
## Requirements
- Upgrading from versions older than 2019 R1 or from SharePoint classic is not possible 
- Minimum SQL Server version is 2019
- For all-in-one Installations the required RAM did go up from 12 GB in 2025 R1 to 20 GB in 2026 R1
- ASP.Net Core 9 Hosting bundle is required

SDKs need to be upgraded to .NEt9, but this check has already been introduced in 2025. [SDK Migration 2026 R1](https://community.webcon.com/community/public/uploads/editor/SDK_Migration_2026_1.pdf)

## Things to check before upgrading
Before you upgrade, check for any "End" blocks in your automation:

- Fixed an issue where the End block in automations did not stop their execution. After the fix, the End block correctly terminates the automation without an error. To maintain backward compatibility, all existing instances of the End block were removed from automation definitions during the update. To take advantage of the corrected behavior, the End block must be readded in the automation editor.


You cannot have SDK actions on dictionary or document template processes?

> The new Service architecture has been adapted to work with SDK addons based on .NET 9 technology which are triggered on transition paths by Run an SDK action (this does not apply to add-ons triggered on transition paths in dictionary and document template processes [importing such processes is not possible]).

 `Single line of text` fields are now using textareas instead of inputs. Everyone who added CSS /JS for some tweaks needs to check their implementation.

## During the upgrade

> Improved the display of maintenance mode message during database updates. Previously, the Maintenance mode message wasn't visible when updating WEBCON BPS, leading to HTTP 500.30 error.

Upgrade from 2025 R2 to 2026 R1 will reindex the content database but not the attachments

## Things to check after the upgrade
It happened again, WEBCON changed the result of a function from textual *True/False*  to *1/0*
>  Updated the context variable Is admin mode active? Previously, this variable returned text values ("True"/"False"). Now, it returns logic values (0 or 1). Consequently, to ensure that rules used in filters will work correctly, it will be necessary to use “TRUE”/”FALSE” or “0”/”1”. The previous use of “True”/”False” will no longer work.

Parameter with defined types are now actually treated this way. This is something to look out for, as it may have an unintended side effect.

> Improved handling of parameters passed from Form rules to Business rules. Values entered on the form are now interpreted according to the parameter 
type defined in the business rule. For example, text that looks like a date will no longer be automatically converted to a date if the parameter type is set to Text.

MSSQL database connections timeout after 30 seconds, previously this had been 120 seconds. I hope no one did have long running statements.

>Introduced access restrictions in the User Defined API (UDA) functionality. In the Get data from an element instance mode, it is now no longer possible to modify hidden form fields. In the Actions on a workflow instance mode, modifying both hidden and read-only fields has been blocked.


If you are somehow monitoring the WEBCON windows processes you may need to take a different approach to check whether everything is working fine.
> It now has a modular structure consisting of three separate processes, which means that in the event of a failure, the system automatically restarts only the malfunctioning module. 
> *NOTE:* due to the new modular Service structure, the way it is started has changed. Now, the process WebCon.WorkFlow.Bootstrapper.exe is initiated first, which then launches the remaining Service modules. This means that starting the Bootstrapper process does not necessarily mean the full Service is already running — the Service is considered fully started only when all modules have been activated

## Logging changes
The way logs are generated is undergoing a restructuring process, which is not yet finished:

> The error logging method has been changed from text-based logs (NLog) to structured logs (Serilog).

> Logs of level Warning and above are written to an MSSQL database configured in the MSsqlServer node (by default, this is the *Infrastructure.Logs* table in the WEBCON BPS *Configuration Database*). Note: For large environments, it is recommended to create a dedicated MSSQL database for logs, or use specialized logging tools (Sinks)
  
> Some loggers will continue writing to their respective tables as before. They will be replaced with Serilog-based logging in future versions.  Information about these updates will be included in the version roadmap. Components that remain unchanged in this version:
> - Debug mode in Designer Studio
> - AdminWfEventLogs
> - logging by the Service
> - Diagnostic sessions
> - logs for REST API and UDA

According to the documentation Serilog is better suited for OpenTelemetry which has undergone a few changes.

# User Experience

## Form 

- Tabs are no longer displayed as a drop down on a small screen


> Restored the ability to change the size of the Multiple lines of text form field in read-only mode.

An update for tooltips:

>Previously, the target="_blank" HTML form field was automatically removed, preventing links from opening in a new tab. It is now allowed in tooltips for form field descriptions, ensuring consistent behavior.


## Attachment changes 
> It is now possible to overwrite attachments in workflows where the Attachments security level is set to High. In such cases, users can overwrite an attachment as long as the form settings have the Edit file and Add and delete options enabled.
 
> Enabled the option to add multiple attachments at once to the Local attachments column on the Item list by holding CTRL and selecting files. The option is available when the Allow adding more than one attachment
checkbox is selected in the Advanced configuration of Local attachments.

Attachment icons have been changed

## Access authorization
This [features](https://community.webcon.com/posts/post/access-authorization-to-form-fields/514/3) hides some field values until the user authorized himself. In case the form was displayed in edit mode, this authorization is always required. This was kind of annoying, if you had a task but just wanted to view the data. Now form is displayed in view mode, even if you have a task. At least if the edit mode is set to [dynamic](https://docs.webcon.com/docs/2026R1/Studio/Workflow/Step/Step_FormView/#edit-mode)


> For the Access authorization feature, it is now possible to add table Reports that contain columns requiring authorization to Dashboards. To facilitate this, columns requiring authorization can also be added to Datasets on Dashboards. Once added, the column's name will display an icon with a tooltip, indicating its special status. Columns requiring authorization cannot be used by the Filter widget, and they remain unseen in the Filter panel configuration on Dashboards.
> Added report access authorization session continuity. Upon returning to a previously authorized report, the authorization session timer continues from 
the initial authorization time.


## History
Finally, we get this option. My only other wish would be to have a tooltip for a choose field to display it's id.

> Expanded the time display format in tooltips for instance History. As a result, seconds are now shown in addition to hours and minutes.

## Reports

> Restored the ability to use calculated columns as a filter in the Data source URL parameter within Report configuration
> When filtering the dashboard by a date scope, the results now also include the last day of the selected interval.

> Fixed incorrect system behavior when saving custom folder visibility settings. Due to a bug, newly granted folder access permissions were removed after clicking the Save button. These permissions were then restored after adding and saving permissions for other users or groups.

> Restored the addition of the returnUrl parameter to the instance address when launching a new workflow instance via a fully defined Start button (with 
a specified process and workflow) from the navigation menu. As a result, users are now returned to the previously opened view when clicking the Back button on the form.

> Restored the ability to switch to private views in Reports embedded in Dashboards via the HTML code widget. To enable view switching for users, the option Allow changing view must be selected (Settings → Embed)

> Fixed a bug where, despite selecting the Dynamic option (Rows per page) in the dashboard Report configuration, the number of rows wasn't adjusting to the current report window size. The issue occurred if the report was initially displayed within a dashboard window and then opened in a separate window


# Actions
## REST Web Service

>Improved response header mapping in the Invoke REST Web service action. Previously, when headers occurred multiple times, only the first value was 
retrieved. Now, all header values are returned concatenated with a comma.

We can now directly store response values in input parameters instead of saving them to a field.

## HotFolders, HotMailBoxes, Archiving

>The paths of temporary folders for HotFolders, HotMailBoxes, and Archiving functionalities have been shortened by replacing the full database name with its acronym. Additionally, the HotMailBoxes folder name has been shortened to HMB. The rules for processing (executing and saving) workflow instances by the HotFolders and HotMailBoxes modules have also been modified. Now, if the  values inserted into form fields through HotFolders or HotMailBoxes do not pass validation, the system prevents the workflow instance from transiting a path. In  such a case, the email or document sent via HotFolders is moved to the Error folder  for incorrectly processed file.


> Fixed an issue where attachments from signed email messages were corrupted after being added to a form via the HotMailBox functionality


> Improved the HotMailBoxes’ ability to find attachments based on RegEx. The fix now makes regular expression attachment searches case-insensitive. 


## Waiting for sub-workflows
There's a change to the workflow is in the `waiting for sub-workflows`
- If the last workflow completes, the parent workflow will be moved forward asynchronously
- As I understand the text this means:
  - The workflow service is now recorded as the person moving the parent workflow
  - I have no idea what will happen if the path transition fails. Will it stay in the step or will the user get an error message. 


> The path transition in the parent workflow, after all sub-workflows are completed, is now executed asynchronously by the system account (using a mechanism analogous to a Timer) on the Service account with a retry mechanism (5 attempts). 




## Analytics

Has gotten an UI overhaul.

> Fixed incorrect attribution of editing time in analytical reports. The update resolves an issue where the time spent editing a form was being assigned to users from the previous step instead of those currently assigned to the task. Now, the times are correctly attributed to the users involved in the given step.

# Removed features

- Searching structures has been removed\
  I hope no one will be annoyed by it. When I asked about it in the community, I got no responses that others are using it.

> Removed UseWindowsAuthentication and ForceHttpsOnProxy flags from Portal configuration

> REST API 5.0 has been removed


I copied the below text from the security chapter and I'm not sure in which context these parameters have been removed. I know URL parameters for (starting) workflow instances and reports. I wasn't able to find the *parameterName* text in any documentation so I'm confused. I did find the *userLogin* parameter but not in the context of URL parameters.

> The *parameterName* and *userLogin* URL parameters are no longer accepted.

# Performance improvements
- Reports viewed as subordinates
- If `working on-behalf` task and search result retrieval has been improved
  
> Improved filtering performance based on the Value filter in Report columns containing multilingual Choice fields by optimizing the SQL query, what prevents timeout errors during search.

> Improved performance of the All Active report in the substitution configuration. Optimized database queries, eliminating the possibility of timeouts and fixing a bug.

> Improved Report filter functionality. Now, changing the filter immediately cancels the previous filtering query, smoothing out how the Report works


> Improved loading performance for the Item list form field. Previously, enabling the Single row editing mode and importing a large number of rows  (> 500) resulted in slow form field loading.




# SDKs

## .Net 9 or .Net Framework
2026 R1 requires of the plugins, but this time almost all actions will be run in the context of .Net 9. You can take a look at [SDK Migration 2026 R1](https://community.webcon.com/community/public/uploads/editor/SDK_Migration_2026_1.pdf)


> Identifying the runtime environment:
> Can be verified via the Context.Environment field:
> - Environment.Web → .NET 9
> - Environment.Service → .NET Framework


> If the migrated plugin package contains plugins used for operations outside of workflows, the project should continue to use the previous targeting: .NET Standard 2.0
> 

## Form Field Extensions

React was updated to 19.1. I'm not a React guy, but this may be a good time to update your FormFieldExtensions.

> New JavaScript API methods have been added to WEBCON BPS forms, enabling full attachment support for Form Field Extensions. Previously, it was only possible to check whether attachments existed. The API now also allows adding, modifying, overwriting, and deleting attachments, retrieving the full list of files, and dynamically showing or hiding the attachment section on the form.

## Custom Controls (External) as CDNs?


Maybe my thoughts go overboard, but do we now have a CDN?
> For the Custom control (External) form field, a new mode has been added that allows hosting the control locally within Portal. The content must be uploaded as a .zip file, with a single entry point file named index.html. Files can be placed in subfolders, and the link to the associated file should be in the following format: “folder_name/file_name” or “./folder_name/file_name”.


# User Defined Actions

> Introduced access restrictions in the User Defined API (UDA) functionality. In the Get data from an element instance mode, it is now no longer possible to  modify hidden form fields. In the Actions on a workflow instance mode, modifying both hidden and read-only fields has been blocked

> A new API definitions node has been added to the System settings tab. This new node provides System administrators with a view of all registered UDA endpoints


Custom controls can now make use of UDAs:
> Additionally, to enable integration with User Defined API (API Definitions), an API tab has been added to the field’s configuration. This  allows the control to communicate with endpoints defined in the API  Definition through JS API. The list of available API definitions is limited to those  that are active, have OAuth authentication enabled, and those that have  been explicitly selected beforehand.

> Improved the OpenAPI documentation generation for the API Definitions (UDA) module by adding parameter descriptions, streamlining the system integration process.

> The User Defined API (UDA) mechanism has been expanded to include a new Running mode: Actions on a workflow instance, which can be used to WEBCON BPS 
start and save a workflow instance, and to move it to the next step using a path.

It's time to take a look at the UDAs.

> A BPS application administrator can now generate OpenAPI documentation for the Actions on a workflow instance mode including the [System] Comment and [System] Attachments fields.


# Some fixes which caused problems for me

> Improved the Clear Item list action import. Previously, the functionality failed to operate correctly after transfer to a different environment, due to a missing Item list mapping


> Unified validation of choice fields on the form. Inconsistencies between how the Service and Portal handled unvalidated values potentially led to errors. Now, the service prevents the saving of unvalidated values.

> Improved the attachment sorting within PDF/DOCX files merged using the Merge attachments into Word/PDF file action. Previously, attachments were 
sorted disregarding the database order and not aligning with the Merge order: according to SQL configuration option. Now, attachments are sorted according to the chosen configuration.

> Fixed the behavior of the Remove attachment action in the Remove only history of binary data mode, which incorrectly removed the attachment from 
the SOLR index. After the fix, the action removes only historical data, leaving the current version correctly indexed

> Fixed licensing functionality in the cloud installation (WEBCONAPPS-SaaS). If the number of assigned Power User (Designer Studio) licenses exceeds the number available, users can still access the Portal, but Designer Studio access requires removal of the surplus assigned licenses via the Admin panel.

# Name changes

| Area    | Old name | New name |
| -------- | ------- | ------- |
| Action  | Start a subworkflow   | Start workflow |
| Action  | Start a subworkflow  (SQL)  | Start workflow (SQL) |
| Logging | ErrorGuid     | CorrelationID |
