---
regenerate: true
title: "Import applications using an application"
categories:
  - WEBCON BPS 
tags:    
  - Installation
  - Governance
excerpt:
    Why should we import an application with a process? It's not only because we can.
bpsVersion: 2024.1.1.48
---

# Overview
My previous post [Import application using PowerShell and REST API](/posts/2024/importing-applications-using-rest) was the first step of my goal to create an application which can be used to import applications.

You may wonder why, and you are right to do so. Just because we can doesn't mean that we should do it. My reasons may be driven from my perspective as a  WEBCON partner who's customers a mainly in the regulated industry. This typically requires documenting 'everything' if something is automated, it is less documentation work. 

My reasons are:
- We have an audit trail /version history for each import.
- We have the history of the imports in the system itself and not somewhere else.
- It can be executed by anyone without specific knowledge or privileges to do so. Ok, this may cause problems with new processes and missing privileges. But this is another topic.
- Best of all, we can create a 'snapshot' of specifics elements before the import and compare these after the import. This is especially helpful, because some elements are always overwritten, and you may need to change them back after the import.

If you find yourself in one of these points you should continue to read.




# Import application phases
The process consists of three different phases. 
1. Creating a snapshot of the current environment
2. The import itself
3. Updating the snapshot information with the current data
   
  
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-21-35-36.png" alt="Workflow diagram of the import workflow." caption="Workflow diagram of the import workflow." %}

While some of these steps could be merged together, I prefer a more detailed approach.

# Environment snapshot creation
## General explanation
In these steps I capture all relevant information which may get changed. Some of these changes could be prevented with a correct import configuration, but not all. These are for example:
- Application group names
- Business entities properties

Both elements will always be overwritten. There is neither a configuration option in the import dialog of the Designer Studio nor in the configuration file.

Even if you have a configuration file, it may be outdated. Creating a snapshot before, will help you to identify unexpected changes.

But how does it look like? Let's use an application which uses global constants rules as an example. If you are transferring an application between different content databases in the same environment or have multiple environments to which an application should be transferred, these values may be different. The below screenshot is an example of changes. Please ignore the fact, that I used business rules here. One business rule (constant) was changed which should be overwritten after the import while the other one should keep its configuration.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-07-43-22.png" alt="Global business rules before the import" caption="Global business rules before the import" %}

This was the result after the import.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-07-47-33.png" alt="Global business rules after the import" caption="Global business rules after the import" %}


Since the values have been stored before the import and are read again after the import we can:
1. Provide an overview where and how many properties have been changed
2. What exactly was changed
   
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-07-49-39.png" alt="An overview what was changed after the import" caption="An overview what was changed after the import" %}

## Saving the data
This is basically the same for each element we want to save. We need to
1. Create an item list to store the information
2. Populating the item list in the different steps

The item list consists of these fields
- Key<br/>
  The key is needed to update the correct row and identify whether a new element has been added by the import. It consists of the GUID of the element and the column name. The integer ID of an element is not an option, as the element may have been deleted and will be added again. While the integer value will change, the GUID will be the same. 
- Title<br/>
  The name of the element, so that you know to which element the property belongs. I don't assume that you would like to use the key. ;)
- Property<br/>
  The column in the table in which the value is stored.
- Value before import<br/>
- Value after import<br/>
  
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-07-55-56.png" alt="Item list for storing the information" caption="Item list for storing the information" %}

Due to performance reasons, I never display the item list itself, but use a data table to render the information. Both are placed inside a group which is collapsed by default.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-01-51.png" alt="Rendering a data table is way faster than rendering an item list, even if it's readonly." caption="Rendering a data table is way faster than rendering an item list, even if it's readonly." %}

{: .notice--info}
**Info:** If you don't need any special formatting and an item list is read only anyway, then using a data table is a good option for a better user experience. Especially if there are hundreds of rows. 

## Displaying the changes
The changes are again displayed in a data table. There's just an additional where condition to check, whether anything was changed. Since you can't compare `null` values I had to make sure, that:
- The value is different, which works if neither value is null.
- That either column is null but not both.

