---
title: "Complete fields with errors"
categories:
  - WEBCON BPS    
tags:  
  - User Experience
  - JavaScript
excerpt:
    You forgot to fill out two required fields in some groups/tabs? Simply tab through them.
bpsVersion: 2023.1.1.89
---

# Update 2023-09-13

{: .notice--warning}
**Warning:**
With the advent of WEBCON BPS 2023 R2 I decided to not only introduced a minimized version of my JavaScript but to add a breaking change. The basic explanations still apply and only the configuration/implementation has changed. You can find out more about how to implement it in [UX form rules revised / 2023 R2 compatible](/posts/2023/ux-form-rules-revised) and the reasons in [Bandwidth usage](/posts/2023/bandwidth-usage). 

# Overview  
This is another approach to improve the user experience. Currently you may receive a message that you missed two required fields. Upon closing the dialog, the first one is selected automatically, but where's the next? This form rule will override the 'tabbing' behavior in such a way, that you move from one error field to the next, wherever it is.

{% include figure image_path="/assets/images/posts/2023-08-15-complete-fields-with-errors/Error_fields.gif" alt="Tab through error fields." caption="Tab through error fields." %}


{: .notice--warning}
**Remark:**
Please read [How is the tabbing behavior is modified](#how-is-the-tabbing-behavior-is-modified) 

{: .notice--info}
**Info:**
This only works for errors caused by a regular expression check, or a forgotten required field. It won't work for errors caused by an `action`.

{: .notice--info}
**Info:**
Originally, I wanted to display the fields inside the dialog, but I didn't found a way. You can read up on this at [Original approaches](#original-approaches)


# Implementation
## Overview
It's the same as [Implementation](/posts/2023/simplification-of-missing-comment#implementation)
1. Create a form rule.
2. Create an html field.
3. Make it visible in the field matrix.

## Global form  rule

Add a new global form rule for example with:
```
Name: MissingRequiredFieldhandler 
Description:
If the modal dialog contains errors which target fields the `tab` behavior is overwritten to tab between those.

``` 

Switch to JavaScript mode and use the JavaScript from the linked repository.


  
## Process modification
This is simple:
1. Add a new html field
    1. Use the below text as the HTML content, where you replace the id of the form rule with yours. Or you remove the `InvokeRule`` line altogether and select the form rule in the expression editor.
    ```html
    <script>
    InvokeRule(#{BRUX:688:ID}#)
    </script>
    ```
    2. Deactivate `Show field name`.
    3. Optional: Activate `Show different HTML content` in `Appearance` tab. You won't need to execute the form rule.
    {% include figure image_path="/assets/images/posts/2023-08-15-complete-fields-with-errors/2023-08-13-21-42-23.png" alt="Field definition." caption="Field definition." %}
2.  Display the field in the field matrix where necessary. If a path doesn't require a comment, don't display the form rule. 

That's it. :)


By default the user won't be able to leave a field with tab, as long as there's an error. If you want to disable this behavior you can add 
```javascript
dkr.missingRequiredFieldsHandler.preventLeavingFieldWithError = false;
```
{% include figure image_path="/assets/images/posts/2023-08-15-complete-fields-with-errors/2023-08-15-20-36-16.png" alt="Form rule example" caption="Form rule example" %}


# Explanations
## Regions
Visual Studio Code has been used to create the JavaScript files. If you have it, you can make use of the defined #regions, which will improve the reading a little. 
```javascript
//#region Modal dialog watcher / and tab handler
dkr.missingRequiredFieldsHandler.MutationCallback = function (mutationList, observer) {
...
//#endregion
```

## Identification of fields with errors
If you look at the  model contains the information whether a field (control), is required but this doesn't necessarily reflect the truth. Any modifications via `MarkRequired` or similar are not reflected there. 
As with the [Missing comment handler](/posts/2023/simplification-of-missing-comment) I opted to check whether the HTML elements in the dialog are mapped to a field. If there are any results, I update an internal array of "erroneousFields". In case of errors within item lists, these are moved to the end of the array.

A regular expression is used to verify whether it's a normal field or an item list field. Each error within an item list contains the word `row`, therefore I'm using this one to check it. If the current user uses a language without a translation, you receive this error. See [Multilingual text](#multilingual-texts) for fixing this.

```
Label for 'row' is not defined for language :'
```



```javascript
let errorContainer = document.querySelectorAll(".form-error-modal div.form-errors-panel__errors-container__error");
  dkr.missingRequiredFieldsHandler.erroneousFields = [];
  let rowLabel = dkr.missingRequiredFieldsHandler.rowLabelForRegEx[G_BROWSER_LANGUAGE.substr(0, 2)]
  if (!rowLabel) {
    alert("Label for 'row' is not defined for language :'" + G_BROWSER_LANGUAGE.substr(0, 2));
    return
  }
  let itemListFields = []
  errorContainer.forEach((item) => {
    let displayName = item.getAttribute("data-key").substring(0, item.getAttribute("data-key").length - 1);
    itemListName = displayName.match("(.*), " + rowLabel + " \\d+");
    if (itemListName != null && itemListName.length == 2) displayName = itemListName[1];
    let field = window.model.controls.find((item) => { return item.name.translated == displayName && (item.fieldName.indexOf("Att") == 0 || item.fieldName.indexOf("SubElems") == 0) })
    if (field != null) {
      if (field.fieldName.indexOf("SubElems") == 0) {
        itemListFields.push(field.fieldName);
      }
      else {
        dkr.missingRequiredFieldsHandler.erroneousFields.push(field.fieldName)
      }
      console.log("Adding required field :" + field.fieldName)
    }
  })
  // I have no idea how to switch to another field if we have an error in a item list using tabs. So lets add the item lists at the end.
  dkr.missingRequiredFieldsHandler.erroneousFields = dkr.missingRequiredFieldsHandler.erroneousFields.concat(itemListFields);


```

## Multilingual texts
You will find a code block at the top of the script with the translation of `row`. You need to change this, so that it matches your language.

If you want to add a new language you could execute the following in the browser developer tools and use the result as the "key".

```javascript
G_BROWSER_LANGUAGE.substr(0, 2)
```

## How is the error dialog checked
Obviously it's the same approach I used in the [How is the error dialog modified](/posts/2023/simplification-of-missing-comment#how-is-the-error-dialog-modified). If you want to use both, I recommend to use a common MutationObserver and merge the logic. Maybe I can add one in the future. At the moment I'm to busy with helping out a friend who's moving.

## How is the tabbing behavior is modified
This one gets activated after the first modal error dialog is updated and a field with an error was found. 
Upon closing the dialog, I overwrite the default behavior to focus the first non item list field. 
If the user modifies the field and clicks on tab, it's checked whether the current field is an 'error' field. Is this true, the next field will be activated. 

Remarks:
- By default, the user can't leave this field with the tab key, if there is an error. Using a mouse will work. 
- If the user clicks into a field which was not part of the error. The tab key will behave normally.
- Only the fields of the last error dialog will be used.
- This works until the first item list is focused. There's no option to focus a specific column in a specific row of an item list. Therefore, the tab key will work normally. 
- If the new field is a datetime field, the date dialog is opened automatically. The user can hit Esc to close it.
- In a datetime field the first tab will move to the date dialog button. Only if this one is active and tab is clicked again, the next field will be activated.
- If the new field is a choose field with popup search mode, the search is opened automatically. The user can hit Esc to close it.
- In a choose /people field with autocomplete you can tab to the validate control and the next tab will move to the next field.


```javascript
dkr.missingRequiredFieldsHandler.tabEventListener = function (event) {
  ....
}

dkr.missingRequiredFieldsHandler.handleTabClickInErroneousField = function (event, currentElement, updatedFieldNumber) {
  // It's an error field, stop the default behavior      
  ...
}
```


# Original approaches

## Adding a text box to the dialog to update fields
When I started on this, I hadn't found the solution for the 'missing comment' approach.
I created a text box and wanted to update the field. This worked fine for text fields, at least in a PoC. Obviously, this failed when a RegEx was defined for the field and what about more complex fields like people fields? So, I dropped this approach.

## Reusing elements of the form in the dialog
The form is made up of React elements. This creates an element in the 'visible' DOM as well as in the 'shadow' DOM. The shadow DOM isn't part of this post and I'm not qualified for explaining this either. What I tried:
- Moving an HTML element
  Moving the element in the DOM breaks the link to the shadow DOM and the element won't fire events as it should. 
- Clone the HTML element
  Same problem as above.
- Creating a new REACT element
  I don't know whether this would be possible with plain JavaScript. I haven't found a solution.
- Creating an own dialog.
  Modifying the CSS of the error fields in such a way, that it looks like a dialog, but it's not.

In the end I gave up because even if I could make this happen it occurred (finally) to me, that there could be error fields which are in another tab/closed group. Therefore, they don't have any HTML element which I could use in the first place.


# Download
The archived form rule code for this post can be found [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/Before_2023_R2/missingRequiredFieldsHandler).

The minified version for the BPS 2023 R2 version can be found [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/missingRequiredFieldsHandler).
while the usage is described [here](/posts/2023/ux-form-rules-revised).
