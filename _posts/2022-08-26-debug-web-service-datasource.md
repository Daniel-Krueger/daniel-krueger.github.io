---
title: "Debug a web service data source"
categories:
  - WEBCON BPS 
  - Private 
tags:
  - Fields
  - Data Sources
  - REST
  - Business Central
excerpt:
    How to view web service communication from WEBCON BPS with other systems. Business Central is used as a data source with filter mode 'web service'.
bpsVersion: 2022.1.2.31
---

# Overview  
Even so the usage of a REST data source is, in general, simple and well [documented](https://community.webcon.com/posts/post/rest-data-sources/173), there are cases when you have problems setting it up. This post will show you an option how to take a look at the executed requests. The use case will be that WEBCON BPS is run on a local environment which calls a Business Central REST web service. 

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-23-14-33.png" alt="Searching a BC REST data source using the popup search window." caption="Searching a BC REST data source using the popup search window." %}

In case you are running WEBCON BPS on WEBCONAPPS or you don't have admin permissions you can read [Debug a web service data source WEBCONAPPS](https://daniels-notes.de/posts/2022/debug-web-service-datasource-alternative) instead of chapter `Preparation` of this post.

# Preparation
## Prerequisites
For the described use case we have the following prerequisites


1. [HTTP Toolkit](https://httptoolkit.tech/), or another alternative to  intercept and view HTTP requests.
2. An account with admin permissions, to install the software and install the certificate in case of HTTPS secured requests.

## Configuration of HTTP Toolkit
After the download and installation of HTTP Toolkit you can click on  `Anything` from the `Intercept` screen for more information. 
{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-20-21-36-40.png" alt="View intercept `Anything` for more information" caption="View intercept `Anything` for more information" %}


{: .notice--info}
**Info:** If your web service communication doesn't use https, you can skip the rest of this chapter.

This will show detailed documentation from which you need to download the `Certificate Authority` via `Export CA certificate`. 
{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-20-21-36-24.png" alt="HTTP Toolkit `Anything` documentation" caption="HTTP Toolkit `Anything` documentation" %}

The downloaded file needs to be added as a trusted root certificate for the local machine. This can be done via the import wizard available from the context menu of the file, right click the downloaded file (1), select 'Install certificate' (2), choose 'Local machine' (3) and 'Trusted root certificate authorities' (4) via the browse dialog.

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-20-21-45-17.png" alt="Importing the HTTP Toolkit certificate authority certificate" caption="Importing the HTTP Toolkit certificate authority certificate" %}

## Configuration of WEBCON BPS
When you want to view the outgoing request send by WEBCON BPS you need to configure the proxy inside the Designer Studio. It's available in the System Settings\Global Parameters\ Proxy.

Make sure to activate it and use the URL provided by HTTP Toolkit.

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-21-48-30.png" alt="Setting up the proxy address" caption="Setting up the proxy address" %}

{: .notice--warning}
**Warning:** When you are finished, deactivate the proxy configuration. Otherwise all outgoing calls will fail, if you close HTTP Toolkit.

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-21-59-54.png" alt="Error entry in event log, if the proxy is not available." caption="Error entry in event log, if the proxy is not available." %}

# View outgoing web request
## Picker fields
### Successful request example
If everything is setup, you can test it using the  `popup search` to search for example for an item. The request will be visible in HTTP Toolkit under `View`. One search consists of a failed first call, because it's executed anonymously, and the second one is executed with credential and should succeed with status 200.

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-22-05-51.png" alt="Result of a successful call." caption="Result of a successful call." %}

### Typical problems with filter mode 'web service'
Depending on the underlying quantity of returned records you should make use of the filter mode `using web service`.
{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-22-17-04.png" alt="REST web service filter mode" caption="REST web service filter mode" %}
Quote from the help:
```
Filtering according to the phrase (typed or selected with the picker) can be carried out in 2 ways: 
 
(1) Filtering on the side of the Web Service allows the invoked phrase to be transferred as a parameter. This way, the whole logic of the search is kept on the side of the Web Service.
 
(2) Filtering on the side of BPS means that all data returned by the Web Service can to be narrowed down to only those searched for by the user. This way, there is no need to implement a filtering system within the Web Service. 
```

Using this filter mode via an OData capable web service will be simple. You can use the `Searched column` and `Searched value` to get the column / value entered by the user.
{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-22-22-56.png" alt="Using web service filter mode." caption="Using web service filter mode." %}

The above screenshot may introduce the first problem. By default `Everywhere` is selected which will search all columns. In the example, this will cause a problem. The filter expects a single column but `Everywhere` translates to a comma separated list of the `Searching`  columns. In our case the executed requests fails.

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-22-28-10.png" alt="`Everywhere` searches two fields" caption="`Everywhere` searches two fields" %}

{: .notice--info}
**Info:** Take a look at the successful example. You can see that only one column was selected in the popup search due to the selected field in the drop down.

There's one other caveat, that's the automatic creation of the response (1). The internal name of all elements inside a collection will be prefixed with the name of the collection (2). The `Picker Filter:Search Column` will use these internal names. Which in turn will fail, because the name with the prefix will not be known by the called system.

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-26-21-27-39.png" alt="The internal name is used for filtering." caption="The internal name is used for filtering." %}
Changing the internal name, will fix this but you may need to setup the picker fields again because the internal name is used in the configuration.


## Web service requests from an action
Actually, there's no need for HTTP Toolkit if a path transition executes a web service action.
If you look in the history you will find the execution of the action and an error message:

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-22-49-49.png" alt="REST action error in normal user view mode." caption="REST action error in normal user view mode." %}

If you switch to admin mode though, the log will be displayed. You will see the request as well as the response. 

{% include figure image_path="/assets/images/posts/2022-08-26-debug-web-service-datasource/2022-08-25-22-52-25.png" alt="REST action error in admin mode shows the request and log." caption="REST action error in admin mode shows the request and log." %}

{: .notice--info}
**Info:** WEBCON did make a dream of mine come true, when I first learned about this four years ago. How did I struggle with other platforms to get this information... 





