---
title: "A breadcrumb for navigating workflow hierarchy"
categories:
  - WEBCON BPS  
  - CC LS
tags:
  - JavaScript
  - User Experience
  - CSS
  - Business Rules
excerpt:
    An alternative navigation between a workflow hierarchy using a breadcrumb
bpsVersion: 2022.1.4.155
---

# Overview  
In this post I will describe a custom *breadcrumb* implementation. Which will allow you to navigate up a workflow hierarchy. The breadcrumb itself also renders the form type as well as the title of a workflow instance.
Other features:
1. The _current_ title of a workflow will be rendered in the breadcrumb.
2. Form type is displayed above the title, of course in the language of the current user.
3. You can opt to show the breadcrumb as links or text only.
4. It's slightly responsive.

{: .notice--warning}
**Remark:** Each of our workflows has a title and this is a global field. Up to now this has had the advantage to see the value in the archive. With the use of the breadcrumb we can rely on it to show the title of each workflow in the breadcrumb. If you don't have a `global title field` you can still make use of the breadcrumb by rendering the form type of the parent workflows as the main element and an empty value above it. Take a look at [Business rules chapter](/posts/2023/breadcrumb#global-business-rules) for an explanation.

{: .notice--info}
**Info:** I post about samples how to migrate field value from one field to another can be found [here](/posts/2023/migrating-field-values).

{% include figure image_path="/assets/images/posts/2023-04-18-breadcrumb/Breadcrumb.gif" alt="Breadcrumb in action" caption="Breadcrumb in action" %}



# Setup
## Overview
This uses again my new standard to implement reusable features. You only need to add:
1. A global business rule
2. A global form rule


The source code files for business rule (1), form rule (2). They can be downloaded from the linked repository at the end of the post.

{% include figure image_path="/assets/images/posts/2023-04-18-breadcrumb/2023-04-18-21-19-06.png" alt="Source files for the business and form rule." caption="Source files for the business and form rule." %}

## Global business rules
Add a new global business rule for example with:
```
Name: GetBreadCrumbData 
Description:
Return a JSON array containing the id a parent workflow id in starting with the current workflow and going to the top.

The trailing , will be removed via js.

Parmeter 1
Name StartingWorkflowId
Type: Text
Description: Most of the time this should be the parent id instead of the id of the current workflow instance. This will allow to display a breadcrumb even for unsaved instances.

Parameter 2
Name: MaxResults
Type: Text
Description: If a number is provided, this will limit the number of returned parents.

```

After saving you need to replace the business rule parameter ids in the provided SQL statement with the ids of your newly created parameters. In my case the `StartingWorkflowId` has the id 123 and `MaxResults` 124.

{% include figure image_path="/assets/images/posts/2023-04-18-breadcrumb/2023-04-18-20-40-54.png" alt="Replace the business rule parameter ids" caption="Replace the business rule parameter ids" %}

If you don't have a global title field, or it's another field you need to change the WFD_AttText1Glob occurrences in the business rule.

{% include figure image_path="/assets/images/posts/2023-04-18-breadcrumb/2023-04-18-20-49-49.png" alt="WFD_AttText1Glob needs to be changed if you use a different global title field." caption="WFD_AttText1Glob needs to be changed if you use a different global title field." %}

If you want to change the terms used at the top and bottom of breadcrumb element you can change the values assigned to the `title` and `formType` property in the statement.

{% include figure image_path="/assets/images/posts/2023-04-18-breadcrumb/2023-04-18-20-52-18.png" alt="Title and form type property are rendered in the breadcrumb." caption="Title and form type property are rendered in the breadcrumb." %}

## Global form  rule
Add a new global form rule for example with:
```
Name: BreadcrumbLogic 
Description:
Will generate a breadcumb this will require an html field with the below content and should be placed in the top panel.

<div id="cclsBreadCrumbContainer" class="ccls-Breadcrumb" style="display:none">
</div>
<span id="cclsTitleField">#{5801}#</span>

<script>
InvokeRule(#{BRUX:5711:ID}#)
ccls.breadcrumb.webconData = '#{BRD:4769:<xps><ps><p id="#BRP:123#" v="" /><p id="#BRP:124#" v="" /></ps></xps>}#'
//ccls.breadcrumb.textOnly = true;
//ccls.breadcrumb.showHome = false;
ccls.breadcrumb.createBreadcrumb();
</script>
``` 

The description contains an example of the HTML field which is not valid JavaScript and will not work on your environment. You need to change the Id and remove the explanation in your process. I will cover this later.
{% include figure image_path="/assets/images/posts/2023-04-18-breadcrumb/2023-04-18-20-55-49.png" alt="The global form rule." caption="The global form rule." %}

# Process implementation
This one is easy really easy:
1. Add an HTML field.
2. Put it in the top panel.
3. Make it visible in the required steps.

   
## HTML field definition
You can copy the field definition from the description above and use it as the content of an HTML field.

1. Replace the id in `InvokeRule` with the id of your one or select the form rule from the expression editor.
2. Replace the id of `...webconData =  '...'` with the id of your business rule, or select it from the expression editor. You can leave the parameters empty. In case no `StartingWorkflowId` is defined, unsaved workflow instance won't render a breadcrumb.
3. This is the field containing the title of the current workflow instance. This will be displayed as the leaf of the breadcrumb. If the user updates the title this will also update the value in the breadcrumb.
4. The breadcrumb comes with two options
  1. Defining whether the breadcrumb should be rendered as text only / no links. This may prove useful, if users should see the hierarchy but not be able to click on it. For example, if they don't have the appropriate privileges. In this case you could create a business rule which returns true/false for the current user.
  2. Show home displays the home icon. If it's not displayed the drop down with the whole hierarchy won't be displayed either.

In the end it should look like this:
{% include figure image_path="/assets/images/posts/2023-04-18-breadcrumb/2023-04-18-21-01-08.png" alt="HTML field definition" caption="HTML field definition" %}

That's it. :)

# Explanations
## Business rule 
Getting the parent elements uses a recursive function the [WITH common_table_expression](https://learn.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql?view=sql-server-ver16). It can help in numerous occasions and it's worth remembering that something like this exists.

## JavaScript
Visual Studio code has been used to create the JavaScript files. If you have it to you can make use of the defined #regions, which will improve the reading a little. 

The home label is currently not translated. I have no idea which short word could be used for home in another language than English. Find this code to change it:
```javascript
ccls.breadcrumb.homeLabel;
switch (G_BROWSER_LANGUAGE.substr(0, 2)) {
  case "de":
    ccls.breadcrumb.homeLabel = "Home";
    break;
  case "pl":
    ccls.breadcrumb.homeLabel = "Home";
    break;
  default:
    ccls.breadcrumb.homeLabel = "Home";
    break;
}
```

Alternatively, you could use the name of the navigation element `Application home` to use as title for the icon or omit it completely. Whatever you want to do, you can change the value of the span element `ccls.breadcrumb.homeLabel`.

{% include figure image_path="/assets/images/posts/2023-04-18-breadcrumb/2023-04-18-21-13-31.png" alt="The name of the navigation element will be used as a title" caption="The name of the navigation element will be used as a title" %}

# Download
The files can be found [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/breadcrumb).
