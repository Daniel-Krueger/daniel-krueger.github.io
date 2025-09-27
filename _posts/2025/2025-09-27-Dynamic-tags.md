---
title: "Creating tags dynamically"
categories:
  - WEBCON BPS
  - Private 
tags:
 - Data sources
 - REST
excerpt:
    "Choose a tag (classification value) from a centralized or decentralized sourced or add one."
bpsVersion: 2025.1.1.105, 2025.2.1.179
---

# Overview
A lot of times you need to classify data using choose fields. Sometimes you have to select these from a provided list and sometimes you would like to enter the values on the fly. In this post I will refer to the first one as a centralized source and to the later one as decentralized. While you could think of them as similar, as you are selecting values from a list, I choose different terms for the following reason.
-	The centralized data source has a backing dictionary which is used to store and manage the data.
-	The decentralized data source has no backing dictionary. You can simply select a value from already existing ones or add a new one ‘My tag’. Afterwards, you can select ‘My tag’ in other workflow instances. If it has been removed from all workflows, ‘My tag’ will no longer selectable be selectable.

{% include video id="n4WPxg26bfk?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

{: .notice--info}
**Info:** While this post is related to [Adding a new choice field value without leaving the page ](/posts/2022/add-new-choice-field-value-without-leaving-the-page) and [Modal dialog v3 ](/posts/2022/modal-dialog) it's contains a little improvement for adding values via the modal dialog. The "dynamic" part is completely new. 

# Decentralized data source
## Implementation
This is quite simple and the 'magic' for providing the created values is the data source definition of this field. 

It simply returns the id and label of this field from the same form types. 
{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-10-16-51.png" alt="SQL statement to return the available values." caption="SQL statement to return the available values." %}

The only thing left is to configure the fields, 
{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-10-27-55.png" alt="Configure the columns for the fields." caption="Configure the columns for the fields." %}
and allow adding values to the data source in the advanced configuration tab.
{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-10-28-54.png" alt="Allow adding new values." caption="Allow adding new values." %}

I'm so used to creating SQL commands that this was my first approach, but it also works with BPS Internal views.
{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-10-23-59.png" alt="Alternative using a BPS internal view." caption="Alternative using a BPS internal view." %}
Just make sure to use the ID of the choose field for type `ID`.
{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-10-30-17.png" alt="Configure the correct fields for the choose field." caption="Configure the correct fields for the choose field." %}
## Usage
Now your employees will be able to:
1) Select one of the existing tags
2) Create a new one by clicking on the pen to enter the edit mode.

{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-10-39-11.png" alt="Select existing values, or create a new one" caption="Select existing values, or create a new one" %}



{: .notice--info}
**Info:**
It's good to know, that adding new values is achieved by creating a new GUID which is prefixed with a dash. This also means that you could effectively create the label multiple times, which have different Ids. While this doesn't make a difference in the form it surfaces in reports. There you would have multiple entries for the ‘same’ label.
{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-10-44-00.png" alt="Created values get a new GUID which are prefixed with a dash." caption="Created values get a new GUID which are prefixed with a dash." %}


# Centralized data source
## General approach
This one is a little bit more complex, as the values of this choose field are stored in a dictionary. The biggest difference to the previous implementation versions from 2022 is, that it overwrites the `Add new` button of the popup search and autocomplete.

{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-11-13-39.png" alt="The 'Add new' button will create a modal dialog to create the workflow." caption="The 'Add new' button will create a modal dialog to create the workflow." %}

This requires JavaScript and therefore we need to:
- Create global form rules
- Create a HTML field for execution
- Update the configuration of the choose field

## Global form rules
The new values will be added via a dialog, if you are not familiar with this, please read up on it [here](/posts/2022/modal-dialog) as I won't go into details how the workflow instance needs to be modified which should be displayed in the dialog. I typically call the workflow which will be displayed in the modal as 'child' and the other one 'parent'. 


All in all, we need the following global form rules:
- Common functions<br/>
  This will be used by the parent and child workflow instance.
- Parent logic <br/>
  I had to update the JavaScript to display my modal dialog in front of the popup search. This will be used by the parent workflow instance.
- Child logic
  This will be used in the child workflow instance.
- ChooseFieldAddNew
  This rule contains the logic to modify the buttons. It was more complicated than I imagined it to be.

{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-11-24-36.png" alt="Those are the global form rules we need." caption="Those are the global form rules we need." %}

If you have never done it before:
- Create a global form rule
- Change mode to JavaScript
- Copy the JavaScript from the linked file to it

{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-11-47-23.png" alt="Adding JavaScript to a global form rule." caption="Adding JavaScript to a global form rule." %}

## HTML Field
As I mentioned, I will only cover the parent workflow configuration in this post. You can refer to [this post](posts/2022/modal-dialog#workflow-preparation) for the child implementation. 


This is a little more complex, as we need to define which workflow should be displayed to save the data. In addition, it's depends on the select behavior `Popup search` or `Autocomplete` of the choose field.
1) In both cases we need to load the form rules
2) This block is used for `Popup search`
3) This block is user for `Autocomplete`

This is the script block for the popup search:
``` JavaScript
openNewTagModalPopupSearch = function () {
    const input = document.querySelector('span.picker-search__input input')
    ccls.modal.dialog.startWorkflow(`"default":"New tag", "de":"Neues Tag"` // Define the title of the modal dialog
        , `"workflowId": #{WF:99}#, "formTypeId": #{DT:106}#` // Define the workflow and form type to be started
        , `"#{FLD:1573}#":"${input?.value}"` // The field to which the entered value should be passed
        , 'height:90%; width: 50%'
        , dkr.chooseFieldAddNew.executeSearchAgain)
}

```

This is the script block for the autocomplete.  

``` JavaScript
openNewTagModalAutocomplete = function () {
    const input = document.querySelector('div##{FLD:1582}# input');
    ccls.modal.dialog.startWorkflow(`"default":"New tag", "de":"Neues Tag"` // Define the title of the modal 
    dialog
        , `"workflowId": #{WF:99}#, "formTypeId": #{DT:106}#` // Define the workflow and form type to be started
        , `"#{FLD:1573}#":"${input?.value}"` // The field to which the entered value should be passed
        , 'height:90%; width: 50%'
        , newTagCloseFunction)
}
newTagCloseFunction = async function (parameters) {
    ccls.modal.dialog.closeFunctions.setGuidForField(parameters, '#{FLD:1582}#');
}
```

The main differences between both start functions are:
- The selection of the currently entered values
- The function which is executed after closing the dialog. In case of the popup search, the search is triggered to display the new value. In contrast the autocomplete adds the GUID of the newly created instance to the existing auto complete values. Yes, this works for multiple values, too.
## Field configuration
The last step is to configure the field by defining the correct link depending on the selected behavior of the field. In case you haven't changed the name of the functions in the script blocks these are:
- `javascript:openNewTagModalAutocomplete()`
- `javascript:openNewTagModalPopupSearch()` 

{% include figure image_path="/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-06-12-13-32.png" alt="Choose the correct function for the choose field behavior." caption="Choose the correct function for the choose field behavior." %}



## Usage
While implementation requires more effort than the decentralized approach, your users can simply
1. Click on "Add new"
  ![](/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-19-09-53-39.png)
2. Enter the new tag
  ![](/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-19-09-55-14.png)
3. Save it and the new value will magically be added to the existing ones.
  ![](/assets/images/posts/2025-09-27-Dynamic-tags/2025-09-19-09-55-52.png)

## Outlook
The idea behind this script is to make it easy for the user to add new entries, while still being able to manage these. 
- You could add validation to the entered value to follow a guideline
- Deactivate outdated values, so that they can no longer be used.

This means, that it's assumed that any user can create new entries. If this isn't allowed, the users will get an error when clicking on `Add new`. You could work around this by:
- Modify the observer functions to hide the button based on a configuration value, display a message when its clicked etc.
- Set this configuration value in the HTML field
- The value is determined by a business rule


## Remarks
There are numerous observers because of the way this has been implemented by WEBCON. 
- In case of the `autocomplete` we must handle different variations, which all destroy the existing `Add new` button
  - There are no values
  - There are values
  - The available values are changed
- The popup search uses the WEBCON modal dialog and we don't know for which choose field this has been opened. If you have multiple choose fields with the `Add new` button enabled, the current implementation could fail. You may need to modify the code where `addNewButtonPopupSearchQuerySelector` is used.

# Download
You can download the script [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/chooseFieldAddNew).
