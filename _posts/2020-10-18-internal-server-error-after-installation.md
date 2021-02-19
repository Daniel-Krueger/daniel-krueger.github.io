---
title: "Internal server error after installation"
categories:
  - WEBCON BPS
  - Cosmo Consult
tags:
  - BPS Portal Installation
excerpt:
    Invalid web.config line -1 error after installation BPS Standalone 
toc: false
bpsVersion: 2020.1.3.411
---
I created an azure VM from a template, installed IIS, .Net Core hosting bundle and Webcon BPS in standalone mode. Even so I have done this numerous time, I was unable to browse to the portal because of the following error.

![Error message](/assets/images/posts/missing_core_module/missing_core_module_error.png)

In the end it's quite simple. I did install the .Net Core hosting bundle before the installation of IIS has been completed. Due to this the AspNetCoreModule was not installed and the above error was raised.

**Reminder:** Wait for completion of the IIS installation before installation of the hosting bundle.
{: .notice--info}