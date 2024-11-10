---
regenerate: true
title: "WEBCON BPS 2025 Change log excerpt and thoughts"
categories:
  - WEBCON BPS 
tags:    
excerpt:
    This is an excerpt of the change log and my thoughts on it.
bpsVersion: 2025.1.1.23
---

# Remark
When I read through the change log I have copied over a few excerpts, these are displayed as quotes in this post. Anything not in quotes are my personal thoughts. The selection criteria for these excerpts from the change log are:
- Will the changes have a direct impact on my work
- Do I have any thoughts about the change
- Is there a 'hidden' gem

Areas of  WEBCON BPS which aren't part of my daily work:
- SOLR changes
- Public links / share tasks
- OneDrive actions
- HotFolder
- OCR

Even if you don't want to read through the whole change log, I would recommend the following:
- Read [2025.1 – [Whitepaper – Business overview]](https://community.webcon.com/community/public/uploads/editor/WEBCON_BPS_2025_Release_Notes_EN.pdf)
- Read the `Before upgrading WEBCON BPS` and other `Important information` from the change logs.
  - [2025.1.1.23 EN Change log](https://community.webcon.com/download/changelog/302?q=8bf483e)
  - [2025.1.1.23 PL Change log](https://community.webcon.com/download/changelog2/302?q=2ca4ccf)
- If you are creating SDK [SDK Migration 2025.1](https://community.webcon.com/community/public/uploads/editor/SDK_Migration_2025_1.pdf).



{: .notice--info}
**Info:** If you haven't moved to WEBCON BPS 2024, you should also take a look at this post: [WEBCON BPS 2024 Change log excerpt and thoughts ](/posts/2024/webcon-bps-2024-change-log)

# Impact of new UI
The new UI can have an impact on various elements which need to be revisited after the upgrade:


- Custom themes<br/>
  They are disabled by default and need to be updated.
- Easier theme creation<br/>
  > Additionally, it is now possible to define a Brand color. After specifying this color, system automatically generates a palette with corresponding shades (individual palette 
colors can be overwritten with custom colors). Additionally, users can define custom CSS styles to be applied to the Portal page after selecting a specific theme.
- Global CSS styles<br/>
  Due to the massive changes, we should:
  1. Copy the current styling to somewhere else,
  2. Add rules back one by one, if we really need them
  3. Make adjustment, if they don't work
- Text widget on dashboards supports now translations<br/>
- HTML code widget on dashboard<br/>
  If you used this widget to modify the dashboard elements, provide additional features, change the CSS or whatever, these may now be broken.
- HTML form field<br/>
  Them as above.
- There's no more system dashboard<br/>
  Ok, there's a default dashboard but we can change its elements.
- We can configure folders, and their permissions will be applied to all elements in this folder<br/>
- Application icon instead of abbreviation<br/>
- Apply a filter to all dashboard widgets

# Performance improvements
> Optimized memory consumption of WEBCON BPS Portal
 
> Loading time of main Portal and application pages

> Report loading<br/>
> SQL queries are limited to columns visible to the user in the report view, as well as system columns essential for proper functionality, instead of fetching all columns defined in the report's data source.
>
> Note: Reports with coloring configurations are the exception — in these cases, all columns will still be retrieved to enable accurate coloring based on complete data

> Increased processing performance for each queue and module of the WebCon Workflow Service.

> Improved the efficiency of the Analytics module. Increased the speed of generating element aggregates.

> Optimized searching in CacheOrganizationStructure for users whose data is no longer available in the system, but to whom tasks have been assigned. In this case, once the form is accessed, such users will be searched by BpsId.

> Improved performance of the database cleanup module for environments where full user synchronization has never been performed.

> Reduced memory consumption of WEBCON BPS Workflow Service when synchronizing users with Active Directory.

Ok, this is not necessarily a performance improvement system wise, but it fits in this category.
> Changed the default compatibility level for new SQL databases created during the installation of the WEBCON BPS platform. As a result, the previous compatibility level set to 120 (SQL Server 2014) has been replaced with the highest possible level, which, however, cannot exceed 160 (SQL Server 2022). This modification does not affect existing databases, which will retain their compatibility level of 120.

Yeah, finally we can use all the 'new' functions like `string_agg` by default. :)


> Added support for Security Information and Event Management (SIEM) providers, allowing users to integrate with Google Cloud, AWS CloudWatch, and Microsoft Sentinel through the OpenTelemetry tool in WEBCON BPS.

This may help improving the performance.


# Form changes
## Access authorization
> It is now possible to authorize access to form fields analogously to authorizing path transition. This aims to add an additional layer of security for sensitive/confidential information on the form. The option is found in the Visibility tab of form field, group, and tab configuration.

I can imagine this comes in handy, to prevent cases where someone goes into a room without knocking and sees confidential information.

> Opening the form in edit mode will require the user to authorize access through one of the available methods. This is to ensure that form and business rules work correctly.

I can understand this from a technical point, but I would have imagined something else. Now we will have to decide whether we want usability or security.

> There are certain limitations for form fields with access authorization enabled. Form fields used in Reports, Dashboards, or as distinguishers cannot have access authorization enabled on them.


# System
## User synchronization
> Has been overhauled, only accounts with the mandatory fields are synchronized. 

If you are using AD you should also read the full change log documentation starting with page 9.

> Fixed an issue related to user synchronization. Incremental synchronization was launched only for one content database – this could result in missing privileges even though the synchronization was successful.


> In the case of the Entra ID (AAD) service, added the possibility of synchronizing Member-type users whose UPN identifier includes the phrase "#EXT#". In such cases, the user's main e-mail address is utilized as the BPS ID. Additionally, for all synchronization types, the system now skips users whose BPS ID contains the "#" character.

### AD mandatory fields
> - samaccountname 
> - objectclass 
> - UserPrincipalName (for users) 
> - useraccountcontrol (for users)
> - samaccounttype 
> - objectsid (for groups) 

> The checkbox Interrupt synchronization on any Active Directory error has been added to the configuration for synchronization with the Active Directory  service. This checkbox cancels the entire synchronization if an error related to the connection or data retrieval from AD occurs in any Organizational Unit. As a result, when an error occurs and synchronization is halted, all changes made during the process are reversed, and the cache tables are restored to their state prior to the synchronization.



### AAD mandatory fields
> - UPN (UPN may not contain # characters)
> - Azure ID


### LDAP
> - objectclass
> - useruniqueidentifier (for users) 
> - groupuniqueidentifier (for groups)


## Reports
> Added handling for incorrectly configured SQL Filters in Reports. Until now, an incorrectly configured filter could cause errors and a "kill state" in the Report. The fix adds a mechanism to prevent a "kill state" when the filter is configured incorrectly

Incorrect configured filters? That never happened. :)

> Sharing private views with others
![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-08-16-39-57.png)


> Improved filtering of Report items by Person or group form field. When a person is selected from the list in the filter configuration, sorting will be automatically 
enabled. Person list will be displayed and sorted correctly also when multiple users are selected/unselected.

So, we can now filter multi value person fields correctly? I hope there comes a time, when this will work for other choose fields too.

## Attachment handling

> Corrected the layout of the text in the footer of a document created by the Generate/Update a Word file action. An issue occurred after going to the print  preview of a document whose contents were defined by a Business rule

> The FILE NAME function in Business rules has been improved to return the current name of the attachment rather than its original name. Similarly, the Convert Word to PDF action and actions from the OneDrive group will use the current name of an attachment rather than its original name.

> Preview of Excel files is back again

> Changed the behavior of the Add attachment action. Now, the action allows path transition even when the action does not return the attachment.

Now I can remove the execution conditions again. :)

> In the Generate/Update a Word file action, if the output file has a configured dynamically-set category, but the process does not have an attachment category source defined, the category of the attachment will be saved in the database anyway – in ID#Name format. Previously, if no defined categories existed, the attachment was saved with an empty category.

That's good to know.

> Fixed a bug that caused the Word Modern add-in to hang. The bug occurred when the user first entered a correct ID and then an incorrect instance number. When attempting to search for an instance using the correct ID afterward, the add-in would hang.


## Miscellaneous
> Improvements to Mail approval

> The Abbreviation option has been removed from the application configuration 

I have never used it anyway.

> Changed the approach to recalculating values in the Item list form field. Currently, recalculation is not performed when values are changed in the cells of a column 
that has been configured as invisible in the Field matrix.

I'm not sure that I understand what it means, but does this mean, if I change such a cell during a path transition, if the cell is visible in the current step?


> Currently, when the number of instances in the system approaches 10 million, the Event Viewer tool and the instance History display a warning about reaching the limit for generating 1D codes and indicate the need to switch to 2D codes.

If you are using a lot of 1D barcodes, you now get a warning if you will be running out of available numbers. :)

> Warning of single-use access licenses are running out

> Preview of historical document versions
![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-08-16-37-13.png)

I know a few customers who will like this

> Restored the ability to take over tasks from people who are not direct reports of the user (e.g. subordinates of subordinates).

> The Edge browser suggested previously entered values. This has been disabled – browsers should not suggest values in form fields.

Yes, this was kind of confusing.

> Added "User-Agent" to the headers of queries used by the service to download currency exchange rates from NBP (National Bank of Poland). Queries without this 
header could result in a 403 error.

>  WEBCON BPS Workflow Service operation logs will now contain information on how long the service tried to start and how long it ran until it stopped.
 
# Designer studio
## Workflow Designer

> A web-based version of the Workflow designer, previously known from WEBCON BPS Designer Desk and Portal, has been introduced in WEBCON BPS Designer Studio. As part of this update, a number of changes have been made to the workflow design tools.

Bringing over the workflow designer from the Designer Desk into Designer Studio will allow WEBCON to concentrate on one solution. Maybe we will be able to configure the path `layout` in the next version. :)


