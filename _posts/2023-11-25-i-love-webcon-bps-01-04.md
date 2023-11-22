---
regenerate: true
title: "I 💗 WEBCON BPS series: Part 01-04"
categories:
  - WEBCON BPS
  - Private 
  - Series 
tags:  
  - I 💗 WEBCON BPS
excerpt:
    This post contains part 01-04 of my LinkedIn post series I 💗 WEBCON BPS.

gallery_Part01:
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_1.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_2.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_2.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_3.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_3.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_4.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_4.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_5.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_5.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_6.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_6.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_7.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_7.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_8.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_8.png.thumb.jpg
    alt: ""
    title: ""
  - url: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_9.png
    image_path: /assets/images/posts/2023-11-01-i-love-webcon-bps/Part1_9.png.thumb.jpg
    alt: ""
    title: ""    
---
{: .notice--info}
**Info:**
This is mostly a copy of my LinkedIn series. The content is the same just some formatting / references / links have been updated.

# Part 1: 99% Low-code/no-code implementation 1% high code  

{% include gallery id="gallery_Part01" caption="Carousel: 99% Low-code/no-code implementation 1% high code" %}
I’m using WEBCON BPS since 2018 to digitize processes which require human interactions. Each platform provided the following things out of the box, so that one can focus more on delivering value instead of doing 'chores':

- Data layer for storing/retrieving the data
- Security framework
- Versioning/traceability
- Form design

