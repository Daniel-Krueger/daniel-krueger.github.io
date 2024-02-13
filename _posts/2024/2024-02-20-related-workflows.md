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

For this example I will use a claim workflow, with claim task and a customer dictionary.
![Claim workflow with tasks and referenced customer](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-21-09-55.png)


# Display related data

## Data tables using BPS internal views
Even so this is pretty straight forward, create a [BPS internal view](https://docs.webcon.com/docs/2023R3/Studio/ConnectionsAndDataSource/DataSources/DataSource_InternalBPSView) and use this as a source for the [data table](https://docs.webcon.com/docs/2023R3/Studio/Process/Attribute/DataPres/Sql_grid/), with appropriate filtering.
But did you know, that you can define the target of the hyperlink?

![The links lead to different workflow instances.](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-21-17-16.png)

You are not limited to the default behavior of the `Instance hyperlink', but instead you can define how the link should be generated
![Three dots button open the hyperlink configuration](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-21-21-44.png)

You can use this also to generate the URL to start new workflows. veterans may remember the link syntax which seems to be the more user friendly alternative. :)

```
link:http://www.webcon.com;displayname:WEBCON
```

{: .notice--info}
**Tip:** Before the `BPS internal views` have been introduced I used simple SQL statements to get the data. There's still nothing wrong with it and it will still work. The biggest benefit of the internal views is, that the field configuration and language of the user is applied automatically. It was a pain to display a date in the correct format using SQL statements.


In case you are displaying tasks you can also opt for using tabs to display different information. For example one for open and another one for closed tasks.

![Use tabs so that open and closed workflow instances are not mixed.](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-22-16-43.png)

The column 'Is finished' is a calculated column which utilizes the WFD_IsFinish column. Since is a standard field, you could add it to every BPS internal view.

![Adding 'Is finished' column to a BPS internal view.](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-22-19-59.png)

{: .notice--warning}
**Remark:** I have in mind, that the value of this field is set the first time, when a workflow instance reached any final step. If it's moved later to another step, this doesn't get updated.


## Linking workflows and data rows
The default option to link workflows is the use of the parent workflow id column. Even so this is sufficient, I tend to add a choose field in which this id is stored too. Since I typically need more information then just one value from the related workflow I move this information to an own tab.

![Showing parent workflow information and related data](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-21-37-31.png)

This has two benefits:
- You can setup the field to display a hyperlink for navigation
  ![Enable hyperlink for choose fields](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-22-14-39.png)
- It prevents potential errors since the field has only one purpose. The parent workflow could contain any workflow id.

If you want to display more information from the parent workflow and *don't* need it on a report, you can make use of a data row. 

![Use data rows to display more information](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-21-48-29.png)


{: .notice--warning}
**Remark:** Make sure, that you return only one workflow instance, otherwise the selected fields will be rendered per record.

# Navigate to related elements
## Dictionaries and hyperlinks
You may have wondered, why I have a hyperlink for the customer dictionary. The reason for this is simple, the hyperlink option of a choose field, is only available if the source returns the instance id for the WFD_ID.

![Hyperlink restriction explanation](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-21-51-35.png)

Therefore I create an own BPS internal view, for the dictionary if necessary, which returns the instance id by default and not the GUID of the workflow instance.
![BPS internal view for a dictionary](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-21-53-03.png)

## Reports and links to other workflow instances
In most cases a report only has a link to the current workflow instance. Nevertheless, it is possible to have links which point to different workflow instances.
In this example, the 'Claim tasks' report has the default link to the workflow instance but also to the parent claim workflow and the referenced customer.
![Three different link targets](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-22-04-21.png)

A prerequisite is, that you activated the `Show link to selected workflow instance` option in the choose field advanced configuration. If this is the case, you can enable the Link option for these fields and decide, whether you want that link to use the customer (Form field value) or just navigate to the own the workflow instance.
![Link option is only available for configured choose fields.](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-22-08-37.png)


# Actions
## Start sub-workflows from an item list
## Wait for the completion of sub workflows.
The default configuration options allow you to wait until all subworkflows finish positively or until one workflow finished negatively. Unfortunately there's no option to wait for the completion of all, regardless of the outcome.

![The first negative finished workflow will stop the waiting](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-22-24-16.png)

This can be achieved by using the advanced settings. The most noteworthy part here is, that you must not return anything, not even null, which is achieved by using an if.
The below template will continue if all workflows with the same workflow instance id and the same form type are finished.

```sql
/* This is only triggered when a subworkflow moves into a final path and not everytime a subworkflow is changed or moves to a different step. */
if 
(
  /* Number of all child workflows */
  (select Count (*) from WFELements where {WFD_ID} = WFD_WFDID and WFD_DTYPEID in ({DT:80}) 
  = 
 /* Number of finished workflows */
  (select Count (*) from WFELements where {WFD_ID} = WFD_WFDID and WFD_DTYPEID in ({DT:80}) 
    and WFD_IsFinish = 1 )
)
begin
select {PH:279}

end
```

![Continue only, if all workflows have been completed.](/assets/images/posts/2024-02-20-related-workflows/2024-02-13-22-31-48.png)

This would also allow you to define some complex scenarios like:
-  moving the parent workflow when a threshold has been reached
-  Have multiple waiting steps in the workflow and at each steps another category of subworkflows has to be finished, while all could be started in the beginning.
-  
## Update related workflow