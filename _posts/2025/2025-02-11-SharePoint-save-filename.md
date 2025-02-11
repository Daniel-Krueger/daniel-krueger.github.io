---
title: "Generate SharePoint save file names"
categories:
  - WEBCON BPS
  - Private 
tags:
 - SharePoint
excerpt:
    "Are you uploading documents to SharePoint? Make sure the file name characters are valid."
bpsVersion: 2025.1.1.44
---

# Overview
You just transported your process to production and two days later you get the feedback that it's 'broken'. During your test everything was working fine, even the upload to [SharePoint via REST](/posts/2025/sharepoint-online-rest-api-integration#using-the-global-automation). What you didn't expect though, was the characters the users would use. WEBCON BPS supports characters which are [not supported by SharePoint](https://support.microsoft.com/en-us/office/restrictions-and-limitations-in-onedrive-and-sharepoint-64883a5d-228e-48f5-b3d2-eb39e07630fa#invalidcharacters).

> Invalid characters<br/>
> - __" * : < > ? / \ |__<br/>
>   (Leading and trailing spaces in file or folder names also aren't allowed.)<br/>
> - Some organizations don't yet support __#__ and __%__ in names.<br/>
> - For Office desktop win32 apps: If you're saving an Office file via the Backstage view to a OneDrive or SharePoint folder, you won't be able to save the file if the folder name contains __;__ (semicolon).<br/>
> - If you're using Office 2010, you can't use __"&"__ in file and folder names.<br/>

The best way to prevent any issues is to parse the existing file name and upload it to SharePoint using a save/cleaned file name.

{% include figure image_path="/assets/images/posts/2025-02-09-Get-save-filename/2025-02-02-21-00-14.png" alt="Generating a save file name for SharePoint" caption="Generating a save file name for SharePoint" %}

# Implementation
## Overview
I've created two business rules to achieve this:
1. GetSafeFilenameInner
2. GetSafeFilename

I could have used a single one, with a lot of nested [String replace](https://docs.webcon.com/docs/2025R1/Studio/BusinessRules_General/#functions) functions. I tried to create it but it became difficult to read. Therefore, I created the 'Inner' function which uses SQL to replace the characters. I had to introduce the other rule to escape single quotes in incoming parameter, otherwise it would have broken the SQL statement. 
{% include figure image_path="/assets/images/posts/2025-02-09-Get-save-filename/2025-02-02-21-02-55.png" alt="Two business rules but only the `GetSafeFilename` is used." caption="Two business rules but only the `GetSafeFilename` is used." %}

## GetSafeFilenameInner
I've used the following name and documentation for this rule.

```
Rule name: GetSafeFilenameInner
Documentation: This business rule should never be called directly. Always use the one without "Inner"

Parameter: ValueWithoutSingleQuotes
```
```sql
select 
Trim(Replace(
  Replace(
    Replace(
      Replace(
        Replace(
          Replace(
            Replace(
              Replace(
                Replace(
                  Replace(
                    Replace(
                      Replace('{BRP:136}','"','_')
                     ,';','_')
                  ,'*','_')
                ,  ':','_')
              ,'<','_')
            ,'>','_')
          ,'?','_')
        ,'/','_')
      ,'\','_')
    ,'|','_')
  ,'''''','_')
,'&','_'))
```

{% include figure image_path="/assets/images/posts/2025-02-09-Get-save-filename/2025-02-02-21-10-45.png" alt="GetSafeFilenameInner implementation with parameter" caption="GetSafeFilenameInner implementation with parameter" %}

## GetSafeFilename
This rule calls the inner business rule but replaces any single quotes in parameter with two single quotes. This escapes the single quote and therefore doesn't break the execution of the first business rule.

I've used the following name and documentation for this rule.

```
Rule name: GetSafeFilename
Documentation: The safe filename function uses a SQL statement to replace the characters. Therefore, we need to escape single quotes. There may be single quote characters in the filename.

Parameter: OriginalValue

String replace parameter 1: The parameter
String replace parameter 2: '
String replace parameter 3: ''''
```
{% include figure image_path="/assets/images/posts/2025-02-09-Get-save-filename/2025-02-02-21-12-17.png" alt="GetSafeFilename calls the previous rule" caption="GetSafeFilename calls the previous rule" %}

{: .notice--info}
**Info:** Yes, the third parameters consists of four single quotes. If you would be using two single quotes, the value is treated as a SQL text value and only the values in the two single quotes would be used by the replace function. Therefore, three single quotes will replace the existing single quote with a single quote, while four single quotes will replace the existing one with two.


# Example
In my case I added a local parameter to the automation. This is then used in a `Change value of single field` action. This action executes the `GetSafeFilename` and passes the attachment file name. 

{% include figure image_path="/assets/images/posts/2025-02-09-Get-save-filename/2025-02-02-21-18-37.png" alt="Using the `GetSafeFilename` rule" caption="Using the `GetSafeFilename` rule" %}
