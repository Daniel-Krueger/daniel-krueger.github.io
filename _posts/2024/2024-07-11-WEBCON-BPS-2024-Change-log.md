---
regenerate: true
title: "WEBCON BPS 2024 Change log excerpt and thoughts"
categories:
  - WEBCON BPS 
tags:    
excerpt:
    This is an excerpt of the change log and my thoughts on it.
bpsVersion: 2024.1.1.48
---

# Remark
When I read through the change log I have copied over a few excerpts, these are displayed as quotes in this post. Anything not in quotes are my personal thoughts. The selection criteria for these excerpts from the change log are:
- Will the changes have a direct impact on my work
- Do I have any thoughts about the change
- Is there a 'hidden' gem

While reading the change log I noticed again how many parts of WEBCON BPS I don't use in my daily work. 
- SOLR 
- Public links / share tasks
- OneDrive actions
- HotFolder
- OCR

Then again, I noticed quite a few changes/bug fixes which I submitted. :)


Even if you don't want to read through the whole change log, I would recommend the following:
- A brief overview of [what's there and what's to come](https://webcon.com/webcon-bps-2024-explore-the-key-features-and-enhancements/)
- Read [2024.1 – [Whitepaper – Business overview]](https://community.webcon.com/community/public/uploads/editor/WEBCON_BPS_2024_Release_Notes_EN.pdf)
- Read the `Before upgrading WEBCON BPS` and other `Important information` from the change logs.
  - [2024.1.1.48 EN Change log](https://community.webcon.com/download/changelog/273?q=1d8b42f)
  - [2024.1.1.48 PL Change log](https://community.webcon.com/download/changelog2/273?q=1d8b42f)
- If you are creating SDK [SDK Migration 2024.1](https://community.webcon.com/community/public/uploads/editor/Migration_Document_2024_1.pdf).


{: .notice--warning}
**Remark:** If you are using any kind of SDKs read [SDKs](#sdks).

After reading the changes you may think that updating to WEBCON BPS 2024 will be a pain. I have to say, in my small dev environment it was straight forward as always. I just had to install the [.Net 8 Core Hosting bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) and "click through". I also didn't need to install the WebView2, as it was listed in the [post](https://community.webcon.com/posts/post/webview2/463/3), in most cases it should be installed anyway.


# Form changes

> Widget
> Expanded the list of form fields available in the Data presentation group by adding the Widget form field. It allows users to attractively visualize selected numerical data on the form and optionally present it against other values.
>Depending on the configuration, the form field can be displayed in one of the available forms: Numeric value, Progress bar, Circular progress bar, and Gauge. It is also possible to change the color scheme of the Widget, including by implementing additional coloring conditions.
>![](/assets/images/posts/2024-07-09-WEBCON-BPS-2024-Change-log/2024-07-09-21-31-37.png)

There's always room for [improvement](https://community.webcon.com/forum/thread/5303).I hope there will be some upvotes. :)

> The Download all attachments button will be visible regardless of whether the `Add and delete option` is enabled in the Attachment panel. The button appears in the top right corner of the Attachments panel when more than one attachment is added.

[Another user voice was implemented](https://community.webcon.com/forum/thread/3840?messageid=3840) :)



>Predefined form templates
>It is now possible to modify the proportions of the left and right panels of a form in WEBCON BPS. This enhancement enables users to adjust the width of the side panels to better align with the content of their forms, allowing them to make the most of the available workspace while designing forms that are more visually appealing.
> ![](/assets/images/posts/2024-07-09-WEBCON-BPS-2024-Change-log/2024-07-09-21-31-47.png)

> Note: after the system upgrade, the forms previously defined by users will be displayed with a default 50/50 template, regardless of the process type.

I like the `one column` option for dictionaries. That was something I didn't thought of. For the rest, I still prefer my solution as it's more flexible.
[Revised changing left/right layout](https://daniels-notes.de/posts/2023/revised-layout-change)




> Fixed a bug causing incorrect display of translations of path and step names in the 
Workflow preview on the form.

I didn't know that the preview should render the translated steps and paths.
![](/assets/images/posts/2024-07-09-WEBCON-BPS-2024-Change-log/2024-07-09-22-13-49.png)


> Blocked the ability to select the path buttons when the form saves.

> The visibility of system fields (including the Attachments section) in archived workflow instances will be analogous to that in the final step before archiving.

> The date format for the Multiple lines of text form field saved in Append mode has been updated to match the date format of the Comment system field. The new 
format is YYYY-MM-DDTHH:SS (without milliseconds).

> The Save and previous button in the Item list row editing window has been replaced by the Apply and previous button to ensure consistency with other buttons in this window.


# Reports / Dashboards

> Changed the configuration process for reports embedded in application dashboards. As a result, users can define data sources for dashboards which can then feed independent reports and Report Tiles created within the dashboard.

While my initial thoughts have been like `Why??? It was good as it was`.
I have to admit that:
- Most of the time I either have hidden the reports in the navigation
- or created special views for the dashboards.
- There's practically no case where I used the same report on two dashboards.

So the one draw back is, that there may be two dashboards which should display the same information and we now need to configure it twice.
I also liked the option to go to edit mode and simply use it to navigate to the hidden reports instead using the dashboard every time.

Experience will tell us, whether this is actually a problem. 

> The way of configuring Application Dashboards from Designer Studio has been changed. Currently, the configuration of this element of the application will be  performed by the user in the browser window.

I couldn't care less that the dashboard can no longer be configured in the Designer Studio. In 99% of the cases using the browser is better anyway. :)

![](/assets/images/posts/2024-07-11-WEBCON-BPS-2024-Change-log/2024-07-11-06-50-21.png)


> New system column: “Last comment”
> A new `Last comment` column has been added to the group of system columns available in the Reports configuration, which displays the content of the last comment in the workflow instance, together with information about its author and date of addition. 
> The column is available for reports with SQL and SearchIndex sources

I always have to keep in mind that the last comment is really the last one and is unrelated to the latest changes or even the latest step. If a comment was added when the workflow was started, it will be the last comment even if the workflow has now version 43 and has moved 10 steps forward.

# SDKs

## Important for everyone
> Versioning has been added for SDK plugin packages. If a plugin's version is incompatible with the current version of WEBCON BPS, a warning will be displayed either in the Installer or in WEBCON BPS Designer Studio when updating the system or uploading the plugin. In this case, it will be necessary to migrate the plugin packages to the corresponding version.

That's important to know, up to know you could just update to a new version and the SDKs have been running, at least until the breaking changes in 2023 version had been added. Now this won't be possible anymore.

![](/assets/images/posts/2024-07-09-WEBCON-BPS-2024-Change-log/2024-07-09-21-49-02.png)


In addition to this: If you are not creating SDKs on your own, but have a partner do it, ask them whether they have given WEBCON the public key. Otherwise it may happen that these cannot be used.

## Important for developers
> Unified the default data model used in the interface part of SDK plugins, i.e. the extension FormFieldExtensionJS for the following form fields: Integrer number,  Floating-point number, Date and time, Single line of text, and Multiple lines of text. When using SDK plugins that do not have business logic with their own data model, it is necessary to adapt the interface to align with the new model.

I have the feeling that I've run already into this when moving to 2023 R3.
[FormFieldExtensionJS: Issue after migrating from 2023.1.2 to 2023.1.3](https://community.webcon.com/forum/thread/5063)

> The SDK has been expanded to include a mechanism that enables loading from a plugin package independent files for service and Portal. This mechanism relies on two folders, ServiceDependencies and PortalDependencies where the respective files for Service and Portal are stored. These folders can be added to a plugin package, ensuring that the files they contain are loaded only in the specific environment (Service or Portal).

That's something I need to check whether I understood it correctly, but I think it would have solved a few problems in the past.


# System
## Miscellaneous
> The second important update is Migration to .NET 8.0., which leverages the latest standards and libraries, and is continuously checked for compliance with current security standards. This update has also brought significant performance benefits. For example, the time required to transition between process steps has been reduced by 25%.


> How the system loads the current SQL server time to save the data in the database has been modified. This change does not impact the system's current  functions – it makes it possible to move databases between servers operating in different time zones.

That caused me a few troubles in the past which had been hard to detect. :)

> Changed the format in which business rules are saved in the database – from XML to JSON. Any existing configuration will be automatically converted to JSON.

Is noteworthy in case someone queries the database directly.

> Connection to MSSQL database via Microsoft Entra ID 
> The feature to connect to an MSSQL database through Microsoft Entra ID has been introduced. This enables Microsoft service users to authenticate with credentials appropriate for their database.


>Added the feature that allows for logging the information about opening the Portal page by users. In addition to the information including the user login, the log 
records the IP address of the device used for opening the Portal page. The activation of the feature requires adding the Microsoft.AspNetCore.Authentication parameter with the Information logging level to the Logging section of the appsettings.user.json configuration file.
> The location where the information is logged depends on the configuration of the NLog module. By default this is the AdminWFEventLogs table of the 
configuration database.

I haven't checked it, but I assume that this is the first opening of the portal in a new browser session and not every navigation to a workflow instance.


> Improved validation of user data in webcon.pl\svc.bps format in a non-domain environment, as well as connecting to and retrieving OUs and user data from such a domain when synchronizing BPS users.


> Restored behavior of the {I:WFD_CreatedBy} variable as of version 2022 R3. Values returned from the CacheOrganizationStructure table on the form are again case-sensitive.

> Disabled logging to the Event Viewer of errors related to actions performed when saving a form.

> The behavior of the Start editing a file using OneDrive action has been modified. 
> If an attempt is made to start editing the same file using OneDrive again, an error message will be displayed and the path transition will be blocked.
> In addition, the previous behavior of the Finish editing a file using OneDrive and Cancel editing a file using OneDrive actions has been restored. If these actions fail, the path transition will not be blocked. The action execution logs will show the corresponding information.

> Improved support for special characters in the configuration of the Update attachment action executed by WEBCON BPS Workflow Service.

## SOLR
There are a whole bunch of changes and improvements. The most noteworthy for me is that it is now possible to create a backup of the recent activities.

> Because it is not possible to reindex data regarding user activities and recently viewed areas, a backup copy of this data will be created during the update. The backup copy will be restored in the installer, after the SOLR Search Server component is updated. The backup contains data from the last 30 days. WEBON has also made the SolrActivitiesMigrationCli tool available which can be used to create and restore a backup copy separately from the update process.


## API 

> Added new REST API version 6.0.<br/>
> REST API version 3.0 has been removed, while version 4.0 has been marked as deprecated.
> The endpoint *api/login* used for authentication *will be removed in version 2025*, it is recommended to use endpoint /api/oauth2/token instead

Everyone still using the api/login endpoint should start moving forward.


> Importing applications using the public API
>Administrators can now import applications using the REST API in Portal. With the new tool and API application, they can define import parameters that previously required navigating separate wizard steps in WEBCON BPS Studio. This solution automates the process of importing applications and transferring configuration data between environments (DEV/TEST/PROD)

The advanced configuration really looks promising. I will dedicate an own blog post to it.

> In the REST API endpoint related to application metadata, information has been added to define whether a process was created within an application or is a 
Related process.

That caused me some problems for our Business Central extension which allows to configure which WEBCON workflows should be started from a page. Another [user voice](
https://community.webcon.com/forum/thread/3462/15) closed. :)

# Designer studio

## ToDo list
> Added functionality that allows users to create a list of tasks (ToDo) for better work 
> management and progress monitoring. The list within the table rows presents objects, 
> such as form fields, actions, or rules, which are designated as requiring further 
> configuration.

This can be interesting, especially before you go on vacation. :)

![](/assets/images/posts/2024-07-11-WEBCON-BPS-2024-Change-log/2024-07-11-08-17-57.png)

## Cyclical action

> Added the capability to execute the `Change value of single field` action in automations performed in cycles. In this context, the action can only modify the values of local automation parameters.

That can be helpful.

> To store cyclical action logs, a new table was added to the content database:  WFRecurrentActionExecutions. Until now, those logs were stored in the  WFActionsExecutions table. The tables contain the same columns. The service will remove logs older than 12 months.
> Existing logs will not be moved to the new table.

That's important to know. :)

## Step 

>A new button has been added to the step edit window, allowing users to navigate to the selected step of the current workflow for editing
![](/assets/images/posts/2024-07-09-WEBCON-BPS-2024-Change-log/2024-07-09-21-39-33.png)


> Changed the manner in which the system handles the ALERT and CONFIRM form rules. Consequently, the standard, JavaScript-based dialogue windows that are invoked by the CONFIRM and ALERT functions are replaced with native implementations. The change allows you to use formatted text with HTML tags <i>, <b>, <u>, <br> inside the ALERT and CONFIRM functions.
> The change results in breaking backwards compatibility for those form rules which functioned in JavaScript mode and invoked in its code other form rules working in the block mode and containing the aforementioned ALERT and CONFIRM functions. For such a configuration, it is necessary to manually insert the Promise object in the JavaScript rule code.
>For any other configuration, backward compatibility is preserved, and no further modifications are required for the rule configuration.

I went again from `Yeah` to `Why??`. I hate arbitrary  restrictions. If someone want's to use HTML than the person will know what he does.

## Automations
> Improved readability of automation configuration
> The latest version provides users with a more comprehensive understanding of the automation’s functionality by allowing them to swiftly access information about individual actions and action templates within the automation configuration. By simply hovering the mouse cursor over the action/template icon within the automation definition area, a tooltip will be displayed, showcasing the action / action template name and description (entered in the Documentation field). This solution eliminates the need to carefully check the configuration of the actions and templates that comprise it.

It will be great to see the documentation of the actions in the mouse hover instead of opening the configuration.


> In addition, the default name of automations created in WEBCON BPS Designer Studio has been changed. When a new automation is added, its default name (previously New  Automation) will be dependent on the context in which the automation is to be triggered. 
Reading this I went 'Yeah, finally', continuing reading I just thought WTF.

> For example, the default name of an action triggered On exit will be labeled as Automation "On exit". The change does not apply to process and global automations.

Again a `Why??` there's not the least reason for using a template for the name like `Automation on path "xyz"`. Xyz would have been sufficient. At least in my opinion, and this is my blog. ;)
![](/assets/images/posts/2024-07-11-WEBCON-BPS-2024-Change-log/2024-07-11-07-34-17.png)


## Miscellaneous 
> The order of display for Global constants, global Business rules, and Automation has been updated to be alphabetical.

> During export/import of an application, the contents of the Documentation fields in the process configuration are no longer parsed for the presence of tags specifying process variables. The previous operation could result in displaying incorrect configuration message during export.


> It is now possible to create universal Form rules that contain a reference (parameter or tag) to Item list columns.