---
title: "Tips & tricks while designing a process part 4 - Parent Workflow - Testing of task retrieval"
categories:
  - Private
  - WEBCON BPS
tags:
  -   
excerpt:
    A multi-part blog post to share expert information based on the creation of a business process.
---

# Part introduction

This is part 4 of my “Tips and tricks while designing a process” in WEBCON BPS.

In the [previous part](/posts/2021/02/15/expert-guide-post-series-part-3) we took the prototype created in [part
2](/posts/2021/02/08/expert-guide-post-series-part-2) enhanced it. Now it's time to test if our changes worked.

{: .notice--info}
**Tip:** If you are a seasoned WEBCON BPS Designer you may scroll through this text and look out for boxes like this one. 


# Retrieving all assignments

The retrieval of all workflow in which the user was assigned to a field is
similar to the previous one. Before copying it I will create a template from the
action.

![](/assets/images/posts/expert-guide-post-series/0ae9ef4bd59995cd1fd3f575167113e1.png)

{: .notice--info}

**Tip:** If you have only the slightest doubt, that you need to revisit an
action, create a template from it. In this case you don’t need to look through
the process and locate it, which saves you a few clicks.

This time we only need information from the V_WFElements table. Instead of
checking the tasks we need to check the column which could contain user
information. These are all WFD_AttChoose\* columns, and there a quite a lot of
them. Each field is mapped to one of the predefined columns. So we only need to
check each field.

![](/assets/images/posts/expert-guide-post-series/2020524a79feda05e12b485dc7ff741c.png)

{: .notice--info}

**Tip:** The number of each field type is fixed and if your process needs a lot
of fields check out the limitations:

https://community.webcon.com/posts/post/limiting-the-number-of-form-fields/70

A choice field stores a value in the format ID\#Displayname. If it’s a multi
value field the values are separated by a semicolon. Example

Id\#DisplayName;Id\#Displayname

This makes our job a little tricky. First of all, we should only compare the Id
of the choice field against the bps user id. This should only change in a few
rare cases while the display name may change due to marriage or similar.

{: .notice--info}

**Tip:** Don’t use the display name when looking for a match. This will break
sooner or later since the display names are only when the workflow itself gets
saved.

The question is how do we get the display name. If you use the Objects tab from
the expression editor, you will notice a few options. Each will be replaced by a
different statement.

![](/assets/images/posts/expert-guide-post-series/c9d9985c626e1978d810d0b28a2d3bf3.png)

If the function is applied to a field with multi value content it returns a
string of ids which a separated by a comma. Example

user@example.com,user2@example.com,user3@example.com

{: .notice--info}

**Tip:** There are a few more functions which can help you:

![](/assets/images/posts/expert-guide-post-series/78325b0dc48d2f28ef3fb7ba502dd218.png)

The second tricky bit is, that the user can be used in a single value or multi
value field. We need to check each case. Since the SQL server doesn’t know a
real regular expression, we have to check every possible option, single value,
multi-value in the beginning, multi-value in the middle and multi-value in the
end:

![](/assets/images/posts/expert-guide-post-series/585d51e6ce2cfcb7b7124ee95d01265e.png)

Without checking for the comma we would may have false positives. Looking only
for [user@example.com](mailto:user@example.com) would be also true for
muser@example.com.

{: .notice--info}

**Tip:** Whenever I encounter a syntax error, I will open the preview using show
and copy the text over into the management studio. This speeds up the time
finding the error.

![](/assets/images/posts/expert-guide-post-series/340d53f636ade760a3f74216c0efdab5.png)

We also need to make sure that we only add these workflows which are not already
part of the item list. In addition, we should update the “Assigned in Field”
list for those workflow ids which were added because they had an open task. So,
we need one action to add the workflow ids without tasks and one action for
updating the field.

{: .notice--info}

**Tip:** If you are in doubt how something works klick on the blue I. In most
cases you will get really useful information. They helped me tremendously
learning WEBCON BPS.

![](/assets/images/posts/expert-guide-post-series/df2908ab435910fc77454a25e81c64cd.png)

