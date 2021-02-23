---
title: "Building Business Processes with WEBCON BPS – an expert guide: Part 7 - Parent Workflow - Starting sub workflows & monitoring column"
categories:
  - Private
  - WEBCON BPS
tags:
  - Sub workflow
excerpt:
    A multi-part blog post to share expert information based on the creation of a business process.
---


# Part introduction

This is the part 7 of my “Building Business Processes with WEBCON BPS – an expert guide” in WEBCON
BPS. In the [previous part](/posts/2021/series-expert-guide-part-6) we created the sub workflow to assign tasks to the workflow responsible. Our workflow item list may contains the same responsible multiple times so we need to create another item list from these which will be used to start the sub workflows. At the same time this will be a small dashboard.

# Responsibles list
The responsilbes list is simple, we only need a field for the responsible. Since we want to use this as a dashboard to we add two further fields, one for storing the workflow and one other which will be used to show the current state and provide an option to jump into the workflow. 
![Definition of the responsible list](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-21-20-53.png)

The `state` field contains dummy data and the TaskWorkflowId field is a marked as a technical field. Populating this field is easy, even so it looks funny.

![Action to populate the responsibles list](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-21-58-45.png)

   
{: .notice--warning}
**Remark:** Don't forget to filter for the item list id `DET_WFCONID = ITEM_LIST_ID`. If you have no other item list this will work, but if another one will be added, you will be in trouble.

This is a case where I could have made use of an internal name, so these fields are better distinguishable. Switching to advanced mode helps here, too.
![Switching to advanced mode makes it clear which fields are referenced.](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-21-24-10.png)

Once the action is executed we have a small list whit each responsible.

![Populated responsibles lists](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-21-27-06.png)

# Linking parent and sub workflow
Parent and sub workflows are linked by assigning the instance id `WFD_ID`of the parent workflow to the column `WFD_WFDID` of the sub workflow. 
![Database column Ids of current workflow and parent workflow ](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-21-33-50.png)

This is fine for most case but I prefer to add an additional technical field in which I store the id of the parent workflow. This is true also for the parent workflow itself.

![Storing the id of the parent workflow in a technical field](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-21-37-49.png)

There are two reasons for this
1. If there's a hierarchy of workflows I can easily identify them.
2. A common field makes it also easier in reports.
   
{: .notice--info}
**Tip:** If you have a workflow hierarchy create one technical column for each parent in the hierarchy. If you have Grand Parent > Parent > Child create GrandParentWFId and ParentWFId and populate them. This will help you in the future, even if you don't know it yet. :)

# Starting sub workflows
It's time to start our sub workflow for each row in the responsibles list. Therefore we use the `Start a sub workflow (SQL))` action. We need to store our responsible and copy over the value from our own parent workflow id and user field.

![Definition of start sub workflows action](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-22-27-04.png)

{: .notice--info}
**Tip:** If you are starting a sub workflow you should always choose `Business entity dynamically`  and select the business entity of this workflow instance. Even if you don't have multiple business entities yet this may change. I don't want to be in your place if you selected a fixed value here, when it's not absolutely necessary.

Since we want to turn our parent workflow into a dashboard we need to update our responsibles list with the created task workflow ids. This is achieved by getting the `WFD_ID` for each sub workflow and assigning it to the responsible column of the item list. In the meantime I changed the internal names, which makes it easier to read. :)

![Updating the task workflow id for each responsible row.](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-22-08-52.png)

In the sub workflow we need to add another action to retrieve the workflow rows for the current responsible. In this case we don't need to map the source columns to the target columns, they are the same.

![Action definition to retrieve the workflow rows from the parent workflow](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-22-30-36.png)

This action is added to the `Assign` path, which is executed by the start sub workflow action. If we now start the sub workflow creation, the sub workflow task will be created, the workflows rows copied over and the responsible list will be updated whit the created workflow id.

![On path transition the workflows are created and the item list updated with there ids.](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-22-34-43.png)

# Adding monitoring column
The responbiles list should be used as a simple dashboard to get a quick overview if a sub workflow is finished. We will achieve this by using our created data row column. The first step is to check the state of the task workflow, which is stored in column `WFD_StatusId`. If we add an icon in addition to the text will make it easier for the user to understand. This can be achieved by using Office UI Fabric icons.

![Showing workflow state with custom icon](/assets/images/posts/2021-03-15-series-expert-guide-part-7/2021-02-23-22-51-13.png)

{: .notice--warning}
**Remark:** A subset of the [Office UI Fabric icons](https://uifabricicons.azurewebsites.net/) are included with BPS Portal. You should  verify if the icon exists is part of the BPS Portal version, before using it in multiple places.


{% include series-expert-guide %}