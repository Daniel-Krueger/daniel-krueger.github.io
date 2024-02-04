---
title: "Adding a help page"
categories:
  - WEBCON BPS   
  - Private  
tags:    
  - User Experience
  - JavaScript
  - CSS
excerpt:
    How would I add a help page to a process". This post answers the question with a reusable approach.
bpsVersion: 2023.1.3.29
---

# Overview  
During the [Ask Me Anything](https://www.youtube.com/watch?v=bcR7GRaVRbs&t=4698s) on 23rd January, I was asked how I would add a wiki page which could be used by users in case of problems. I replied that I would use an HTML field to provide a link / help icon to bring up the page. This post is a follow up on the question. 

{% include video id="EGJ7e81uIyo?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


# Changes to the modal dialog
This solution is build upon the [Modal dialog](/posts/2022/modal-dialog), which I improved a bit.

Changes to the modal dialog:
- Added option to open a provided URL in a modal
- Added option to show an attachment by providing database id and attachment id
- Modal can be moved around
- Change: The "new tab" icon now really opens a new tab and doesn't replace the existing one.<br/>
    ![](/assets/images/posts/2022-12-11-modal-dialog/2024-02-04-09-21-13.png)


# Options to display the help

{: .notice--info}
**Info:**
I will also describing a small part of the implementation in the next chapters, even so it will only make sense once you have read the whole post.

## Display URL in a dialog
This one will just take provided URL and display it a dialog if the user clicks on the help button.
You can provide the following parameters, in this order:
1. Title of the dialog
   Can be a fixed value or a business rule.
2. URL
   Can be a fixed value or a business rule.
3. Optional: Dimensions of the modal dialog
   The default value is: `"height:95%; width:50%;min-width:400px;"`

Example with fixed title label and default dimensions:
```js
  dkr.helpPage.useDisplayURLInDialog('Help page','https://community.webcon.com/forum')
```

Example with dynamic label and custom dimensions:
```js
  dkr.helpPage.useDisplayURLInDialog('#{BRD:855}#',"https://community.webcon.com/forum","height:95%; width:95%")
```


{: .notice--warning}
**Remark:**
This may not always work, because of the [* refused to connect](#error-refused-to-connect) error.


##  Display URL in a new tab
If you are getting the [* refused to connect](#error-refused-to-connect) error and can't change the underlying system, this is your alternative.
Instead of first rendering the dialog and then clicking on the `open in new tab` icon, you can directly open the URL in a new tab.

Example :
```js
dkr.helpPage.useDisplayURLInNewTab("https://community.webcon.com/forum")
```

## Display a file in a dialog
This will allow you to display an existing attachment in the modal dialog. You can provide the following parameters, in this order:
1. Title of the dialog
   Can be a fixed value or a business rule.
2. Database id
3. Id of attachment to display. 
4. Optional: Dimensions of the modal dialog
   The default value is: `"height:95%; width:50%;min-width:400px;"`

Example with fixed title label and default dimensions:
```js
  dkr.helpPage.useDisplayAttachment('Help page',#{DBID}#,'#{BRD:851}#')
```

Example with dynamic label and custom dimensions:
```js
  dkr.helpPage.useDisplayAttachment('#{BRD:855}#',#{DBID}#,'#{BRD:851}#',"height:95%; min-width:800px;")
```

# Implementation
## Overview
I created this solution in a way that it's easily reusable in each process. This requires a few new global elements in addition to changes to a process.

The minimum implementation exists of:
- Global form rule "HelpPage"
- Global css
- Html field per process
- Optional global business rules for translatable texts.

The further requirements will depend on how you want to handle the help:
- Do you have one document / URL per process?
- Do you want to provide an own help page per step?
- Do you want to use files or URLs?

I will provide a guideline for providing help information per step using files. You can easily amend this for your use case.

This will require:
- A document template process for the mapping.
- Global business rule for retrieving the attachment id.

## Help files per step
### Process definition
This is pretty straight forward. We will add a document template with a few fields to map a file to a step.
{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-09-38-07.png" alt="Fields of the help file document template process" caption="Fields of the help file document template process" %}

The definition of the choose fields is simple.  Depending on your environment, you could probably omit the application or even process field. I just prefer it this way for a better overview.

- Application
  ```sql 
  select APP_ID, APP_Name
  from WFApplications
  order by APP_Name
  ```
- Process
  ```sql 
  select DEF_ID, DEF_name
  from WFDefinitions
  where DEF_APPID = '{I:917}' /* The application field id*/
  order by DEF_Name
  ```
- Workflow
  ```sql 
  select WF_ID, WF_name
  from Workflows
  where WF_WFDEFID = '{I:913}'  /* The process field id*/
  order by WF_Name
  ```
- Step
  ```sql 
  select STP_GUID, STP_Name, ObjectName as Step_Type, STP_Order
  from WFSteps join DicStepTypes on STP_TypeId =TypeId
  where STP_WFID = '{I:921}' /* The workflow field id*/
  order by [STP_Order]
  ```
{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-09-53-38.png" alt="Field definitions" caption="Field definitions" %}

The steps will be sorted by their order and the type is displayed using the database information. They differ from those used in the designer studio.

{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-09-45-41.png" alt="Displayed step information" caption="Displayed step information" %}

{: .notice--info}
**Info:**
I'm using the STP_GUID here, as this will allow us to transport the documents to test/prod, which will be useful for new processes.

{: .notice--info}
**Info:**
Instead of `ObjectName` you can also use `[Name]` column, if you speak polish.

{: .notice--warning}
**Important:**
Make sure, that all users have the privilege [Access all workflow instances and attachments](https://docs.webcon.com/docs/2023R3/Studio/Process/Process_Configuration/Process_Permissions).


### Global business rule
Now that we have a mapping for the steps to a file, we can create a global business rule `GetStepHelpFileId` using a `SQL Command`


```sql
select ATT_ID
from WFDataAttachmets join WFElements
  on ATT_WFDID = WFD_ID
    and ATT_IsDeleted = 0
    and WFD_DTYPEID = {DT:77} /* Your form type of the created process*/
    and  {WFCONCOL_ID:918} /* The id of the step field of the process*/
     = (select STP_GUID from WFSteps where STP_ID = {STP_ID})
```

{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-09-57-53.png" alt="Business rule implementation" caption="Business rule implementation" %}


{: .notice--info}
**Info:**
Unfortunately the view V_WFElements doesn't contain the GUIDs, maybe it will help, if you upvote my user voice [Extend V_WFELEMENTS with GUIDs](https://community.webcon.com/forum/thread/4134/15). :)

## Global elements
### Global form rules

All in all, we will need three from rules of type JavaScript. 
I will be brief on the process on how to do this. If you need more information, just read through the link to in the common functions.
I suggest using the minified version due to these [reasons](/posts/2023/bandwidth-usage).

- Common functions [util.min.js](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/utils)
  If you don't have it yet, check out [](https://daniels-notes.de/posts/2023/ux-form-rules-revised#1-common-functions)
- Modal dialog [parentLogic.min.js] (https://github.com/Daniel-Krueger/webcon_snippets/tree/main/ModalDialog)
- Help page [helpPageFormRule.min.js] (https://github.com/Daniel-Krueger/webcon_snippets/tree/main/helpPage)
{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-10-00-43.png" alt="Required form rules" caption="Required form rules" %}

Form rule example:
{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-10-28-53.png" alt="Example of a form rule in JavaScript mode" caption="Example of a form rule in JavaScript mode" %}

### (Optional) Global business rules
You can provide a title for the global dialog as well as a label for the deactivated help page.

{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-10-32-09.png" alt="Multilingual labels can be provided" caption="Multilingual labels can be provided" %}

This is realized using global business rules and the `Text` function. You can select the current language from the drop down and set a text for it.
{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-10-36-48.png" alt="Using the text function to support multilingual labels" caption="Using the text function to support multilingual labels" %}

{: .notice--info}
**Info:**
In contrast to some other form rules I created, I decided for using the function `Text` for the business rules. Maybe I wasn't aware of it when I started using global form. As these are already in use, it's to late to go change these now.

### Global CSS style
The styling of the button is applied using the [global CSS](https://docs.webcon.com/docs/2023R3/Studio/SystemSettings/GlobalParams/SystemSettings_AppearanceSettingsMode#global-css-styles). I suggest to use the provided minified [helpPageGlobal.min.css](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/helpPage). 

{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-10-38-14.png" alt="Button styling in Global CSS" caption="Button styling in Global CSS" %}


## Process customization
### General
Now everything is prepared we need to add the help page to the individual processes. Don't be afraid, this will consist of:
- Adding two HTML fields
- Making them visible
- Copying these fields between the processes

{: .notice--warning}
**Remark:**
If you already have used any of my solutions using the `Common functions(util.js)` form rule, you will need to modify this HTML field and create one additional one.

{: .notice--warning}
**Remark:**
At least if you go with one approach and don't switch between help files, URLs displayed in modal or in a new tab.

### HTML fields
The new form rules depend on the `Common functions` and `Modal dialog - parent logic` form rules. I'm following my approach from [here](https://daniels-notes.de/posts/2023/ux-form-rules-revised#overview) to setup one HTML field which only invokes global form rules, especially if they depend on each other.  
If you already have one `GlobalRules` form field, add the call to the new created `HelpPage` form rule. Otherwise add one HTML field which looks like the one below and don't forget to deactivate `Show field name`.

```html
<script>
  InvokeRule(#{BRUX:714:ID}#); // Form rule id of the common function
  ccls.utils.applicationId = #{APP_ID}#;
  ccls.utils.basicPathInformation = JSON.parse('#{BRD:716}#');  // Business rule id of the GetBasicPathInformation 
  InvokeRule(#{BRUX:733:ID}#);
  InvokeRule(#{BRUX:857:ID}#);
</script>
```

{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-11-33-36.png" alt="Global rules HTML field example" caption="Global rules HTML field example" %}

{: .notice--warning}
**Remark:**
If you are missing the common functions head over [here](https://daniels-notes.de/posts/2023/ux-form-rules-revised#1-common-functions).

We need one more HTML field for creating the help button. As mentioned, if you decided for one approach, you can create this HTML field ones, and copy it over to the other processes.
Depending on your use case you need use one of these options by removing the comment `//` from the line, fixing the parameters and remove the other ones, so that they map your use case.

``` html
<button id="helpPage" class="helpPage" aria-label="" tabindex="0" type="button" onclick="dkr.helpPage.displayMethod()" style="display:none;">
  <i class="icon ms-Icon ms-Icon--Help ms-Icon--standard" aria-hidden="true" data-disabled="false"></i>
</button>

<script>
  dkr.helpPage.noHelpDefinedLabel = 'BRD_ID with Text function or fixed text'
  //dkr.helpPage.useDisplayAttachment("Help title",#{DBID}#,'#{BRD:851}#')
  //dkr.helpPage.useDisplayURLInDialog("An external page","https://community.webcon.com/forum","height:95%; width:95%")
  //dkr.helpPage.useDisplayURLInNewTab("https://community.webcon.com/forum")
  dkr.helpPage.prepareHelpPage();
</script>


```
{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-11-37-44.png" alt="Adding help button using attachments as a source." caption="Adding help button using attachments as a source." %}

## Showing the fields
The `GlobalRules` fields needs to be the very first field on the form. You can place your field for displaying the help button afterwards.
Don't forget to display these fields in the field matrix.
{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-11-42-46.png" alt="Add the fields to the top of the form template." caption="Add the fields to the top of the form template." %}

# Which file type should I use?
Using files for help will surely not be the best option in regards to bandwidth consumption, but as always, you have to decide between usability and technical requirements. I made some tests, and I didn't expect the results.

|File name | Size on disk in bytes |Bandwidth usage|Comment|
|---|---|---|---|
|Test_docx.docx |72.606|24.053|Source document|
|Test_html.html |301.006|Omitted|Created form Word, the image is not even part of the file.
|Test_pdf.pdf |29.074|29.074|Created from Word|
|Test_docx_bps.pdf|24.053|24.053 |Created via `Convert to pdf action` |
|Test_docx_bps.html|26.094 |compressed to 20.1xx |PDf converted to HTML using online tool|

For me this shows the following:
1. The most efficient way would be to have an HTML file, as the plaintext can be compressed by the server.
2. WEBCON BPS internally converts a .docx to a .pdf for rendering the preview. 
3. The Aspose engine does a better job for generating the .pdf then the default Word mechanisms. The file size is lower.


I don't know how long the generated .docx preview is kept alive to be served again, so that it doesn't need to be converted again and again. You remove a little burden from the server by generating the pdf automatically via an action. 



# Error Refused to connect
If you want to display an URL in the dialog you may receive this error:

{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-11-59-35.png" alt="Refused to connect error in modal dialog." caption="Refused to connect error in modal dialog." %}

The developer tools will provide you with a little more information.
{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-12-03-49.png" alt="More detailed error explanation." caption="More detailed error explanation." %}

This is due to the fact that the URL is displayed in an iFrame. This could be misused, and it's prevented by a security feature implemented in the browser / web servers. In theory you could define which website should be allowed to display the URL in an iFrame. Unfortunately there are quite a lot websites which don't support this. Those I'm aware of are:
- Azure DevOps
- OneNote
- SharePoint Online

Initially I wanted to use these ones as a source for the help, but I ended up with the attachment solution due to this reason.

{: .notice--info}
**Feedback requested:**
If you have something to contribute, adding more pages / documentations to enable it, please get in touch with me.

If you want to go the other way around, and display WEBCON BPS in an iFrame, you may encounter the same problem. Luckily, we are able to provide a configuration in [WEBCON BPS](https://docs.webcon.com/docs/2023R3/Studio/SystemSettings/GlobalParams/SystemSettings_Security).

{% include figure image_path="/assets/images/posts/2024-02-04-adding-a-help-page/2024-02-04-12-12-13.png" alt="In WEBCON BPS we have the option to configure which websites could display WEBCON BPS content in an iFrame." caption="In WEBCON BPS we have the option to configure which websites could display WEBCON BPS content in an iFrame." %}

# Download
You can find the CSS, global form rule and base HTML field definition [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/helpPage).
