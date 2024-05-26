---
title: "Building Business Processes with WEBCON BPS – an expert guide: Part 6 - Sub Workflow - User assignment task"
categories:
  - Private
  - WEBCON BPS
  - Series
tags:
  - Fields
  - Paths
  - Business rules
  - Governance
excerpt:
    A multi-part blog post to share expert information based on the creation of a business process.
---


# Part introduction

This is part 6 of my “Building Business Processes with WEBCON BPS – an expert guide” in WEBCON
BPS. In the [previous part](/posts/2021/series-expert-guide-part-5) we added data row columns to load the translation of objects at runtime and retrieved the application supervisors. In this post we will create the sub workflow for handling the identified processes.

{: .notice--info}
**Tip:** If you are a seasoned WEBCON BPS Designer you can scroll through this text and look out for boxes like this one. These contain tips / summaries and the like. You may find some useful information without reading everything.

# Creating Task workflow
## Purpose
The parent workflow, User Assignments Overview, listed all workflows where the selected user is involved.
In addition, for each row a responsible must be selected. 
If applicable, this is the application supervisor.
Based on this data, we will create one task workflow for each supervisor. This task workflow will be assigned to the responsible and will list all workflows. The task workflow responsible can define per row if the referenced workflow was changed or if no change is necessary.

## Steps and paths
There are only a few steps of the task workflow. We need a step for initialization, which can be used to copy non item list data from the parent workflow. From there the workflow will automatically be transferred to `Processing`. During the transition, all rows will be copied. In step `Processing` the responsible can work on the listed workflows. Finally, it will be moved to completed.

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-21-21-49-17.png" alt="Step overview of the task workflow." caption="Step overview of the task workflow." %}
This workflow is intended to be used as a sub workflow. Nevertheless, we need to test the sub workflow without the parent workflow. Therefore, I added a hidden `AdminAssign`, which doesn't execute any actions on transition, and 'Save' path which is only visible in administration mode and not displayed on diagram.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-21-21-50-14.png" alt="Hiding an admin path from normal users" caption="Hiding an admin path from normal users" %}

Using the admin mode (1) we can enter test data. It helps that we defined the Id fields as technical fields instead but are still visible, otherwise we couldn't enter test data (2). The workflow is saved using a hidden admin path (3).
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-21-22-06-03.png" alt="Creating a task workflow with test data in admin mode." caption="Creating a task workflow with test data in admin mode." %}

{: .notice--info}
**Tip:** It's easier to debug a saved workflow. Once it's saved you can use the workflow history. Therefore, add at least a save path which is only visible in admin mode. 


## Fields
We can reuse most of the fields from the parent workflow. The only new fields are a responsible (1), the 'workflow link' (2) and 'decision fields'(3) for each workflow row.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-06-34.png" alt="Fields added to sub workflow" caption="Fields added to sub workflow" %}
The new field and columns aren't visible for the parent workflow. While the responsible field is a simple `Person or group` field the 'workflow link' is a data row and the decision fields are choice fields with a fixed set of options.

### Multilingual open workflow link
The 'workflow link' field is a data row which uses a default function (1) to create a link to another instance. We only need to assign our data row column containing the instance id to the parameter (2).
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-10-15.png" alt="Build in Open Element function makes it easy to render a link to another instance " caption="Build in Open Element function makes it easy to render a link to another instance " %}

The only drawback is that we can't provide a translatable `Display name`. This can be fixed by creating a custom business rule.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-17-26.png" alt="Business rule to return language specific information" caption="Business rule to return language specific information" %}

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-21-17.png" alt="Alternative rule without using SQL" caption="Alternative rule without using SQL" %}

We can use this rule as a value for `Display name`, we only need to make sure that it is encapsulated in single quotes.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-18-18.png" alt="Using a business rules as a parameter value" caption="Using a business rules as a parameter value" %}

The result is a language specific link depending on the BPS Portal language selected by the user.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-23-21.png" alt="Language specific labels depending on BPS Portal language" caption="Language specific labels depending on BPS Portal language" %}

### Decision fields
The decision fields are used to flag if a row has been worked on and with which result. Either it was necessary to change something, or it wasn't. 

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-58-01.png" alt="Choice field definition and rendered options" caption="Choice field definition and rendered options" %}

The image above contains three useful information

{: .notice--info}
**Tip 1:** A choose field with a fixed number of options can be created by either using a fixed value list, like in the image below, or using an SQL statement. In the later case we can simply write the select statements and combine the rows with a union.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-21-22-24-03.png" alt="Sample of fixed value list" caption="Sample of fixed value list" %}

{: .notice--info}
**Tip 2:** If you don't have to hard code something, don't do it. You should use constants instead. You can make use of the `Usages` tab to locate every place where a specific constant is used. The number of locations will increase over time. At least if the value isn't just informational, but it's involved in some logic. Even if there's no logic yet, it will be added. This is the reason why I don't make use of fixed value lists. 

{: .notice--info}
**Tip 3:** By providing an "Empty element display name" we can have an additional value in the drop down. It is used if the value of the fields hasn't been set (it is null). In combination with defining the field as required this can be used to force a user to make a conscious decision, which is not possible with a simple boolean field.


### Conditional required fields
It's necessary that for each row the decision fields need to be set, before the workflow can be moved to the completed step. Since there are two fields, we have three different cases, why a workflow could have been added to the item list. Either the user is assigned in a field, he has a task or both. Depending on the checked field a value in a decision field is required.

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-33-49.png" alt="Only the 'yes' fields should have a required decision field" caption="Only the 'yes' fields should have a required decision field" %}

Due to this we can not simply set the field as required, this would result in false errors.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-34-42.png" alt="Each field is marked as invalid even so not all fields should be required." caption="Each field is marked as invalid even so not all fields should be required." %}

This can easily be fixed by setting up an appropriate `Column requireability restriction` in the permissions tab of both fields. 

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-23-20-45-08.png" alt="Column requireability restriction is set" caption="Column requireability restriction is set" %}

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-36-57.png" alt="Conditional required columns are marked with red dots" caption="Conditional required columns are marked with red dots" %}

{: .notice--warning}
**Remark:** The field matrix defines the field/column as required. If the field is not required in field matrix, these settings is ignored. 

{: .notice--info}
**Tip:** The `Column requireability restriction` is evaluated on page load. For example, changing the value of `Has task` won't change the required behaviour. This only applies to item list columns.

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-43-37.png" alt="Changing the value without saving doesn't affect the required behaviour" caption="Changing the value without saving doesn't affect the required behavior" %}


{: .notice--info}
**Tip:** If a field is used in a restriction rule and this rule should be evaluated without saving, the `Value change will cause default...` box needs to be checked on this field. So, if you have a field which visible/editable/requiredness state depends on another field you need to do three things:

1. Define the availability for this field in the field matrix
2. Define the restriction for this field
3. Check the `Value change will cause default...` box on the other field

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-45-48.png" alt="Field with `Value change will cause default...` causes a evaluation of all restrictions like `Requiredness restriction`" caption="Field with `Value change will cause default...` causes a evaluation of all restrictions like `Requiredness restriction`" %}

# Continuation
This is all what our sub workflows needs to do. What's left is to start the sub workflow from the parent workflow and build a 'dashboard' inside the parent workflow.

{% include series-expert-guide %}

# Download
You can download the application from [here](https://github.com/cosmoconsult/webconbps/tree/main/Applications/UserAssignments).