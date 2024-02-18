---
title: "Simplification of entering a missing comment"
categories:
  - WEBCON BPS
  - Private     
tags:  
  - User Experience
  - JavaScript
excerpt:
    You forgot a comment? There's no longer a need to leave the error dialog. Enter it and continue.
bpsVersion: 2023.1.1.89, 2022.1.4.155
---
# Update 2023-09-13

{: .notice--warning}
**Warning:**
With the advent of WEBCON BPS 2023 R2 I decided to not only introduced a minimized version of my JavaScript but to add a breaking change. The basic explanations still apply and only the configuration/implementation has changed. You can find out more about how to implement it in [UX form rules revised / 2023 R2 compatible](/posts/2023/ux-form-rules-revised) and the reasons in [Bandwidth usage](/posts/2023/bandwidth-usage). 


# Overview  
WEBCON BPS has this little flag, that will require the user to provide a comment, when a path is executed. I typically use this for negative/destructive paths - and every time I forget to enter the comment. Obviously, the error dialog pops up, I need to close it, enter the comment, and execute the path again. Those days are gone. :)


{% include figure image_path="/assets/images/posts/2023-07-31-simplification-of-missing-comment/Entering_missing_commment.gif" alt="Entering a missing comment." caption="Entering a missing comment." %}

{: .notice--warning}
**Remark:**
I tested it with the listed BPS 2022 and 2023 versions above and in German, English, Polish. There are also texts for Italian and Slovenian, but I can't test those.

# Implementation
## Overview
Those of you how read my posts already will have an idea, what my typical approach looks like:
1. Create a form rule.
2. Create a business rule.
3. Create an html field.
4. Make it visible in the field matrix.

In this case we can don't even need a business rule.

## Global form  rule
Add a new global form rule for example with:
```
Name: MissingCommentHandler 
Description:
If the error "Comment is missing on path" is displayed in the modal dialog, a text area and "Continue" button will be added. The user can provide the comment and the continue will trigger the executed path again.

``` 

Switch to JavaScript mode and use the JavaScript from the linked repository.
{% include figure image_path="/assets/images/posts/2023-07-31-simplification-of-missing-comment/2023-07-31-20-00-28.png" alt="Form rule example" caption="Form rule example" %}
  
## Process modification
This is simple:
1. Add a new html field
    1. Use the below text as the HTML content, where you replace the id of the form rule with yours. Or you remove the `InvokeRule`` line altogether and select the form rule in the expression editor.
    ```html
    <script>
    InvokeRule(#{BRUX:6360:ID}#)
    </script>
    ```
    2. Deactivate `Show field name`.
    3. Optional: Activate `Show different HTML content` in `Appearance` tab. You won't need to execute the form rule, if you have no [quick paths](https://community.webcon.com/posts/post/quick-paths/304) which may require a comment. I don't even know whether this possible.
    {% include figure image_path="/assets/images/posts/2023-07-31-simplification-of-missing-comment/2023-07-31-20-12-05.png" alt="Field definition." caption="Field definition." %}
2.  Display the field in the field matrix where necessary. If a path doesn't require a comment, don't display the form rule. 


That's it. :)

# Explanations

## Regions
Visual Studio Code has been used to create the JavaScript files. If you have it, you can make use of the defined #regions, which will improve the reading a little. 
```javascript
//#region Labels in different languages
// The label of the error message in the languages.
...
//#endregion
```
## Identification of a "Comment is missing" error
I haven't found a better way than checking the text of a displayed error message. It seems that this text is generated on the server and send to the client in the correct language. 
If you get the following  browser message, you need to add the text in your language to the different languages.
```
Label for 'missing comment on path' is not defined for language 
```

This in turn means, if the translation is changed in a version, the texts need to be adapted. This could also happen if the structure of the DOM changes.

```javascript
// The first container is "Validation error" and the "second container" any error. 
// If there's more than two elements (one error), not only the comment is missing, which need to be corrected.
let errorContainer = document.querySelectorAll(".form-error-modal div.form-errors-panel__errors-container__error");

if (errorContainer.length != 2) {
  return;
}

let errorText = dkr.missingCommentHandler.missingCommentErrorLabel[G_BROWSER_LANGUAGE.substr(0, 2)]
if (!errorText) {
alert("Label for 'missing comment on path' is not defined for language :'" + G_BROWSER_LANGUAGE.substr(0, 2));
return
}
let continueBtnLbl = dkr.missingCommentHandler.continueBtnLabel[G_BROWSER_LANGUAGE.substr(0, 2)]

let errorMessage = errorContainer[1].getAttribute('data-key');

// It's not a missing comment error
if (!errorMessage.startsWith(errorText)) return;

```

## Multilingual texts
You will find a code block at the top of the script with the standard error texts and the label of the continue button. You can modify these to your liking. If you want to add a new language you could execute the following in the browser developer tools and use the result as the "key".
```javascript
G_BROWSER_LANGUAGE.substr(0, 2)
```

## How is the error dialog modified
I'm using the [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) for this. It watches for any DOM modification of the div with id `Modals`. If it's id is changed in a later version, the whole thing breaks. 
If any change (mutation) is detected, the function `MutationCallback` is executed. This means, that it is executed for error dialogs as well as item list single edit dialogs and similar.

I tried my best to limit unnecessary executions to reduce the impact on the browser, but I'm not a real web developer.
Maybe someone else finds a better way to improve it.

```javascript
dkr.missingCommentHandler.ModalContentObserver = new MutationObserver(dkr.missingCommentHandler.MutationCallback);
dkr.missingCommentHandler.ModalContentObserver.observe(document.getElementById("Modals"), {
  subtree: true,
  childList: true,
});
```

## How is the comment updated
This one was actually the "hardest" part. In the end it's fairly simple and you can take a look at `tryAgainPathExecution`.
What happens is that I simulate the settings of the comment field as well as the leaving of it. It took more time to find this solution as I want to admit. :)

After dispatching the events, a timeout triggers `MoveToNextStep` so that the events had time to be processed.

```javascript
// Set the value in the comment box
var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
eventObject = new Event("input", { bubbles: true });
nativeTextAreaValueSetter.call(commentTextArea, newCommentText.value);
commentTextArea.dispatchEvent(eventObject);

// Only setting the input is not enough, we need to call another event to update the state
eventObject = new Event("focusout", { bubbles: true });
commentTextArea.dispatchEvent(eventObject);

// Execute the path again, after the event has been dispatched and the states have been updated. 
setTimeout(() => { MoveToNextStep(pathId) }, 100);
```
# Download
The archived form rule code for this post can be found [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/Before_2023_R2/missingCommentHandler).

The minified version for the BPS 2023 R2 version can be found [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/missingCommentHandler).
while the usage is described [here](/posts/2023/ux-form-rules-revised).
