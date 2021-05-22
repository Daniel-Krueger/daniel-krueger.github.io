---
title: "Bring erroneous fields to the front"
categories:
  - Private
  - WEBCON BPS  
tags:
  - User Experience
  - Form rules
  - JavaScript
excerpt:
    Options are explained to display fields that have triggered an error to the user. Even if they are located on another tab.
bpsVersion: 2021.1.2.136
---

# Overview
This post describes an option how fields, which caused an error, can be brought to the attention of the user. With the current version of WEBCON BPS the user has to go through the following steps:
1. He needs to close the error dialog.
2. He may not see any problem. 
3. He has to click through the tabs/groups to find the mentioned fields. 

{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-22-23-33-29.png" alt="Example of the current user actions" caption="Example of the current user actions" %}

The second step can be eliminated using the options below. Of course, this only applies to forms, which make use of tabs and/or collapsed groups. If a form doesn't use either one, the default highlighting is enough. 

# General approach
With WEBCON BSP 2021 the form function [Set Focus](https://community.webcon.com/posts/post/set-focus-form-function/222) has been added. This allows us to display a specific field and activate it, which places the cursor inside the field. This can be used to improve the filling the form. The field will also be displayed if it is inside a collapsed group or on another tab. We will use this to display the first mentioned field in the error dialog.

Unfortunately, at least for our case, there are two different kind of errors. The first one is the missing required field, which is checked on the client.
{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-21-51-54.png" alt="Error message for missing required fields" caption="Error message for missing required fields" %}

The second one, an error thrown by a `Validate form` action, is checked on the server.
{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-21-56-14.png" alt="Error message of a `Validate form` action" caption="Error message of a `Validate form` action" %}

The different options require two different approaches, too.

# Set focus on required field
The browser checks whether any required field is empty and will create a log message with an internal field name (1). Afterwards a user-friendly message will be added to the error dialog (2).

{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-22-08-57.png" alt="A log message is written, before the dialog is executed" caption="A log message is written, before the dialog is executed" %}

The form rule `SetFocus` expects a field name in the format `DatabaseColumn_FieldId`. The logged message contains exactly this information. Therefor our solution will hijack the logging (1), extract the field name (2) and call `setFocus` for this field.
{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-22-14-02.png" alt="Executing `Set focus` for an empty field." caption="Executing `Set focus` for an empty field." %}

{: .notice--info}
**Info:** Even so we hijack console.log, the original one will still be called.

{: .notice--info}
**Info:** This will add a little additional overhead on the browser for executing our logging method.

Attentive readers noticed a condition in the previous screenshot. Unfortunately, we need to take a different approach if the missing field is a column of an item list. The logged message only contains the name of the column but not the name of the item list. This requires another solution for two reasons:
1. There could be multiple item list so we won't know which one should be focused on.
2. The focus can not be set on a column of an item list, we can only focus the item list, which is good enough.
  
{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-22-19-11.png" alt="Logged message of an empty required field in an item list." caption="Logged message of an empty required field in an item list." %}

Since we don't have the name of the erroneous item list, we need to get this after the error dialog is displayed. The dialog is displayed after all fields have been checked, so we will have to wait until it is (probably) displayed (1). I'm assuming that it won't take longer than 250ms to check all fields and display the dialog. Once the time is up we get the first row which contains the field/item list column information (2), get the field name from `initialModel` (3) and call the `setFocus` form function (4).

{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-22-22-47-54.png" alt="Implementation of focusing an item list with missing required column information." caption="Implementation of focusing an item list with missing required column information." %}

{: .notice--warning}
**Remark:** The script uses two timeouts. One has already been explained. The other one prevents that the focus will be set on the last checked field in case multiple fields have an empty value. I assume, that it does not take longer than 250ms to check every field. If this time is too short `setFocus`  will be called for the next field.
 
# Set focus on `Validate form` action field 
In contrast to the required field implementation, the `Validate form` action is not executed on the client, in turn we have no log message either. We only have the error dialog which contains our error message and no field information at all. Therefore, our error message needs to contain the field name in the expected format on which `Set Focus` should be executed.

{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-23-27-22.png" alt="A `Validate form` action message containing the field on which set focus should be executed. " caption="A `Validate form` action message containing the field on which set focus should be executed. " %}

{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-23-40-37.png" alt="The displayed error message of the above definition." caption="The displayed error message of the above definition." %}

This script itself is similar to the first one. Instead of hijacking `console.log` we do this for `window.fetch` (1). This is executed for when an instance is saved or moved to another step. If we receive a response from a server, we will trigger our method after 500ms (2). 
{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-23-29-42.png" alt="Responses from the server after calling goToNextStep or SaveElement are used for checking a possible error dialog." caption="Responses from the server after calling goToNextStep or SaveElement are used for checking a possible error dialog." %}

The script for the `Validate form` action expects that the error message begins with `Error WFD_Column_FieldId` (1). In case an error message exists, it's checked against the defined format (2). If this is the case `Set focus` will be called using the extracted field name (3).

{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-23-55-46.png" alt="Calling `setFocus` on a field name preceding the original error message." caption="Calling `setFocus` on a field name preceding the original error message." %}

{: .notice--info}
**Info:** I didn't want to disrupt the intended flow more than absolutely  necessary. Therefore, I opt for the timeout instead of working with the response.

If you don't want to see the `Error WFD_*:` text and/or want to have line breaks in your error message, you can use the following CSS rules. The error field text can be hidden using (1) which also requires (2) which preserves the entered line breaks in the error message.
{% include figure image_path="/assets/images/posts/2021-05-22-focus-error-field/2021-05-21-23-43-07.png" alt="Styles definitions to keep line breaks and hide the first row." caption="Styles definitions to keep line breaks and hide the first row." %}

{: .notice--warning}
**Remark:** If the style for preserving the line breaks is not used, then the whole message is displayed as a single line with the result, that no text is displayed at all.

{: .notice--info}
**Info:** The style for hiding the error line  `Error WFD_*` is only applied if the error message starts with this text. Any other messages will be displayed as they are.

The style definitions can be injected to a form using an html field. For more information you can read [this](https://daniels-notes.de/posts/2021/path-button-styling#defining-path-button-styles-once).


# Word of caution 
If you are intending to use these scripts, you have to keep this in mind:
1. Use either script only if the form makes use of tabs or collapsed groups. This will (slightly) increase the load on the client
2. Both scripts make use of timeouts, these may be to low in some cases. If this is the case you can increase them.
3. The scripts rely on internal workings of WEBCON BPS. If these change, they may break.
4. There's a [user voice](https://community.webcon.com/forum/thread/496/15) for a `Validate form` action improvement. This blog post was born from it and in case the user voice gets implemented you need to remove the scripts from all processes. In addition, the validation messages can be reverted and the style removed.

# Download
The scripts and CSS styles can be downloaded [here](https://github.com/cosmoconsult/webconbps/tree/main/FormRules/FocusOnError).