---
title: "UX form rules revised / 2023 R2 compatible"
categories:
  - WEBCON BPS  
  - Private   
tags:    
  - Form rules
  - User Experience
  - JavaScript
excerpt:
    This post describes the changes necessary for BPS 2023 R2 while reflecting the gained inside in the 'Bandwidth usage' post.
bpsVersion: 2023.1.2.44
---

# Overview  
As announced in the previous post [Bandwidth usage](/posts/2023/bandwidth-usage), I have modified my 'user experience form rules' to use less bandwidth. In addition, some of the old ones weren't compatible with BPS 2023 R2.

Effected are:
- [Unified save experience ](/posts/2021/unified-save-experience)
- [Revised uniform path button styling ](/posts/2023/path-button-styling-revisited)
- [Modal dialog v3 ](/posts/2022/modal-dialog)
- [A breadcrumb for navigating workflow hierarchy ](/posts/2023/breadcrumb)
- [Complete fields with errors ](/posts/2023/complete-fields-with-errors)
- [Simplification of entering a missing comment ](/posts/2023/simplification-of-missing-comment)

As a result of the changes you will save 40% or 28KB whenever a form is displayed, if you are using the minified version. This includes the full form view, the task view or the preview.

{% include figure image_path="/assets/images/posts/2023-09-13-ux-form-rules-revised/2023-09-12-20-15-41.png" alt="Effect of the minimizing the form rules on the bandwidth" caption="Effect of the minimizing the form rules on the bandwidth" %}

{: .notice--info}
**Remark:**
The effect is even greater because the JavaScript is passed as string value in a JSON object. This requires escaping special characters. For example, a line break consist of the `carriage return` and `new line`  characters. During the response these two characters will become four `\r\n`.

Unfortunately, I neither have the time nor the possibility to test this against multiple WEBCON BPS versions. There's a great chance that they will at least work as of WEBCON BPS 2022 R4, but I only tested 2023 R2.

