---
regenerate: true
title: "I 💗 WEBCON BPS series: Part 05-08"
categories:
  - WEBCON BPS
  - Private 
  - Series
tags:  
  - I 💗 WEBCON BPS
excerpt:
    This post contains part 05-08 of my LinkedIn post series I 💗 WEBCON BPS.

gallery_Part05:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_1.png.thumb.jpg
    alt: ""
    title: ""                           
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_2.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_2.png.thumb.jpg
    alt: ""
    title: ""                           
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_3.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_3.png.thumb.jpg
    alt: ""
    title: ""                           
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_4.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_4.png.thumb.jpg
    alt: ""
    title: ""                                       
gallery_Part07:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_1.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_2.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_2.png.thumb.jpg
    alt: ""
    title: ""    
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_3.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_3.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_4.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_4.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_5.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_5.png.thumb.jpg
    alt: ""
    title: ""
                   
---

# Part 5: Greatly reduced testing time

{% include gallery id="gallery_Part05" caption="Carousel: Greatly reduced testing time" %}

Even a low code platform offers numerous opportunities to introduce problems in one’s application. Especially if the platform is feature rich and doesn’t focus on a single use case. We just don’t come around testing and the InstantChange™ technology is one key feature, which let me fell in love with WEBCON BPS.

A workflow, or more precisely a workflow instance in WEBCON BPS, is stored as a data row. The instance is not started with a specific version of the workflow, it is unaware of the currently deployed version. It will use the deployed version when the workflow instance is “used” in some way, for example when it’s moved from one step to another, or better, from one state to another.

I can understand comments like: *A workflow instance should use the version, which was valid, when it was started*. There are benefits to this, but also numerous problems. Not the least of those is explaining to managers, that they need to approve numerous ongoing requests again, because they had to be started again to fulfill new policies. I wonder how many workflows had to be stopped and restarted after implementing new policies due to COVID.

Thanks to the fact that the workflow instance is just a data row, any deployed version is immediately effective. The new policies are in place and the workflow instance will carry on as nothing happened.
You can imagine what this means for testing. This greatly reduces the wasted time:
- You can just use the existing data to verify any UI changes.
- You don’t need to recreate the test data, to fix bugs.
- Continue after fixing the bug without redoing everything will keep the employees happy.
  
This is possible because WEBCON BPS is transactional. If the transition from one step/state to another involves numerous actions, either everything is successful or none[^1].

[^1]: At least if you don't communicate with external systems like uploading a document to OneDrive. You would need to handle the deletion of the document in an Error handler yourself.

{% include figure image_path="/assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_2.png" alt="Transaction enforces that all works or nothing happened at all" caption="Transaction enforces that all works or nothing happened at all" %}

This doesn’t mean, that you can test those actions only after saving your changes. In most cases you can actually test these already before saving. You can select the workflow instance, and the Designer Studio will run the action using, with the data of this workflow instance.
{% include figure image_path="/assets/images/posts/2023-11-01-i-love-webcon-bps/Part5_4.png" alt="Test logic before saving" caption="Test logic before saving" %}

