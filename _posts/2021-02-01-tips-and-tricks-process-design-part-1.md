---
title: "Tips & tricks while designing a process part 1 - Introduction and Use Case"
categories:
  - Private
  - WEBCON BPS
tags:
  -   
excerpt:
    A multipart blog post about providing tips & tricks while designing a WEBCON BPS process. 
---

# Introduction

There are sufficient posts and videos out there if you are only looking for an
introduction into WEBCON BPS and how you can design processes. For example:
[DEMO \| Business Application in 7 Minutes with WEBCON BPS](https://www.youtube.com/watch?v=U7fYjI71XtM&list=PL5F22BFB60089115D&index=28)



So, what could be in it for you reading through this? I’m providing tips &
tricks by creating a process from scratch and explaining why I did it in a
particular way. The main reason I’m doing things in a particular way is, that my
professional background is that of a developer, who likes transparency,
traceability above all. Before I started with WEBCBON BPS in 2018 and left
behind my time as a SharePoint application developer, which succeeded my career
as a NAV developer.

# Use case

We recently had the situation that an employee’s user account had been
deactivated overnight. Of course, the user was involved in processes and had
some open tasks. This provided us some headache because WEBCON BPS doesn’t allow
to assign new tasks to deactivated users. Which is correct in itself, but
unfortunate for us. We had to clean up, which means that we had to delegate the
tasks, and check in which processes he was involved and may receive a task
because of this. We were lucky, there weren’t many, but we realized that we
would need a better way for this.

We needed an option to get the following information for a given person.

-   Get all workflows with active tasks.
-   Get all workflows in which he is involved, read is assigned to a user field.
-   Get all workflows in which he may be indirectly involved. This means, that
    he is a member of a group which was assigned to a user field.

We only need this information for active workflows, finished workflow won’t fail
because a user is no longer available.

What should we do, once we know which workflows may cause an error? We need to
verify which role he has in each process and who can replace him. Who could do
this, who knows the process well enough to decide on this? This should be the
supervisor of a application.
{% include figure image_path="/assets/images/posts/tips-and-tricks-process-design/f70d8b427fc50f0034c225c80e699b75.png" alt="Supervisor of an application" caption="Supervisor of an application" %}

If all supervisors report that the same person can replace him, this is fine. In
this case we can use the

Administration Tools\\Permission migration tool to change all tasks, so we only
need to manually clean up the fields. Otherwise, the tasks need to be delegated
manually too.
{% include figure image_path="/assets/images/posts/tips-and-tricks-process-design/efeef154dbc76c261946ce2d23246de8.png" alt="Changing permissions for a user" caption="Changing permissions for a user" %}
If you are wondering why this should be done manually instead of a search &
replace on database level than there’s a simple reason for this. One big benefit
of WEBCON BPS is that every change to a workflow gets logged. Doing a search &
replace on database level would circumvent this and this is a no go.

What are the requirements:

1.   We need to fetch the workflows where a person is involved based on the above
    requirements.
2.   We need to get the application of these workflows to get the supervisor.
3.   We need to inform all supervisor about the identified workflows.
4.   The supervisors need an option to track which workflows they already
    changed.

The requirements one and two will be handled by a parent process while three and four will be fulfilled with a subworkflow.

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
