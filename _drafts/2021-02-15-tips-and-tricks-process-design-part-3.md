---
title: "Building Business Processes with WEBCON BPS – an expert guide: Part 3 - Parent Workflow - Preparations and task retrieval"
categories:
  - Private
  - WEBCON BPS
tags:
  -   
excerpt:    
    A multi-part blog post to share expert information based on the creation of a business process.
---

# Disclaimer

I hope you read the
[Disclaimer](/posts/2021/02/01/tips-and-tricks-process-design-part-1#disclaimer)
because this is not a simple tutorial. In addition, the parent workflow here is
not a normal workflow. We need to create this workflow in a way that we fetch
all possible user assignments for **existing workflows** as well as for those
which will be created in the **future[^1]**. So, don’t be scared from a few
complex looking SQL statements.

[^1]: I wonder how many platforms exist where you could achieve this.

# User Assignments: Creating the parent workflow

This is the part 3 of my “Building Business Processes with WEBCON BPS – an expert guide” in WEBCON
BPS.

In the first [part 1](/posts/2021/02/01/tips-and-tricks-process-design-part-1)
defined the use case and showed in the [part
2](/posts/2021/02/08/tips-and-tricks-process-design-part-2) how the Designer
Desk can help us. The Designer Desk can be used by everyone but going onward
from a trained WEBCON BPS user is necessary with a license for using the
Designer Studio. In this part we will populate the item list with workflows
which have open tasks.


{: .notice--info}

**Tip:** If you are a seasoned WEBCON BPS Designer you may scroll through this text and look 
out for boxes like this one. 

# Adding additional fields to the item list

These are the fields of our Workflows Item list which we got via the Designer
Desk from our process owner.

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/924f04dbc6e261758215bbb9888041f8.png"
alt="Fields provided by the process owner via Designer desk." caption="Fields
provided by the process owner via Designer desk." %}

So, we need our supervisor and the name of the workflow, and the Id of the
element, which is referred to as Workflow Id in this case. Here are a few
problems:

1.  We have a misleading name; the column Workflow Id should hold the Ids of the
    workflow instances and not of the absence workflow which has the Id 6.
2.  Workflow name is a simple text field, but this won’t work in a multilingual
    environment, so we need to retrieve the workflow name at runtime in the
    language of the current user.
3.  For retrieving the supervisor information, we need some more Ids, at least
    internally.
4.  In addition, it would be good, that we have more than only the name of the
    workflow. Th responsible should be able to easily recognize the workflow.
    Therefore, we need the name of the application, process, workflow and also
    the form type.

The screenshot below shows the added fields and the translations of the field
“WorkflowInstanceId”.

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/9aff4a1c13cc88c252d6931c6eaa363a.png"
alt="Added fields and translations of WorkflowInstanceId" caption="Added fields
and translations of WorkflowInstanceId" %}

Instead of providing an English translation. I could have simply used the
translation value for the field, but there’s a simple reason:

{: .notice--info}

**Tip:** There will be cases, where you want to use an “internal” name for an
object. For this, you can simply provide an additional translation. This will
make it more distinguishable, especially across workflows/processes.

# Creating the SQL statement

Looking at the workflow diagram we see that we need to retrieve all open tasks
for the required user:

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/f5cd21da9682acf78688b7282786c6aa.png"
alt="Workflow diagram of user assignment parent workflow" caption="Workflow
diagram of user assignment parent workflow" %}

First, I will rename the path and add an action to update the item list. If I’m
familiar where the requested data is stored and which names the fields have, I
would write the SQL statement directly into the expression editor.

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/76c33217a17d4c66e770548a12b0f672.png"
alt="An action was added to the renamed pat to fetch all open tasks for selected
user." caption="An action was added to the renamed pat to fetch all open tasks
for selected user." %}

This isn’t the case now. Therefore, I will create this script using the
Management Studio. This will help me with identifying the fields, test the data
and so on.

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/ad9f1462960d1aba72f15bae77d3ad96.png"
alt="Alternative creation of the expression in SQL Management Studio"
caption="Alternative creation of the expression in SQL Management Studio" %}

{: .notice--info}

**TIP:** If you don’t know which objects relate to which tables in the database
you can take a look at the post: [Configuration tables in WEBCON
BPS](https://community.webcon.com/posts/post/configuration-tables-in-webcon-bps/158).

Armed with this knowledge I could join all the necessary tables or rely simply
on V_WFElements which already contains all the IDs I need.

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/a2fc892531f673e644741862ad88de00.png"
alt="SQL Statement for getting all required data for workflows with an open
task." caption="SQL Statement for getting all required data for workflows with
an open task." %}

{: .notice--info}

**Tip:** There’s an overview of existing views in the database: [Views embedded
in the content
database](https://community.webcon.com/posts/post/views-embedded-in-the-content-database/42)

{: .notice--info}

**Tip:** I prefer to add a leading comma instead of a trailing one. If I have a
trailing one, I will often get a “Incorrect syntax near the keyword” when I
comment out one line.

# Using variables in expressions

Now we have all the information we need. We can remove the hard coded values and
map the columns to the appropriate fields of the item list.

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/7e33d8ff580558adc69f29ccf3805ef2.png"
alt="SQL statement after adding variables" caption="SQL statement after adding
variables" %}

If you activate the advanced mode, you can see the internal representation of
the variables (objects).

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/f1df2de9c135760308a531637fccdcf6.png"
alt="SQL statement in advanced mode. This matches a copy & paste into a text
editor." caption="SQL statement in advanced mode. This matches a copy & paste
into a text editor." %}

{: .notice--info}

**Tip:** You can simply copy an expression inside the Designer Studio and it
will work. To be more precise, inside the same database. The integer values
refer to the respective rows in the table. If you copy & paste the same script
in a Designer Studio connected to a different database, you will run into
problems.

During execution, the internal expressions of the variable will be replaced by
the appropriate database field. You probably noticed the curly brackets around
the names. The curly expression is referred to as moustache expression or
variables and are “magic” expressions. These will be replaced with a real value
during execution.

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/fc10137fac4cc38f61be79e78a39f44f.png"
alt="The advanced mode shows the variable names and their internal values."
caption="The advanced mode shows the variable names and their internal values."
%}

{: .notice--info}

**Tip:** If you want to know more about them start the help from the designer
and search for help site called ‘Variables’

{: .notice--info}

**Tip:** Whenever possible, use the Objects tab to get the wanted information
instead of writing the name manually. This will save you a lot of headaches if
you change the type of a field later on[^2]. In addition, the usages tab will
show you where it is used.

[^2]: As a matter of fact, I did change the type of a field during the creation of
    the process. Hadn’t I used the Objects variable, I would have had a hard
    time to look for the problem.

{% include figure
image_path="/assets/images/posts/tips-and-tricks-process-design/399c2f7220590ccca5d61274c7a15df4.png"
alt="" caption="" %}

# Part overview

In the next part we will see what options we have to test our SQL statement
during design and execution time.

1.  [Introduction and Use
    Case](/posts/2021/02/01/tips-and-tricks-process-design-part-1)
2.  [Parent Workflow- Prototype implementation using the Designer
    Desk](/posts/2021/02/08/tips-and-tricks-process-design-part-2)
3.  Parent Workflow - Preperations and task retrieval
4.  Parent Workflow - Testing of task retrieval
5.  Parent Workflow - Identifying workflows with user assignments
6.  Parent Workflow - Getting translations of objects
7.  Parent Workflow - Completion
8.  Sub workflow - Creation
9.  Parent Workflow - Starting sub workflows
10. Parent Workflow - Adding monitoring column
11. Download