{: .notice--info}
**Info:**
In case you want to apply minification to your rules to, you can take a look [here](/posts/2023/bandwidth-usage#minify-javascript).

# Breaking change
As mentioned in the previous post, I decided to implement a breaking change. In the past all form rules where independent of each other. This in turn was only possible, because I used some 'utility' functions which I duplicated in each form rule. In the past I opted for independent working form rules. Realizing how it currently works and how many form rules there are today, I changed this.

The utility functions have been moved to their own form rule, which is a prerequisite before invoking any other form rule.
I won't update the old any longer. Therefore I've moved them to an [archive](
https://github.com/Daniel-Krueger/webcon_snippets/tree/Before_2023_R2) branch.

{: .notice--info}
**Remark:**
I've updated the old posts, so that there's information about the breaking change and the download section reflects this information.

# Using the revised form rules
## General implementation
The implementation is basically the same:
- Create the form rules using the provided JavaScript files.
- Create an HTML field.
- Add the ```<script></script>``` tags and call the required form rules.


I will describe each number in the screenshot in the below screenshots.

{% include figure image_path="/assets/images/posts/2023-09-13-ux-form-rules-revised/2023-09-12-20-35-03.png" alt="Global rules html field executes all form rules." caption="Global rules html field executes all form rules." %}


{: .notice--info}
**Remark:**
Since there will be the archived version and the new minimized version, I decided to describe the usage of the new ones in this single post instead of updating the old ones.

{: .notice--info}
**Remark:**
Even so I'm describing the implementation here it may happen that you need more information to understand some parts. Please refer to the respective posts for this. 

Using the HTML field also has a nice side effect. You can invoke different rules depending on edit/view mode, for example you neither need the save* or missing* rules in view mode.

{% include figure image_path="/assets/images/posts/2023-09-13-ux-form-rules-revised/2023-09-12-21-15-45.png" alt="Different rules are executed depending on edit/view mode." caption="Different rules are executed depending on edit/view mode." %}

## 1. Common functions
The form rule will provide the 'utility' functions, stored in the [utils](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/utils) folder. You can simply create it by copying the  utils.min.js content into the form rule after switching to JavaScript mode. If there's a problem and you need to debug, you can always replace the minimized one with the full version if necessary.

{% include figure image_path="/assets/images/posts/2023-09-13-ux-form-rules-revised/2023-09-12-20-44-27.png" alt="Copy either the full or minified version into the form rule." caption="Copy either the full or minified version into the form rule." %}

In addition to the form rule we need a business rule which returns a few information about the currently available paths. This will be cheaper in terms of bandwidth than calling the internal `/desktop` endpoint. The sql command is stored in the basicPathInformation.businessRule.sql file and copy & paste should work just fine. We don't need any parameters.

{% include figure image_path="/assets/images/posts/2023-09-13-ux-form-rules-revised/2023-09-12-20-50-54.png" alt="Business rule GetBasicPathInformation" caption="Business rule GetBasicPathInformation" %}

In the HTML field you need to 
- Invoke the created rule, you need to use your one
- Set ccls.utils.applicationId
- Set the basic path information

HTML field code:
```
InvokeRule(COMMON FUNCTION FORM RULE);
ccls.utils.applicationId = #{APP_ID}#;
ccls.utils.basicPathInformation = JSON.parse('BUSINESS RULE GetBasicPathInformation'); /*The created business rule to retrieve the basic path information*/
```

## 2. Breadcrumb
The breadcrumb is now divided into two parts. Originally 1 and 2 have been in the same HTML field, which was a mistake I didn't realize till now.

The breadcrumb utilized the value of a field, in our case the 'Title' field. Whenever the value in the actual field changes, this would be updated. What I didn't notice until introducing the changes, the 'update' recreates the whole HTML field each time. This means, that the form rule was invoked each time. Maybe the breadcrumb data was also executed. I haven't checked the later one.

{% include figure image_path="/assets/images/posts/2023-09-13-ux-form-rules-revised/2023-09-12-20-57-30.png" alt="Breadcrumb HTML fields" caption="Breadcrumb HTML fields" %}

Defining the general breadcrumb functionality in the `GlobalRules` field and the actual creation in `BreadcrumContainer` prevents the multiple invocations.

Dividing the logic into two fields obviously requires that the one is executed before the other. This is easily achieved by placing the `GlobalRules` field as the first field.

{% include figure image_path="/assets/images/posts/2023-09-13-ux-form-rules-revised/2023-09-12-21-02-39.png" alt="The global rules field should be the first field on the form." caption="The global rules field should be the first field on the form." %}

## 3. Save button as path 
**BREAKING CHANGE**
The form rule dates back to November 2021 and either there weren't HTML fields yet or I wasn't aware of the capability. Nevertheless, in the past the form rule was loaded in the OnLoad/Behavior of the form and form rule parameters have been used.

![Old version of using the unified save experience form rules.](/assets/images/posts/2023-09-13-ux-form-rules-revised/2023-09-13-22-15-43.png)

As you have seen above, the new version is executed like any other in the HTML field. In contrast to the previous version, you need to call the `createPathButton` and provide the parameters yourself.
The single function parameter allowed you to pass an `alternativeLabel` for the button. You can do the same by passing the value in JavaScript.
In most cases I passed `Empty` as the form rule parameter and the respective value in JavaScript would be `''` 

HTML field code:
```
InvokeRule(SAVE BUTTON AS PATH);
ccls.addSaveButtonAsPath.createPathButton('');
```

## 4. Save draft as path button
**BREAKING CHANGE**
The same as in [3. Save button as path](#3-save-button-as-path) applies here. No more form rule parameters, you need to call  `createSaveDraftButton` yourself and provide the id of the `Save draft path` in the JavaScript directly.

HTML field code:
```
InvokeRule(SAVE DRAFT PATH AS BUTTON);
ccls.addSaveDraftButton.createSaveDraftButton('SAVE DRAFT PATH ID', '');
```

## 5. Colorize paths
Originally the path information were retrieved using a business rule before executing the `colorize` function. In the new version the `Common functions` already has this information. Therefore, setting this information here is no longer necessary.

HTML field code:
```
InvokeRule(COLORIZE PATH));
ccls.colorizePaths.colorize();
```
## 6. No changes
There are no changes in the usage of:
- Modal dialog, consisting of parent and child logic
- Missing comment handler
- Missing required fields handler


# Common functions overview
## getIdFromUrl
This will allow you to get an id from the current URL. 
In case `https://someserver.cosmocloud.eu/db/1/app/115/element/30544` is your url, passing `app` as the parameter will return `115`. You can also pass an arbitrary URL as a second parameter.

```
ccls.utils.getIdFromUrl.(precedingElement, optional_url)
```

## getGlobal
If a user switches very fast between tasks/previews, it can happen that the G_ variables don't exist.
If you experience something like this, you can call this function and pass the variable name to the function like below. This will prevent the execution until the variable was accessible, or the allotted time for recreating the G_ variables has been reached.

``` javascript
if ((await (ccls.utils.getGlobal('G_ISNEW')))) 
```

## continueAlsoPageIsDirty
Requested a confirmation from the user, whether the user really wants to navigate away.Is used in the child dialog.

## getLiteModel
Will return the lite model for the current element which was previously available as window.initialModel. This works for new workflow instances as well as existing ones in view/edit mode.
The endpoint will only be called ones after loading the page, in subsequent calls the cached value will be returned. As this model does contain only static information, this is no problem. Hitting the `Refresh` button or navigating to another element, will clear the cached value.

You can use the function like this:
``` javascript
(await ccls.utils.getLiteModel()).controls
```

## getSpecificLiteModel
Similar to getLiteModel but you specify which element is retrieved from which database.

## getVersionValues
In case you are supporting different WEBCON BPS vesion there may be changes in the HTML or JavaScript objects. This function will allow you to defining `VersionDependingValues` and retrieve those applicable for the current version.

Below we define
- a different ```getFieldFromControls``` function for version before and as of 2023.1.1.1.
- get the one for the current version.
- use it. 

``` javascript
dkr.missingRequiredFieldsHandler.VersionDependingValues = [
  {
    version: '0.0.0.0',
    values: {
      getFieldFromControls: async function (displayName) {
        return (await ccls.utils.getLiteModel()).controls.find((item) => { return item.displayName == displayName && (item.fieldName.indexOf("Att") == 0 || item.fieldName.indexOf("SubElems") == 0) })
      }

    }
  }, {
    version: '2023.1.1.1',
    values: {
      getFieldFromControls: async function (displayName) {
        return (await ccls.utils.getLiteModel()).controls.find((item) => { return item.name.translated == displayName && (item.fieldName.indexOf("Att") == 0 || item.fieldName.indexOf("SubElems") == 0) })
      }
    }
  }
];
dkr.missingRequiredFieldsHandler.versionValues = ccls.utils.getVersionValues(dkr.missingRequiredFieldsHandler.VersionDependingValues);
...
dkr.missingRequiredFieldsHandler.versionValues.getFieldFromControls(displayName).
```

# Downloads
You can find the JavaScript files here:
- [Common functions](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/utils)
- [Breadcrumb](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/breadcrumb)
- [Save button as path, Save draft path as button](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/Save%20and%20save%20draft)
- [Colorize paths](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/colorizePaths)
- [Missing comment handler](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/missingCommentHandler)
- [Missing required fields handler](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/missingRequiredFieldsHandler)
- [Modal dialog](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/ModalDialog)