While Navision[^1] and SharePoint required coding to build the applications, WEBCON BPS is a low-code/no-code platform. So, I can focus even more on providing benefits for the business. The slide show shows some examples of the no-code/low-code options. You can get an overview of all actions in the [online documentation](https://docs.webcon.com/docs/2023R2/Studio/Action/).

[^1]: Navision was renamed to Dynamics NAV in 2005. Dynamics 365 Business Central (BC) is the latest name.

For the high-code developers who read this: In five years I have never hit a wall with WEBCON BPS. Of course, I have encountered obstacles or not 100% satisfying user experiences with the out of the box options. But when you really need it, you can use the WEBCON BPS SDK to write plugins adding .Net code or React components to achieve just that. The times I needed to resort to these were rare though.
Link to the [developer portal](https://developer.webcon.com/).

{: .notice--info}
**Info:** If anyone has hit a wall implementing a process with human interaction using a low-code platform, please get in touch with me. I really want to test those scenarios.


[LinkedIn Post Part 1](https://www.linkedin.com/posts/krueger-daniel_webcon-bps-no-code-low-code-high-code-activity-7059037292216102912-SFYM/)


# Part 2: Leveraging benefits aka early go-live in < 2 month

{% include video id="2adXNykaM6U?autoplay=0&loop=1&mute=1&rel=0&playlist=2adXNykaM6U" provider="youtube" %}

During a kick-off for a new project, I encourage everyone that we need to aim for a go-live in at most two month. The first version will contain the most relevant processes and features. Everything else can be delivered in the upcoming iterations. If it’s necessary at all.

This is possible, thanks to the way WEBCON has designed the platform WEBCON BPS. All workflow instances will continue using the latest version. This is possible thanks to InstantChange™. We don’t lose anything. We can reap the benefits of the first improvements early. Instead of creating a 'finished' application, we can publish an early application. It will consist of the absolute minimum of functionality. This allows us to see how it behaves in the real world. More importantly, we see how the users interact with it. In addition, we make the journey together as they can provide feedback early on.

The two-month time-frame is based on the limited availability of my counterparts.
After all it’s my job to support / implement / digitize the new process but this is not true the other way around. It's just something which needs to be done in addition to their daily business. If we could lock us in, decide everything and don’t need any external help, it could be way faster. If you are interested in how fast a complex application can be create, you can take a look at the [Digitizing homeowners association processes](https://www.linkedin.com/feed/update/urn:li:activity:7036576448903569408/).

[LinkedIn Post Part 2](https://www.linkedin.com/posts/krueger-daniel_webconbps-digitizinghoaprocesses-ilovewebconbps-activity-7061574007455641600-YINU/)

# Part 3: Transporting applications Dev->Test->Prod
{% include video id="_ktISniMpH8?autoplay=0&loop=1&mute=1&rel=0&playlist=_ktISniMpH8" provider="youtube" %}

WEBCON BPS is all about application life cycle management or better said, it’s part of it's DNA. In this post I will focus on the transport only. The only option to ignore the built-in mechanisms, is when you have a production environment in name only. With this I mean, that you have a single environment, and your users are entering production data in your development environment. :)

So, how does it look like, when you want to transport an updated application to another environment? In WEBCON BPS you create an export package which contains everything related to this application which can in turn be imported to the target environment and you don’t need to do anything else after the import[^2].

[^2]: When you define new user groups, you need to assign the members of these groups in the target environment.

This package contains for example:
- Process definition
- Form definition
- Reports, dashboards and other UI elements
- User groups
- Permissions
- Master data / configuration data, if you want
  
It doesn't stop with the selected application. If any artifact from other applications are used, these applications can be exported too.

If your process needs values which depend on dev/test/prod environment, WEBCON BPS has you covered. You can define 'constants' and assign a shared value or specific value for each environment. This works because, the target environment knows whether its dev/test/prod so the correct value will be used.
Communications with external systems are handled in a similar manner, so this isn’t an issue either. If you are thinking that using the same process across multiple subsidiaries which use different data sources would cause a problem, I have to inform you that WEBCON BPS here too. But this is worth an own post and it’s a reason why I 💗 WEBCON BPS. :)



[LinkedIn Post Part 3](https://www.linkedin.com/posts/krueger-daniel_webconbps-webcon-ilovewebconbps-activity-7064111225625825280-6r3Z/)
# Part 4: Change request there’s a typo
{% include video id="1ZaOdbmdGCA?autoplay=0&loop=1&mute=1&rel=0&playlist=1ZaOdbmdGCA" provider="youtube" %}

WEBCON BPS is all about bringing together the strength of the business and the IT department. Up to version 2022 the business could:
- Define a process
- The fields and which is displayed when where
- Describe what’s happening like ‘when I click here, magic stuff happens’
- Test the prototype with actual data

This is called the Citizen-Assisted Development in WEBCON BPS. Why assisted and not 'real' citizen development? I have a good example from yesterday. A workflow consists of a parent and sub workflows which make up steps. Each step consists of different required information and optional documents to be filled out. The new change:
Under specific circumstances we notice in step x that we need to repeat some of the earlier steps. So, we need an option to choose and copy some of the previous steps, but without the entered responses. These copied steps need to be inserted between the current and next step. Of course, we need to renumber the steps and the changes need to be reflected in the generated document.

That’s far easier to describe than to implement and I really wonder, whether the business would want to do it and has time to do so.

Up to now, these changes trickled in different ways outside of the platform, with the new WEBCON BPS 2023 release though, there’s an integrated change request. This is available for each application and the users can provide feedback/change requests using this feature without leaving the platform and missing default information like, when and where. These changes can be sent, to an external ticketing system if necessary. I really love this new feature.

One other new addition is that the business can now not only create change requests for typos, missing translations or inappropriate labels, but instead change these themselves. I really need this feature in a current project, because I can speak only German and English, but we need Spanish, French, Italian and more.

I have never met anyone in IT who liked translating / labeling elements, because most of the time they are wrong. Now this can be done by those who actually know about it.

The best thing is that the application life cycle is applied here too. You can, by default, only provide translation in the development environment. If a process is transported to another environment, then you get a warning, that changes cannot be made, because it was transported. :)

[LinkedIn Post Part 4](https://www.linkedin.com/posts/krueger-daniel_webconbps-webcon-ilovewebconbps-activity-7066647437456617472-EWKL/)

