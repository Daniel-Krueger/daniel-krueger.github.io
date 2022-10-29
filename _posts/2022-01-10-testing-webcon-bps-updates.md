---
title: "Testing WEBCON BPS updates"
categories:
  - CC LS
  - WEBCON BPS  
tags:
  - Template
excerpt:
    An approach on how to test the most basic functionalities after installing a new WEBCON BPS version.
bpsVersion: 2021.1.4.84
---

# Overview  
Every month a new WEBCON BPS version is published. Whether you try to stay on top on the latest version or an older one, there will be a time, when you need to install a new update. Depending on the time you are already using WEBCON BPS the number of your applications will have grown so big, that it won't be possible to test every single process in your development environment. At least if you aren't using a fully automated UI based test framework. Even if you would be able to do it and everything was fine, would you update the test and production environment without an additional check? My answer to this question is 'No'. I would still test the most fundamental things on each environment just in case. Since I don't want to mess up the numbering just for testing I created an own `Update test` application. 

If you are wondering whether this will do any good, we recently updated from 2021.1.3.205 to 2021.1.4.84 and I didn't expect that the replacement for a calculated value and a multi language autocomplete picker would not be replaced, also it worked before. After adding the fields again in the template everything was fine.

{% include figure image_path="/assets/images/posts/2022-01-17-testing-webcon-bps-updates/2022-01-10-20-56-48.png" alt="The replacement of two fields worked in 2021.1.3.205 but did not in 2021.1.4.84 without updating the template. " caption="The replacement of two fields worked in 2021.1.3.205 but did not in 2021.1.4.84 without updating the template. " %}

# WEBCON BPS Version number and their risk level
## Structure of version numbers
Everyone who has installed WEBCON BPS is familiar with the four part version number or example 2021.1.4.84. 
{% include figure image_path="/assets/images/posts/2022-01-10-testing-webcon-bps-updates/2022-01-10-22-53-02.png" alt="Parts of the version number" caption="Parts of the version number" %}

The first number is the number of the major release matching the calendar year in which the version came out. Ok, in the past the release has been published a few days before the new year, but don't be too strict with this one. The major version contains a whole bunch of new things and typically bigger changes.\
The second part stands for? I have no idea; I haven't seen another number than 1. :)


The third part is the number will be increased, when there are new features ready for the general public and is called (hot) refresh. There has been a time when there was only one hot refresh but in 2021 there have been three refresh updates. So we ended up with a version 2021.1.4.*. Once a new major version is released there won't be any more hot refresh updates. All new features of a hot refresh will be part of the change log of the next major update.


The fourth part is (probably) the build number for this major version. Not every build will be made available so the monthly updates will have gaps between them. These updates will contain fixes and small improvements to existing features but no new ones. These kind of updates will also be provided for older versions. For example, the latest 2020 version has the version number 2021.1.3.572, even so they may not be published each month.

## Risk level of installing an update
No one is perfect, so there will always be problems but as long as you prepare, this isn't a showstopper. In my experience the risk of encountering an issue is more likely if either the major, first part, or the refresh number, third part, of the version number increases. If these stay the same, it's unlikely that you will have any problems.

{% include figure image_path="/assets/images/posts/2022-01-17-testing-webcon-bps-updates/2022-01-10-21-24-00.png" alt="Installing a new hot refresh is riskier than installing a build which contains only bug fixes, only the build number changed." caption="Installing a new hot refresh is riskier than installing a build which contains only bug fixes, only the build number changed." %}

As a rule of thumb, I do a simple test in the latter case by executing my  `Update test` process. In all other cases I will fully test up to two complex processes in the development environment. On test and production, I will only execute the `Update test` process.

{: .notice--warning}
**Remark:** Most of the time I'm working for clients in the regulated industry, so my level of 'risk' is more strict than others. :)

# Update test process
It's quite a simple process which could be expanded. 
{% include figure image_path="/assets/images/posts/2022-01-17-testing-webcon-bps-updates/2022-01-10-21-28-11.png" alt="Workflow of the `Update test` process" caption="Workflow of the `Update test` process" %}

1) The "Step field values" is used for testing the most fundamental fields.
{% include figure image_path="/assets/images/posts/2022-01-10-testing-webcon-bps-updates/2022-01-10-22-38-12.png" alt="Three tabs for testing fields" caption="Three tabs for testing fields" %}

2) Once completed a document is created referencing all fields. The template for the generated document is retrieved from a document template process, which is part of this application.
{% include figure image_path="/assets/images/posts/2022-01-10-testing-webcon-bps-updates/2022-01-10-22-38-45.png" alt="A document is generated which displays the entered values." caption="A document is generated which displays the entered values." %}

3) The transition to this step will be triggered by a timeout. An item list with checks will be displayed. I didn't expect this, but it helped me to find the above issue.
{% include figure image_path="/assets/images/posts/2022-01-17-testing-webcon-bps-updates/2022-01-10-21-49-32.png" alt="Typical checks, which needs to be executed after every update." caption="Typical checks, which needs to be executed after every update." %}

# Download
The process  itself is easy to create. but if you are running the same version, you could simply use download one from my [GitHub repository](https://github.com/Daniel-Krueger/webcon_processes/tree/main/Update_test).

{: .notice--warning}
**Remark:** I've used my [Uniform path button style](https://daniels-notes.de/posts/2021/path-button-styling) approach, so two global constants will be added. 

{: .notice--warning}
**Remark:** The template contains three business entities. So you may need to clean them up afterwards.