```sql
select {DCNCOL:170} as Title
 , {DCNCOL:171} as Property
 , {DCNCOL:172} as [Value before import]
 , {DCNCOL:173} as [Value after import]
from WFElementDetails
where DET_WFDID = {WFD_ID}
       and DET_WFCONID = {WFCON:749}
       and ({DCNCOL:173} <> {DCNCOL:172} 
            or {DCNCOL:172} is null
            or {DCNCOL:173} is null)
       and not({DCNCOL:172} is null and {DCNCOL:173} is null)
```

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-13-21.png" alt="Configuration of the field to display the changes" caption="Configuration of the field to display the changes" %}

The overview of the changes is simply a combination of these statements displayed as a data row. Instead of selecting the columns we do a count and use the whole statement as a sub select.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-19-11.png" alt="The change overview uses a data row to display the number of changes" caption="The change overview uses a data row to display the number of changes" %}
## Actions
I tend to create process automations for each trigger, so that I don't need to bring up the step dialog. In this case the OnEntry automations are both the same, at least at this moment. 

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-54-46.png" alt="I create automations for triggers" caption="I create automations for triggers" %}

Each OnEntry automation calls all 'Update  xyz' item list automation. The automations are always build up the same way. There's a condition to check whether the 'before import' or after 'import value' should be updated. The numbers in the screenshot will be used later.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-33-22.png" alt="All automations are for updating the item list are build the same way" caption="All automations are for updating the item list are build the same way" %}

The actions all use the same SQL command and only the settings are different.

- The add rows action is in both cases the same.
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-39-33.png" alt="" caption="" %}
- The update actions map the value to a different column.
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-41-49.png" alt="" caption="" %}

{: .notice--info}
**Info:** You are right, this looks strange. Originally, I used a replace action on the left and an update action with update and add rows option on the right. It turned out I wouldn't be able to compare the values using this approach. You can read up on the nitty gritty details [here](#empty-and-null-handling-depends-on-the-item-list-action).


## Creating the SQL statement
I'm way too lazy to create all those SQL commands myself and no I didn't use ChatGPT or similar. I used my favorite tool for 'generating' code: Excel. :)
The file is stored in the GitHub repository, so I will focus on how to use it.

1. Bring up the SQL Management studio, generate a select statement and copy the columns.<br/>
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-51-52.png" alt="" caption="" %}
2. Paste these into the Excel and remove the leading space and comma with `Find and replace` so that you only have the column names.<br/>
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-54-25.png" alt="Paste the columns to excel and remove the spaces and ,." caption="Paste the columns to excel and remove the spaces and ,." %}
3. Update the values of:<br/>
   - Table
   - GUID column
   - Title
   - Where condition, which is optional<br/>
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-56-11.png" alt="Updated elements for this table" caption="Updated elements for this table" %}
4. Afterwards you can copy the generated lines back to management studio to test them. <br/>
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-58-12.png" alt="Result of the generated SQL statements" caption="Result of the generated SQL statements" %}

The `TSUpdate` and `RowVersion` column is always ignored. Either the values stay the same, if the element wasn't modified or they will be different, in this case something else was changed. Therefore, these values would only cause unnecessary data.


# Importing the import package
## Fields
Using the import API requires the import package and a configuration. I've opted for uploading those two files. While I also used categories in the attachments I created an item list with local attachments. This allowed me to make these files mandatory. For the `File type` I used a drop down with a custom SQL query which uses constants as an id.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-33-04.png" alt="File type configuration in the files item list" caption="File type configuration in the files item list" %}

 If you could imagine that a drop down / choice field is not only displayed but used with logic, always use constants instead of fixed value lists. This way you can make sure that you will find all places with the `Usages` tab.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-36-15.png" alt="Using constants instead of fixed value lists makes it easier to identify where something is used" caption="Using constants instead of fixed value lists makes it easier to identify where something is used" %}


