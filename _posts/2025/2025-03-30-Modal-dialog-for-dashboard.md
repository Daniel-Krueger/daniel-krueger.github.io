---
title: "Modal dialog for dashboards"
categories:
  - WEBCON BPS
  - Private 
tags:
 - User Experience
 - JavaScript
 - Dashboard
excerpt:
    "A variation of the modal dialog for the dashboard"
bpsVersion: 2025.1.1.105
---

# Overview
While I was working on the next blog post, I realized, that a modal dialog would be beneficial to it. Since the next one will be a dashboard 'extension' it was necessary to create a variation of the [modal dialog](/posts/2022/modal-dialog).


{% include video id="U_LAbRJpJE0?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


# Implementation
This is quite simple; we need a dashboard with:
- An HTML code widget to load the JavaScript
- A dataset with a calculated field to trigger the modal dialog.



## HTML code widget
You can add an `HTML code` widget anywhere to the dashbaord.
{% include figure image_path="/assets/images/posts/2025-03-30-Modal-dialog-for-dashboard/2025-03-30-17-04-51.png" alt="Select the `HTML code` widget" caption="Select the `HTML code` widget" %}

You can copy the content from the `modalDialogDashboard.html` file in the referenced [GitHub](#download) folder.
{% include figure image_path="/assets/images/posts/2025-03-30-Modal-dialog-for-dashboard/2025-03-30-18-05-33.png" alt="Copy the html code from the``modalDialogDashboard.html` file" caption="Copy the html code from the``modalDialogDashboard.html` file" %}

That's all.
## Calculated column

Create a calculated column of type `Link` with the following text:
``` sql
'link:javascript:dkr.modaldashboard.displayWorkflowFromReport('+cast(WFD_ID as varchar(12))+',''WFD_Signature'','''+WFD_Signature+''',''width:60%;height:75%;'',true);displayname:'+WFD_Signature`
```

{% include figure image_path="/assets/images/posts/2025-03-30-Modal-dialog-for-dashboard/2025-03-30-17-22-31.png" alt="Calculated column definition" caption="Calculated column definition" %}

You have to replace the **first** occurrence of the WFD_Signature `''WFD_Signature''` with the value of the `data-key` attribute of any report column. This will be used as the title of the modal dialog as explained [here](#modal-dialog-functions).

{% include figure image_path="/assets/images/posts/2025-03-30-Modal-dialog-for-dashboard/2025-03-30-17-27-03.png" alt="The `data-key` value is used to get the title value. " caption="The `data-key` value is used to get the title value. " %}

The second occurrence `+WFD_Signature+`  must not be changed while you are free to change the one after the `displayname:` to anything you want.


# Explanations
## Modal dialog functions
The `modalDialogDashboard.html` file adds three functions with which a modal dialog can be invoked.
1. `dkr.modaldashboard.dialog.displayiFrame = function (title, url, dimensions, closeFunction, opensWorkflowInstance)`
2. `dkr.modaldashboard.displayWorkflow = function (instanceId, title, dimensions, openInEditMode, closeFunction)`
3. `dkr.modaldashboard.displayWorkflowFromReport = function (instanceId, titleColumn, signature, dimensions, openInEditMode, closeFunction)`

I will explain the parameters of the third one as it's the most complex one.
- instanceId <br/>
  The workflow instance id which should be displayed in the dialog.
- titleColumn <br/>
  The report column which value should be used as the title for the dialog. By passing the column of the title, you don't need to care of special characters like quotes in the title, when creating the calculated column.
  ![](/assets/images/posts/2025-03-30-Modal-dialog-for-dashboard/2025-03-30-17-13-03.png)
- signature <br/>
  The signature of the workflow instance is used to identify the current row. The `titleColumn` will then be used to get the title value.
  ![](/assets/images/posts/2025-03-30-Modal-dialog-for-dashboard/2025-03-30-17-15-03.png)
- dimensions <br/>
  You can define the height and width of the dialog. For example, `height:70%; width:80%`
- openInEditMode <br/>
  The workflow instance will be displayed in edit mode.
- closeFunction <br/>
  An optional function which is triggered, whenever the dialog is closed.

In the example above I omitted the last two parameters `,''width:60%;height:75%;'',true)`

Closing the modal dialog will trigger the refresh of all reports.
{% include figure image_path="/assets/images/posts/2025-03-30-Modal-dialog-for-dashboard/2025-03-30-17-19-16.png" alt="Closing the dialog will refresh the report." caption="Closing the dialog will refresh the report." %}


## Edit modal dialog text
The `Edit modal dialog dashboard code` text is only displayed in the edit mode (1). It's automatically hidden if the edit mode is not active (2).
{% include figure image_path="/assets/images/posts/2025-03-30-Modal-dialog-for-dashboard/2025-03-30-17-38-14.png" alt="The edit text is only displayed in edit mode" caption="The edit text is only displayed in edit mode" %}

## Refreshing report tiles
I haven't found a way to refresh the report tile data. 

## Displaying a workflow instance in the modal
The correct styling of the modal dialog is handled by the [Child logic](/posts/2022/modal-dialog#workflow-preparation) of the modal [modal dialog]( /posts/2022/modal-dialog)
I needed to add a few lines of CSS to it. I’ve linked the updated child logic in the download chapter.


# Download

You can find the full and a minified JS version [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/modalDialogDashboard).

You can find the updated child logic [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/ModalDialog).