[LinkedIn Post Part 5](https://www.linkedin.com/posts/krueger-daniel_post-5-testing-changes-activity-7069186669039509505-IkeB/)


# Part 6: Time to market
{% include video id="M85SM38vOU0?autoplay=0&loop=1&mute=1&rel=0&playlist=M85SM38vOU0" provider="youtube" %}

All of the previous parts have one thing in common they describe different aspects of WEBCON BPS which reduced the time to market. But don't take my word for it just listen to [Mike Fitzmaurice](https://www.linkedin.com/in/mikefitzmaurice/) who described the different aspects in the [WEBCON BPS 2023 What's new? webinar](https://www.youtube.com/watch?t=79&v=oV3SX3hcXz8&feature=youtu.be)

Actually, I wanted to post about it later, but I started yesterday, 2023-06-05, an implementation for a generic "Risk Assessment" after a meeting on Friday with [Christian Sallaberger](https://www.linkedin.com/in/christian-sallaberger-282285227/). Today I've finished the version we will review next Tuesday. It was decided in advance to spent two days (16 hours) on this. At this point in time we are short a few hours of the alloted time.

Application features:
- Create risk assessment based on risk objects
- Risk objects are categorizes
- A blank risk assessment can be started for an object or risks can be copied from any another assessment
- Risks are evaluated and an overview exists
- Measures can be defined for risks, which have a due date but can be postponed
- Measures define the new risk
- Once all measures are defined the assessment is moved to review and the risks are updated
- A date for a next assessment can be define
- Upon reaching the date, a new assessment is started reusing the risks of the latest assessment for the same object
- There's an overview of the Top risks across all objects

Relevant features provided by the platform
- Attachments to any workflow
- Commenting
- Audit trail
- Security model
- Mail system

Deploying the risk assessment, will contain the process, data model, form, UI elements, security settings as well as the configuration of the categories and objects. I do believe we will achieve our goal and I think this is a good example for "Time to market".
Of course, one application alone would be a waste of for the *Application factory* WEBCON BPS. Other applications are in progress or planned, two of which are tightly integrated with Business Central.

Edit for the blog post:
In the mean time, we have four applications live and two are waiting for ERP go live.

[LinkedIn Post Part 6](https://www.linkedin.com/posts/krueger-daniel_webconbps-applicationfactory-webcon-activity-7072075705638903810-k4Hj/)

# Part 7:  Gather debugging information
{% include gallery id="gallery_Part07" caption="Carousel: Gather debugging information" %}

In [part 5](#part-5-greatly-reduced-testing-time) I talked about how WEBCON BPS greatly reduced the time spent on testing. What I didn’t cover was how you could actually identify a problem aka debugging.

You always know, how something should work out, after all you can take a look at the workflow definition, the paths, the actions and so on. For example, you defined a logic, which sends a mail to the person who receives the next task in a work-flow, except that this mail should only be send, if the person who caused the movement of the workflow is someone else. If they are the same, no mail is necessary. Of course, this works when you test it, but will it also work when you are not around? 

In WEBCON BPS you know what was executed and not in a log file but at your finger tips where you need it. This kind of information, can be found in the workflow history. A detailed look at the history will also provide more information about the action, as you can see in the slide show and if you are an admin you can see even more. So, you don’t need to rely on the users memory, if they tell you which workflow it was, you will find the problem.

{% include figure image_path="/assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_2.png" alt="Log information are available with three clicks" caption="Log information are available with three clicks" %}

If the workflow needs to 'talk' with an external system, you can actually see the communication. There’s no need to gather data from different sources and map them together. If you need to check what happened on 9th November 2021, you can just go to the workflow history and take a look at it. This makes auditors as well as developers really happy.
{% include figure image_path="/assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_3.png" alt="Sensitive log information are restricted to admins" caption="Sensitive log information are restricted to admins" %}

Up to now I talked about getting information when the workflow moved from one step to another, but what about errors in the browser and something fails or it takes a really long time? The user can just activate the diagnostic mode, save the session.
{% include figure image_path="/assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_4.png" alt="User records what he does" caption="User records what he does" %}

An admin can take a look at at what has been executed and even how long it took.
{% include figure image_path="/assets/images/posts/2023-11-01-i-love-webcon-bps/Part7_5.png" alt="An admin can review the execution of the users action" caption="An admin can review the execution of the users action" %}


If you still weren’t able to solve the issue, your last resort would probably be to go to the user and see what he was doing, either in person or with some kind of screensharing. Thanks to WEBCON there’s no need for this. The user can grant you the permissions to impersonate him. Which allows you to do everything in the system with the users privileges instead of your own. But this is worth an own post and another reason why I 💗 WEBCON BPS.

[LinkedIn Post Part 7](https://www.linkedin.com/posts/krueger-daniel_debugging-in-webcon-bps-activity-7075352044458389504-8VpS/)

# Part 8: Being CEO for a day (working on behalf)
{% include video id="kS2-vcQA6bI?autoplay=0&loop=1&mute=1&rel=0&playlist=kS2-vcQA6bI" provider="youtube" %}

The working on behalf features was introduced in WEBCON BPS 2022 and for me this one is revolutionary. Assume that you want to go on vacation and you have three different roles.
- As a superior you need to approve vacation requests
- As a project member you have your own tasks to work on
- As a member of the board committee, you have access to classified data

Before going on vacation, you can select:
- Tiffany to work in your name for the vacation requests.
- Kurt will take over your project tasks.
- No one should replace you in your board committee role.

Working on behalf, will allow Tiffany and Kurt to use the system as if they were you. For the allowed applications or whole platform, they
- will have your privileges.
- work on your tasks.
- start new workflows.
 
If they do something, this is logged in the history of course, that they did it in your name.
I don’t know any other system which would allow this and especially not across all processes.

  
This is not only useful in daily business. You can 'misuse' this feature to:
- Do demos with different roles as a single person.
  I’ve used browser profiles before, but the change of the role was easily missed. This is not the case when using the Work on behalf feature.
- Tests the application with different roles.
- Debug a process if something only happens for a specific user.
  The user can simply tell the system that you are allowed to do so, and you can debug it in his name on your machine instead of stealing his time with a screenshare.

The last one is what I hinted at in my previous post [Gather debugging information](#part-7-gather-debugging-information). There's only one last part missing in testing/debugging and that is sending mail by the system. This could get annoying for the users, if you use their accounts during testing. It wouldn't be WEBCON BPS if WEBCON wouldn't have you covered. :)


[LinkedIn Post Part 8](https://www.linkedin.com/posts/krueger-daniel_webcon-ilovewebconbps-webconbps-activity-7076793794347577344-sL--/)
