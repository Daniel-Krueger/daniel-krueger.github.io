---
title: "Batch processing to prevent timeouts"
categories:
  - WEBCON BPS
  - Private 
tags:
  - Best practice
excerpt:
    "When you are creating a lot of subworkflows, you could run into timeouts, when you don't create them in batches."
bpsVersion: 2025.1.1.105
---

# Overview
Let's assume that we are using WEBCON BPS for projects. These projects consist of different phases, and each phase has a few dozen standard tasks. Of course, you wouldn't want to create these manually each time. You would have some kind of template which you would copy.

Depending on the server performance and the current load, the creation of all these tasks can take a while. If you are out of luck, you could run into an [automation timeout](https://community.webcon.com/posts/post/types-of-timeouts-in-webcon-bps/560/3). In this post I will describe how we can process these in batches to prevent this timeout.


{: .notice--info}
**Info:** While I may have described this approach already in another post, I haven't found it. Nevertheless, I'm quite sure that I didn't write about the ‘business rule way’. This will prevent repeating the same where condition multiple times.

{: .notice--info}
**Info:** This not only applies to subworkflows, but can also be used when you are updating / retrieving data from external systems.


# General approach
In general, it uses the following approach:
- Define a SQL query which identifies the top x elements which need to be processed
- Use a constant or similar to store this value
- Process the elements on the path to a flow control
- Check if every element was processed
- If this is not the case, move the workflow instance to a temporary step
- A timer aka timeout will trigger the path again

For simplicity, let's assume that we have an item list with a lot of rows for which we will create subworkflows. We want to process 50 rows in one batch. After these have been created, we will update a column in the item list with the created workflow instance. This will allow us to identify which rows have already been processed.

# Business rule to return elements to process
The first step is to define a business rule to return uniquely identifiable elements. This will typically be either the WFD_ID or DET_ID in case of an item list.
{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-22-21-49-50.png" alt="The business rule will return the next batch of elements to update" caption="The business rule will return the next batch of elements to update" %}

The reason for this business rule is that this will be the single source of truth. Without it, we would have to replicate and maintain the condition in at least two places.

# Process elements in automation
## Overview
The next step is to process the elements and update the item list.

This will be done in a dedicated automation with the following elements:

- Local parameter: Unique element identifiers (ReadingConfirmationsToCreate)
  This stores the result of the created business rule.
- For each with data source collection type
- Update item list
{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-24-20-27-35.png" alt="Overview of the automation for processing a batch of elements." caption="Overview of the automation for processing a batch of elements." %}

## For each with data source collection type

It may be counterintuitive to use the `Collection type: Data source` for an item list. The alternative would be to use the item list directly and use an `if` or `case` in the `for each` to check whether the current row should be processed. While this would allow us to update columns of the row directly, every row would be processed, and the processing would be logged. If you have hundreds of rows, displaying the details in the workflow history will take a while. Finding why a specific row didn't work as expected in this list is a pain. That's the reason why I decided against it and instead updated the item list after the `for each`. In addition, this approach can be used against any other data source too. 

The data source of the `for each` uses the returned value from the business rule in the where condition to the data which should be updated in this batch.

```sql
where DET_ID in (select item from dbo.SplitToTable('{AUTP_Value:-5}',';'))
```
{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-24-20-30-30.png" alt="Data source definition.." caption="Data source definition.." %}

There's another side effect the business rule has. Without it you would have to limit the results in this query. Which would lead to the following error.

{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-22-22-03-47.png" alt="Error with active TOP clause." caption="Error with active TOP clause." %}

WEBCON executes the data source query in the background when opening the `for each` wizard to get the data source columns. During this execution an empty value is passed. The  `select TOP LocalParameter *` will be parsed to `select TOP *`  which is the reason for this error. This won't be an issue in the actual execution but it doesn't allow us to use the columns in the `for each`. Therefore, the `TOP ` clause has to be commented or not used at all when modifying the `for each`.


Regardless how you implement it, once we can use the values of the data source in the `Columns collection` to create the sub workflows or start REST actions etc. Of course, if you are simply starting subworkflows, you can also use `Start a subworkflow (SQL)` action with the where condition.

{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-22-22-07-12.png" alt="Active `TOP` clause will prevent loading the columns." caption="Active `TOP` clause will prevent loading the columns." %}

## Update processed elements
The last step is to mark the elements as processed. In my case the id of the created workflow instance will be stored in the item list. This works, because the DET_ID of the item list row is saved to the created workflow instance. We will use the same where condition here. This ensures that we will update exactly those elements which have been processed in the `for each`.
```sql
where DET_ID in (select item from dbo.SplitToTable('{AUTP_Value:-5}',';'))
``` 

{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-22-22-10-42.png" alt="Update the processed elements." caption="Update the processed elements." %}



# Flow control loop
Last but not least is the creation of the loop. In my case, I've added the created automation to both paths leading to the flow control.

{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-22-22-14-02.png" alt="Creating the loop with a flow control." caption="Creating the loop with a flow control." %}

The flow control checks whether the returned string is empty to determine whether all elements have been processed

{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-22-22-16-03.png" alt="If the business rule doesn't return a value, every element has been processed." caption="If the business rule doesn't return a value, every element has been processed." %}

If there are still elements which need to be processed, the workflow instance is moved to a system step. A timer will trigger the creation of the next batch of elements by using the path transition option.

{% include figure image_path="/assets/images/posts/2025-07-24-Batch-processing-to-prevent-timeouts/2025-07-22-22-17-56.png" alt="Next batch will be processed in one minute." caption="Next batch will be processed in one minute." %}

# Conclusion
While I have used this approach for years, it took me a long time to implement the business rule variant. This really makes a difference. It ensures a single point of truth. Before this, I've updated the where condition in all places manually and had a reminder in the SQL command as well as in the documentation to do so.
I also wasn’t aware of the option that you could use the current database in the `for each`. This has made it way more flexible.
