---
title: "Quickly search a website using a search engine"
categories:
  - Private
  - GitHub
tags:
  - JavaScript
excerpt:
   Quickly search your current (public) website using your favorite search engine.
---


# Introduction
I find myself quite often on a website without a good search experience. In most cases these are blogs or forums which sometimes don't even have a search option.
Using the same approach as in [HTML 5 Video play control without extension](https://daniels-notes.de/posts/2021/html-5-video-play-control), I put together some JavaScript which allows to search the current website using the  favorite search engine.

{% include figure image_path="/assets/images/posts/2021-07-14-quickly-search-current-website/2021-07-14-21-35-17.png" alt="A simplified option to search a specific page." caption="A simplified option to search a specific page." %}

# How to use it
## Creating the bookmark
Create a bookmark with the following line.
```
javascript:(function(){if (typeof(window.dkr) == "undefined" || typeof(window.dkr.searchEngines) == "undefined"){var scr = document.createElement('script');scr.type = "text/javascript";scr.src = "https://cdn.jsdelivr.net/gh/Daniel-Krueger/js_snippets@0.6-beta/search/dkr_search.js?engine=bing";scr.async = true;document.getElementsByTagName('head')[0].appendChild(scr);} else{window.dkr.searchFunction();}})();
```

The above line uses Bing as the default search engine. But you can replace `dkr_search.js` with one of the following to explicitly define a search engine:
  - Bing: `dkr_search.js?engine=bing`
  - DuckDuckGo: `dkr_search.js?engine=duckduckgo`
  - Google : `dkr_search.js?engine=google`
  - Yahoo: `dkr_search.js?engine=yahoo`


{% include figure image_path="/assets/images/posts/2021-03-01-html-5-video-play-control/2021-03-01-21-53-58.png" alt="Adding the load script as a bookmark/favorite" caption="Adding the load script as a bookmark/favorite" %}

{: .notice--warning}
**Remark:** There must not be any line breaks.

## Using the bookmark
Browse to your favorite  site and click on the bookmark. There are two  different outcomes:
1. If everything works fine a modal dialog will be displayed. 
2. If no dialog appears, there was something wrong with the bookmark or the script is no longer available.

{% include figure image_path="/assets/images/posts/2021-07-14-quickly-search-current-website/2021-07-14-20-57-12.png" alt="The dialog which is displayed after clicking on the bookmark" caption="The dialog which is displayed after clicking on the bookmark" %}

The dialog contains a drop down which limits the search results to all pages starting with the URL.
{% include figure image_path="/assets/images/posts/2021-07-14-quickly-search-current-website/2021-07-14-20-58-09.png" alt="The drop down is populated using the different parts of the URL" caption="The drop down is populated using the different parts of the URL" %}

{% include figure image_path="/assets/images/posts/2021-07-14-quickly-search-current-website/2021-07-14-21-06-06.png" alt="Search results are limited to the selected start URL" caption="Search results are limited to the selected start URL" %}

I didn't test the script with all major browsers and options to execute a bookmark. But I'm quite sure that my test from the mentioned video play control apply here to: 

Browser|Bookmark dialog| Bookmark bar|
---|:---:|:---:|
Chrome|x|x|
Edge|o|x|
FireFox|x|x|

# Improvements
## Styling
The modal dialog is based on https://w3bits.com/javascript-modal/ and uses parts of the styles of the website, so it may look a little bit different on another site. If someone want's to fix this you are welcome. :)

## Languages
The labels of the dialog are displayed in German or English, depending on your browser language. If you can provide me with other labels, I will be glad to add them.

Code excerpt for German translation part:
```
    if (userLang === 'de') {
        searchPhraseLabel = "Suchbegriff";
        searchLocationLabel = "URL beginnt mit";
        searchButtonLabel = "Suchen";
    }
```



# Bookmark explanation
The script pasted as a bookmark URL loads a minified version of a JavaScript [file](https://github.com/Daniel-Krueger/js_snippets/blob/main/search/dkr_search.js) from my GitHub repository. Since you cannot directly reference files from GitHub it's loaded via: https://www.jsdelivr.com/

The URL of the file contains a specified version @*. This specifies the [release](https://github.com/Daniel-Krueger/js_snippets/releases/tag/0.6-beta). 
../gh/Daniel-Krueger/js_snippets **@0.6-beta** /search/dkr_search.min.js
Only this version of the file will be loaded. With this option you can rest without fears, that something bad will be added to the code in the future.