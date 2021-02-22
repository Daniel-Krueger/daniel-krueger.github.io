---
title: "Building Business Processes with WEBCON BPS – an expert guide: Part 6 - Sub Workflow - User assignment task"
categories:
  - Private
  - WEBCON BPS
tags:
  - Fields
  - Paths
excerpt:
    A multi-part blog post to share expert information based on the creation of a business process.
---


# Part introduction

This is the part 6 of my “Building Business Processes with WEBCON BPS – an expert guide” in WEBCON
BPS. In the [previous part](/posts/2021/series-expert-guide-part-5) we added data rows columns to load the translation of objects at runtime and retrieved the application supervisors. In this post we will create the sub workflow for handling the identified processes.

# Creating Task workflow
## Purpose
The parent workflow, user assignments overview, listed all workflows where the selected user is involved.
In addition for each row a responsible needs to be assigned. 
The default value is the application supervisor which could be changed. 
There will be one task workflow for each supervisor which will list all workflows. The task workflow responsible can define per workflow row if the referenced workflow was changed or if no change is necessary.

## Steps and paths
The steps of the task workflow are limited. We need a step for initialization, which can be used to copy the data from the parent workflow. From there the workflow will automatically be transferred to processing, in which the responsible can work on the listed workflows. Finally it will be moved to completed.

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-21-21-49-17.png" alt="Step overview of the task workflow." caption="Step overview of the task workflow." %}
This workflow is intended to be used as a sub workflow. Nevertheless we need to test the sub workflow without the parent workflow. Therefore I added a hidden 'AdminAssign' path which is only visible in administration mode and not displayed on diagram.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-21-21-50-14.png" alt="Hiding an admin path from normal users" caption="Hiding an admin path from normal users" %}

Using the admin mode (1) we can enter test data. It helps that we defined the Id fields as technical fields instead of hiding them, otherwise we couldn't enter test data (2). The workflow is saved using a hidden admin path (3).
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-21-22-06-03.png" alt="Creating a task workflow with test data in admin mode." caption="Creating a task workflow with test data in admin mode." %}

{: .notice--info}
**Tip:** It's easier to debug a saved workflow. Once it's saved you can easily use the workflow history. If you don't have a save path, add one which is only visible in admin mode. 


## Fields
We can reuse most of the fields from the parent workflow. The only new fields are a responsible (1), the 'workflow link' (2) and 'decision fields'(3) for each workflow row.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-06-34.png" alt="Fields added to sub workflow" caption="Fields added to sub workflow" %}
The field and columns are defined as visible only for the sub  workflow in the field matrix. While the responsible field is a simple `Person or group` field type the decision fields are choice fields with a fixed set of options. 

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-58-01.png" alt="Choice field definition and rendered options" caption="Choice field definition and rendered options" %}

The image above contains three useful information

{: .notice--info}
**Tip 1:** We can achieve with an SQL statement the same result as the usage of a fixed value list. We can simply write the select statements and join them via a union.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-21-22-24-03.png" alt="Sample of fixed value list" caption="Sample of fixed value list" %}

{: .notice--info}
**Tip 2:** If you don't have to write hard coded strings, don't do it. You should use constants instead. You can use the usages tab  to locate every place where a specific constant is used. The number will increase if the value isn't just informational but the workflow should react on it.

{: .notice--info}
**Tip 3:** By providing an "Empty element display name" we can have an additional value in the drop down, which is not listed. This can be used to mark a field as required and force the user to make a decision. 

The 'workflow link' field is a data row which uses a default function (1) to create a link to another instance. We only need to assign our data row column containing the instance id to the parameter (2).
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-10-15.png" alt="Build in Open Element function makes it easy to render a link to another instance " caption="Build in Open Element function makes it easy to render a link to another instance " %}

The only drawback is that we can't provide a translatable `Display name`. This minor drawback can be fixed by creating a custom business rule.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-17-26.png" alt="Business rule to return language specific information" caption="Business rule to return language specific information" %}

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-21-17.png" alt="Alternative rule without using SQL" caption="Alternative rule without using SQL" %}

We can use this rule as a value for `Display name`, we only need to make sure that it is encapsulated in single quotes.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-18-18.png" alt="Using a business rules as a parameter value" caption="Using a business rules as a parameter value" %}

The result is a language specific link depending on the BPS Portal language selected by the user.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-23-21.png" alt="Language specific labels depending on BPS Portal language" caption="Language specific labels depending on BPS Portal language" %}


## Conditional required fields
It's necessary that for each row the decision fields need to be set, before the workflow can be moved to the completed step. Since there are two fields we have three different cases, why a workflow could have been added to the item list. Either the user is assigned in a field, he has a task or both.

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-33-49.png" alt="Only the 'yes' fields should have a required decision field" caption="Only the 'yes' fields should have a required decision field" %}

Due to this we can not simply set the field as required, this would result in false errors.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-34-42.png" alt="Each field is marked as invalid even so not all fields should be required." caption="Each field is marked as invalid even so not all fields should be required." %}

This can easily be fixed by setting up an appropriate `Column requireability restriction` in the permissions tab of both fields 

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-36-57.png" alt="Conditional required columns are marked with red dots  " caption="Conditional required columns are marked with red dots  " %}

{: .notice--warning}
**Remark:** The field matrix defines the field/column as required. If the field is not required in field matrix, this settings is ignored. 

{: .notice--info}
**Tip:** The `Column requireability restriction` is evaluated on page load. For example, changing the value of `Has task` won't change the required behaviour. This only applies to item list columns.

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-43-37.png" alt="Changing the value without saving doesn't effect the required behaviour" caption="Changing the value without saving doesn't effect the required behaviour" %}


{: .notice--info}
**Tip:** If a field is used in a restriction rule and this rule should be evaluated without saving, the `Value change will cause default...` box needs to be checked on this field. So, if you have a field which visible/editable/requiredness state depends on another field you need to do three things:

1. Define the availability for this field in the field matrix
2. Define the restriction for this field
3. Check the `Value change will cause default...` box on the other field

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-22-22-45-48.png" alt="Field with `Value change will cause default...` causes a evaluation of all restrictions like `Requiredness restriction`" caption="Field with `Value change will cause default...` causes a evaluation of all restrictions like `Requiredness restriction`" %}

# Remark

There’s room for improvement. We did not check the fields in item list and
groups are ignored too. The latter shouldn’t be a problem since we can
easily check the BPS Groups and the AD groups won’t contain the user anyway. The
item lists should be checked but there’s nothing new to tell so I omitted it. It will be included in the downloadable application.

# Continuation

At this step we achieved everything which was necessary for the parent workflow.

-   We need to fetch the workflows where a person is involved based on the above
    requirements.
-   We need to get the application of these workflows to get the supervisor.

What’s left is to inform the supervisors. For this we will create one sub
workflow for each supervisor and copy over all workflows which needs to be
checked. Afterwards we can come back to the parent workflow to create them.


{% include series-expert-guide %}