> The new Automations tab allows users to add process and global automations by dragging and dropping them onto the step entry/exit and the path.


> The Show analysis option has been added to the context menu of steps, replacing the Analysis parameter previously available in Designer tools. When the Hide on diagram option is used in the context of a step or path, the selected workflow design element is  highlighted in grey and, for steps, [HIDDEN] appears next to the step name.
> 
![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-08-15-48-59.png)
> At the same time, the Designer tools have been restricted to the Diagram management 
tab, where the Save preview and Grid options are available.

Hidden no longer means hidden :( At least in this version, let's cross our fingers.

![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-10-10-27-00.png)

> All notes added in Designer Studio are now visible in the Workflow designer in Portal, where it is also possible to edit their content, move them freely, and resize them in the 
diagram. All notes added will be visible in the generated documentation.
> Notes can now also be created and edited in WEBCON BPS Designer Desk.

That's a nice change. :)



## Phases and actors
Thats a big step forward and I don't want to copy the whole chapter. So I will just copy a few pictures that you know what `Phases and actors` mean. :)
![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-08-16-20-07.png)

![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-08-16-20-23.png)
![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-08-16-21-00.png)

I wonder whether there are also automatic performance indicators per phase.

## ~~Timeouts~~ Timers
> The latest system release introduces numerous changes and improvements to the operation of Timers (formerly known as Timeouts). Among other things, it is now possible to configure timers for immediate initial activation and subsequent activations  at a specified Interval, as well as to remove activated timers from related workflow  instances. These changes have been made by extending and customizing the Timer details configuration window

> As part of the functionality, the configuration associated with the handling of validation/execution errors of timer-related actions has also been enhanced by  introducing two additional parameters: Acceptable number of consecutive errors and Number of minutes to retry after error.

There's also a `preview` of when timers would be triggered.

![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-10-09-27-09.png)

> It is also possible to start timers immediately, as well as remove activated timers from the associated circuit elements

Yeah, that was my very first question in the community. :)

