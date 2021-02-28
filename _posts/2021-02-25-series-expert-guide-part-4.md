---
title: "Building Business Processes with WEBCON BPS – an expert guide: Part 4 - Parent Workflow - Identify workflows by selected user"
categories:
  - Private
  - WEBCON BPS
  - Series
tags:
  - Fields
  - Item List  
  - Governance
excerpt:
    A multi-part blog post to share expert information based on the creation of a business process.
bpsVersion: 2021.1.1.46
---

# Part introduction

This is the part 4 of my “Building Business Processes with WEBCON BPS – an expert guide” in WEBCON
BPS. In the [previous part](/posts/2021/series-expert-guide-part-3) we took the prototype created in [part
2](/posts/2021/series-expert-guide-part-2) enhanced it gather all workflows where the selected user has an open task.
In this part we will identify all workflows which store the selected user in a person field. This can be a single or multi-value field

{: .notice--info}
**Tip:** If you are a seasoned WEBCON BPS Designer you may scroll through this text and look out for boxes like this one. 


# Querying choose/person fields
## How a choose field value is stored

This time, we only need information from the V_WFElements table. Instead of
checking the tasks we need to check the column which could contain user
information. These are all `WFD_AttChoose##` columns, and there a quite a lot of
them. Each field is mapped to one of the predefined columns. 

{% include figure image_path="/assets/images/posts/series-expert-guide/2020524a79feda05e12b485dc7ff741c.png" alt="The field 'User' is mapped to the Column WFD_AttChoose1" caption="The field 'User' is mapped to the Column WFD_AttChoose1" %}

{: .notice--info}

