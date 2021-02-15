---
title: "How to populate an item list from an XML file"
categories:
  - GitHub Project
  - Private
  - WEBCON BPS  
tags:
  - Custom Action
  - SDK
excerpt:
    This post describes an SDK Custom Action which populates an item list with data read from an XML attachment.
---

# Overview

This post describes an SDK Custom Action which populates an item list with data
read from an XML attachment. If you are interested in one of the following
topics read on:

-   Creating a plugin configuration with a grid
-   Reading an attachment
-   Populating an item list
-   Logging to admin view in history
-   Tips for Debugging and VS build events

# Initial Situation

Even today you will find yourself in a situation where you receive a plain xml
file which needs to be processed. Let’s assume that it contains invoice
information. The xml file will be part of a mail along with other attachments.
Someone from purchase receives this “invoice” and starts the invoice workflow
from Outlook add-in by dragging the mail on the start tile (1). In the new
workflow he drags the attachments from the mail on the attachment control in the
browser (2). The result will be a new invoice instance with prepopulated fields
(3), the attachments (4) and the e-mail (5).

{% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/bcdb9e2ed0e91c248be3e5b79c2da33e.png"
alt="Starting a workflow from Outlook" caption="Starting a workflow from
Outlook" %}

In the next step he selects the Xml file (1) with the invoice data and send the
workflow to the next person. During the transition to the next person the Xml
data should be read into an item list (2).

{% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/dc3a1a4c79d4291e1b88ffd2972738cd.png"
alt="Item list is populated from selected XML file" caption="Item list is
populated from selected XML file" %} {% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/2636ad5715b11a613a4033340c7730b0.png"
alt="Source xml" caption="Source xml" %}

# Workflow artifacts

## Attachment picker

The attachment picker uses a simple sql query fetching all xml attachments of
the current workflow instance (1) and defines an “Empty element display name” to
prevent automatic population of the field with the first available value.

{% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/757b20f2485e4eec6d9fcf5c396bc046.png"
alt="Definition of attachment picker" caption="Definition of attachment picker"
%}

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SELECT [ATT_ID] as Id, ATT_Name as Label
FROM [dbo].[WFDataAttachmets]
where ATT_WFDID = {WFD_ID}
and [ATT_IsDeleted] = 0
and [ATT_FileType] = '.xml'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

## Xml to item list action

The action used for populating the item list is called “XmltoItemList”.

{% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/ca6aae89b374927885b201d8ca0b7667.png"
alt="Custom action XMLtoItemList is selected from plugin CC_XmlToItemList"
caption="Custom action XMLtoItemList is selected from plugin CC_XmlToItemList"
%}

It expects a picker which identifies the XML file which should be used (1). The
structure of each xml will be different. Therefore, the custom action uses an
XPath to select the rows which should be processed (2). This allows a high
flexibility. The nodes of each matched row will be processed to create new rows
in the selected item list (3). The values are retrieved from the inner text of
the xml node and note from attributes, which don’t exist in the used sample.xml.
For each node a type must be defined, so that the custom action transforms the
xml text to a corresponding WEBCON BPS value. All values in the configuration
taken from the Objects register and **not** from the Values register.

{% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/cc053df6ca1fec241c5e4e8d73bc158c.png"
alt="Configuration of the custom action" caption="Configuration of the custom
action" %}

## Workflow history

In the workflow history the normal user view does not contain any additional
information. Every created row is visible to the user anyway. But if you are
switching to the admin view, you will get additional details.

{% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/18ed01a30688e0c234c45c2910bc26e1.png"
alt="In admin view additional details are visible" caption="In admin view
additional details are visible" %}

# VS Solution information

## Logging

The logging is done using a simple StringWriter class which uses manual
indentation.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
logger.Indent();
logger.Log($"Populating item list");
logger.Indent();
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The log messages are displayed in admin view only because the log string is
assigned to the LogMessage property

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
args.LogMessage = logger.ToString();
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

## Build event usage

The solution makes use of the pre-build and post-build event. The pre-build
event uses a PS script to increase the revision number of the solution. The post
build event creates a .zip package and copies it to the development BPS server.

{% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/63a14cec193c40054cd36d30f2563926.png"
alt="Build output where the field has been copied to" caption="Build output
where the field has been copied to" %}

The reason for this is, that no development takes place on the BPS server.
Therefore, the combination of the pre- and post-build events will allow me to
“immediately” upload a new version of the plugin package in BPS. Yes, I still
use the server side BPS Studio.

## Debugging

Debugging a solution requires to attach Visual Studio to the BPS Portal process.
If you upload you plugin multiple times without recycling the process you will
notice that you assembly has been loaded multiple times. If Visual Studio tells
you that no module information have been loaded and you are sure that you
uploaded the latest build version, a good option is to recycle the process.

{% include figure
image_path="/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/f32f99b0dcb0264322f7b713de8ecbb5.png"
alt="While debugging: Loaded modules by the process" caption="While debugging:
Loaded modules by the process" %}

**Remark:** Be sure that you inform all your colleagues if you debug the process
on the dev server. Otherwise, you may find yourself in an unwanted situation. :)
{: .notice--warning}

## Download

The custom action solution can be download from:

<https://github.com/cosmoconsult/webconbps/tree/main/SDK_Actions/CC_XmlToItemList>

## Fun facts

The post has been born from these two community questions:

[SDK configuration with a dynamic
grid](https://community.webcon.com/forum/thread/111)

[Attachment file handle with SDK](https://community.webcon.com/forum/thread/231)

All in all it took three hours:

| Actions                                     | Proof                                           |
|---------------------------------------------|-------------------------------------------------|
| Solution for custom action created at 19:49 | ![](/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/46f0c0154ed438c86753fdeab033de92.png) |
| Sample process created at 20:47             | ![](/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/25f86933fa461ea908059775836ce514.png) |
| Started Blog post                           |                                                 |
| Setting up Outlook                          |                                                 |
| Last change to sample process 21:51         | See above                                       |
| Repository created for custom action 22:48  | ![](/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/ee5cf8e30c0ce85acb8322bfd9200940.png) |
| Blog published 22:53                        | ![](/assets/images/posts/2021-02-09-custom-action-xml-to-item-list/83e3e522e78e4dc47a8956811b4debe9.png) |