## New actions / business rules / form rules 

Actions:
> Generate text file

While it was possible before it's now a lot easier

> Merge attachments into a Word/PDF file, which combines files uploaded as form attachments. As a result, a single file is created in the format specified 
by the user (DOCX, PDF, or PDF/A), composed of the attachments merged in the defined sequence. The action allows merging files of different formats.

But don't wonder how it may look like, if you merge an Excel file in a portrait word file. :)

> Add attachment to another workflow element action

That will be relieve for a lot of us and this workaround will no longer be necessary [Copy an attachment to another workflow](/posts/2023/copy-attachment-to-other-workflow)
> Send a PUSH notification action

I wonder, when the first person will use this action in a timer which is repeated every minute. :)

> Managing group owners


Rules:
> GET PHOTO GEOLOCATION (from an image)

> DATE DIF using Business days

> Do I have edit permissions?
Finally. :)

> Is it a new instance?
I would have preferred `Is admin mode`. Changing whether the instance is new, is easy Instance id > 0.

> All TRUE, ANY TRUE
  ![](/assets/images/posts/2024-11-08-WEBCON-BPS-2025-Change-log/2024-11-08-16-26-15.png)

> PICTURE
Can set a default value for a picture field.

> SET FORM SUBTITLE

> HIDE ITEM LIST ROW BUTTON – allows you to hide the selected action button in the item list row.<br/>
> SHOW ITEM LIST ROW BUTTON – allows you to show an action button in the item list row, which was previously hidden by the HIDE ITEM LIST ROW BUTTON function.<br/>
> HIDE ITEM LIST BUTTON – allows you to hide the selected action button of the entire item list.<br/>
> SHOW ITEM LIST BUTTON - allows you to show the action button of the entire item list, which was previously hidden by the HIDE ITEM LIST BUTTON function.<br/>
> HIDE ITEM LIST ROW BUTTON – hides a selected action button in the Item list row (Delete, Clone, or Edit),<br/>
> SHOW ITEM LIST ROW BUTTON – displays a selected action button in the Item list row (Delete, Clone, or Edit),<br/>
> HIDE ITEM LIST BUTTON – hides a selected action button for the whole Item list  (Add, Edit all, Restore defaults, Remove all, Export, or Import from Excel file),<br/>
> SHOW ITEM LIST BUTTON – displays a selected action button for the whole Item list (Add, Edit all, Restore defaults, Remove all, Export, or Import from Excel file).<br/>
> IS NEW ROW - returns information whether a given row has been already saved in the data base.<br/>

