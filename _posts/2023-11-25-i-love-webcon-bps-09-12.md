---
regenerate: true
title: "I 💗 WEBCON BPS series: Part 09-12"
categories:
  - WEBCON BPS
  - Private 
  - Series
tags:  
  - I 💗 WEBCON BPS
excerpt:
    This post contains part 09-12 of my LinkedIn post series I 💗 WEBCON BPS.

gallery_Part09:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Par9_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part9_1.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Par9_2.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part9_2.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Par9_3.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part9_3.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Par9_4.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part9_4.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Par9_5.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part9_5.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Par9_6.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part9_6.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Par9_7.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part9_7.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Par9_8.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part9_8.png.thumb.jpg
    alt: ""
    title: ""    
gallery_Part10:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_1.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_2.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_2.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_3.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_3.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_4.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_4.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_5.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_5.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_6.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part10_6.png.thumb.jpg
    alt: ""
    title: ""                                        
gallery_Part11:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""                   
---
# Part 9:  I no longer hear "Who send these test mails?"
{% include gallery id="gallery_Part09" caption="Carousel: I no longer hear 'Who send these test mails?'" %}

I once was lucky to work for a customer who had complete dedicated development and test environments. By complete I mean, that each employee had a development and test user account and mailbox. I never had such a luxury again. I can vividly remember the times when I accidently send a mail to the upper management when implementing and testing an application in the past.


Even more unprofessional is it when you send mail to external recipients. Luckily this is no longer an issue. With WEBCON BPS you have a few options to test the mail layout without going through the process and prevent situations like above:

- Preview the mails before using the existing data
- Even in different languages
- Send a test mail to any account without going through a process
- Redirecting the outgoing mails for a process to a specific account
- Redirecting the outgoing mails of all process for the whole environment

I've already stated it but WEBCON designed WEBCON BPS in a way which delights my developer heart.

At this point in time my series I ­💗 WEBCON BPS consist of nine posts. Four out of these have been about testing? Yes and I'm not sorry for not sticking to 'All good things come in threes'.  :)
After all testing, debugging, deploying solutions easily and fast will increase the user satisfaction. Not only those of the end users but those who actually develop/implement solutions.