After executing all three actions our item list will look like this:

![](/assets/images/posts/expert-guide-post-series/369373bd5190c077860ce78c7743d729.png)

### One big or multiple smaller steps

All in all, we have three actions to populate the workflow item list. Couldn’t
we achieve this with one single action? That’s possible without doubt. We could
create one monster select statement and it will work. Alternatively, we could
declare temporary tables in which we insert data and return the result.

{: .notice--info}

**Tip:** You can write complex t-sql statements directly in the expression
editor and they will be executed just fine. The only problem is that you will
lose the test options. This will throw an error. You can check out this blog
posts for more details-

[How configure form field with advanced SQL query -
AlterPaths](https://alterpaths.com/how-configure-form-field-with-advenced-sql-query/)

As shown above I prefer multiple smaller steps. There’s a simple reason. If
there’s a problem I will have a hard time looking into it with one single
action. I need to understand it again and check which part is the problem. If I
have multiple small steps instead, I im/assets/images/posts/expert-guide-post-seriestely know which part failed and I
may have some data to work with. At least if not all actions are executed during
the same path transition.

{: .notice--info}

**Tip:** If you have a complex query it will help to split it into multiple
actions. If you can, you should even add multiple steps and execute only a
single action during one step to modify the data. This would allow you to take a
look at the data and how it was transformed.

{: .notice--info}

**Tip:** You can quickly open the step configuration of a specific workflow by
pressing ctrl+g and either enter the ID or paste the URL.

![](/assets/images/posts/expert-guide-post-series/e7b53216a88b039993b3e119189b688c.png) [More keyboard
shortcuts](https://community.webcon.com/posts/post/keyboard-shortcuts-in-designer-studio/38)

### Retrieving translations of WEBCON BPS elements

As we already seen above WEBCON BPS objects can have translation. They have an
internal name and for each language an additional one can be provided. Sometimes
it’s necessary to retrieve the translation of an object at runtime. Ok it’s not
necessary but it’s more user friendly if you have a translation for an object to
use it. In our case, we have the ids of the application, process, workflow and
form type and want to display the translation of these elements to the user in
our workflow.

The translations are stored in the table Translates, but you won’t get very far
with this table alone:

![](/assets/images/posts/expert-guide-post-series/46f39da72fc8947273c7be4cc49a3a7e.png)

Every table has an \_ID column which is the key of the table, but what are these
other columns:

\_LANID points to the table TranslateLanguages where we have a mapping of
languages to an id

>   ![](/assets/images/posts/expert-guide-post-series/d9e881b2e9fab1b039e54debf046c04a.png)

\_OBJID is the id of the object which translation we want to retrieve. But since
each id of each object starts with 1 there should be duplicates. This is where
column \_ELEMID comes to our rescue. It defines the type of the object. But how
do we know which id represents our application name? This information can be
retrieved from the table DicTranslationsObjects.

![](/assets/images/posts/expert-guide-post-series/a662b21703bc7cd7d1cc557c9b90592a.png)

{: .notice--info}

**Tip:** WEBCON BPS has evolved over more than ten years to become what it is
today. So there have been a few naming changes in the UI which couldn’t be
reflected in the core of the system. Two obvious ones are Process, which have
been Definitions, and Form Types, which were Document Types at some point in
time.

{: .notice--info}

**Tip:** If you see an integer value and it looks like it should have a meaning,
your first bet is to look at Dic\* tables. Dic is the abbreviation for
dictionary where you may find a mapping of the integer to a meaningful name.

So, we have the translation but how do we make use of them. We need a data row
in the item list to retrieve the translation, so we could write our query there,
but this would be a waste. This seems like something which can be reused, and
this is where Business Rules come in. They allow us to create a rule which we
can use again and again. Business Rules can be defined on process level or
global, which allows to use the rule everywhere. Overtime there will be a lot of
rules and to keep an overview you can add groups.

![](/assets/images/posts/expert-guide-post-series/32990c0f24406e63d058682817e8643d.png)

Since a Business Rule is there to be reused, parameters can be provided.

![](/assets/images/posts/expert-guide-post-series/4199e7f0401ccc519cb94681dad582b9.png)

Which can than be used inside the expression.

![](/assets/images/posts/expert-guide-post-series/fffdbf07a995a2e692b64949f9c18b30.png)

The “ObjectType” parameter expects only two value 51 and 51, but this is only an
description and not a restriction. Even so these are fixed values I tend to
create constants for those, which I will group, too. These constants can be used
in the expression editor as well as in the parameter mapping window.

![](/assets/images/posts/expert-guide-post-series/6a07a570de7bd5bb902e753f10e44778.png)

{: .notice--info}

**Tip:** Grouping objects has one other benefit. If you right click on the group
name, you can select one of the group members.

![](/assets/images/posts/expert-guide-post-series/854ac295c6b72760d3d3d21f15b35b0a.png)

All that’s left is to add a new column to the item list of type data row, write
a simple sql query “select ‘’ as Label” and put the business rule inside the
single quotes.

![](/assets/images/posts/expert-guide-post-series/913788b656d893ff49c81ab5a36e9f7f.png)

The parameter mapping of the Business Rule can be opened with a right click.
What’s important to note here is the following, we need to fetch the correct
translation for the current row. WEBCON BPS makes it easy for us, if we expand
the workflows item list field, than we see all the defined fields and if we use
one field it will automatically refer to the value of this row.

![](/assets/images/posts/expert-guide-post-series/cc4b74914a69ffd6a0f1036e150a5f68.png)

The result looks like this:

![](/assets/images/posts/expert-guide-post-series/29b671395747727f43395ef747637bdd.png)

We no longer need our ids so we can hide them, but we shouldn’t do this via the
field matrix. Instead we make use of the “Technical column” attribute.

![](/assets/images/posts/expert-guide-post-series/10eb06abef43ca78eed4f0fee9d5140a.png)

This allows to hide unnecessary information for the normal user (1) and display
it when necessary via the admin view (2) which is toggled via the admin button
(3) in the menu bar.

![](/assets/images/posts/expert-guide-post-series/2db2fb2b6ec84692f3f27b35ffaa55ea.png)

{: .notice--info}

**Tip:** If the column would have been hidden via the field matrix it wouldn’t
have be available at all.

{: .notice--info}

**Tip:** A group of fields, a field, item list and a column can be declared as
technical. If you declare a group or item list as technical, this will be
applied to all child elements even so they don’t have the flag.

### Retrieving supervisor

There’s not much to tell here. We need to update two fields of the item list. So
we prepare the statement (1) and will add the retrieval of the wanted
information in a second step (2).

![](/assets/images/posts/expert-guide-post-series/75d48a691f81e93d24eba54f4c5e5a04.png)

{: .notice--info}

**Tip:** You should always check for null, otherwise you will be surprised.
Because select ‘1’+null+’2’ will return null.

This action is executed on the transition to the next path.

![](/assets/images/posts/expert-guide-post-series/6bc9250957ba86c394798251cd207068.png)

### The (temporary) end

At this step we achieved everything which was necessary for the parent workflow.

-   We need to fetch the workflows where a person is involved based on the above
    requirements.
-   We need to get the application of these workflows to get the supervisor.

What’s left is to inform the supervisors. For this we will create on sub
workflow for each supervisor and copy over all workflows which needs to be
checked. Afterwards we can come back to the parent workflow to create hem.

Remark

There’s room for improvement. We did not check the fields in item list and
groups are ignored too. The later case shouldn’t be a problem since we can
easily check the BPS Groups and the AD groups won’t contain the user anyway. The
item lists should be checked but there’s nothing new to tell so I omitted it.

## User Assignment: Creating the sub workflow

### Adding a link to the workflow

Adding status field to track progress

### Starting sub workflow

### System step for monitoring

No task assigned

# Debugging options in WEBCON BPS

Creating processes within WEBCON BPS is a pleasure for me. It’s not only because
it’s blazing fast to create new processes, but the major reason is that handling
problems during a life cycle is at the core of the application. Since WEBCON as
a company follows the principle “eat your own dog food” not only the end user
experience gets improved with each version but also the user experience of the
workflow designers. If you are using your own software, you just can’t waste
resources on finding errors. So, what kind of options do we have:

-   We can test our “code” before we even save the changes
-   A debug mode can be activated in the browser which lists everything what’s
    happening
-   There are two different log levels which are displayed in the history

## Debugging before saving the changes

There’s not much to tell about this feature. In the expression editor you have
the option to execute the expression and see the result or to show how it looks
like.

![](/assets/images/posts/expert-guide-post-series/a06e31a18d1b2bc3d9a0e3679fff60d0.png)

The later one is more useful if you are resorting to writing a t-sql query which
uses values from BPS. Clicking on “show” will replace the red bordered
placeholders with actual values. If you are wondering where these values come
from, you can set the workflow instance whose values should be used. If

![](/assets/images/posts/expert-guide-post-series/63666512114d7138de7f2d744435d5d2.png)

## Debugging the form behaviour

Prior to version 2021 you had to add “debug=1” as a query parameter to the URL
to view what happened in the browser. This has been improved a lot. The least of
it is that you don’t need to add the parameter anymore but instead click on an
icon. What’s even better is that any user can activate it, can save the logging
information and send them to the administrator. For more details regarding this,
you can refer to the official knowledge base entry:

<https://community.webcon.com/posts/post/diagnostics-and-form-behavior-registration-mechanism/215>

Since there are already an official topic about this, I want to highlight
something. Once in while you will add some calculated field to a report, or on
the form.

![](/assets/images/posts/expert-guide-post-series/6bb03a2a6e1584ebb9993569b668599d.png)

During the creation of t-sql you will probably make mistakes and you are
wondering why it doesn’t work. To get down to the problem it would be great to
get the whole t-sql statement which get’s executed and guess what that’s
possible. Just activate the diagnostic session, find the operation with
operation with “Get data from swe provider” for a report and copy the statement
over to management studio and execute it yourself.

![](/assets/images/posts/expert-guide-post-series/53420a3a0db3d77b6b7a5e9cc64121da.png)

In case of a field /data grid on the form look for a operation title
ExecuteParametrizedQuery.

So what about actions during path transition, which aren’t executed in the
browser? In the past I used the SQL profiler, but this is no longer necessary.
Just start the diagnostic session, click on the path, search and search for the
action name. You may have to expand the nodes list, but hey, this is far more
convenient than the previous approach and saves us a lot of times.

![](/assets/images/posts/expert-guide-post-series/3d53058b71274b79a06d4b1273608087.png)

![](/assets/images/posts/expert-guide-post-series/b5faaf321045f6a5abd7d9f42152c6d7.png)

## Debugging communication with external systems

The chance of errors get’s more likely if you are communicating with external
systems, via a web service. This may be an error in your call or something as
simple as an unavailable server. I hated these errors in the past when I worked
with SharePoint. Most of the time they happened in production and I wouldn’t
have enough logging information. So how has this changed with WEBCON BPS? WEBCON
BPS stores every executed action and you can check what happened in the history.

![](/assets/images/posts/expert-guide-post-series/953706f10ab312ddb587ae11470e78aa.png)

If you have the impression, that this information won’t help much, you are
right. But this is only because this is what a normal user can see. If you
switch to admin mode, you will get all information necessary to replicate the
call.

![](/assets/images/posts/expert-guide-post-series/4aa6365af7521255dc80dd8a3fbc1d23.png)

This information is stored in the database alongside the workflow. It will only
get deleted if the workflow itself is deleted. So you can track down the problem
not only in production but also a long time back.

## Summary

With WEBCON BPS it get’s really simple to prevent errors in the first place and
even if they occurred you have handy options to get down to the core. Thanks to
InstantChange™ we can fix them without restarting the failed workflows, so the
users don’t need to repeat their previous action in a new instance of the
workflow.
