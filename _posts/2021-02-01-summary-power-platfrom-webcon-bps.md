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
This session covered minute 0:00 to 0:30

- [What to expect of this workshop](https://youtu.be/4TSYSO1hVC0?t=886)
- [Disclosure of involvements](https://youtu.be/4TSYSO1hVC0?t=983)
- Christina states that implementing business processes using [Power Platform is a little painful](https://youtu.be/4TSYSO1hVC0?t=1004), this is not the case for automation though.
- [Agenda](https://youtu.be/4TSYSO1hVC0?t=1229)
- [What is a Business process](https://youtu.be/4TSYSO1hVC0?t=1355). There's a difference between automation, workflow and process and Mike explains it with nice real world examples. Even if you are neither interested in the Power Platform nor WEBCON BPS you should watch this. 

# Session 2 - 2021-02-02

What stuck in my mind during this session were the following to "ideas"
1. Automation is used for scratching an [itch](https://youtu.be/4TSYSO1hVC0?t=2415) while processes are used to cure a pain.
2. If you only implement a well working solution the users will soon get used to it. The old problems will be forgotten and it may be questioned what good you are actually doing. This can easily be solved by adding metrics to a process especially if you have some metrics from before the change. Armoured with this information oneself can [proof his value](https://youtu.be/4TSYSO1hVC0?t=2492). So if you create a solution you should add measure to proof the benefits.
   
Table of contents
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
This session is a little shorter and covers only minutes 0:56 to 1:08 of the workshop, which is due to the fact that I redo session one and two which had been previously posted in LinkedIn only. 
Even so I'm well aware of the covered topics in this session, it's good to be confirmed. If you don't have time you should at least watch how [data-centric approaches (to process development) impair auditability](https://youtu.be/4TSYSO1hVC0?t=3880)

- [Real world state machine diagram](https://youtu.be/4TSYSO1hVC0?t=3396), we see the logic without each activity at first to get a good overview of the workflow.
- [Simulation of state machine with a loop in  a sequential workflow](https://youtu.be/4TSYSO1hVC0?t=3492)
- [Sequential workflow ... using stages](https://youtu.be/4TSYSO1hVC0?t=3566)
- [Parallel actions](https://youtu.be/4TSYSO1hVC0?t=3566), are an illusion. 
- [Sub-workflows](https://youtu.be/4TSYSO1hVC0?t=3673), can be used to simulate parallel activities or to restrict access to the data on the parent workflow.
- [Data modelling](https://youtu.be/4TSYSO1hVC0?t=3800), data serves a purpose and makes up a 'case' which contains meta data and maybe documents.
- [Data-centric approaches (to process development)  impair auditability](https://youtu.be/4TSYSO1hVC0?t=3880). This is especially true if you store the data, which makes up the case, in different sources. In this case you are risking to loose your data integrity.
- [Mitigating risk of data loss](https://youtu.be/4TSYSO1hVC0?t=3998), different options for preventing the previous mentioned data integrity issues. 


To be continued..