[LinkedIn Post Part 9](https://www.linkedin.com/posts/krueger-daniel_how-to-test-mails-in-webcon-bps-activity-7080060821581520896-V68S/)

# Part 10: Yes, remove this ... AARRRGH (Dependency tracking)

{% include gallery id="gallery_Part10" caption="Carousel: Yes, remove this ... AARRRGH (Dependency tracking)" %}

Did you ever encounter a situation, where the business had a requirement, which has a major impact on the behavior of a process. A few weeks later it was no longer necessary. For example, a claims process can be marked as critical, which will:
- require additional fields to be filled out,
- Send mails to the management
- Create documents
- Change the flow of the workflow


Would you be willing to remove this central logic? With pro-code you have static code analysis, unit tests and so on. Back in the past I would have just removed the elements from the source code, and, if it builds, everything is fine. What do you in a low-code environment though?

I rely on the dependency tracking of WEBCON BPS. It will show me where something is used, and I can change the occurrences. Examples of the places:
- Actions
- Data connections
- Data sources
- Fields
- Custom functions
- UI elements like views
  
The dependency tracking works not only inside a process but across all applications. For example, the Audit management could create a workflow in the Incident management and set a field. This field would than have a reference to the action in the Audit management.
It will also prevent deleting specific artifacts like a workflow step if this step was already used in a workflow instance. This is necessary to ensure data integrity of the workflow history, which is required for the auditability.

This works really well and ensures a higher satisfaction. I trust this enough that I removed something central from a process one day before I went on vacation. Also, the customer was going into a test phase.

[LinkedIn Post Part 10](https://www.linkedin.com/posts/krueger-daniel_dependency-tracking-in-webcon-bps-activity-7082229126320803840-ftOR/)

# Part 11: From OnPrem to SaaS and back? Without migration effort? 🤣
{% include gallery id="gallery_Part11" caption="Carousel: From OnPrem to SaaS and back? Without migration effort? 🤣" %}

I would laugh too, if I wouldn’t know WEBCON.

What do I mean with 'processes don't care'? Do you have long running processes, with reminders or so? They will just work as normal.

But back to the start. First of all, why would you want this option all?
- You want to validate the platform with minor investments. If this it holds up to the promises you want to have the platform under your control.
- You start on an old server and at the end of it's live there's the question how you want to continue.
- Due to regulations one of your subsidiaries in a country can no longer use the public SaaS environment.
- A subsidiary get's sold and they need to keep there data.
- Changes in the costs structure

I can't tell whether these are unlikely reasons, but I know that this works. You can even have an OnPrem development environment and run the test and production environment in the cloud, as you can simply transport the processes. This shows, that WEBCON is dedicated to ensure your investments in terms of time and effort to digitize your processes, whatever option you may consider.

This is how the process would look like:
OnPrem -> SaaS
- Backup and provide your SQL databases.
- Change the DNS so that the URL would point to the correct IP address.

SaaS -> OnPrem
- Install the server.
- Request the SQL databases and restore the backups.
- Change the DNS so that the URL would point to the new server.

Your processes will continue and there's no need to touch them. I don't know whether there's any 
other platform which offers you this flexibility. I hope no persons reads this, who needed to migration SharePoint Nintex workflows. ;)


Of course, the above would be more complex if you have:
- An unsupported authentication method in the other environment.
- If the user names (UPN) would differ, you may need to migrate them.
- You are consuming data from a source which cannot be reached from the target environment.
  
I will dive into the last issue with the twelfth post in my series I 💗 WEBCON BPS. You will see that this won't be a problem at all. :)

[LinkedIn Post Part 11](https://www.linkedin.com/posts/krueger-daniel_webcon-ilovewebconbps-bpm-activity-7085128228486402048--_X-/)

# Part 12: Same process, multiple subsidiaries but different data sources? Those requests are a piece of cake for WEBCON.
{% include video id="biC8_MEL85I?autoplay=0&loop=1&mute=1&rel=0&playlist=biC8_MEL85I" provider="youtube" %}

After lots of back and forth, the business has finally agreed on a process which can be used across all subsidiaries. After this success has sunken in, the next step is to define the data. At this point you realize you need customer data and:
- Two subsidiaries use a common BC environment but are different companies.
- Another subsidiary use still and outdated Navision version which doesn't offer REST or even SOAP APIs to access the data.
- You heard a rumor that another company will be bought, it will take time to integrate it into your environment but the new process should be used their too.

Before I encountered WEBCON BPS I would have started cursing. How should one be able to use the same process definition to read customer data from different sources? Not only is the data itself different, but also the way the data is available.

I'm glad that WEBCON already encountered this issue and implemented a really smart way to handle this. I don't have to care about it at all.
- Each subsidiary will be represented as a “business entity”, if you know Navision/BC you can use the term 'Company'.
- Each business entity will have their own workflow instances (data) secured by an own set of privileges.  It's really similar to a 'Company'.
- You define a general data source. For example with the customer data Number and Name. This will be the default one.
- Depending on this you can define child data sources for each business entity (subsidiary) and these can refer to completely different types of data sources. These could be MSSQL databases, oracle, REST, SOAP, SharePoint lists and even custom ones.

Each workflow instance is created in the context of such a business entity and whenever the customer data source is used WEBCON BPS will fetch the data from the correct data source. I don’t have to do anything about it. This really delights my developer heart. Even more so as I started my professional career as NAV developer, which is also the reason why I used these examples. :)

I ended the eleventh post of my series I 💗 WEBCON BPS [From OnPrem to SaaS and back? Without migration effort? 🤣](#part-11-from-onprem-to-saas-and-back-without-migration-effort-🤣) with the problem:
You are consuming data from a source which cannot be reached from the target environment.

The solution for this is obviously fairly easy. If you migrated the data and the primary keys stayed the same, you only need to change the connection.

In case you think, this is just one building block in "one process to rule them all" and it won't work in a real world example check out:
[Success story by PWC CEE](https://webcon.com/case-study-pwc/)
..of the most critical business processes .. to unify it across 27 countries… 

[LinkedIn Post Part 12](https://www.linkedin.com/posts/krueger-daniel_webcon-webconbps-webconbps-activity-7090236762165301248-wnBb/)
