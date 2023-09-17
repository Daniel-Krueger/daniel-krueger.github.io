---
title: "Copy an attachment to another workflow"
categories:
  - WEBCON BPS  
  - Private 
tags:
  - REST
excerpt:
    This post covers the REST option to copy an attachment from the current workflow to another.
bpsVersion: 2023.1.1.89
---

# Overview  
The default actions of WEBCON BPS allow us to:
1. Create attachment for the current workflow instance.
2. Copy attachments from another workflow to the current instance. 

If you want to copy an attachment from the current instance to another you have three options:
1. Trigger a path transition in the target workflow, so that it can use the standard action to copy the attachment from the other instance to its own instance.
2. Write an SDK plugin to do so.
3. Use the REST API. 

This post covers the necessary actions for the REST API option.

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/Copy attachment via rest.gif" alt="Copy attachment via rest to another instance via REST." caption="Copy attachment via rest to another instance via REST." %}


# Setup
## Prepare the API application
If you don't have an existing API create a new one at:
```
https://WEBCONBPSSERVER/adminpanel/apiApplications
``` 

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-03-24.png" alt="UI navigation for adding a new API application." caption="UI navigation for adding a new API application." %}
Generate a secret and store it in KeePass or similar. We will need it later. Finally grant at least App.Elements.ReadWrite.All permissions. 

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-21-53-26.png" alt="API example" caption="API example" %}

You can find a more detailed description at [WEBCON Developer portal](https://developer.webcon.com/docs/registration-and-authentiaction/).


The permissions have the following information:
Information about the permission App.Elements.ReadWrite.All: Read, start new and update workflow instances in all processes (form fields, attachments and metadata). **Additional read, update or start new permissions on each instance are required**.

Therefore, we need to grant the application at least permissions on the process level.

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-12-37.png" alt="The created application has edit all permissions on the process level." caption="The created application has edit all permissions on the process level." %}

## Setup the connection
Add an OAuth2 APP -> API authentication using the client id and generated secret of the created application. Use your server in the token URL:
```
https://WEBCONBPSSERVER/api/oauth2/token
```

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-01-00.png" alt="The OAuth2 App -> API authentication" caption="The OAuth2 App -> API authentication" %}

Create a new REST Web Service connection using authentication type `OAtuh2 App -> API` with the newly created authentication option. Use the BPS portal URL as a base service instance URL:
```
https://WEBCONBPSSERVER
```


{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-05-05.png" alt="REST Web Service connection" caption="REST Web Service connection" %}


## Create the automation
### Overview
If you are already using WEBCON BPS 2023 you should make use of the new global automations. :)

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-07-59.png" alt="WEBCON BPS 2023 has global automations. " caption="WEBCON BPS 2023 has global automations. " %}

The automation will consist of:
- 2 input parameters
  - AttachmentId, which should be copied.
  - TargetElementId, the instance id to which the attachment should be copied.
- 1 local parameter
  - Body, the content we need to pass to the API endpoint.
- 2 actions
  - Change value of a single field for creating the body.
  - Invoke REST Web service to execute the request.

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-13-22.png" alt="The final automation" caption="The final automation" %}
{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-10-37.png" alt="" caption="" %}

### Generate the body
The API endpoint for adding an attachment is
```
/api/data/v4.0/db/{dbid}/elements/{id}/attachments
```
It requires this body

``` json 
{
  "name": "string",
  "description": "string",
  "group": "string",
  "content": "string"
}
```


{: .notice--info}
**Info:**
You can find more information about the API endpoint at (https://WEBCONBPSSERVER/api/index.html?urls.primaryName=API%20v4.0) under PublicApiElements. Look for a green post action which ends with `attachments` 

The easiest way I found to generate the body is using the `Change value of single field` action with a `Concat` function.
I've used text in combination with the functions `FILE NAME` and `CONTENT AS BASE64`. 

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-21-11.png" alt="Generate the body" caption="Generate the body" %}

These are the text values I used.
``` 
{  'name': '
'',  'description': '',  'group': '',  'content': ''
'}
```
I have no idea why, but for some reason I had to add an extra `'` at one place, so make sure, that every property name on the left is enclosed with single quotes as well as the value on the right in your environment.
{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-24-44.png" alt="Although there's are two single quotes only will be in the result." caption="Although there's are two single quotes only will be in the result." %}


### Define the Inokve REST Web service action

Setting up the  `Invoke REST Web service` action is quite simple.
1. Make use of the created `REST Web service connection`.
2. Define the URL/REST request suffix 
  ```
  /api/data/v4.0/db/#{DBID}#/elements/#{AUTP_Value:24}#/attachments
  ```
  This is assuming, that you want to copy the attachment to an instance in the current database. If you need to copy it to another database, you would need to change the value of the database ID variable. 
3. Use the local `Body` parameter in the `Request body` tab

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-29-04.png" alt="Minimum REST action definition." caption="Minimum REST action definition." %}

If you need to do something with the response, you can copy the response body from the API definition. Alternatively, you can use this one, which is valid for version 3 -5.

```
{
  "id": 0,
  "name": "string",
  "version": 0
}
```
{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-36-03.png" alt="Prepare the response body." caption="Prepare the response body." %}

{: .notice--info}
**Remark:**
The API version depends on your environment. API 4.0 has been available with the release of WEBCON BPS 2022. Therefore, you should check which versions are supported by your environment and use the latest one. API 3.0 has been deprecated with BPS 2023 and 2.0 is no longer available.

{: .notice--info}
**Remark:**
The API also has a `forceCheckout` query parameter. Without this parameter the call may fail if a user checked out the element. If you want to use it, you need to modify the URL and grant Admin privileges to the created application and admin permissions on process level.

# Using the automation
If you are lucky and are already running BPS 2023, you have now an easy to use option which can be utilized in any process.
Simply pass the ID of the attachment which should be copied and the ID of the target element.

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-43-57.png" alt="Using the global automation." caption="Using the global automation." %}

This will add the attachment to the element without creating a new version. In my case I modified my approach and manually removed the copied attachment.

{% include figure image_path="/assets/images/posts/2023-07-13-copy-attachment-to-other-workflow/2023-07-13-22-44-29.png" alt="The copied attachment doesn't create a new version of the instance." caption="The copied attachment doesn't create a new version of the instance." %}

