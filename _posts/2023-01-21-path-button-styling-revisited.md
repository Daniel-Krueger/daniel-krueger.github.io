---
title: "Revised uniform path button styling"
categories:
  - WEBCON BPS
  - Private   
tags:
  - JavaScript
  - User Experience
  - CSS
  - Business Rules
excerpt:
    This is a revised, simplified version to create a unified path styling across all applications.
bpsVersion: 2022.1.3.65
---

# Update 2023-09-13

{: .notice--warning}
**Warning:**
With the advent of WEBCON BPS 2023 R2 I decided to not only introduced a minimized version of my JavaScript but to add a breaking change. The basic explanations still apply and only the configuration/implementation has changed. You can find out more about how to implement it in [UX form rules revised / 2023 R2 compatible](/posts/2023/ux-form-rules-revised) and the reasons in [Bandwidth usage](/posts/2023/bandwidth-usage). 

# Overview  
In two years' time things change. WEBCON BPS has evolved, one gains experience and most importantly you have new ideas. So, it's time to revisit my post 
[Uniform path button styling](https://daniels-notes.de/posts/2021/path-button-styling) from April 2021. I just noticed that it was Fool's Day, but the topic is definitely not a joke. :)

The post focuses on the new implementation approach, the idea is still the same. If you don't know what I'm talking about, you can head over to the old post and read the [Introduction](https://daniels-notes.de/posts/2021/path-button-styling#introduction) and [Current Situation](https://daniels-notes.de/posts/2021/path-button-styling#current-situation). This hasn't changed. :)

{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21_10h50_53.gif" alt="A test implementation showing the predefined colors in dark /light theme and the explanation of the colors." caption="A test implementation showing the predefined colors in dark /light theme and the explanation of the colors." %}

# What's new
The most important question is, what changed and should you move to the new implementation. Here's a little what's new:
- We make use of the colors selected in the diagram, no more settings button styles.
- Support of dark and light themes
- Add an explanation what the colors mean, of course in multiple languages. :)
- If something changes under the hood in a new WEBCON BPS version, the buttons won't be colored anymore but use the default color instead. 

All in all, it will take less than five minutes to colorize the paths of a workflow, regardless of the number of steps and paths. 


# Setup
## Overview
The new approach makes use of:
1. A global business rule
2. A global form rule
3. Global CSS styles

The sources of each can be taken from the linked repository.

{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-11-02-37.png" alt="The source code files for business rule (1), form rule (2) and CSS styles (3)." caption="The source code files for business rule (1), form rule (2) and CSS styles (3)." %}

## Global business rules
Add a new global business rule for example with:
```
Name: GetPathColors 
Description:
Returns a JSON array containing the path id, name and color.

The trailing , will be removed via js.
```
{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-11-07-44.png" alt="Business rule" caption="Business rule" %}

You can simply copy the whole source code; it only makes use of system fields. A test should return something like this:
{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-11-08-57.png" alt="A test result of the business rule execution" caption="A test result of the business rule execution" %}

## Global form  rule
Add a new global form rule for example with:
```
Name: ColorizePaths 
Description:
Will generate a breadcumb this will require an HTML field with the below content and should be placed in the top panel.

<script>
InvokeRule(#{BRUX:603:ID}#); <-- This form rule should be executed
ccls.colorizePaths.webconData = '#{BRD:601}#';  <- The business rule to return the path information GetPathColors should be executed.
ccls.colorizePaths.colorize();
</script>
``` 
The description contains an example of the HTML field which is not valid JavaScript and will not work on your environment. You need to change the Id and remove the explanation in your process. I will cover this later.
{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-11-12-40.png" alt="Form rule in JavaScript mode with documentation" caption="Form rule in JavaScript mode with documentation" %}

## Global styling
The colors of our buttons will be defined in the Global CSS styles. You can copy the content of the CSS file to Appearance (1)\Global CSS styles(2).

{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-11-15-42.png" alt="Adding the provided classes." caption="Adding the provided classes." %}

{: .notice--info}
**Remark:** I'm anything but a front-end guy. If anyone has a better/more user-friendly definitions, feel free to reach out. :)

# Process implementation
This one is easy really easy:
1. Add an HTML field.
2. Make it visible in the required steps.
3. Put it in the bottom panel.

## Why in the bottom panel
Let's cover the last one first.
The content of the form is generated dynamically. For some reason the path panel already exists when the content of the bottom panel is generated at least in 2022.1.3.65 and 2022.1.4.61. This is not the case if you place the field in any other panel the JavaScript won't work.

Nevertheless, I added a safety measure just in case. It will test whether the bottom panel exists and repeat this process five times in a span of 250ms. Afterwards, the execution will be stopped, and the buttons will keep their default styling. 
{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-12-08-23.png" alt="Place the HTML field in the bottom panel." caption="Place the HTML field in the bottom panel." %}

## HTML field definition
You have seen the field definition already in the description above.

1. Replace the id in `InvokeRule` with the id of your one, or select the form rule from the expression editor.
2. Replace the id of `...webconData =  '...' with the id of your business rule, or select it from the expression editor.
3. Remove the explanation.

In the end it should look like this:
{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-11-26-50.png" alt="Changing the form rule HTML field definition to a working one" caption="Changing the form rule HTML field definition to a working one" %}

That's it. :)

# Migrating from the old approach
If you used the old approach, it would be good to do some clean up while you are moving the the new one.

## Removing the styling on the buttons
In most cases I argue heavily against modifying the database directly, but this time I make an exception. 


{: .notice--warning}
**Warning:** You are doing this at your own risk!


In case your buttons contain only the styles as suggested in the previous post. You can use the following query to see where the values have been used.

```SQL
select DEF_ID, DEF_Name as Process,  WF_ID, WF_Name, STP_ID, STP_Name, PATH_ID, PATH_Name
from WFAvaiblePaths join WFSteps on PATH_STPID = STP_ID join WorkFlows on Wf_ID = STP_WFID join WFDefinitions on DEF_ID = WF_WFDEFID
where Path_ButtonStyle  in (
'background-color: rgb(0, 0, 10);',
'background-color: rgb(0, 0, 20);',
'background-color: rgb(0, 0, 30);',
'background-color: rgb(0, 0, 40);',
'background-color: rgb(0, 0, 50);',
'background-color: rgb(0, 0, 60);',
'background-color: rgb(0, 0, 70);',
'background-color: rgb(0, 0, 80);'
)

```
Make a copy of the result and make a **backup of the database.**

Afterwards you can use the below script to remove the style definition.
```SQL
update WFAvaiblePaths 
set PATH_ButtonStyle = null
where Path_ButtonStyle  in (
'background-color: rgb(0, 0, 10);',
'background-color: rgb(0, 0, 20);',
'background-color: rgb(0, 0, 30);',
'background-color: rgb(0, 0, 40);',
'background-color: rgb(0, 0, 50);',
'background-color: rgb(0, 0, 60);',
'background-color: rgb(0, 0, 70);',
'background-color: rgb(0, 0, 80);'
)

```
The number of modified rows should match the number of copied rows. If not, something went seriously wrong, and you should restore the database.

## Remove styling fields and global constants
This only applies, if you didn't copy the styling definition form the constants to the global CSS styles, which was available as of 2021.1.4.
1. Go to the global constants, and check where they are used. Make a screenshot, you will need it :)
2. Remove each field
3. Remove the global constants

## Remove the global styles
This only applies if you started with the global CSS styles.

Remove the CSS definitions of the old approach.

# Explanations
## JavaScript 
Visual Studio code has been used to generate the JavaScript files. If you have it to you can make use of the defined #regions, which will improve the reading a little. 

## Path button styling 
The styling of the path button is applied by CSS classes. There are two classes for each color, one for the dark and one for the light theme

``` html
<style>

.ccls_bluePathButtonLightTheme {
    color: white !important;
    background-color: rgba(7, 150, 221, 0.75) !important;
    font-size: larger !important;
    border-radius: 8px !important;
}
.ccls_bluePathButtonDarkTheme {
    color: white !important;
    background-color: rgba(7, 150, 221, 0.75) !important;
    font-size: larger !important;
    border-radius: 8px !important;
}

</style>
```

This will also allow you to define pseudo classes, for example for styling a hover effect.

``` html
<style>

.ccls_bluePathButtonLightTheme:hover {
    background-color: rgba(7, 150, 221, 1) !important;
}

.ccls_bluePathButtonDarkTheme:hover {
    background-color: rgba(7, 150, 221, 1) !important;
}

</style>
```

{: .notice--info}
**Remark:** The `<style>`  tag has only been added to achieve syntax highlighting in the post. Only the classes themselves must be used in the `Global CSS styles`.

## Switching between light/dark theme doesn't work
By default, the light theme classes will be used. It's only switched to dark theme classes if the id of the current theme is part of the `ccls.colorizePaths.darkThemes` array.

{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-11-32-39.png" alt="If you have a a custom dark theme, you need to add it." caption="If you have a a custom dark theme, you need to add it." %}

You can get the id of the current theme by executing this code in the developer tools of the browser.

```JavaScript
window.initModel.userTheme
```

## Changing color explanation
I've provided a default color explanation, this is based on the [Color coding paths chapter](https://daniels-notes.de/posts/2021/path-button-styling#color-coding-paths).
 
{% include figure image_path="/assets/images/posts/2023-01-21-path-button-styling-revisited/2023-01-21-11-42-06.png" alt="There's a default color explanation and one for additional languages" caption="There's a default color explanation and one for additional languages" %}

## Relaying on internal methods
The whole approach relies on the following internal workings of WEBCON BPS:
1. The color explanation is added to the `Available Paths` text, which is identified using this CSS  class `wfPathPanelCaption`.
2. The path buttons are identified using the CSS class `pathPanelButton`.
3. The name of the path button is also the value of the attribute value.
4. The `window.initialModel.paths` exists and has the properties:
   1. `title` which matches the value attribute
   2. `id` which is the database id of the path

If something changes like a class is renamed some or all of the logic may fail. This was also the case with the previous approach, but this time the buttons will just lose their customized color. 



# Download
The archived form rule code for this post can be found [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/Before_2023_R2/colorizePaths).

The minified version for the BPS 2023 R2 version can be found [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/colorizePaths).
while the usage is described [here](/posts/2023/ux-form-rules-revised).

