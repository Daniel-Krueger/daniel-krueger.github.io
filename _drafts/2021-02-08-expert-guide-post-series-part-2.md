---
title: "Building Business Processes with WEBCON BPS – an expert guide: Part 2 - Prototype implementation via Designer Desk"
categories:
  - Private
  - WEBCON BPS
tags:
  - Designer Desk 
excerpt:
    A multi-part blog post to share expert information based on the creation of a business process.
---

# User Assignments: Designing a prototype

## Designer Desk

Prior to WEBCON BPS 2021 I would have used the Designer Studio to create a
prototype together with the process owner, the person who’s requesting this. With
the new version I would definitely choose the Designer Desk as a tool. The Designer Desk allows every
user to create a prototype of their process which they have in mind. It contains
only as much  information as needed for the prototype creation, which can be
tested, and upon completion it can be send to the IT department to create a
process from it. I won’t take a screenshot of every step since it’s quite self-explaining, 
and it’s shown in the official release demo starting
[here](https://youtu.be/K9zX5YCqE_M?t=198).

## Creating the workflow

Lets start with the initial workflow to get all assignments of a user. We can
define a step name and provide a description what should happen in this step.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/9092de44ddde237ad18da9ecc2aa413d.png"
alt="Describing a path" caption="Describing a path" %}

The workflow for identifying all workflows in which a user is involved could
look like this.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/2aa80e53cb00ebfce08b0a344cadb2de.png"
alt="Design of user assignments workflow" caption="Design of user assignments
workflow" %}

## Creating the form

Once done, we will move to the form, define fields, and provide information for
the field. Why do we need it and what should happen with it.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/d6c37b764a739f716dfcfffb8a81f425.png"
alt="Providing a label and description for a field" caption="Providing a label
and description for a field" %}

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/6b89fda0613ebb419a3c4cbe1af528d1.png"
alt="How the label and description are displayed" caption="How the label and
description are displayed" %}

Besides the user we need a table (item list), adding fields is done by drag&
drop the fields from the left navigation onto the plus sign.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/3089a8fd71e09e70589780b5d0cf8958.png"
alt="Added item list and columns" caption="Added item list and columns" %}

In the field matrix we are defining when each field will be visible, whether
it’s read only or required.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/6a909a1d1429d65a226eefb2838938ab.png"
alt="Defining in which steps which field is visible" caption="Defining in which
steps which field is visible" %}

## Performing a test run

With these settings we can use the prototype for a test run. We can select the
user and see the description of the first step.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/f7c5adc0abff5aaa40777274ac588e43.png"
alt="User selected and starting new instance" caption="User selected and
starting new instance" %}

While going through the workflow step by step we can provide other values and identify any
shortcomings.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/fe1435a674aba314bca4c0d3f82c1e3a.png"
alt="Entering data in item list" caption="Entering data in item list" %}

For example, we might decide, that it would be good to have an Id in addition to the Workflow name.
When we looked through our existing applications for example data, we noticed that not all
of them have a person as a supervisor. Some use custom information like “Backoffice”.

## Updating the form and workflow

We therefore need to add an option to display this additional information and provide a way
to define a responsible in this case. Let’s add some fields to reflect the new
requirements.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/4e3483580dbf3b8efad13afb1ed6079e.png"
alt="Adding additional fields after the test run" caption="Adding additional
fields after the test run" %}

And add a description to the responsible field so that we know why this is
special.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/649098c7fdb4f1e24f6cb4204b696b26.png"
alt="Providing details for an item list column" caption="Providing details for
an item list column" %}

In addition, we change the name of the paths from “Sample path” to something
else and add an action to it.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/c83aec0a3bac5d6a75ad8f3df2e09ff7.png"
alt="Defining the path" caption="Defining the path" %}

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/480a347c752f8c50f4a7cb853308b8a4.png"
alt="Defining what actions should be executed on a path" caption="Defining what
actions should be executed on a path" %}

## Adding a report

After doing this, I noticed that I don’t have an option to view the test run
data. But this is only because I haven’t yet added a report, which can easily be
fixed, by adding one.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/13d510b21a6cb57954a768fd352d35a6.png"
alt="Option to add a report" caption="Option to add a report" %}

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/df34cb6365a81f0ca739a4dff8046f33.png"
alt="Test run data is displayed in the report" caption="Test run data is
displayed in the report" %}

Now we can enter the additional information and start the imaginary sub
workflows.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/b1cd6e530e57dbffb08e880ab5755738.png"
alt="Opened test run workflow from report" caption="Opened test run workflow
from report" %}

## Sending the prototype to IT for finalization

Once everything is ok it can be published. This is a one-way action for sending
the prototype over to the IT where it can be finalized.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/24dbf27b4a521abe1ed2cb606e6d34f4.png"
alt="Publishing the prototype" caption="Publishing the prototype" %}

The IT can continue working on the prototype, no information was lost. Every
field, step, report description, documentation and so on was transferred.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/8fe1f72ed5ab3e59aaa3b12c7b91be30.png"
alt="Verification which elements are published" caption="Verification which
elements are published" %}

The IT can even take a look at the test-run data.

{% include figure
image_path="/assets/images/posts/expert-guide-post-series/ed75a9cbd9e0d0cb6680588367b376b2.png"
alt="Test run workflow instance are available even after publishing"
caption="Test run workflow instance are available even after publishing" %}

## Impressions

The Designer Desk allows any end user to create a prototype based on their ideas.
They can design the workflow and form, test the created application, verify it, change it
until they are satisfied with the result. In addition, they can add a description what should
happen, without bothering to make it actually work or fear to break anything.
They can just describe something like “send attachment with name X via mail to
the supervisor of A and attachment with name Y to supervisor of supervisor of B”
and let the IT see how to implement this. This is great for both sides. The end
user can test and adapt to their hearts content and the IT finally gets precisely described
requirements. What’s even better all information and test-run data is
accessible to the IT. This is clearly a win-win situation and I like it a lot.
To summarize the benefits:

-   End users get a sandbox where they can create/change/test a prototype to
    their hearts content.
-   The IT can focus on the implementation using the provided description and
    test data.
-   InstantChange™ technology is applied here too.

If you don't know what InstantChange™ is, here is a five minute video:

{% include video id="wAwxyiHI1yw" provider="youtube" %}

# Continuation

In the next part we will take the prototype and and enhance it to get all workflows
for which a active tasks exists.

{% include expert-guide-parts %}