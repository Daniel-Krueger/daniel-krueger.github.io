---
regenerate: true
title: "WEBCON BPS 2025 R2 Change log excerpt and thoughts"
categories:
  - WEBCON BPS 
tags:    
excerpt:
    This is an excerpt of the change log and my thoughts on it.
bpsVersion: 2025.2.1.42
---

# Remark
When I read through the change log I have copied over a few excerpts, these are displayed as quotes in this post. Anything not in quotes are my personal thoughts. The selection criteria for these excerpts from the change log are:
- Will the changes have a direct impact on my work
- Do I have any thoughts about the change
- Is there a 'hidden' gem, these are marked with a `*` in the title

I won't cover the new AI features but highlight some information about licenses/tokens here. There's already a knowledge base post from WEBCON about the new features.
[New AI Solutions in WEBCON BPS](https://community.webcon.com/posts/post/new-ai-solutions-in-webcon-bps/543/3)

The changes to the dashboard are another important aspect. We need to verify how these look, because of the change to a twelve-column grid.

In general, there have been a lot of bug fixes/improvements to reports, SOLR, translations and import/export.

While it's stated that the passing of parameters in automation has been fixed to work in all cases, it's was also mentioned, that this required to rewrite the logic completely. Let's cross our fingers, that this doesn't add any new issues.

Regarding issues, it's a great feeling to recognize the reported issues in the 'bug fix' section. :)

# Further information of new features
## Knowledge base
- [Application hub](https://community.webcon.com/posts/post/application-hub/544/3)
- [Export and import of global automations](https://community.webcon.com/posts/post/export-and-import-of-global-automations/537/3)
- [New AI solutions in WEBCON BPS](https://community.webcon.com/posts/post/new-ai-solutions-in-webcon-bps/543/3)
- [User Defined API (API Definition)](https://community.webcon.com/posts/post/user-defined-api-api-definition/545/3)
- [Workflow phases and actors - update](https://community.webcon.com/posts/post/workflow-phases-and-actors/538/3)


## YouTube
- [AI Business Rules](https://www.youtube.com/watch?v=V4XGL27avoU)
- [AI process builder](https://www.youtube.com/watch?v=gO6Wc6EQhZ0)
- [Application hub](https://www.youtube.com/watch?v=OstBYswdQ3w)
- [Automation Export](https://www.youtube.com/watch?v=Ouaw2OO3Pwc)
- [Dashboard design](https://www.youtube.com/watch?v=Zy6oAfKH7IA)
- [New Report form field](https://www.youtube.com/watch?v=3xTTQml9xiE)
  
# Import
## Deployment mode defaults to false
If a process with active deployment mode (email redirection) is imported then the value is deselected by default. If the deployment mode should be active, you must change this yourself.


## * Import with a default attachment/archive database
An option was added to configure a default attachment and archive database. 
This is actually a great addition, as we cannot change the database after an attachment was added and it may happen, that you forget to change the database from main to the correct one.


## Export /Import of Global automations

We have now an option to export/import global automations under specific circumstances:

> it will not be possible to create a file with a global automation definition if it contains references to another Global automation, Global business rules, Global constants, Data sources or SDK plugins. In this case a message will be displayed and the exported automation will need to be reconfigured.
>
> If there are references to Connections in the automation definition, any sensitive data present in their configuration, such as user logins and passwords, secrets, etc. will be removed during export.

I was wondering what the benefit it until I read:

> It should be noted that it is possible to import global automation configurations within the **same major versions** of the system, **or from a lower to a higher version** (provided that the configuration structure of the elements that make up the imported automation has not been modified).

Maybe the automations are a started and the other global elements like fields, rules constants will be following.


# AI
## AI Providers
 DISCLAIMER!
>AI features are based n solutions from third parties, **OpenAI Ireland Ltd** or **Google Cloud Poland Sp. z o.o.** (AI providers). Using AI functionalities is tantamount to accepting the current terms of cooperation with AI providers, which are outlined in the EULA when installing the new version and/or in the WEBCON EULA.

## Tokens
From the official mail communication
>Along with the new license agreement provisions, we are introducing a new pricing item – the AI PRIME package. If you have any questions regarding the offer, please contact your account manager.

> The AI PRIME package. This is only available as part of a subscription and enables the use of up to 6.4 million AI tokens per year. One token allows, for example, the transcription of a 30-second voice memo or the summary of an A4 page of text. The long-awaited function for creating prototypes using AI consumes an average of 5-8 token

>But that’s not all. EVERY subscription client who updates their environment to version 2025 R2 will receive access to the AI FIRST EDITION package – including 50,000 free tokens, which can be used until May 5, 2026.


> System administrators can monitor the usage of AI Tokens through a report in the Admin panel on Portal under User management → Users and licenses → AI Token Settlements. Detailed information concerning AI Token pricing is available in the license price guide.

## Availability
The server must be able to connect to https://aiservices.webconapps.com

> AI models are accessed in the moment a feature is invoked (e.g. an action is triggered) by using the available Proxy. Due to this, the system environment must have constant access to https://aiservices.webconapps.com

# Portal
## Flexible dashboard
 Gone are the time where we had one row and up to three columns. :)

 > A design grid, visible only in the Edit mode while dragging a widget, has been applied to the dashboard space. The grid's width consists of 12 columns, while its height is not fixed and is determined by the number of rows. It organizes the dashboard space and streamlines its design. Thanks to its feature that automatically moves widgets upward (as close to the upper edge as possible), it enables optimal utilization of available space.

> Note: a twelve-column dashboard view automatically adapts to the screen width. For narrower screens, widgets adjust to a six-column grid, and for very narrow screens (e.g., on mobile phones), to a one-column grid. As a result, users can edit widget locations only in the twelve-column view, which is available only for screen resolutions above 1024 px.

We need to review the dashboards:

>Note: updating to the newest version may change the size and appearance of 
dashboard components, which may require modifications to their configuration. This is 
particularly relevant in scenarios where the dashboard contains an HTML code widget 
with unconventional code. 

## Way to add widgets was modified

In combination with the redesigned dashboard, the way widgets are added was modified.  They are now always visible on the right. But this is something you will notice anyway. :)

## Changed styling options

The styling options of some widgets have been modified, there are two many to list them. The description starts at page 19.

## New Separator widget

> A new widget, Separator, has been added. This widget allows users to divide the dashboard grid space with a horizontal line that spans the full width of the grid. Once embedded, it serves as the upper edge to which widgets located below it are automatically moved.


## Embedded element is gone 
The widget was replaced by HTML Code widget during the update.

## Access authorization
The new `access authorization` feature, prevented displaying the secured values on a report. We can now authenticate on the portal and view the values.


## Shared views

Shared views are now recognizable by an icon.

## * Private views for KPI reports
It's now possible to create private views.

## * Report definition improvement
Two bugs have been fixed, which will make it possible to change form types, add steps and workflows, without loosing all process calculated columns.

This is great, I don't know how often I had to reconfigure these, when I added a new form type.

## * Navigation grid elements work as a button
Yeah, there's no longer a need to click on the button to navigate and the button itself can be hidden. :)

# Designer Studio
## Aligning paths
It took a while, but it's finally possible to align the paths (again). :)

![](/assets/images/posts/2025-05-06-WEBCON-BPS-2025-R2-Changelog/2025-05-08-17-14-10.png)

## Improved rules
This is great. :)

> Additional placeholders have been introduced for the CONCAT and IS IN functions, making it easier to insert new values anywhere in an expression while editing it. It has also been made possible to change the orientation of expressions  created with these functions – the user can now switch between vertical and horizontal layout of the expression.

![](/assets/images/posts/2025-05-06-WEBCON-BPS-2025-R2-Changelog/2025-05-13-21-30-22.png)

# Form
## Reports embedded in forms

>The Data presentation form field group has been expanded to include a new form field, Report, which allows users to create independent reports and display them as a table, chart, or calendar on the form

I'm not really hyped about this one, because I already did something like this in the past using an iFrame rendering. The report data was filtered using the URL filter option. This was something I wanted to create a blog post about. I have to see, whether it still makes sense. Maybe, because there will be quite a few out there, who won't be install 2025 R2 any time soon.


## Compact instance history

I have to admit, I don't understand the impact. This is something I need to check for myself in a real-world scenario. 

I have seen the screenshots with the compact history, but it would have been nice to see a direct comparison. Nevertheless, this is good to know:

> The full (regular) history can still be accessed by **Administrators, Auditors, users with Access to all instances (on process and workflow levels)**, as well as users with **privileges granted via actions**.
> Users with full access will see all steps and instance versions on the simplified view.
> The Add privileges and Remove privileges action can now manage access to the instance history – however, to add privileges to the history, the user must first have privileges to the instance in question.

The last one makes you wonder, why the read privilege isn't granted along with the privilege to view the full history.




# System

## User defined APIs
This will be a simpler way to integrate WEBCON BPS into external systems. While we already had the Public API to start and move any kind of workflow, it required deep knowledge on how everything worked. With the new `User defined APIs` it shall be way easier. I haven't seen it but I assume, that the instead of field Guids, we will have the names of the fields.

>Using the provided API, the external application will be able to execute the specified automation, retrieve and filter values from any data source, and retrieve the values of a workflow instance.

I'm wondering what kind of `automation` these are. 


It seems that these can also be called directly from the portal by the currently logged in user

>In the case of an API definition configured in the context of a process, two authentication methods are available, i.e., API application authentication (OAuth2), using a token, as for a public API, and User authentication in BPS Portal (Cookie).

## WEBCON SaaS can no longer connect to SharePoint 2013
> In WEBCONAPPS-SaaS installations, the ability to configure connections to SharePoint 2013 has been hidden – only connections to SharePoint Online and SharePoint 2016/2019 remain available. The change is due to the lack of support for older versions of SharePoint.


## Application hub / Alternative application address

This is something we have waited a long time for. We can create a dedicated URL for a single application. If one uses this URL the other applications won't be displayed

> Alternative address may be defined as subdomain (e.g. https://myapplication.webcon.com), but will require an additional certificate. 

Of course this requires some infrastructure changes:

> In order to ensure that the alternative address works for the application, additional network infrastructure configuration is necessary (DNS Alias, IIS, firewall). The application alternative address functionality can be used only in environments where no Portal virtual directory (RunningAddress) was defined during installation.

## Workflow phases /actors available as variables

The new phases and actors introduced in 2025 R1 are now available as variables and on the report.

## Statistical data send to WEBCON

You could say, that it is long due, that WEBCON also wants to collect statistical data to analyze how customers use the system.
This can be deactivated in the global parameters, except for the Freemium Edition:
> Note: this functionality cannot be disabled for installations based on the Freemium Edition license


Unlike others vendors, there shall be a way to actually view the data, even if it is in JSON format. I'm interested in it too. :)


## * Extended `ExtensionAttribute` to groups

> Added ExtensionAttribute support for synchronized groups in AD, Entra ID, LDAP synchronizations

## * Custom Temp path for WEBCON Workflow Service

> Added ability to set custom WebCon Workflow Service temporary file path via configuration file or environment variables. Additionally, fixed bug causing appsettings.user.json and otlpsettings.user.json files to not be included by the  service, which previously led to inconsistency with portal configuration.


## * Choice fields are extended to 4000 characters
This is really great, especially for multi value fields. We have faced some issues because of this because when we had a choice field referencing a dictionary:
1. We used the GUID as the id
2. Customers entered long titles 
3. They choose a lot of values

> Increased the character limit in choice fields and columns from 1000 to 4000 characters. Due to this, the upgrade may take more time. Depending on the amount of data collected in the database, executing the update script may take from several to several dozen minutes.

## Last workflow step is always marked as completed

>In the form information panel, in the section displaying the current workflow step 
and the steps already completed, the last workflow step will always be visually marked as completed.

I'm wondering what the last workflow step is, if you have a finished positive and negative step. Do you need to move the finished step to the bottom position in this case?

# Name changes
## Free WEBCON BPS is now called Freemium edition 

>Standardized the name for the free WEBCON BPS license. It is now consistently referred to as **Freemium Edition**. As a result, this new name replaces other variants – Freemium, Express, and Express Edition – across the platform, including the WEBCON BPS installer, Designer Studio, and Portal. This change applies to all language versions of the platform

## Usage of Microsoft Entra

>Changed the names of selected Authentication types available in the MSSQL database connection configuration. The change consisted in replacing the phrase "Active Directory" with "Microsoft Entra".

It takes some time, until all references are updated. I wonder whether the documentation and screenshots have already been updated. ;)

## Start a ~~sub~~workflow
The **sub** part was removed from the actions to start a workflow  `Start a subworkflow (sql)`. 

## My tasks are now Active tasks
I thought this was already the case, but maybe it was only on the landing page and not in the widget.

> Aligned task counter names across Portal. As a result, the My phrase has been 
replaced with Active.

## Version numbering was changed
I wonder who noticed it but silently the version numbering was changed. It was always Majorversion.1.Rx.Buildnumber now it's  Majorversion.Rx.1.Buildnumber.