**Tip:** The number of each field type is fixed and if your process needs a lot
of fields check out the [limitations](https://community.webcon.com/posts/post/limiting-the-number-of-form-fields/70).

With this knowledge we can create a SQL statement which will **future proof**, even workflows from
 new processes will be retrieved correctly.

A choice field stores a value in the format `ID#Displayname`. If it’s a multi
value field the values are separated by a semicolon:
 `Id#DisplayName;Id#Displayname`

This makes our job a little tricky. First of all, we have to compare the Id
of the choice field against the BPS id, which is the name of the internal user id. This should only change in a few
rare cases while the display name may change due to marriage or similar.

{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-17-22-37-23.png" alt="The id of a user can be retrieved from the BPS users list" caption="The id of a user can be retrieved from the BPS users list" %}

{: .notice--info}

**Tip:** Don’t use the display name in a condition. This is bound to break. 
The display names are updated only when the workflow itself gets saved. Old workflows may have stored the old name. Which is correct, because it was the name at this point in time.

## Extracting id or display name from a choose value
The question is how do we extract the id from the value. If you use the Objects tab from
the expression editor, you will notice a few options. Each will be replaced by a
different statement.

{% include figure image_path="/assets/images/posts/series-expert-guide/c9d9985c626e1978d810d0b28a2d3bf3.png" alt="Four different variables can be used to get the correct value from a person/choose field" caption="Four different variables can be used to get the correct value from a person/choose field" %}

While a single value field will simply return the id, there's a different behaviour for a multi-value field. In this case it returns string of ids which a separated by a comma. 

`user@example.com,user2@example.com,user3@example.com`

{: .notice--info}

**Tip:** There are a few more functions which can help you:

{% include figure image_path="/assets/images/posts/series-expert-guide/78325b0dc48d2f28ef3fb7ba502dd218.png" alt="Functions for extracting specific values from a choose/person field value" caption="Functions for extracting specific values from a choose/person field value" %}

## Where condition for a single and multi-value field 

The second tricky bit is, that the user can be used in a single value or multi
value field. We need to check each case. Since the SQL server doesn’t know a
real regular expression, we have to check every possible option. These are:
1. single value
2. multi-value in the beginning of the string
3. multi-value in the middle of the string
4. multi-value in the end of the string

{% include figure image_path="/assets/images/posts/series-expert-guide/585d51e6ce2cfcb7b7124ee95d01265e.png" alt="Checking a value for all possible combinations which may contain the user id" caption="Checking a value for all possible combinations which may contain the user id" %}

Without checking for the comma we may have false positives. Searching 
for `user@example.com` would be also return true for ids like `muser@example.com`.

{: .notice--info}

**Tip:** Whenever I encounter a syntax error, I will open the preview using show
and copy the text over into SQL Server Management Studio. This reduces the time spend
for identifying the error .

{% include figure image_path="/assets/images/posts/series-expert-guide/340d53f636ade760a3f74216c0efdab5.png" alt="Syntax highlighting in Management Studio makes it easier to see the error" caption="Syntax highlighting in Management Studio makes it easier to see the error" %}

# Updating an item list with additional information
The retrieval of all workflow in which the user was assigned to a field is
similar to the for retrieving the tasks. Before copying it I will create a template from the
action.

{% include figure image_path="/assets/images/posts/series-expert-guide/0ae9ef4bd59995cd1fd3f575167113e1.png" alt="The created template is available under Configuration\Action templates" caption="The created template is available under Configuration\Action templates" %}

{: .notice--info}

**Tip:** If you have only the slightest doubt, that you need to revisit an
action, create a template from it. In this case you don’t need to look through
the process and locate it, which saves you a few clicks.

Since the template action is similar to the one we need to create we can copy it twice. The first copy will be used to add only these workflows which are not already
part of the item list. The second copy will update the “Assigned in Field”
column for those workflow ids which were because they have an open task.

The action for adding only workflows which don't exist yet simply checks whether the workflow instance id is already part of the item list (1). The complete statement is omitted simply because of the "is user in field check" for 90 fields.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-17-22-04-41.png" alt="SQL statement for adding only those workflows which don't exist yet." caption="SQL statement for adding only those workflows which don't exist yet." %}

The action for updating the "Assigned in Field" field uses a case statement which checks if the current workflow also has choose field with the BPS id of the selected user (1). If this is the case, than the field is set to true otherwise to false. It is executed for each row in the item list where "Has task" is true. Selecting the DET_ID as a unique value and retrieving it in the SQL query will ensure that the same row is updated and not some other row.
{% include figure image_path="/assets/images/posts/series-expert-guide/2021-02-17-22-02-23.png" alt="" caption="" %}
{: .notice--info}

**Tip:** If you are in doubt how something works click on the blue `i`. In most
cases you will get really useful information. They helped me tremendously
learning WEBCON BPS.

{% include figure image_path="/assets/images/posts/series-expert-guide/df2908ab435910fc77454a25e81c64cd.png" alt="Info icons often provide useful information and examples" caption="Info icons often provide useful information and examples" %}

After executing all three actions our item list will look like this:

{% include figure image_path="/assets/images/posts/series-expert-guide/369373bd5190c077860ce78c7743d729.png" alt="Item list is populated with all workflows and the checkbox defines why the workflow was added" caption="Item list is populated with all workflows and the checkbox defines why the workflow was added" %}

# One big or multiple smaller steps

All in all, we have three actions to populate the workflow item list. Couldn’t
we achieve this with one single action? That’s possible without doubt. We could
create one monster select statement and it will work. Alternatively, we could
declare temporary tables in which we insert data and return the result.

{: .notice--info}

**Tip:** You can write complex SQL statements directly in the expression
editor and they will be executed just fine. The only problem is that you will
lose the test options. This will throw an error. You can check out this blog
posts for more details: [How configure form field with advanced SQL query -
](https://alterpaths.com/how-configure-form-field-with-advenced-sql-query/)

There’s a simple reason why I don't use this approach, in most cases. If
there’s a problem I will have a hard time looking into it with one single
action. I need to understand it (again) and check which part is causing the problem. If I
have multiple small steps instead, I immediately know which part failed and I even have some data to work with. At least if not all actions are executed during the same path transition. :)

{: .notice--info}

**Tip:** If you have a complex query it will help to split it into multiple
actions. If you can, you should even add multiple steps and execute only a
single action during one step to modify the data. This will allow you to take a
look at the data and how it was transformed.

{: .notice--info}

**Tip:** If there was an error during path transition, you can quickly open the step configuration of a specific workflow by
pressing ctrl+g and either enter the ID or paste the URL of the workflow. There are [more keyboard
shortcuts.](https://community.webcon.com/posts/post/keyboard-shortcuts-in-designer-studio/38)

{% include figure image_path="/assets/images/posts/series-expert-guide/e7b53216a88b039993b3e119189b688c.png" alt="Short cut for opening the configuration of the current step of a workflow" caption="Short cut for opening the configuration of the current step of a workflow" %} 



# Continuation

In the next part we will see how we can retrieve the translations of the application, process, workflow and form type which ids have been stored in the item list.

{% include series-expert-guide %}