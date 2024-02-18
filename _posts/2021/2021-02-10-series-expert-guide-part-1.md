---
title: "Building Business Processes with WEBCON BPS – an expert guide: Part 1 - Introduction and Use Case"
categories:
  - Private
  - WEBCON BPS
  - Series   
tags:
  - Governance
excerpt:
    A multi-part blog post to share expert information based on the creation of a business process.
bpsVersion: 2021.1.1.46    
---

# Disclaimer

This series won’t be a tutorial for how things are done in WEBCON BPS but how
these are done right. If you are unfamiliar with WEBCON BPS, you should do the
following, before continuing with part 3:

-   Watch some of the [tutorial videos](/webcon_tutorial_videos/)
-   Create one workflow on your own. If you need help just contact me either via
    the comments or LinkedIn

If you are wondering how you could create a workflow on your own,
[here’s](/how_to_test_webcon_bps/) an overview of the options you have.

Once you have a little experience, you are welcome to come back and read on. :)

# Introduction

If you are familiar whit WEBCON BPS, what could be in it for you reading through
this? Because here you find more than just a “how-to” instruction. In this blog I am sharing deep insights into the process of building business applications with WEBCON BPS: I’m providing tips & tricks by creating a process from scratch and
explaining why I did it in a particular way. The main reason I’m doing things in
a certain way is influenced by the fact that I have a professional developer
background. I’m looking out for maintainability, transparency and traceability.
The only sure thing is, that everything changes. This applies even more to
processes, so slight changes in the beginning will help to prevent mistakes in
the future.

# Use case

We recently had the situation that an employee’s user account had been
deactivated overnight. Of course, the user was involved in processes and had
some open tasks. This gave us some headache because WEBCON BPS doesn’t allow
to assign new tasks to deactivated users. Which how you want a solution to work,
but in this situation was unfortunate for us. We had to do some housekeeping, 
which means that we had to
delegate the tasks, and verify in which processes he was involved and may
receive a task because of this. We were lucky, there weren’t many, but we
realized that we would need a better way for this.

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

{% include figure
image_path="/assets/images/posts/series-expert-guide/f70d8b427fc50f0034c225c80e699b75.png"
alt="Supervisor of an application" caption="Supervisor of an application" %}

If all supervisors report that the same person can replace him, this is fine. In
this case we can use the

Administration Tools\\Permission migration tool to change all tasks, so we only
need to manually clean up the fields. Otherwise, the tasks need to be delegated
manually too.

{% include figure
image_path="/assets/images/posts/series-expert-guide/efeef154dbc76c261946ce2d23246de8.png"
alt="Changing permissions for a user" caption="Changing permissions for a user"
%}

If you are wondering why this should be done manually instead of a search &
replace on database level than there’s a simple reason for this. One big benefit
of WEBCON BPS is that every change to a workflow gets logged. Doing a search &
replace on database level would circumvent this and this is a no go.

What are the requirements:
1.  We need to fetch those workflows where a certain person is involved in, based on the requirements named above.
2.  We need to get the application of these workflows to get the supervisor.
3.  We need to inform all supervisor about the identified workflows.
4.  The supervisors need an option to track which workflows they already
    changed.

The requirements one and two will be handled by a parent process while three and
four will be fulfilled with a sub workflow.

{% include series-expert-guide %}

# Download
You can download the application from [here](https://github.com/cosmoconsult/webconbps/tree/main/Applications/UserAssignments).