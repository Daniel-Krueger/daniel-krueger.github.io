---
title: "Related workflows"
categories:
  - WEBCON BPS   
  - Private  
tags: 
  - Best practice   
excerpt:
    This is an overview of my approach to work with related workflows.
bpsVersion: 2023.1.3.29
---



# Overview
There's basically no application I know of, which doesn't use some kind of workflow relation. The most common one is the parent and child version, followed by data referenced from dictionaries and continue with grand-grand-children which have other data references. This post shall provide an overview of the options we have to:
- display related data
- navigate to the related elements
- execute actions

For this example, I will use a claim workflow, with claim task and a customer dictionary.

{% include video id="xrFwYjs3HxU?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

# Display related data

## Data tables using BPS internal views
Displaying data of related workflows in a data table is pretty straight forward:
1. Create a [BPS internal view](https://docs.webcon.com/docs/2023R3/Studio/ConnectionsAndDataSource/DataSources/DataSource_InternalBPSView) 
2. Use this as a source for the [data table](https://docs.webcon.com/docs/2023R3/Studio/Process/Attribute/DataPres/Sql_grid/), with appropriate filtering.

But did you know that you can define the target of the hyperlink?

{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-21-17-16.png" alt="The links lead to different workflow instances." caption="The links lead to different workflow instances." %}

You are not limited to the default behavior of the `Instance hyperlink', but instead you can define how the link should be generated
{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-21-21-44.png" alt="Three dots button open the hyperlink configuration." caption="Three dots button open the hyperlink configuration." %}

You can use this also to generate the URL to start new workflows. Veterans may remember the link syntax. I have to admit, the 'new' option is way more user friendly. :)

```
link:http://www.webcon.com;displayname:WEBCON
```

{: .notice--info}
**Tip:** Before the `BPS internal views` have been introduced, I used simple SQL statements to get the data. There's still nothing wrong with it and it will still work. The biggest benefit of the internal views is, that the field configuration and language of the user is applied automatically. It was a pain to display a date in the correct format using SQL statements.


In case you are displaying tasks you can also opt for using tabs to display different information. For example, one for open and another one for closed tasks.

{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-22-16-43.png" alt="Use tabs so that open and closed workflow instances are not mixed." caption="Use tabs so that open and closed workflow instances are not mixed." %}

The column 'Is finished' is a calculated column which utilizes the WFD_IsFinish column. Since is a standard field, you could add it to every BPS internal view.

{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-22-19-59.png" alt="Adding 'Is finished' column to a BPS internal view." caption="Adding 'Is finished' column to a BPS internal view." %}

{: .notice--warning}
**Remark:** I have in mind, that the value of this field is set the first time, when a workflow instance reached any final step. If it's moved later to another step, this doesn't get updated.

Of course you are not limited to just display the value, you can use some more elaborate SQL command:
[Creating multilingual icon html tags](/posts/2021/little-excel-helpers#creating-multilingual-icon-html-tags)

## Linking workflows and data rows
The default option to link workflows is the use of the parent workflow id column. Even so this is sufficient, I tend to add a choose field in which this id is stored too. Since I typically need more information than just one value from the related workflow (1) I move this information to an own tab and display more information using a data row field (2). The data itself could again be used to display a preview (3).

{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-21-37-31.png" alt="Showing parent workflow information and related data" caption="Showing parent workflow information and related data" %}

This has two benefits:
- You can setup the field to display a hyperlink for navigation
  {% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-22-14-39.png" alt="Enable hyperlink for choose fields." caption="Enable hyperlink for choose fields." %}
- It prevents potential errors since the field has only one purpose. The parent workflow id column could contain any workflow id.

If you want to display more information from the parent workflow and *don't* need it on a report, you can make use of a data row. 

{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-21-48-29.png" alt="Use data rows to display more information." caption="Use a data row to display more information." %}


{: .notice--warning}
**Remark:** Make sure, that you return only one workflow instance, otherwise the selected fields will be rendered per record.

# Navigate to related elements
## Dictionaries and hyperlinks
You may have wondered, why I have a hyperlink for the customer dictionary. The reason for this is simple, the hyperlink option of a choose field, is only available if the source returns the instance id for the WFD_ID.

{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-21-51-35.png" alt="Hyperlink restriction explanation" caption="Hyperlink restriction explanation" %}

Therefore, I create an own BPS internal view, for the dictionary if necessary, which returns the instance id by default and not the GUID of the workflow instance.
{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-21-53-03.png" alt="BPS internal view for a dictionary." caption="BPS internal view for a dictionary." %}

## Reports and links to other workflow instances
In most cases a report only has a link to the current workflow instance. Nevertheless, it is possible to have links which point to different workflow instances.
In this example, the 'Claim tasks' report has the default link to the workflow instance but also to the parent claim workflow and the referenced customer.
{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-22-04-21.png" alt="Three different link targets" caption="Three different link targets" %}

A prerequisite is, that you activated the `Show link to selected workflow instance` option in the choose field advanced configuration. I've mentioned this in  [Dictionaries and hyperlinks](#dictionaries-and-hyperlinks). If this is the case, you can enable the Link option for these fields and decide, whether you want that link to use the customer (Form field value) or just navigate to the own the workflow instance.
{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-22-08-37.png" alt="Link option is only available for configured choose fields." caption="Link option is only available for configured choose fields." %}


# Actions
## Start sub-workflows from an item list
There's already a lot of documentation for starting sub-workflows in the Knowledge Base:
- [Official documentation](https://docs.webcon.com/docs/2023R3/Studio/Action/Workflow/StartWorkFlow/)
- [General description of the 'Start a subworkflow' action](https://community.webcon.com/posts/post/starting-workflows-in-webcon-bps-actions/76)
- [Start subworkflows using the for each operator](https://community.webcon.com/posts/post/for-each-operator/319/3)
- [Starting a subworkflow using a hyperlink](https://community.webcon.com/posts/post/starting-subworkflows-from-a-button-with-a-hyperlink/198)

The documentation is fine and I have nothing to add regarding the starting of the subworkflows. The one thing I do differently is, that I'm creating a relation. 
1. The subworkflow has a field to store the item list row id, by which it was started.
2. The item list row has a field to store the id of the started subworkflow.

For this I'm also using the `For each` operator which is applied to the item list.
{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-14-20-50-46.png" alt="Subworkflows are created from an item list." caption="Subworkflows are created from an item list." %}


In the foreach loop the `Start a subworkflow' action is executed which saves the current row id.
{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-26-20-33-11.png" alt="The id of the current item list row is saved in a technical field. " caption="The id of the current item list row is saved in a technical field. " %}

Furthermore, the subworkflow id is stored in a local parameter of the automation. I'm using a local parameter as we can't select columns from the item list here.
{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-26-20-36-31.png" alt="Storing the id of the started subworkflow in a local parameter" caption="Storing the id of the started subworkflow in a local parameter" %}

The second action in the loop is 'Change value of a single field', which saves the value of the local parameter in a column of the item list.
{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-14-20-55-26.png" alt="Saving the subworkflow id in a column of the item list for the current row." caption="Saving the subworkflow id in a column of the item list for the current row." %}


This creates a relation in both directions. Possible use cases are:
- The subworkflow can display the original data from the item list
- You can update values in the item list when all subworkflows are completed
- Display the current step of the workflow in the item list using a data row column.
- Provide a hyperlink in the item list to navigate to the subworkflow. 

This approach isn't restricted to the foreach operator, you can also use the `Start a subworkflow (sql)` action in combination with an `Item list update` action. You simply store the DET_ID in the subworkflow and then update the item list rows based on the stored DET_ID. 
Additional information regarding the `Start a subworkflow (sql)` action can be found here:
- [Official documentation](https://docs.webcon.com/docs/2023R3/Studio/Action/Workflow/StartManyWorkFlows/)
- [Official example](https://community.webcon.com/posts/post/pre-paid-electronic-transactions-in-webcon-bps/12)
- [Expert series example](/posts/2021/series-expert-guide-part-7#linking-parent-and-sub-workflow)

{: .notice--info}
**Info:** Instead of defining the tasks in an item list, you can create each one separately using the [hyperlink action](https://community.webcon.com/posts/post/starting-subworkflows-from-a-button-with-a-hyperlink/198).

## Wait for the completion of sub workflows.
The default configuration options allow you to wait until all subworkflows finish positively or until one workflow finished negatively. Unfortunately, there's no option to wait for the completion of all, regardless of the outcome.

{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-13-22-24-16.png" alt="The first negative finished workflow will stop the waiting" caption="The first negative finished workflow will stop the waiting" %}

This can be achieved by using the advanced settings. The most noteworthy part here is, that you must not return anything, not even null, which is achieved by using an if.
The below template will continue if all workflows with the same workflow instance id and the same form type are finished.

```sql
IF 
  /* Number of all measure child workflows */
    (select Count (*) from WFELements where {WFD_ID} = WFD_WFDID and WFD_DTYPEID in ({DT:80}))
  = 
  /* Number of finished workflows */
    (select Count (*) from WFELements where {WFD_ID} = WFD_WFDID and WFD_DTYPEID in ({DT:80}) and WFD_IsFinish = 1 )
  begin 
    select {PH:279}
end;
/* This is only triggered when a subworkflow moves into a final path and not every time a subworkflow is changed or moves to a different step. */
```

{% include figure image_path="/assets/images/posts/2024-02-27-related-workflows/2024-02-26-20-40-07.png" alt="Continue only, if all workflows have been completed." caption="Continue only, if all workflows have been completed." %}

{: .notice--warning}
**Remark:** The first line of this statement should not be a comment. At least I had problems.


This would also allow you to define some complex scenarios like:
-  Moving the parent workflow when a threshold has been reached
-  If you are using some kind of 'approval' subworkflows and it gets rejected, the parent workflow would go back to the previous step. But as the system already contains a negatively finished workflow, it would automatically go back with the default conditions.
-  Have multiple waiting steps in the workflow and at each steps another category of subworkflows must be finished, while all could be started in the beginning.
  
## Other workflow actions
There's nothing I can add which is not already documented, so I will just link the official documentation
- [Start a subworkflow](https://docs.webcon.com/docs/2023R3/Studio/Action/Workflow/StartWorkFlow/)
- [Update related workflow instance](https://docs.webcon.com/docs/2023R3/Studio/Action/Workflow/UpdateParentWorkflow/)
- [Set workflow status](https://docs.webcon.com/docs/2023R3/Studio/Action/Workflow/ActionUpdateElementStatus)<br/>
  I have to admit, I never used this one.
- [Start a subworkflow (SQL)](https://docs.webcon.com/docs/2023R3/Studio/Action/Workflow/StartManyWorkFlows/)
- [Move workflow (SQL)](https://docs.webcon.com/docs/2023R3/Studio/Action/Workflow/MoveManyWorkFlows/)
