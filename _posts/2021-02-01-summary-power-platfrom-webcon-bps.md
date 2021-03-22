---
title: "Building Business Process Solutions: with MS Power Platform & WEBCON BPS (without Cutting Corners!) (ongoing)"
categories:
  - Private
  - WEBCON BPS
tags:
  - Power Platform
  - Definitions
excerpt:
    A table of contents 
note: https://youtu.be/4TSYSO1hVC0?t=4099
---


# Introduction
This post is my table of contents of the five hour workshop
[Building Business Process Solutions: with MS Power Platform & WEBCON BPS (without Cutting Corners!)](https://www.youtube.com/watch?v=4TSYSO1hVC0). 

Speakers:
- [Mike Fitzmaurice](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi9i5SitY3vAhUH_qQKHSEjBUsQFjALegQIBhAD&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fmikefitzmaurice&usg=AOvVaw2EixABzoWFsiDwzhOJV6lt), Chief Evangelist and VP from WEBCON
- [Christina Wheeler](https://mvp.microsoft.com/en-us/PublicProfile/5002830), Principal Solution Architect for Canviz Consulting delivered on ECS Learning Day 2020.

I started watching it because I have no idea about the current Power Platform options. A few years ago, I had a short look and what I saw didn't suit my needs. Now the platform has evolved, and I should learn what I can and especially what I can not do. I'm quite confident about my skills with WEBCON BPS but so I know the limitations there. If the question arises, I should know what tool I should use for which purpose.

It will take some sessions to go through the workshop.

# Session 1 - 2021-01-15
## Summary
This session covered minute 0:00 to 0:30

## Video table of contents
- [What to expect of this workshop](https://youtu.be/4TSYSO1hVC0?t=886)
- [Disclosure of involvements](https://youtu.be/4TSYSO1hVC0?t=983)
- Christina states that implementing business processes using [Power Platform is a little painful](https://youtu.be/4TSYSO1hVC0?t=1004), this is not the case for automation though.
- [Agenda](https://youtu.be/4TSYSO1hVC0?t=1229)
- [What is a Business process](https://youtu.be/4TSYSO1hVC0?t=1355). There's a difference between automation, workflow and process and Mike explains it with nice real world examples. Even if you are neither interested in the Power Platform nor WEBCON BPS you should watch this. 

# Session 2 - 2021-02-02
## Summary
What stuck in my mind during this session were the following "ideas"
1. Automation is used for scratching an [itch](https://youtu.be/4TSYSO1hVC0?t=2415) while processes are used to cure a pain.
2. If you only implement a well working solution the users will soon get used to it. The old problems will be forgotten and it may be questioned what good you are actually doing. This can easily be solved by adding metrics to a process especially if you have some metrics from before the change. Armoured with this information oneself can [proof his value](https://youtu.be/4TSYSO1hVC0?t=2492). So, if you create a solution you should add measure to proof the benefits.
   
## Video table of contents
- [Automation](https://youtu.be/4TSYSO1hVC0?t=1846) elimination of manual steps.
- [Workflow](https://youtu.be/4TSYSO1hVC0?t=1876), define which steps need to happen.
- [Process](https://youtu.be/4TSYSO1hVC0?t=2056), what must be achieved and how. This includes one or multiple workflows, tasks, assets which are needed to fulfil the goals. The goals are matched against measured by metrics, against which the workflows are compared. 
- [Tasks are more than approvals](https://youtu.be/4TSYSO1hVC0?t=2540), which is a differentiation between automation and processes.
- [Design issues when building business process applications](https://youtu.be/4TSYSO1hVC0?t=2731). Different approaches how to create a process, from the perspective of Developer, Power User and Process People. 
- [Workflow design](https://youtu.be/4TSYSO1hVC0?t=2881), how workflows diagrams can be created/read. 
- [Definition of linear (sequential) workflows](https://youtu.be/4TSYSO1hVC0?t=2959) 
- [Definition of state machine workflows](https://youtu.be/4TSYSO1hVC0?t=3089)
- [State machine logic explained](https://youtu.be/4TSYSO1hVC0?t=3270), using a pull chain light switch. If you have no idea, what a state machine is and which benefits there are, you should watch Mike's explanation. It's really simple. :)

# Session 3 - 2021-02-28
## Summary
This session is a little shorter and covers only minutes 0:56 to 1:08 of the workshop, which is due to the fact that I redo session one and two which had been previously posted in LinkedIn only. 
Even so I'm well aware of the covered topics in this session, it's good to be confirmed. If you don't have time you should at least watch how [data-centric approaches (to process development) impair auditability](https://youtu.be/4TSYSO1hVC0?t=3880)

## Video table of contents
- [Real world state machine diagram](https://youtu.be/4TSYSO1hVC0?t=3396), we see the logic without each activity at first to get a good overview of the workflow.
- [Simulation of state machine with a loop in  a sequential workflow](https://youtu.be/4TSYSO1hVC0?t=3492)
- [Sequential workflow ... using stages](https://youtu.be/4TSYSO1hVC0?t=3566)
- [Parallel actions](https://youtu.be/4TSYSO1hVC0?t=3566), are an illusion. 
- [Sub-workflows](https://youtu.be/4TSYSO1hVC0?t=3673), can be used to simulate parallel activities or to restrict access to the data on the parent workflow.
- [Data modelling](https://youtu.be/4TSYSO1hVC0?t=3800), data serves a purpose and makes up a 'case' which contains meta data and maybe documents.
- [Data-centric approaches (to process development)  impair auditability](https://youtu.be/4TSYSO1hVC0?t=3880). This is especially true if you store the data, which makes up the case, in different sources. In this case you are risking to loose your data integrity.
- [Mitigating risk of data loss](https://youtu.be/4TSYSO1hVC0?t=3998), different options for preventing the previous mentioned data integrity issues. 


# Session 4 - 2021-03-03
## Summary
This was the first session using my [video play control](https://daniels-notes.de/posts/2021/html-5-video-play-control). and it covers 1:06 to 2:08. :)

My personal highlights:
1. A process needs versioning. I always thought of versioning of a way how data was changed, so that I can debug it and not as a way to proof which data was there, when someone approved/signed something. Even so it’s kind a obvious.
2. Remembering how annoying it was to hide fields in an InfoPath form based on the state of a workflow and how easy it can be using WEBCON BPS.
3. Don't create complex PowerApps directly from a [SharePoint list](https://youtu.be/4TSYSO1hVC0?t=7244) or you may have to recreate them after some iterations.
4. Power Platform is for automation and [not for](https://youtu.be/4TSYSO1hVC0?t=5142) business processes. There are to many workarounds required (at this point in time) 
5. Model-driven apps share the same idea with WEBCON BPS on how data impacts form elements.

## Video table of contents
- [Digital signatures are a tricky issue](https://youtu.be/4TSYSO1hVC0?t=4099) Signing/Approving should be done at the end, so that everyone so the entered data. In this case you don't need keep the previous data instances, to verify when some signed and which information have been visible. 
- [Process centric UI](https://youtu.be/4TSYSO1hVC0?t=4263) The form should adapt to the step of the process. The form needs to check which fields should be visible under which circumstances this has been done with creating a lot of rules. The alternative is to create a parent workflow and task workflow with the necessary data. If there are changes to the data it's written back to the parent workflow. The best option though if the form is aware of the workflow steps, so that you can define which fields are visible with a click in a given step instead of creating rules.
- [Control role-based display with permissions or rules](https://youtu.be/4TSYSO1hVC0?t=4530) The visibility gets even more difficult, if you have different roles in a process who can see different information 

- [Building a process application: Risk Management scenario](https://youtu.be/4TSYSO1hVC0?t=4674) 
- [The Power Platform way](https://youtu.be/4TSYSO1hVC0?t=4869)  Only topics are listed and followed by a break.
  - Model data & create data stores
  - Create CRUD PowerApp for editing data
  - Create flow to react to data changes
  - Possibly create utility flows to invoke with PowerApps buttons
- [Continuation with Risk Management scenario](https://youtu.be/4TSYSO1hVC0?t=5110) Now is Christina Wheeler speaking. The scenario is based on a SharePoint farm solution. 
- [The Power Platform prototype is only a half-baked solution ](https://youtu.be/4TSYSO1hVC0?t=5142) There were and are still missing features for the Risk Management scenario. If you are automating something Power Platform is great, if you need a state machine it's not. This requires workarounds.
- [Approach to the Risk Management Scenario in PowerApps](https://youtu.be/4TSYSO1hVC0?t=5276) Analysis of the process and data has been done in preparation. There will be a lot of "fakes" like in a cooking show. The cooking show shows how to do something, for example a single piece is sliced and it's continued with the prepared bowl of slices. Focus is on making use on the MS 365 licenses, so SharePoint is used as a data source. The Azure SQL Connector was not an option because it required a higher license.
- [Preparing the data sources as SharePoint list](https://youtu.be/4TSYSO1hVC0?t=5732) Some tips, best practices for creating SharePoint list in modern UI. Excel is still a valid tool for preparing and populating lists, at least for a prototype. Sometimes it's better to work in classic view, for example to define a lot of choice values per copy & paste.
- [Data sources prepared; Don't create PowerApps from SharePoint](https://youtu.be/4TSYSO1hVC0?t=7244) It's not recommended to use a PowerApp as a custom SharePoint form. The more complex the form the more bugs happened, even so it looked every looked right. A recreation of an existing PowerApp form, which evolved over time, proofed that everything works, at least in the new form. Unfortunately it took 17 hours. Don't use multiple data sources in a PowerApp created from SharePoint. Use a standalone PowerApp and connect this to SharePoint.
- [Creating standalone PowerApp options](https://youtu.be/4TSYSO1hVC0?t=7420)
Model-driven app requires the highest license for Power Platform. WEBCON BPS and Model-driven apps share a similar idea on how to create forms and process. The "phone view" PowerApp is a good approach for creating a custom form, at least if you don't need a table view. Currently it can not be changed.

# Session 5 - 2021-03-22
## Summary
This session covers the part of creating the Power App as a standalone version 2:08h to 3:00h. Since I'm new to Power App I added a lot of notes to the  different chapters. There has been a lot of information, especially for me, and a few which made it to my "What not to do" list. In my opinion this is more helpful than any "How to" list. Here are my personal highlights:
- It's important to set the screen ratio - 16:9 / 3:2 / 16:10 - depending on your customization this may break your UI. I didn't expect to see options for defining width and height by pixels of components in today's world.
- When you are selecting an option for a drop down value you can only display information for this value after selecting. It's not possible to do this while you are selecting it with the default options. It may be possible with model-driven apps.
- It took 42 minutes to create a standalone Canvas App which is connected to a SharePoint list for which two screens have been added. One for browsing the list and one for creating new items. The screens have been tweaked a little bit.

A workflow hasn't been created yet; it will be interesting to see how this will unfold.

## Video table of contents
- [Creating a PowerApp from scratch: Screens and Components ](https://youtu.be/4TSYSO1hVC0?t=7728) Overview of screens and recommendation to start on the functionality. Once this is fixed improve the UI.
- [Creating a PowerApp from scratch: Connecting to SP data sources](https://youtu.be/4TSYSO1hVC0?t=7961) If you see a Diamond icon it's a premium feature. These can be tested using the [community plan](https://powerapps.microsoft.com/en-us/communityplan/).
- [Creating a PowerApp from scratch: New item screen](https://youtu.be/4TSYSO1hVC0?t=8126) Notes:
  - If you are applying naming conventions, do it after the functionality has been achieved. If the requirements change in between, and you need to recreate stuff, it was time wasted. 
  - Edit/New form component, allows to connect to the data source.
  - There were some issues, that some things didn't work also they should have worked.
  - A lot of time is spent on the UI though, there are unnecessary/not enough fields, multi line fields are represented as single lines, the renaming of the title field in the SharePoint list is ignored.
  - What's nice is that you have to do an extra trip to change settings for component which has been automatically been added by using the data source. 
  - The formula syntax is similar to excel.
  - Make sure that you select the correct [screen size](https://youtu.be/4TSYSO1hVC0?t=8565) and ratio in the beginning. If you change it later, you may have to redo your UI. 
  - There's an auto save, not sure whether I like this.
  - A form  has a default mode, if you are creating a "New" form you need to change it to make the preview work
  - You can do stuff when [loading the App](https://youtu.be/4TSYSO1hVC0?t=9415), initializing variables and load connection for example.  You can load list data into internal collection during OnStart to improve performance.
  - Displaying [additional information](https://youtu.be/4TSYSO1hVC0?t=8855) when selecting g a lookup value can easily be done in model-driven apps, but not in Canvas App. There's an [option](https://youtu.be/4TSYSO1hVC0?t=8984) to achieve this after selecting one though.
    - Increase the width of the control, make sure not to hard code it, 
    - Increase the height of the card
    - Add connection to the source SharePoint list of the lookup field.
    - Use an html field, and use the [internal collection](https://youtu.be/4TSYSO1hVC0?t=9579)
  - ["Grouping" fields](https://youtu.be/4TSYSO1hVC0?t=9938) by creating additional cards. 
- [Switching to prepared Power App](https://youtu.be/4TSYSO1hVC0?t=10332) Up to this point we had an incomplete single new form, to create items, and browse screen to select an item. It took 42 minutes to achieve this. After switching to the prepared Power App, we have browse, new, edit, success and draft form (screens). Options to navigate to the correct screen (new/edit) 
  need to be added.

# Next session
Starting with:
- [WEBCON way to create the scenario](https://youtu.be/4TSYSO1hVC0?t=10752)


# Video table of contents
## Introduction
- [What to expect of this workshop](https://youtu.be/4TSYSO1hVC0?t=886)
- [Disclosure of involvements](https://youtu.be/4TSYSO1hVC0?t=983)
- Christina states that implementing business processes using [Power Platform is a little painful](https://youtu.be/4TSYSO1hVC0?t=1004), this is not the case for automation though.
- [Agenda](https://youtu.be/4TSYSO1hVC0?t=1229)
## What is a business process
- [What is a Business process](https://youtu.be/4TSYSO1hVC0?t=1355). 
- [Automation](https://youtu.be/4TSYSO1hVC0?t=1846) 
- [Workflow](https://youtu.be/4TSYSO1hVC0?t=1876)
- [Process](https://youtu.be/4TSYSO1hVC0?t=2056) 
- [Tasks are more than approvals](https://youtu.be/4TSYSO1hVC0?t=2540)
## Design issues when building business process applications
- [Design issues when building business process applications](https://youtu.be/4TSYSO1hVC0?t=2731)
### Workflow
- [Workflow design](https://youtu.be/4TSYSO1hVC0?t=2881)
- [Definition of linear (sequential) workflows](https://youtu.be/4TSYSO1hVC0?t=2959) 
- [Definition of state machine workflows](https://youtu.be/4TSYSO1hVC0?t=3089)
- [State machine logic explained](https://youtu.be/4TSYSO1hVC0?t=3270)
- [Real world state machine diagram](https://youtu.be/4TSYSO1hVC0?t=3396)
- [Simulation of state machine with a loop in  a sequential workflow](https://youtu.be/4TSYSO1hVC0?t=3492)
- [Sequential workflow ... using stages](https://youtu.be/4TSYSO1hVC0?t=3566)
- [Parallel actions](https://youtu.be/4TSYSO1hVC0?t=3566)
- [Sub-workflows](https://youtu.be/4TSYSO1hVC0?t=3673)
### Data
- [Data modelling](https://youtu.be/4TSYSO1hVC0?t=3800)
- [Data-centric approaches (to process development)  impair auditability](https://youtu.be/4TSYSO1hVC0?t=3880)
- [Mitigating risk of data loss](https://youtu.be/4TSYSO1hVC0?t=3998),
- [Digital signatures are a tricky issue](https://youtu.be/4TSYSO1hVC0?t=4099) 

### User experience
- [Process centric UI](https://youtu.be/4TSYSO1hVC0?t=4263) 
- [Control role-based display with permissions or rules](https://youtu.be/4TSYSO1hVC0?t=4530) 
## Walk through building a process application

- [Building a process application: Risk Management scenario](https://youtu.be/4TSYSO1hVC0?t=4674) 
### Using Power Platform
- [The Power Platform way](https://youtu.be/4TSYSO1hVC0?t=4869)  
- [Continuation with Risk Management scenario](https://youtu.be/4TSYSO1hVC0?t=5110)
- [The Power Platform prototype is only a half-baked solution ](https://youtu.be/4TSYSO1hVC0?t=5142) 
- [Approach to the Risk Management Scenario in PowerApps](https://youtu.be/4TSYSO1hVC0?t=5276)
#### Model data & create data stores
- [Preparing the data sources in SharePoint](https://youtu.be/4TSYSO1hVC0?t=5732) 
#### Create CRUD PowerApp for editing data  (ongoing)
- [Data sources prepared; Don't create PowerApps from SharePoint](https://youtu.be/4TSYSO1hVC0?t=7244) 
- [Creating standalone PowerApp options](https://youtu.be/4TSYSO1hVC0?t=7420)
- Creating a PowerApp from scratch
  - [Screens and Components ](https://youtu.be/4TSYSO1hVC0?t=7728) 
  - [Connecting to SP data sources](https://youtu.be/4TSYSO1hVC0?t=7961) 
  - [New item screen](https://youtu.be/4TSYSO1hVC0?t=8126) 
  - [Setting screen size](https://youtu.be/4TSYSO1hVC0?t=8565)
  - [Improving App performance](https://youtu.be/4TSYSO1hVC0?t=9415)
  - [Showing additional information of a drop down value](https://youtu.be/4TSYSO1hVC0?t=8984)
  - [Internal collection](https://youtu.be/4TSYSO1hVC0?t=9579)
  - ["Grouping" fields](https://youtu.be/4TSYSO1hVC0?t=9938)
- [Switching to prepared Power App](https://youtu.be/4TSYSO1hVC0?t=10332)
#### Create flow to react to data changes  (ongoing)
####  Possibly create utility flows to invoke with PowerApps buttons  (ongoing)

### Using WEBCON BPS (ongoing)
## Diagramming & documentation (ongoing)
## User assistance (ongoing)
## Integrating with external data (ongoing)
## Compliance & Governance (ongoing)
## Deployment & change management (ongoing)
## Conclusions and final advice (ongoing)

