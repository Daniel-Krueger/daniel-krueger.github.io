---
title: "Focus fields which caused an error"
categories:
  - Private
  - WEBCON BPS  
tags:
  - User Experience
  - Form rules
  - JavaScript
excerpt:
    Bring fields causing an error into focus.
bpsVersion: 2021.1.2.136
---

# Overview
This post describes an option how fields, which caused an error, can be brought to the attention of the user. With the current version the user has to close the error dialog (1). Depending on the for it could be that, he doesn't see any issue (2), therefore he has to click through the tabs/groups to find the fields (3). This behavior can be changed so that the second step is void.

![Example of the current](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-21-37-52.png)

Of course this only applies to forms, which make use of tabs and/or collapsed groups. If a form doesn't use either one, the default highlighting is enough. 

# General approach
With WEBCON BSP 2021 the form function [Set Focus](https://community.webcon.com/posts/post/set-focus-form-function/222) has been added. This allows us to display a specific field and activate it, which places the cursor inside the field. This can be used to improve the filling the form. If the target field is inside a collapsed group or on another tab, the field will be displayed nevertheless. We will use this to display the first mentioned error field.

Unfortunately, at least for our case, there are two different kind of errors. The first one is the missing required field, which is checked on the client.
![Error message for missing required fields](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-21-51-54.png)

The second one, an error thrown by a `Validate form` action, is checked on the server.
![Error message of a `Validate form` action](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-21-56-14.png)

The different options require two different approaches too.
# Set focus on required field error
The browser checks whether any required field is empty and will create a log message (1). If this is the case will display an error dialog accordingly (2).

![A log message is written, before the dialog is executed](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-22-08-57.png)

The form rule 'SetFocus' expects a field name in the format `DatabaseColumn_FieldId`. The logged message contains exactly this information. Therefor our solution will hijack the logging (1), extract the field name (2) and set the focus for this field.
![Executing `Set focus` for an empty field.](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-22-14-02.png)


{: .notice--info}
Even so we hijack console.log we will call the original one. Of course, this will add a little additional overhead on the browser for executing our logging method.

Attentive readers noticed an  condition in the previous screenshot. Unfortunately, we need to take a different approach if the missing field is a column of an item list. The logged message only contains the name of the column but not the name of the item list. This requires another solution for two reasons:
1. There could be multiple item list so we won't know which one should be focused on.
2. The focus can not be set on a column of an item list, we can only focus the item list which is good enough.
  
![Logged message of an empty required field in an item list.](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-22-19-11.png)

Since we have don't have the name of the erroneous item list, we need to get this after the error dialog is displayed. The dialog is displayed after all fields have been checked, so we will have to wait until it is (probably) displayed (1). I'm assuming that it won't take longer than 250ms to check all fields. Afterwards we get the first row which contains the field/item list column information (2), get the field name from `initialModel` (3) and call the `Set focus` form function (4).

![Implementation of focusing an item list with missing required column information.](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-22-30-15.png)

{: .notice--warning}
**Remark:** The script uses two timeouts. The first prevents that the focus will be set on the last checked field, if multiple fields have an empty value. I assume, that it does not take longer than 250ms to check every field. If this time is exceeded than the next field will be focused on.
 
# Set focus on `Validate form` action field 
In contrast to the required field implementation, the `Validate form` action is not executed on the client, therefore we have no log message, which we can use. We only have the error dialog which contains our error message and no field information. Therefore our error message needs to contain the field on which `Set Focus` should be executed in the format `Set Focus` expects.

![A `Validate form` action message containing the field one which set focus should be executed. ](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-23-27-22.png)

![The displayed error message of the above definition.](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-23-40-37.png)

This script itself is similar to the other one. Instead of hijacking `console.log` we do this for `window.fetch` (1). If we receive a response from a server after moving the workflow to the next step or saving it(2), we will trigger our method after 500ms to check whether, an error dialog is displayed. 
![Responses from the server after calling goToNextStep or SaveElement are used for checking a possible error dialog.](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-23-29-42.png)

The script for the `Validate form` action expects that the error message begins with `Error WFD_Column_FieldId` (1). In case an error message exist, it's checked against this format (2). If this is the case `Set focus` will be called using extracted field name (3).

![Calling `Set focus` on a field name preceding the original error message.](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-23-55-46.png)

If you don't want to see the error field text and want to have line breaks you can use the following CSS rules. The error field text can be hidden using (1) in combination with keeping the line breaks with rule (2).
![](/assets/images/posts/2021-05-25-focus-error-field/2021-05-21-23-43-07.png)

{: .notice--info}
**Info:** The error field name line is only invisible, if the error message starts with `Error WFD_`. 

The style definitions can be injected to a form using an html field. For more information you can read [this](https://daniels-notes.de/posts/2021/path-button-styling#defining-path-button-styles-once).


# Word of caution 
If you are intending to use these scripts you have to keep this in mind:
1. Use either script only if the form makes use of tabs or collapsed groups. This will (slightly) reduced the load on the client
2. Both scripts makes use of timeouts, this may be to low in some cases.
3. The scripts rely on internal workings of WEBCON BPS. If these change, they may break.
4. There's a [user voice](https://community.webcon.com/forum/thread/496/15) for a `Validate form` action improvement. This blog post was born from it and in case the user voice gets implemented you need to remove the scripts from all processes where they are used.

# Download
The scripts and CSS styles can be downloaded [here](https://github.com/cosmoconsult/webconbps/tree/main/FormRules/FocusOnError).