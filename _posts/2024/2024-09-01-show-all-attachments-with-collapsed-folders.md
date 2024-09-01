---
regenerate: true
title: "Show all attachments with collapsed folders"
categories:
  - WEBCON BPS 
tags:  
  - JavaScript
  - Form rules
  - User Experience
  - 
excerpt:
  Describes how showing related attachments work and how to display those by default with collapsed folders.
bpsVersion: 2023.1.3.202
---

# Overview
I got a request whether it would be possible to not only display `All attachments` after page load but also collapse the groups. This was one of those requests, which made me wonder, why I didn't think of it myself. :)

{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-09-01-15-32-32.png" alt="After page load all attachment folders are collapsed." caption="After page load all attachment folders are collapsed." %}

{: .notice--info}
**Info:** This post is based on [Show all attachments after page load](/posts/2021/javascript-form-rule-execution-on-page-load#show-all-attachments-after-page-load).



# Implementation
## All attachments display options
The updated function will allow you to choose from three different options to display the `All attachments` tab.
 - Collapse to folder names<br/>
 ![Folders are collapsed](/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-08-31-17-22-38.png)
 - Collapse to category (subfolder)<br/>
 ![Categories are collapsed, if they exist](/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-08-31-17-22-20.png)
- All elements are expanded<br/>
 ![All attachments are displayed](/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-08-31-17-21-12.png)
 
Depending on your preferences you can choose from three different options to display the `All attachments` tab.

## Basic implementation with fixed display option
The implementation is simple.
1. Create a form rule in JavaScript mode.
2. Copy the content of the ShowAllAttachments.js or  ShowAllAttachments.min.js
3. Modify the last line of the code to match your need.
   - Collapse to folder names<br/>
   `dkr.showAllAttachments.execute(0, 4, 0)`
   - Collapse to category (subfolder)<br/>
   `dkr.showAllAttachments.execute(0, 4, 1)`
   - All elements are expanded<br/>
   `dkr.showAllAttachments.execute(0, 4,null)`
  
{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-08-31-17-14-13.png" alt="Creating the form rule and defining the collapsed levels." caption="Creating the form rule and defining the collapsed levels." %}

What's left is to execute the form rule after page load.

{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-08-31-17-17-47.png" alt="Executing the form rule after page load." caption="Executing the form rule after page load." %}

## Option 2: Form rule with a parameter
An alternative to the fixed display option is to make it configurable using a form rule parameter.
If you want to display all elements without collapsing, than you need to pass `Empty`.
{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-08-31-17-30-19.png" alt="Same form rule, but with a parameter." caption="Same form rule, but with a parameter." %}

## Option 3: HTML field 
The last option is different from the previous, as this will make use of HTML field to execute the JavaScript. This way we can make use of the field matrix or other elements, to conditionally display the HTML and thereby executing the function.

If you are going to use this option, you need to remove the call to the execute function from the form rule itself.
{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-08-31-17-24-11.png" alt="Function `dkr.showAllAttachments.execute` is not executed in the form rule." caption="Function `dkr.showAllAttachments.execute` is not executed in the form rule." %}

Of course, you need to remove the form load from the on page load event, too.
{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-09-01-15-24-42.png" alt="The page load event does not call the form rule." caption="The page load event does not call the form rule." %}

The HTML field will invoke the form rule and call the execute function whenever the field will be visible.
If you want to copy the below lines, make sure to use your form rule.
```js
<script>
InvokeRule(#{BRUX:950:ID}#);
dkr.showAllAttachments.execute(0, 4,0);
</script>
```

{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-09-01-15-26-12.png" alt="Execution via an HTML field." caption="Execution via an HTML field." %}

{: .notice--info}
**Info:** The name of the form rule in the screenshot is a bit misleading. 




# Folders and categories in all attachments
Using the `Related attachments` will allow you to display the documents any kind of of attachments. These may be parent/child workflows or they can be based on a query.

The first thing to do is activating the `Related attachments` for the attachment element in the form.
{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-08-31-17-35-33.png" alt="Activate the related attachments." caption="Activate the related attachments." %}

The [official documentation](https://docs.webcon.com/docs/2024R1/Studio/Process/AttachmentAttribute/AppearanceOfAttachments/#7-related-attachments) already contains the most relevant information, if you really need it. The information in the blue info icon already provides the relevant information.

{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-09-01-14-53-06.png" alt="The info icon provides the expected column names." caption="The info icon provides the expected column names." %}

Unfortunately, there seems to be a mix up between the column names and their actual usage. The `ElementName` column is used for subfolder/category labels and  `Category` for the file name. 
{% include figure image_path="/assets/images/posts/2024-09-01-show-all-attachments-with-collapsed-folders/2024-09-01-14-56-28.png" alt="ElementName and Category usage " caption="ElementName and Category usage " %}