It seems that I can review this [Conditional editing/deleting of item list rows](/posts/2024/conditional-allow-deleting-item-list-rows) again.

Variable:
> PORTALADDRESS
 
I can remove my global variable. :)



## REST Action
> Modified the behavior of the rule that processes the received value in the Invoke REST Web Service action. When the input value was empty and the Date type was selected for the rule, inserting the value into the date form field resulted in an error. The value of the field will now clear in such a case. Similarly, the behavior of the rule for the Floating-point number type has been changed. Instead of setting the value to "0," the value of the form field will clear.

> Fixed incorrect behavior of the Invoke REST Web service action. Previously, when this action modified values in the Choice field, Choice field (picker), and 
Autocomplete columns, the changes were saved unvalidated in the content database. Now, these values are saved in the validated form whenever possible.


> Fixed a bug that caused the execution of a global automation, which set an output parameter, to obstruct the setting or transfer of subsequent variables or 
parameters in a process automation where that global automation was used.


> REST action can be used in a `Cyclical action` but we cannot access form fields. Instead business rules can be used.

## Miscellaneous

> It is now possible to deactivate an entire automation using the dedicated Activate checkbox. The option is available for automations configured from the Workflow Designer and the automation can be deactivated by unchecking it.

That will help us debugging / implementing automations partially while we are waiting for someone else. :)

> Restored the ability to use HTML elements in calculated columns of Item lists.

# SDKs

## Important for everyone (since 2024)
> Versioning has been added for SDK plugin packages. If a plugin's version is incompatible with the current version of WEBCON BPS, a warning will be displayed either in the Installer or in WEBCON BPS Designer Studio when updating the system or uploading the plugin. In this case, it will be necessary to migrate the plugin packages to the corresponding version.

That's important to know, up to know you could just update to a new version and the SDKs have been running, at least until the breaking changes in 2023 version had been added. Now this won't be possible anymore.

![](/assets/images/posts/2024-07-09-WEBCON-BPS-2024-Change-log/2024-07-09-21-49-02.png)


In addition to this: If you are not creating SDKs on your own, but have a partner do it, ask them whether they have given WEBCON the public key. Otherwise, it may happen that these cannot be used.

## Breaking changes
This time there's only a little change, but you will need to create versions of your SDKs [anyway](#important-for-everyone-since-2024).

```csharp
//Previously:
currentDocument.ParentDocumentID = parentDocumentID;

//Currently:
await currentDocument.SetParentDocumentIDAsync(parentDocumentID)
```

## Custom authentication providers
We can created custom authentication providers for REST and SQL Authentication. This will allow us to use the latest suggested authentication methods without the need to wait for WEBCON or to update WEBCON BPS.


```c#
public class CustomRest : CustomRESTAuthentication<PluginConfig>
 {
 public override Task<HttpClient> 
CreateAuthenticatedClientAsync(CustomRestAuthenticationParams params)
 {
 ....
 }
 }

```

```c#
public class CustomDB : CustomDatabaseAuthentication<PluginConfig>
{
 public override Task<string> CreateConnectionStringAsync()
 {
 ....
 }
}

```

## Removed REST API
> api/login
> 
> api/v4.0 (WEBCON BPS 2022)

## REST API 6.0 changes
> Attachments can be added without checking out the instance.

> We can pass the persons for which a task should be created


## Different dependencies for BPS Portal and Workflow Service
> The SDK has been expanded to include a mechanism that enables loading from a plugin package independent files for service and Portal. This mechanism relies on two folders, ServiceDependencies and PortalDependencies where the respective files for Service and Portal are stored. These folders can be added to a plugin package, ensuring that the files they contain are loaded only in the specific environment (Service or Portal).

That would have helped us four months ago. :)
