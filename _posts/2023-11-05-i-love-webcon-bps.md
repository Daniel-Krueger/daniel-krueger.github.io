---
regenerate: true
title: "I 💗 WEBCON BPS series: Part 1 - 4 "
categories:
  - WEBCON BPS
  - Private 
  - Series
tags:  
  - I 💗 WEBCON BPS
excerpt:
    This post contains part 1 -4 of my LinkedIn post series I 💗 WEBCON BPS.
bpsVersion: 2023.1.2.44
gallery_Part05:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""                           
gallery_Part07:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
gallery_Part09:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
gallery_Part10:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
gallery_Part11:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
gallery_Part13:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
gallery_Part14:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
gallery_Part15:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
gallery_Part16:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
---

# Part 5: Greatly reduced testing time
[LinkedIn Post Part 5](https://www.linkedin.com/posts/krueger-daniel_post-5-testing-changes-activity-7069186669039509505-IkeB/)

Even a low code platform offers numerous opportunities to introduce problems in one’s application. Especially if the platform is feature rich and doesn’t focus on a single use case. We just don’t come around testing and the InstantChange™ technology is one key feature, which let me fell in love with WEBCON BPS.

A workflow, or more precisely a workflow instance in WEBCON BPS, is stored as a data row. The instance is not started with a specific version of the workflow, it is unaware of the currently deployed version. It will use the deployed version when the workflow instance is “used” in some way, for example when it’s moved from one step to another, or better, from one state to another.
I can understand comments like: 𝘈 𝘸𝘰𝘳𝘬𝘧𝘭𝘰𝘸 𝘪𝘯𝘴𝘵𝘢𝘯𝘤𝘦 𝘴𝘩𝘰𝘶𝘭𝘥 𝘶𝘴𝘦 𝘵𝘩𝘦 𝘷𝘦𝘳𝘴𝘪𝘰𝘯, 𝘸𝘩𝘪𝘤𝘩 𝘸𝘢𝘴 𝘷𝘢𝘭𝘪𝘥, 𝘸𝘩𝘦𝘯 𝘪𝘵 𝘸𝘢𝘴 𝘴𝘵𝘢𝘳𝘵𝘦𝘥. 𝘛𝘩𝘦𝘳𝘦 𝘢𝘳𝘦 𝘣𝘦𝘯𝘦𝘧𝘪𝘵𝘴 𝘵𝘰 𝘵𝘩𝘪𝘴, 𝗯𝘂𝘁 𝗮𝗹𝘀𝗼 𝗻𝘂𝗺𝗲𝗿𝗼𝘂𝘀 𝗽𝗿𝗼𝗯𝗹𝗲𝗺𝘀. Not the least of those is 𝗲𝘅𝗽𝗹𝗮𝗶𝗻𝗶𝗻𝗴 𝘁𝗼 𝗺𝗮𝗻𝗮𝗴𝗲𝗿𝘀, that they need to reapprove numerous ongoing requests, because 𝘁𝗵𝗲𝘆 𝗵𝗮𝗱 𝘁𝗼 𝗯𝗲 𝘀𝘁𝗮𝗿𝘁𝗲𝗱 𝗮𝗴𝗮𝗶𝗻 to fulfill new policies. I wonder how many workflows had to be stopped and restarted after implementing new policies due to COVID.

Thanks to the fact that the workflow instance is just a data row, any deployed version is immediately effective. The new policies are in place and the workflow instance will carry on as nothing happened.
You can imagine what this means for testing. This greatly reduces the wasted time:
• You can just use the existing data to verify any UI changes.
• You don’t need to recreate the test data, to fix bugs.
• Continue after fixing the bug without redoing everything will keep the employees happy.
  
This is possible because WEBCON BPS is transactional. If the transition from one step/state to another involves numerous actions, 𝗲𝗶𝘁𝗵𝗲𝗿 𝗲𝘃𝗲𝗿𝘆𝘁𝗵𝗶𝗻𝗴 𝗶𝘀 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 𝗼𝗿 𝗻𝗼𝗻𝗲.
This doesn’t mean, that you can test those actions only after saving your changes. In most cases 𝘆𝗼𝘂 𝗰𝗮𝗻 𝗮𝗰𝘁𝘂𝗮𝗹𝗹𝘆 𝘁𝗲𝘀𝘁 𝘁𝗵𝗲𝘀𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗯𝗲𝗳𝗼𝗿𝗲 𝘀𝗮𝘃𝗶𝗻𝗴. You can select the workflow instance, and the Designer Studio will run the action using, with the data of this workflow instance.

This was the fifth post in my series #ILoveWEBCONBPS. You can find the previous when you click on the hashtag.


{% include gallery id="gallery_Part05" caption="This is a sample gallery with **Markdown support**." %}

# Part 6: Time to market
[LinkedIn Post Part 6](https://www.linkedin.com/posts/krueger-daniel_webconbps-applicationfactory-webcon-activity-7072075705638903810-k4Hj/)
All of the previous parts have one thing in common they describe different aspects of WEBCON BPS which reduced the time to market. But don't take my word for it just listen to Mike Fitzmaurice who described the different aspects in the WEBCON BPS 2023 What's new? webinar: https://lnkd.in/ehjuEwau

Actually, I wanted to post about it later, but I started yesterday, 2023-06-05, an implementation for a generic "Risk Assessment" after a meeting on Friday with Christian Sallaberger. Today I've finished the version we will review next Tuesday. It was decided in advance to spent two days (16 hours) on this. At this point in time we are short a few hours of the defined timeframe.

Application features:
• Create risk assessment based on risk objects
• Risk objects are categorizes
• A blank risk assessment can be started for an object or risks can be copied from any another assessment
• Risks are evaluated and an overview exists
• Measures can be defined for risks, which have a due date but can be postponed
• Measures define the new risk
• Once all measures are defined the assessment is moved to review and the risks are updated
• A date for a next assessment can be define
• Upon reaching the date, a new assessment is started reusing the risks of the latest assessment for the same object
• There's an overview of the Top risks across all objects

Relevant features provided by the platform
• Attachments to any workflow
• Commenting
• Audit trail
• Security model
• Mail system

Deploying the risk assessment, will contain the process, data model, form, UI elements, security settings as well as the configuration of the categories and objects. I do believe we will achieve our goal and I think this is a good example for "Time to market".
Of course, 𝘰𝘯𝘦 𝘢𝘱𝘱𝘭𝘪𝘤𝘢𝘵𝘪𝘰𝘯 𝘢𝘭𝘰𝘯𝘦 𝘸𝘰𝘶𝘭𝘥 𝘣𝘦 𝘢 𝘸𝘢𝘴𝘵𝘦 for the #ApplicationFactory WEBCON BPS. Other applications are in progress or planned, two of which are tightly integrated with Business Central.

Maybe some experienced WEBCON user will find some new things I implemented in the video. :)

This was the sixth post in my series #ILoveWEBCONBPS. You can find the previous when you click on the hashtag.

{% include video id="M85SM38vOU0?autoplay=0&loop=1&mute=1&rel=0&playlist=M85SM38vOU0" provider="youtube" %}

# Part 7:  Gather debugging information
[LinkedIn Post Part 7](https://www.linkedin.com/posts/krueger-daniel_debugging-in-webcon-bps-activity-7075352044458389504-8VpS/)
In part 5 I talked about how WEBCON BPS greatly reduced the time spent on testing. What I didn’t cover was how you could actually identify a problem aka debugging.

You always know, 𝗵𝗼𝘄 𝘀𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴 𝘀𝗵𝗼𝘂𝗹𝗱 𝘄𝗼𝗿𝗸 out, after all you can take a look at the workflow definition, the paths, the actions and so on. For example, you defined a logic, which sends a mail to the person who receives the next task in a work-flow, except that this mail should only be send, if the person who caused the movement of the workflow is someone else. If they are the same, no mail is necessary. Of course, this works when you test it, but will it also work when you are not around? 😉

In WEBCON BPS 𝘆𝗼𝘂 𝗸𝗻𝗼𝘄 𝘄𝗵𝗮𝘁 𝘄𝗮𝘀 𝗲𝘅𝗲𝗰𝘂𝘁𝗲𝗱 and not in a log file but 𝗮𝘁 𝘆𝗼𝘂𝗿 𝗳𝗶𝗻𝗴𝗲𝗿𝘁𝗶𝗽𝘀 where you need it. This kind of information, can be found in the workflow history. A detailed look at the history will also provide more information about the action, as you can see in the slide show and if you are an admin you can see even more. So, you don’t need to rely on the users memory, if they tell you which workflow it was, you will find the problem.
If the workflow needs to “talk” with an external system, you can actually see the communication. There’s no need to gather data from different sources and map them together. If you need to check what happened on 9th November 2021, you can just go to the workflow history and take a look at it. This makes auditors as well as developers really happy 😊

Up to now I talked about getting information when the workflow moved from one step to another, but what about 𝗲𝗿𝗿𝗼𝗿𝘀 𝗶𝗻 𝘁𝗵𝗲 𝗯𝗿𝗼𝘄𝘀𝗲𝗿 and something fails or it takes a really long time? The user can just a𝗰𝘁𝗶𝘃𝗮𝘁𝗲 𝘁𝗵𝗲 𝗱𝗶𝗮𝗴𝗻𝗼𝘀𝘁𝗶𝗰 𝗺𝗼𝗱𝗲, save the session and an admin can take a l𝗼𝗼𝗸 𝗮𝘁 𝘄𝗵𝗮𝘁 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗲𝘅𝗲𝗰𝘂𝘁𝗲𝗱 𝗮𝗻𝗱 𝗲𝘃𝗲𝗻 𝗵𝗼𝘄 𝗹𝗼𝗻𝗴 𝗶𝘁 𝘁𝗼𝗼𝗸.

If you still weren’t able to solve the issue, your last resort would probably be to go to the user and see what he was doing, either in person or with some kind of screensharing. Thanks to @WEBCON there’s no need for this. The user can grant you the permissions to impersonate him. Which allows you to do everything in the system with the users privileges instead of your own. But this is worth an own post and another reason why #ILoveWEBCONBPS.

You can find the previous posts of this series, when you click on the hashtag.


{% include gallery id="gallery_Part07" caption="This is a sample gallery with **Markdown support**." %}

# Part 8: Being CEO for a day (working on behalf)
[LinkedIn Post Part 8](https://www.linkedin.com/posts/krueger-daniel_webcon-ilovewebconbps-webconbps-activity-7076793794347577344-sL--/)

The working on behalf features was introduced in WEBCON BPS 2022 and for me this one is revolutionary. Assume that you want to go on vacation and you have three different roles.
• As a superior you need to approve vacation requests
• As a project member you have your own tasks to work on
• As a member of the board committee, you have access to classified data

Before going on vacation, you can select:
• Tiffany to work in your name for the vacation requests.
• Kurt will take over your project tasks.
• no one should replace you in your board committee role.

Working on behalf, 𝘄𝗶𝗹𝗹 𝗮𝗹𝗹𝗼𝘄 𝗧𝗶𝗳𝗳𝗮𝗻𝘆 𝗮𝗻𝗱 𝗞𝘂𝗿𝘁 𝘁𝗼 𝘂𝘀𝗲 𝘁𝗵𝗲 𝘀𝘆𝘀𝘁𝗲𝗺 𝗮𝘀 𝗶𝗳 𝘁𝗵𝗲𝘆 𝘄𝗲𝗿𝗲 𝘆𝗼u. For the allowed applications or whole platform, they
• will have your privileges.
• work on your tasks.
• start new workflows.
  
If they do something this is logged in the history of course, that they did it in your name.
𝗜 𝗱𝗼𝗻’𝘁 𝗸𝗻𝗼𝘄 𝗮𝗻𝘆 𝗼𝘁𝗵𝗲𝗿 𝘀𝘆𝘀𝘁𝗲𝗺 𝘄𝗵𝗶𝗰𝗵 𝘄𝗼𝘂𝗹𝗱 𝗮𝗹𝗹𝗼𝘄 𝘁𝗵𝗶𝘀 𝗮𝗻𝗱 𝗲𝘀𝗽𝗲𝗰𝗶𝗮𝗹𝗹𝘆 𝗻𝗼𝘁 𝗮𝗰𝗿𝗼𝘀𝘀 𝗮𝗹𝗹 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀.

This is not only useful in daily business. You can '𝗺𝗶𝘀𝘂𝘀𝗲' 𝘁𝗵𝗶𝘀 𝗳𝗲𝗮𝘁𝘂𝗿𝗲 to:
• Do 𝗱𝗲𝗺𝗼𝘀 with different roles as a single person.
  I’ve used browser profiles before, but the change of the role was easily missed. This is not the case when using the Work on behalf feature.
• 𝗧𝗲𝘀𝘁𝘀 the application with different roles.
• 𝗗𝗲𝗯𝘂𝗴 𝗮 𝗽𝗿𝗼𝗰𝗲𝘀𝘀 if something only happens for a specific user.
  The user can simply tell the system that you are allowed to do so, and you ca𝗻 𝗱𝗲𝗯𝘂𝗴 𝗶𝘁 𝗶𝗻 𝗵𝗶𝘀 𝗻𝗮𝗺𝗲 on your machine 𝗶𝗻𝘀𝘁𝗲𝗮𝗱 𝗼𝗳 𝘀𝘁𝗲𝗮𝗹𝗶𝗻𝗴 𝗵𝗶𝘀 𝘁𝗶𝗺𝗲 with a screenshare.
  
The last one is what I hinted at in my previous post of the series #ILoveWEBCONBPS 'Gather debugging information'. There's only one last part missing in testing/debugging and that is 𝘀𝗲𝗻𝗱𝗶𝗻𝗴 𝗺𝗮𝗶𝗹 by the system. This 𝗰𝗼𝘂𝗹𝗱 𝗴𝗲𝘁 𝗮𝗻𝗻𝗼𝘆𝗶𝗻𝗴 𝗳𝗼𝗿 𝘁𝗵𝗲 𝘂𝘀𝗲𝗿𝘀, if you use their accounts during testing. It wouldn't be WEBCON BPS  if WEBCON wouldn't have you covered.. :)

{% include video id="kS2-vcQA6bI?autoplay=0&loop=1&mute=1&rel=0&playlist=kS2-vcQA6bI" provider="youtube" %}

# Part 9:  I no longer hear "Who send these test mails?"
[LinkedIn Post Part 9](https://www.linkedin.com/posts/krueger-daniel_how-to-test-mails-in-webcon-bps-activity-7080060821581520896-V68S/)
I once was lucky to work for a customer who had 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲 𝗱𝗲𝗱𝗶𝗰𝗮𝘁𝗲𝗱 𝗱𝗲𝘃𝗲𝗹𝗼𝗽𝗺𝗲𝗻𝘁 𝗮𝗻𝗱 𝘁𝗲𝘀𝘁 𝗲𝗻𝘃𝗶𝗿𝗼𝗻𝗺𝗲𝗻𝘁𝘀. By complete I mean, that each employee had a development and test user account and mailbox. I never had such a luxury again. I can vividly 🤬  remember the times when I accidently 𝘀𝗲𝗻𝗱 𝗮 𝗺𝗮𝗶𝗹 𝘁𝗼 𝘁𝗵𝗲 𝘂𝗽𝗽𝗲𝗿 𝗺𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁 𝘄𝗵𝗲𝗻 implementing and 𝘁𝗲𝘀𝘁𝗶𝗻𝗴 𝗮𝗻 𝗮𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻 in the past.

Even more 𝘂𝗻𝗽𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻𝗮𝗹 𝗶𝘀 𝗶𝘁 𝘄𝗵𝗲𝗻 𝘆𝗼𝘂 𝘀𝗲𝗻𝗱 𝗺𝗮𝗶𝗹 𝘁𝗼 𝗲𝘅𝘁𝗲𝗿𝗻𝗮𝗹 𝗿𝗲𝗰𝗶𝗽𝗶𝗲𝗻𝘁𝘀. Luckily this is no longer an issue. With WEBCON BPS you have a few options to test the mail layout without going through the process and prevent situations like above:

• Preview the mails before using the existing data
• Even in different languages
• Send a test mail to any account without going through a process
• Redirecting the outgoing mails for a process to a specific account
• Redirecting the outgoing mails of all process for the whole environment

I've already stated it but WEBCON designed WEBCON BPS in a way which delights my developer heart.

At this point in time my series #ILoveWEBCONBPS consist of 𝗻𝗶𝗻𝗲 𝗽𝗼𝘀𝘁𝘀. 𝗙𝗼𝘂𝗿 out of these have been 𝗮𝗯𝗼𝘂𝘁 𝘁𝗲𝘀𝘁𝗶𝗻𝗴? Yes and I’m not sorry for not sticking to “All good things come in threes”.  :)
After all 𝙩𝙚𝙨𝙩𝙞𝙣𝙜, 𝙙𝙚𝙗𝙪𝙜𝙜𝙞𝙣𝙜, 𝙙𝙚𝙥𝙡𝙤𝙮𝙞𝙣𝙜 𝙨𝙤𝙡𝙪𝙩𝙞𝙤𝙣𝙨 𝙚𝙖𝙨𝙞𝙡𝙮 𝙖𝙣𝙙 𝙛𝙖𝙨𝙩 𝙬𝙞𝙡𝙡 𝙞𝙣𝙘𝙧𝙚𝙖𝙨𝙚 𝙩𝙝𝙚 𝙪𝙨𝙚𝙧 𝙨𝙖𝙩𝙞𝙨𝙛𝙖𝙘𝙩𝙞𝙤𝙣. Not only those of the end users but those who actually develop/implement solutions.


{% include gallery id="gallery_Part09" caption="This is a sample gallery with **Markdown support**." %}

# Part 10: Yes, remove this ... AARRRGH (Dependency tracking)
[LinkedIn Post Part 10](https://www.linkedin.com/posts/krueger-daniel_dependency-tracking-in-webcon-bps-activity-7082229126320803840-ftOR/)
Did you ever encounter a situation, where the 𝗯𝘂𝘀𝗶𝗻𝗲𝘀𝘀 𝗵𝗮𝗱 𝗮 𝗿𝗲𝗾𝘂𝗶𝗿𝗲𝗺𝗲𝗻t, which has a major impact on the behavior of a process. 𝗔 𝗳𝗲𝘄 𝘄𝗲𝗲𝗸𝘀 𝗹𝗮𝘁𝗲𝗿 𝗶𝘁 𝘄𝗮𝘀 𝗻𝗼 𝗹𝗼𝗻𝗴𝗲𝗿 𝗻𝗲𝗰𝗲𝘀𝘀𝗮𝗿𝘆. For example, a claims process can be marked as critical, which will:
- require additional fields to be filled out,
- Send mails to the management
- Create documents
- Change the flow of the workflow

𝗪𝗼𝘂𝗹𝗱 𝘆𝗼𝘂 be willing to 𝗿𝗲𝗺𝗼𝘃𝗲 this 𝗰𝗲𝗻𝘁𝗿𝗮𝗹 𝗹𝗼𝗴𝗶𝗰? With 𝗽𝗿𝗼-𝗰𝗼𝗱𝗲 you have 𝘀𝘁𝗮𝘁𝗶𝗰 𝗰𝗼𝗱𝗲 𝗮𝗻𝗮𝗹𝘆𝘀𝗶𝘀, 𝘂𝗻𝗶𝘁 𝘁𝗲𝘀𝘁𝘀 and so on. Back in the past I would have just removed the elements from the source code, and, if it builds, everything is fine. 𝗪𝗵𝗮𝘁 𝗱𝗼 𝘆𝗼𝘂 𝗶𝗻 𝗮 𝗹𝗼𝘄-𝗰𝗼𝗱𝗲 𝗲𝗻𝘃𝗶𝗿𝗼𝗻𝗺𝗲𝗻𝘁 though?

I rely on the 𝗱𝗲𝗽𝗲𝗻𝗱𝗲𝗻𝗰𝘆 𝘁𝗿𝗮𝗰𝗸𝗶𝗻𝗴 of WEBCON BPS. It will show me where something is used, and I can change the occurrences. Examples of the places:
• Actions
• Data connections
• Data sources
• Fields
• Custom functions
• UI elements like views
  
The 𝗱𝗲𝗽𝗲𝗻𝗱𝗲𝗻𝗰𝘆 𝘁𝗿𝗮𝗰𝗸𝗶𝗻𝗴 𝘄𝗼𝗿𝗸𝘀 not only inside a process but 𝗮𝗰𝗿𝗼𝘀𝘀 𝗮𝗹𝗹 𝗮𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀. For example, the Audit management could create a workflow in the Incident management and set a field. This field would than have a reference to the action in the Audit management.
It will also prevent deleting specific artifacts like a workflow step if this step was already used in a workflow instance. This is necessary to ensure data integrity of the workflow history, which is required for the auditability.

This works really well and ensures a higher satisfaction. 𝗜 𝘁𝗿𝘂𝘀𝘁 𝘁𝗵𝗶𝘀 enough that 𝗜 𝗿𝗲𝗺𝗼𝘃𝗲𝗱 𝘀𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴 𝗰𝗲𝗻𝘁𝗿𝗮𝗹 from a process 𝗼𝗻𝗲 𝗱𝗮𝘆 𝗯𝗲𝗳𝗼𝗿𝗲 I went on 𝘃𝗮𝗰𝗮𝘁𝗶𝗼𝗻. Also, the customer was going into a test phase.

This was then tenth post in time my series #ILoveWEBCONBPS. You can find the other posts by clicking on the hashtag.


{% include gallery id="gallery_Part10" caption="This is a sample gallery with **Markdown support**." %}

# Part 11: From OnPrem to SaaS and back? Without migration effort? 🤣
[LinkedIn Post Part 11](https://www.linkedin.com/posts/krueger-daniel_webcon-ilovewebconbps-bpm-activity-7085128228486402048--_X-/)
I would laugh too, if I wouldn’t know WEBCON.

What do I mean with "processes don't care"? Do you have long running processes, with reminders or so? They will just work as normal.

But back to the start. First of all, 𝘄𝗵𝘆 𝘄𝗼𝘂𝗹𝗱 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 this option all?
• You want to validate the platform with minor investments. If this it holds up to the promises you want to have the platform under your control.
• You start on an old server and at the end of it's live there's the question how you want to continue.
• Due to regulations one of your subsidiaries in a country can no longer use the public SaaS environment.
• A subsidiary get's sold and they need to keep there data.
• Changes in the costs structure

I can't tell whether these are unlikely reasons, but I know that this works. You can even have an OnPrem development environment and run the test and production environment in the cloud, as you can simply transport the processes. This shows, that WEBCON is dedicated to ensure your investments in terms of time and effort to digitize your processes, whatever option you may consider.

This is how the process would look like:
𝗢𝗻𝗣𝗿𝗲𝗺 -> 𝗦𝗮𝗮𝗦
• Backup and provide your SQL databases.
• Change the DNS so that the URL would point to the correct IP address.

𝗦𝗮𝗮𝗦 -> 𝗢𝗻𝗣𝗿𝗲𝗺
• Install the server.
• Request the SQL databases and restore the backups.
• Change the DNS so that the URL would point to the new server.

𝗬𝗼𝘂𝗿 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀 𝘄𝗶𝗹𝗹 𝗰𝗼𝗻𝘁𝗶𝗻𝘂𝗲 𝗮𝗻𝗱 𝘁𝗵𝗲𝗿𝗲'𝘀 𝗻𝗼 𝗻𝗲𝗲𝗱 𝘁𝗼 𝘁𝗼𝘂𝗰𝗵 𝘁𝗵𝗲𝗺. I don't know whether there's any other platform which offers you this flexibility. I hope no persons reads this, who needed to migration SharePoint Nintex workflows.
At this point I also want to speak my gratitude to Christian Krause and his team hosting our WEBCON servers in the COSMO CLOUD and their support whenever we needed it. :)

Of course, the above would be more complex if you have:
• An unsupported authentication method in the other environment.
• If the user names (UPN) would differ, you may need to migrate them.
• You are consuming data from a source which cannot be reached from the target environment.
  
I will dive into the last issue with the twelfth post in my series #ILoveWEBCONBPS. You will see that this won't be a problem at all. :)

{% include gallery id="gallery_Part11" caption="This is a sample gallery with **Markdown support**." %}

# Part 12: Same process, multiple subsidiaries but different data sources? Those requests are a piece of cake for WEBCON.
[LinkedIn Post Part 12](https://www.linkedin.com/posts/krueger-daniel_webcon-webconbps-webconbps-activity-7090236762165301248-wnBb/)
After lots of back and forth, the business has finally agreed on a process which can be used across all subsidiaries. After this success has sunken in, the next step is to define the data. At this point you realize you need 𝗰𝘂𝘀𝘁𝗼𝗺𝗲𝗿 𝗱𝗮𝘁𝗮 and:
• Two subsidiaries use a common 𝗕𝗖 𝗲𝗻𝘃𝗶𝗿𝗼𝗻𝗺𝗲𝗻𝘁 but are different companies.
• Another subsidiary use still and 𝗼𝘂𝘁𝗱𝗮𝘁𝗲𝗱 𝗡𝗮𝘃𝗶𝘀𝗶𝗼𝗻 version which doesn’t offer REST or even SOAP APIs to access the data.
• You heard a rumor that another 𝗰𝗼𝗺𝗽𝗮𝗻𝘆 𝘄𝗶𝗹𝗹 𝗯𝗲 𝗯𝗼𝘂𝗴𝗵𝘁, it will take time to integrate it into your environment but the new process should be used their too.

Before I encountered WEBCON BPS I would have started cursing. How should one be able to use the 𝘀𝗮𝗺𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀 definition to read customer data from 𝗱𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝘁 𝘀𝗼𝘂𝗿𝗰𝗲𝘀? Not only is the data itself different, but also the way the data is available.

I’m glad that WEBCON already encountered this issue and implemented a really smart way to handle this. 𝗜 𝗱𝗼𝗻’𝘁 𝗵𝗮𝘃𝗲 𝘁𝗼 𝗰𝗮𝗿𝗲 𝗮𝗯𝗼𝘂𝘁 𝗶𝘁 𝗮𝘁 𝗮𝗹𝗹.
• Each subsidiary will be represented as a “business entity”, if you know Navision/BC you can use the term “Company”.
• Each business entity will have their own workflow instances (data) secured by an own set of privileges.  It's really similar to a "Company".
• You define a general data source. For example with the customer data Number and Name. This will be the default one.
• Depending on this you can define child data sources for each business entity (subsidiary) and these can refer to completely different types of data sources. These could be MSSQL databases, oracle, REST, SOAP, SharePoint lists and even custom ones.
Each workflow instance is created in the context of such a business entity and whenever the customer data source is used WEBCON BPS will fetch the data from the correct data source. I don’t have to do anything about it. This really delights my developer hearth. Even more so as I started my professional career as NAV developer, which is also the reason why I used these examples. :)

I ended the eleventh post of my series #ILoveWEBCONBPS "From OnPrem to SaaS and back? Without migration effort? 🤣" with the problem:
You are consuming data from a source which cannot be reached from the target environment.

The solution for this is obviously fairly easy. If you migrated the data and the primary keys stayed the same, you only need to change the connection.

In case you think, this is just one building block in "one process to rule them all" and it won't work in a real world example check out:
https://lnkd.in/gwdaNibH
..of the most critical business processes .. to unify it across 27 countries… PwC Case Study.
{% include video id="biC8_MEL85I?autoplay=0&loop=1&mute=1&rel=0&playlist=biC8_MEL85I" provider="youtube" %}



# Part 13: Ever evolving
[LinkedIn Post Part 13](https://www.linkedin.com/posts/krueger-daniel_evolve-or-revolutionize-activity-7092748926721630208-8b7j/)
Everything changes and and the speeds picks up, it's even faster now with AI, but humans are not made for this.

We need routines.
We need something to rely on.

Why? We want to do as much as possible unconsciously. It takes less effort.

I’m still not used to the “new” outlook layout with the icons on the left. This results in wasted time and disturbed thoughts because I have to give it my attention.

𝗨𝘀𝗲𝗿 𝗽𝗲𝗿𝘀𝗽𝗲𝗰𝘁𝗶𝘃𝗲
That’s another part I love about WEBCON BPS. WEBCON puts a lot of effort to 𝗲𝘃𝗼𝗹𝘃𝗲 𝗶𝗻𝘀𝘁𝗲𝗮𝗱 𝗼𝗳 𝗿𝗲𝘃𝗼𝗹𝘂𝘁𝗶𝗼𝗻𝗶𝘇𝗶𝗻𝗴 its product. Don’t get me wrong, there are a lot of i𝗺𝗽𝗿𝗼𝘃𝗲𝗺𝗲𝗻𝘁𝘀 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝗱𝗶𝘀𝘁𝘂𝗿𝗯𝗶𝗻𝗴 𝘁𝗵𝗲 𝘂𝘀𝗲𝗿𝘀. They can work as they are used to.

𝗣𝗼𝘄𝗲𝗿 𝗨𝘀𝗲𝗿 𝗽𝗲𝗿𝘀𝗽𝗲𝗰𝘁𝗶𝘃𝗲
The improvements would justify rewriting most of my blog post. Nevertheless, those approaches would still work.

𝗜𝗧 𝗽𝗲𝗿𝘀𝗽𝗲𝗰𝘁𝗶𝘃𝗲
Another point in regards to “evolution” is that it's fairly easy to update to new major versions. Simply execute setup.exe for an in-place upgrade. I remember some SharePoint migrations where we had to create dedicated SharePoint installation just to migrate to an intermediate version.

𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 𝗽𝗲𝗿𝘀𝗽𝗲𝗰𝘁𝗶𝘃𝗲
Last but not least, WEBCON BPS is a low code platform, but it also offers the option to enhance it’s abilities with custom SDK plugin. These can either improve the frontend with custom React components or backend capabilities using .Net.
In 2022 WEBCON BPS a version was released which 𝗺𝗼𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 .𝗡𝗲𝘁 𝟰.𝘅 𝘁𝗼 .𝗡𝗲𝘁 𝗰𝗼𝗿𝗲 𝟲. Even so the name is similar, 𝗶𝘁’𝘀 𝗺𝗼𝗿𝗲 𝗹𝗶𝗸𝗲 𝘂𝘀𝗶𝗻𝗴 𝘀𝗮𝗹𝘁 𝗶𝗻𝘀𝘁𝗲𝗮𝗱 𝗼𝗳 𝘀𝘂𝗴𝗮𝗿 in a cake.
I didn’t think about it, but a colleague reminded me this year, that we have an SDK plugin which 𝘄𝗮𝘀 𝗰𝗿𝗲𝗮𝘁𝗲𝗱 𝗶𝗻 𝟮𝟬𝟮𝟬 𝗮𝗻𝗱 𝘀𝘁𝗶𝗹𝗹 𝗿𝘂𝗻𝘀 𝘁𝗼𝗱𝗮𝘆. I have no idea why this is possible.

One thing is for sure. 𝗔𝗹𝗹 𝘁𝗵𝗶𝘀 𝗲𝗳𝗳𝗼𝗿𝘁 𝗶𝘀 𝗱𝗲𝗱𝗶𝗰𝗮𝘁𝗲𝗱 𝘁𝗼 𝗰𝘂𝘀𝘁𝗼𝗺𝗲𝗿𝘀 𝗮𝗻𝗱 𝘁𝗵𝗲𝗶𝗿 𝗲𝗺𝗽𝗹𝗼𝘆𝗲𝗲𝘀. They spend a lot of energy in their processes so WEBCON makes sure that this investment which pays off.


This was then thirteenth post in time my series #ILoveWEBCONBPS. You can find the other posts by clicking on the hashtag.


{% include gallery id="gallery_Part13" caption="This is a sample gallery with **Markdown support**." %}

# Part 14 Multilanguage and evergreen documentation

{% include gallery id="gallery_Part14" caption="Multilanguage and evergreen documentation" %}

Even so the advent of AI enforces the dominance of English in the west that’s not necessarily the case on company level. If we want that the users embrace the processes, they must speak the same language.

A 𝗺𝘂𝗹𝘁𝗶𝗹𝗶𝗻𝗴𝘂𝗮𝗹 𝘂𝘀𝗲𝗿 𝗶𝗻𝘁𝗲𝗿𝗳𝗮𝗰𝗲 𝗶𝘀 𝗻𝗼𝘁 𝗲𝗻𝗼𝘂𝗴𝗵. The 𝗮𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀/𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀 themselves 𝗻𝗲𝗲𝗱 𝘁𝗼 𝗯𝗲 𝗺𝘂𝗹𝘁𝗶𝗹𝗶𝗻𝗴𝘂𝗮𝗹.

WEBCON BPS   supports this 𝗳𝗼𝗿 𝗲𝘃𝗲𝗿𝘆 𝘀𝗶𝗻𝗴𝗹𝗲 𝗮𝗿𝘁𝗶𝗳𝗮𝗰𝘁 you can create. Even those which most user won’t see in their daily business. For example actions executed during the transition from one state to another, which would be displayed in the history (audit trail).

In addition to the translation of these artifacts you can also 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗱𝗼𝗰𝘂𝗺𝗲𝗻𝘁𝗮𝘁𝗶𝗼𝗻 𝗳𝗼𝗿 𝗲𝗮𝗰𝗵 𝗲𝗹𝗲𝗺𝗲𝗻𝘁. In 𝗽𝗿𝗼-𝗰𝗼𝗱𝗲 this would be the 𝗲𝗾𝘂𝗶𝘃𝗮𝗹𝗲𝗻𝘁 𝘁𝗼 𝗮 “𝗰𝗼𝗺𝗺𝗲𝗻𝘁”. This won't be visible to the user, but would be part of the 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 𝗱𝗼𝗰𝘂𝗺𝗲𝗻𝘁𝗮𝘁𝗶𝗼𝗻. Of course, you can select the target language of the document.

You can:
• Translate the UI
• Translate all user generated artifacts
• Document the process while designing it
• Create a documentation

Without:
• Any training
• Making errors along the way
• Resorting to any external system/tools

Not only your users will be satisfied but you will have an 𝗲𝘃𝗲𝗿𝗴𝗿𝗲𝗲𝗻 𝗱𝗼𝗰𝘂𝗺𝗲𝗻𝘁𝗮𝘁𝗶𝗼𝗻. You are going to 𝗰𝗵𝗮𝗻𝗴𝗲 𝘀𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴? Simply 𝗰𝗿𝗲𝗮𝘁𝗲 𝗮 𝗻𝗲𝘄 𝗱𝗼𝗰𝘂𝗺𝗲𝗻𝘁𝗮𝘁𝗶𝗼𝗻. Some refer to as functional specification while other coin it as technical specification. Regardless of the term, depending on your industry /regulatory requirements this will help you tremendously.

I've written a blog post on who to modify the template used for generating the documentation so that the 𝗱𝗼𝗰𝘂𝗺𝗲𝗻𝘁𝗮𝘁𝗶𝗼𝗻 is 𝗶𝗻 𝘆𝗼𝘂𝗿 𝗖𝗜.
https://lnkd.in/dir9pX4v


This is just another example that WEBCON focuses not “just” on improved development time but focuses on all aspects around it.

This was then fourteenth post in time my series #ILoveWEBCONBPS. You can find the other posts by clicking on the hashtag.


*10 Page how-to
That would be the printed version of the article:
How to create a multi-language app with localized experience in Power Platform
https://lnkd.in/esjCXark


[LinkedIn Post Part 14](https://www.linkedin.com/posts/krueger-daniel_webconbps-ilovewebconbps-bpm-activity-7095280860286840832-lqUm/)

# Part 15: If you repeat yourself, you are doing it wrong

{% include gallery id="gallery_Part15" caption="If you repeat yourself, you are doing it wrong" %}

WEBCON did a really good job so that we can do something ones right and reuse it when we need it. There are different objects one can reuse:
- Processes
- Actions
- Automations, a collection of actions
- Business logic
- Data sources
- Fields

𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀
• A single 'measure' process is part of different applications.
• Same process but different applications for different roles.
• Build a "template process" and clone it.

𝗔𝗰𝘁𝗶𝗼𝗻𝘀
Actions define that something should happen. For example, when moving from one step to another you could execute a “Validate” action to do a more 𝗰𝗼𝗺𝗽𝗹𝗲𝘅 𝘃𝗮𝗹𝗶𝗱𝗮𝘁𝗶𝗼𝗻 than “is required”. These actions can be 𝘀𝗮𝘃𝗲𝗱 𝗮𝘀 𝗮 𝘁𝗲𝗺𝗽𝗹𝗮𝘁𝗲, so that you can 𝘂𝘀𝗲 𝗶𝘁 𝗺𝘂𝗹𝘁𝗶𝗽𝗹𝗲 𝘁𝗶𝗺𝗲𝘀 in a process.

𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗼𝗻𝘀
A "Create pdf document" 𝗮𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗼𝗻 could 𝗰𝗼𝗻𝘀𝗶𝘀𝘁 𝗼𝗳 𝗮 𝘀𝗲𝗾𝘂𝗲𝗻𝗰𝗲 of actions like
• Fetching external data
• Generate a document
• Convert to pdf
This action sequence can then be reused in a process where needed.
In addition, they have 𝗶𝗻𝗽𝘂𝘁, 𝗹𝗼𝗰𝗮𝗹 𝗮𝗻𝗱 𝗼𝘂𝘁𝗽𝘂𝘁 𝗽𝗮𝗿𝗮𝗺𝗲𝘁𝗲𝗿𝘀 and they can be defined on a 𝗴𝗹𝗼𝗯𝗮𝗹 𝗹𝗲𝘃𝗲𝗹. So you can have a parameterized sequence of actions which can be reused 𝗮𝗰𝗿𝗼𝘀𝘀 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀.

𝗕𝘂𝘀𝗶𝗻𝗲𝘀𝘀 𝗹𝗼𝗴𝗶𝗰
You can create 𝗯𝘂𝘀𝗶𝗻𝗲𝘀𝘀 𝗹𝗼𝗴𝗶𝗰 𝘁𝗮𝗿𝗴𝗲𝘁𝗲𝗱 𝗮𝘁 𝘁𝗵𝗲 𝗳𝗿𝗼𝗻𝘁 𝗲𝗻𝗱 𝗼𝗿 𝗯𝗮𝗰𝗸𝗲𝗻𝗱. These are called “Rules”. As the automations, they can either be 𝘀𝗰𝗼𝗽𝗲𝗱 𝘁𝗼 𝘁𝗵𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀, 𝗼𝗿 if you need it in multiple applications, you can define it as 𝗴𝗹𝗼𝗯𝗮𝗹. As the name implies a change to a global rule would be reflected in all applications which use it. I use them heavily in my blog posts as it allows others to extend WEBCON workflows with complex functionality in minutes.

𝗗𝗮𝘁𝗮 𝘀𝗼𝘂𝗿𝗰𝗲𝘀
Due to data sources, we have a 𝘀𝗶𝗻𝗴𝗹𝗲 𝗽𝗼𝗶𝗻𝘁 𝗼𝗳 𝘁𝗿𝘂𝘁𝗵. This can be reused in every application.
𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱 𝗲𝘅𝗽𝗶𝗿𝗲𝗱? 𝗖𝗵𝗮𝗻𝗴𝗲 𝗶𝘁 𝗼𝗻𝗲𝘀 and everything works.
For additional information about data source, you can take a look here:
https://lnkd.in/ePm9Y-hY


𝗙𝗶𝗲𝗹𝗱𝘀
Last but not least, you may have 𝗰𝗼𝗺𝗺𝗼𝗻 𝗳𝗶𝗲𝗹𝗱𝘀 𝗮𝗰𝗿𝗼𝘀𝘀 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀, like a “Title” field. You can define these default fields as “𝗚𝗹𝗼𝗯𝗮𝗹 𝗳𝗶𝗲𝗹𝗱𝘀” which can be added to the process. The benefit of this is not only, that you have a single point which needs to be changed, but you can 𝗴𝗲𝘁 𝘁𝗵𝗲 “𝗧𝗶𝘁𝗹𝗲𝘀” 𝗼𝗳 𝗮𝗹𝗹 𝘄𝗼𝗿𝗸𝗳𝗹𝗼𝘄 𝗶𝗻𝘀𝘁𝗮𝗻𝗰𝗲𝘀 𝗮𝗰𝗿𝗼𝘀𝘀 𝗮𝗹𝗹 𝗮𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀.

[LinkedIn Post Part 15](https://www.linkedin.com/posts/krueger-daniel_webcon-ilovewebconbps-bpm-activity-7100064519724376064-AjXq/)

# Part 16:  In numbers I trust
{% include gallery id="gallery_Part16" caption="In numbers I trust" %}
there are three ways a software can achieve my trust:
1. Personal experience
2. Experience from others
3. Numbers from real life

This post focuses on the third one and I don't mean marketing/sales numbers. Don't take this personally. :)

I never have run into these regions mentioned in the slide show, but 𝗶𝘁’𝘀 𝗿𝗲𝗮𝘀𝘀𝘂𝗿𝗶𝗻𝗴 to know them. I have listed the public sources below.

WEBCON has an 𝗼𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗿𝗲𝗰𝗼𝗺𝗺𝗲𝗻𝗱𝗮𝘁𝗶𝗼𝗻 for setting up an environment 𝗳𝗼𝗿 𝗼𝘃𝗲𝗿 𝟭𝟬,𝟬𝟬𝟬 𝘂𝘀𝗲𝗿𝘀, which some customers surpassed by far.

If a human needs to interact with a workflow than this person receives a task. May it be some approval, enriching of the data or whatever. How about generating approximately 𝟭 𝗺𝗶𝗹𝗹𝗶𝗼𝗻 𝘁𝗮𝘀𝗸𝘀 𝗽𝗲𝗿 𝗺𝗼𝗻𝘁𝗵? Even if workflow goes back and force or have multiple steps/stages which create tasks, that’s quite a lot of workflows.

On the other hand, processing 𝟮.𝟱 𝗺𝗶𝗹𝗹𝗶𝗼𝗻 𝗶𝗻𝘃𝗼𝗶𝗰𝗲𝘀 𝗽𝗲𝗿 𝗺𝗼𝗻𝘁𝗵 is on a whole other page.
Not sure, whether these invoices are paper based invoices are they enter the system some other way, but there’s also a customer who processes over 𝟮𝟱𝟬,𝟬𝟬𝟬 𝗽𝗮𝗴𝗲𝘀 𝗽𝗲𝗿 𝗺𝗼𝗻𝘁𝗵 𝘄𝗶𝘁𝗵 𝗢𝗖𝗥.

What should you do with 𝟳 𝘁𝗲𝗿𝗿𝗮 𝗯𝘆𝘁𝗲 𝗼𝗳 𝗱𝗮𝘁𝗮? You can initially store it in your live database until it's no longer needed frequently, then transfer it to an archive database. However, 𝗮𝗿𝗰𝗵𝗶𝘃𝗶𝗻𝗴 a significant amount, like 𝟮𝟬𝟬,𝟬𝟬𝟬 𝘄𝗼𝗿𝗸𝗳𝗹𝗼𝘄 𝗶𝗻𝘀𝘁𝗮𝗻𝗰𝗲𝘀 with all associated data, 𝗰𝗮𝗻 𝘀𝘁𝗿𝗮𝗶𝗻 𝘆𝗼𝘂𝗿 𝘀𝘆𝘀𝘁𝗲𝗺, especially if it lacks features for offloading during low-activity hours and handling the entire process. That's build into WEBCON and 𝗶𝘁 𝘁𝗼𝗼𝗸 𝟭𝟲 𝗵𝗼𝘂𝗿𝘀 to complete it.


Of course, these numbers don’t happen when you start with a new platform. There are numerous companies who 𝘂𝘀𝗲 𝗪𝗘𝗕𝗖𝗢𝗡 𝗕𝗣𝗦 𝘀𝗶𝗻𝗰𝗲 𝗺𝗼𝗿𝗲 𝘁𝗵𝗮𝗻 𝟭𝟰 𝘆𝗲𝗮𝗿𝘀.

[LinkedIn Post Part 16](https://www.linkedin.com/posts/krueger-daniel_numbers-activity-7105068941240147969-PHn5/)