In addition to the files item list there's:
- `Import session id`, a single text field.
- `Configuration`, a multi line text field.
  We need to saved the extracted configuration in a field because only those can be used in `Raw` mode in a REST action, see [uploading the configuration](#uploading-the-configuration).
- `Import status` another choice field.
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-41-28.png" alt="The values of the import status" caption="The values of the import status" %}

I also added a title and description field, so that I can describe what was the reason for the import.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-37-54.png" alt="An overview of all fields" caption="An overview of all fields" %}

## Business rules
There are four business rules which will be used in the REST action:
- Read the text from the configuration file
- One for the configuration and package file to get the attachment id
- One to get the size (length) of the package, which is required for starting the import session

I created two business rules for getting the correct attachment id. An alternative would be to create one with a parameter, which passes the correct constant value.

``` sql
select {DCNCOL:149}
from WFElementDetails 
where DET_WFDID = {WFD_ID}
  and DET_WFCONID = {WFCON:721}
  and {DCNCOL_ID:148} = '{EPV:98}'
```

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-50-38.png" alt="SQL command returning the ID of the attachment based on the item list." caption="SQL command returning the ID of the attachment based on the item list." %}

SQL command for converting the binary value of the configuration file to a text.
```
SELECT CONVERT(VARCHAR(MAX), CONVERT(XML, CONVERT(VARBINARY(MAX), ATF_Value)))
FROM BPS_Content_Att.dbo.WFAttachmentFiles 
WHERE 
	ATF_ID = ( Select max(ATF_ID) from WFAttachmentFiles where ATF_ATTID = {BRD:532})
```
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-49-14.png" alt="Converting the binary value of a file to a text" caption="Converting the binary value of a file to a text" %}

Last but not least the SQL command for getting the size (length) of the package file.
``` sql
select ATT_ContentLength
from WFDataAttachmets
where ATT_ID = {BRD:528}
```
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-52-27.png" alt="Getting the size (length) of the package file" caption="Getting the size (length) of the package file" %}

## Authentication
I've used the same application, I've configured [here](/posts/2024/importing-applications-using-rest#setting-up-the-api-application). In WEBCON BPS I've setup an `OAuth2 App -> API` authentication which in turn is used by the REST actions. 
Token:
``` 
https://bpsportal.example.com/api/oauth2/token
```
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-21-08-57.png" alt="OAuth2 App -> API configuration to be used in the REST actions " caption="OAuth2 App -> API configuration to be used in the REST actions " %}

## Create import session path
Creating the import session uses the standard REST action with business rules to get the site of the package file and an action to read the configuration file.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-55-23.png" alt="Actions in the path to start the import session" caption="Actions in the path to start the import session" %}

Configuration of the REST action for starting the import session.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-57-38.png" alt="REST action for starting the import session" caption="REST action for starting the import session" %}

Storing the configuration in the field.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-08-58-08.png" alt="Storing the configuration in the field" caption="Storing the configuration in the field" %}


## Upload the package and configuration
I was not able to use the standard REST action for uploading the file. If you are interested in my tests you, can read more [here](#uploading-the-configuration).

In the end, I gave up and created a custom very minimal custom action with three properties:
- API Endpoint<br/>
  The absolute address of the endpoint to be used.<br/>
  https://bpsportal.example.com/api/data/v6.0/db/{DBID}/importsessions/{722}/1
- Access token<br/>
  This is retrieved by another action, as I did not want to bother with the authentication and hope to get rid of this plugin in the future anyway.
- Attachment id<br/>
  The id of package which should be uploaded.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-05-33.png" alt="The configuration of the plugin." caption="The configuration of the plugin." %}

Since I decided against implementing the authentication, it's necessary to get the access token with a standard REST action.
- Authentication<br/>
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-10-00.png" alt="" caption="" %}
- Request data<br/>
  URL suffix: /api/oauth2/token<br/>
  Headers<br/>
  - accept:application/json
  - Content-Type:application/x-www-form-urlencoded
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-21-04-12.png" alt="" caption="" %}
- Request body <br/>
  I stored the secret as a constant for this example.
  {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-11-37.png" alt="" caption="" %}
-  Response<br/>
  The returned access token is stored in a parameter which is passed to the upload action.
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-12-34.png" alt="" caption="" %}

The last action is to upload the configuration which will start the import. The important thing here is to use the value stored in the field and return it in `RAW`. If you use the `Text without formatting` the value will not be a valid JSON because the characters are escaped as you can see it in the screenshot. If you would be using the business rule directly, then it would also be encoded as the field with  `Text without formatting` setting.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-16-31.png" alt="Action configuration for uploading the import configuration." caption="Action configuration for uploading the import configuration." %}

All combined, the automation for starting the import by uploading the file and configuration looks like this:
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-19-47.png" alt="Action overview for starting the import." caption="Action overview for starting the import." %}


## Waiting for import completion
It can take a while until the import is completed. This is handled by moving the workflow instance to the flow control. During this path transition the current status of the import is polled. The flow control then decides how to continue. If it's still in progress it goes back to the previous step.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-22-11.png" alt="Creating a loop to wait for the completion of the import." caption="Creating a loop to wait for the completion of the import." %}

This path has only one REST action which stores the result in the prepared choice field.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-24-07.png" alt="Action configuration for polling the import status." caption="Action configuration for polling the import status." %}

## Setting up the response body
The easiest way for configuring the Response body correctly is to:
- Navigate to the endpoint<br/>
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-26-40.png" alt="API endpoint" caption="API endpoint" %}
- Copy the example of the success code 200<b/>
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-27-13.png" alt="Success code result" caption="Success code result" %}
- Paste it into the JSON editor
    {% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-27-51.png" alt="Insert the success body" caption="Insert the success body" %}




# Remarks
## Importing the same application in multiple databases
By default, it is not possible to import the same application into multiple database. This can be changed by deactivating the flag `ImportValidateAppProcPresUniqueness` in the global parameters of the configuration database.

```sql
SELECT *
  FROM [BPS_Config].[dbo].[GlobalParameters]
  where PRM_Name ='ImportValidateAppProcPresUniqueness'
```


## Uploading package with standard REST action 
I spend quite of lot of time trying to figure out, whether I can use the standard action to upload the package. In the end I was not able to do it. Nevertheless, I want to document my results.

Below you see the request body which is send when I used PowerShell to upload the file. 
The body starts with a boundary `--GUID` followed by the `Content-Disposition` and `Content-Type`  in line 5 the binary part would follow.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-21-48-45.png" alt="Working multi part from PowerShell" caption="Working multi part from PowerShell" %}

### Request body type Multipart
I was not able to reproduce the body using the `Body type: multipart`. The problem is the JSON part. Regardless of what I did there have always been two 'starting' boundaries. One for the JSON part and on for the binary part.


{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-21-49-59.png" alt="Multipart configuration" caption="Multipart configuration" %}


{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-21-48-20.png" alt="Send request of the configuration" caption="Send request of the configuration" %}

But this is not supported by the API, it causes a bad request.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-21-49-32.png" alt="Bad request with REST action" caption="Bad request with REST action" %}
The underlying error was that the `Model is not valid`
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-22-01-15.png" alt="Bad request because of invalid model" caption="Bad request because of invalid model" %}

I was able to 'persuade' the API to accept the model, when I was using the binary part headers as the JSON headers.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-19-03-45.png" alt="A configuration which caused no bad request error." caption="A configuration which caused no bad request error." %}

 hile it worked for the upload it caused an error during the import. The stored binary is not a valid zip package.

### Request body type binary
Even so I didn't expect that using `Body type: Binary` would work,

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-21-50-26.png" alt="Binary configuration" caption="Binary configuration" %}
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-21-51-58.png" alt="Send request of the configuration" caption="Send request of the configuration" %}

I didn't expect that I would receive a `Not found 404` error. That got me really confused.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-21-51-26.png" alt="Not found error" caption="Not found error" %}

### Additional error information 
Each API call is logged in the table `AdminAPILogs` in the configuration database. In case of an error the column `WSAL_ErrorGUID` will have a value.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-16-21-59-54.png" alt="Get the error GUID from the AdminAPILogs table" caption="Get the error GUID from the AdminAPILogs table" %}

With this GUID you can use the `Search for logs by GUID` option from the administration tools.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-18-27-14.png" alt="Search for logs by GUID returns additional information." caption="Search for logs by GUID returns additional information." %}

## Empty and NULL handling depends on the item list action
### Background and summary
Originally, I used the `Replace list item` to store the data in the item list and in a later step I wanted to update it. This did work but when I wanted to display the changes I got an unexpected behavior.
- `Replace list item` and `Update item list values` with `Add new rows from the datasource` option<br/>
  These actions store an empty string value and a NULL value as an empty string value.
- `Update item list values` with `Update existing rows` option<br/>
  This setting will save an empty string value and a NULL value as a NULL.

Due to these different behaviors, I decided that I cannot use the replace action and have to add new rows and update all rows later.
This way, the value is always stored with the update action in all cases. However, the implementation may be.


In addition, I decided to replace the `NULL` value with a NULL text value. In the UI I will see the NULL text value and know that the value actually was `NULL`. Even if an empty string value is stored as `NULL` in the database, it doesn't matter in the UI. You can't distinguish a `NULL` value and an empty string value in the UI. 
There's also no issue when comparing two columns, if we only want to know, whether they are different. If both are null or have an empty string, that doesn't make a difference. In all other cases there would be a difference and they would be part of the changes.


### Baseline
I was using this SQL command and result as a baseline. The value column of the first row contains an empty string, while the second row is NULL.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-15-58-44.png" alt="The baseline data used for the tests." caption="The baseline data used for the tests." %}

### Replace action
As you can see below, there's no `NULL` stored in the `Value before import` column of the item list. All rows have at least an empty string.
The  `NULL` value is not stored as  `NULL`.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-16-04-24.png" alt="Replace action configuration" caption="Replace action configuration" %}
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-15-58-56.png" alt="Result of the action execution" caption="Result of the action execution" %}

### Update and add action
I switched from the `Replace` action to the `Update` action with a combination of `Add` and `Update`.
The result is that again the `NULL` values are stored as an empty text.

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-16-04-50.png" alt="Update action configuration" caption="Update action configuration" %}
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-16-06-39.png" alt="Result of the action execution" caption="Result of the action execution" %}

### Clear and add only
This had the same result as the replace action. There's a little difference because I decided to replace the `NULL` value with a NULL text. This way I can distinguish whether something else was stored as a `NULL`. 

{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-16-17-56.png" alt="Using clear and add instead of replace." caption="Using clear and add instead of replace." %}
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-16-18-25.png" alt="The same behavior as with the replace action." caption="The same behavior as with the replace action." %}

### Using add followed by an update
If the row already exists, the update will store an empty string value as a NULL value.
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-18-16-41-33.png" alt="First add all rows and then update values." caption="First add all rows and then update values." %}
{% include figure image_path="/assets/images/posts/2024-07-20-Importing-applications-using-an-application/2024-07-19-18-52-20.png" alt="Updating an existing row will save an empty string as `NULL`." caption="Updating an existing row will save an empty string as `NULL`." %}

## HTTP Requests
If you are wondering, how I got the requests, which had been generated by the REST actions you can read this post [Debug a web service data source](/posts/2022/debug-web-service-datasource) and also [Debug a web service data source alternative](/posts/2022/debug-web-service-datasource-alternative)

# GitHub Repository
In the linked [repository](https://github.com/Daniel-Krueger/webcon_application_import) you will find:
- The PowerShell solution.
- The Visual Studio solution for the custom action.
- The Excel file.
- An export of the application.

Yes, the exported application contains the credentials and I deleted the existing and setup a new credentials after the export. ;)