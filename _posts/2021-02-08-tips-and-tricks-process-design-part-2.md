---
title: "Tips & tricks while designing a process part 2 - Prototype implementation via Designer Desk"
categories:
  - WEBCON BPS
tags:
  -  Designer Desk 
excerpt:
    A multipart blog post about providing tips & tricks while designing a WEBCON BPS process.
---


# Part overview
1. [Introduction and Use Case](/posts/2021/02/01/tips-and-tricks-process-design-part-1)
2. [Parent Workflow- Prototype implementation using the Designer Desk](/posts/2021/02/08/tips-and-tricks-process-design-part-2)
3. Parent Workflow - Preperations and task retrieval
4. Parent Workflow - Testing of task retrieval
5. Parent Workflow - Identifying workflows with user assignments
6. Parent Workflow - Getting translations of objects
7. Parent Workflow - Completion
8. Sub workflow - Creation 
9. Parent Workflow - Starting sub workflows
10. Parent Workflow - Adding monitoring column
11. Download
    
# User Assignments: Designing a prototype

## Designer Desk

Prior to WEBCON BPS 2021 I would have used the Designer Studio to create a
prototype together with the process owner, the guy who’s requesting this. With
the new version I would choose the Designer Desk. The Designer Desk allows every
user to create a prototype of there process which they have in mind. There is
only the information, which is needed for the prototype creation, the prototype
can be tested, and upon completion it can be send to the IT department to create
a process from this prototype. I won’t take a screenshot of every step since
it’s self explaining and there’s an upcoming webinar for this.

## Creating the workflow

Lets start with the initial workflow to get all assignments of a user. We can
define a step name and provide a description what should happen in this step.
![](/assets/images/posts/tips-and-tricks-process-design/9092de44ddde237ad18da9ecc2aa413d.png)

The workflow for identifying all workflows in which a user is involved could
look like this.

![](/assets/images/posts/tips-and-tricks-process-design/2aa80e53cb00ebfce08b0a344cadb2de.png)

## Creating the form

Once done we will move to the form, define fields, and provide information for
the field. Why do we need it and what should happen with it.

![](/assets/images/posts/tips-and-tricks-process-design/6b89fda0613ebb419a3c4cbe1af528d1.png)

![](/assets/images/posts/tips-and-tricks-process-design/d6c37b764a739f716dfcfffb8a81f425.png)

Besides the user we need a table (item list), adding fields is done by drag&
drop the fields from the left navigation onto the plus sign.

![](/assets/images/posts/tips-and-tricks-process-design/3089a8fd71e09e70589780b5d0cf8958.png)

In the field matrix we are defining when each field will be visible, whether
it’s read only or required.

![](/assets/images/posts/tips-and-tricks-process-design/6a909a1d1429d65a226eefb2838938ab.png)

## Going for a dry run

With these settings we can use the prototype for a dry run. We can select the
user and see the description of the first step.

![](/assets/images/posts/tips-and-tricks-process-design/f7c5adc0abff5aaa40777274ac588e43.png)

While going through the workflow we can provide other values and notice any
shortcomings.

![](/assets/images/posts/tips-and-tricks-process-design/fe1435a674aba314bca4c0d3f82c1e3a.png)

For example it would be good to have an Id in addition for the Workflow name.
Also we noticed, when we looked through the application that not all
Applications have a person as a supervisor but use custom information like
“Backoffice”.

## Updating the form and workflow

We need to add an option to display the additional information and provide a way
to define a responsible in this case. Let’s add some fields to reflect the new
requirements.

![](/assets/images/posts/tips-and-tricks-process-design/4e3483580dbf3b8efad13afb1ed6079e.png)

And add a description to the responsible field so that we know why this is
special

![](/assets/images/posts/tips-and-tricks-process-design/649098c7fdb4f1e24f6cb4204b696b26.png)

In addition, we change the name of the paths from “Sample path” to something
else and add an action to it.

![](/assets/images/posts/tips-and-tricks-process-design/c83aec0a3bac5d6a75ad8f3df2e09ff7.png)

![](/assets/images/posts/tips-and-tricks-process-design/480a347c752f8c50f4a7cb853308b8a4.png)

## Adding a report

After doing this, I noticed that I don’t have an option to view the dry run
data. But this is only because I haven’t yet added a report, which can easily be
fixed

![](/assets/images/posts/tips-and-tricks-process-design/13d510b21a6cb57954a768fd352d35a6.png)

![](/assets/images/posts/tips-and-tricks-process-design/df34cb6365a81f0ca739a4dff8046f33.png)

Now we can enter the additional information and start the imaginary sub
workflows.

![](/assets/images/posts/tips-and-tricks-process-design/b1cd6e530e57dbffb08e880ab5755738.png)

## Sending the prototype to IT for finalization

Once everything is ok it can be published. This is a one-way action for sending
the prototype over to the IT where it can be finalized.

![](/assets/images/posts/tips-and-tricks-process-design/24dbf27b4a521abe1ed2cb606e6d34f4.png)

The IT can continue working on the prototype, no information was lost. Every
field, step, report description, documentation and so on was transferred.

![](/assets/images/posts/tips-and-tricks-process-design/8fe1f72ed5ab3e59aaa3b12c7b91be30.png)

The IT can even take a look at the dry-run data.

![](/assets/images/posts/tips-and-tricks-process-design/ed75a9cbd9e0d0cb6680588367b376b2.png)

## Impressions

The Designer Desk allows any end user to create a prototype for there ideas.
They can design the workflow and form, test their idea, and verify it, change it
until they are satisfied. In addition, they can add some action with a
description what should happen, without bothering to make it actually work or
fear to break anything. They can just describe something like “send attachment
with name X via mail to the responsible A and attachment with name Y to
responsible B” and let the IT see how to implement this. This is great for both
sides the end user can test/change to their hearts content and the IT gets
finally useful requirements. What’s even better is that all information and
dry-run data is accessible to the IT. This is clearly a win-win situation and I
like it a lot. To summarize the benefits:

-   End users get a sandbox where they can create/change/test a prototype to
    their hearts content.

-   The IT can focus on the implementation using the provided description and
    test data.

-   InstantChange™ technology is applied here too.

If you don't know what InstantChange™ is, here is a five minute video:

[The WEBCON Way \| What is InstantChange & why is it a game-changer in business application delivery?](https://www.youtube.com/watch?v=wAwxyiHI1yw)

