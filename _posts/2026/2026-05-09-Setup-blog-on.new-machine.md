---
title: "Local build of the blog on a new machine"
categories:
  - Private 
tags:
excerpt:
    "Notes for my future self on how to setup/update the blog/gems on a new windows machine."
---

# Overview
I should have been aware that building my blog on a new machine with the latest components would work. Since I don’t want to spend numerous hours the next time again, I’m creating this guide.

# Original approach 
## Install ruby
From a command line search for the available Ruby versions
``` 
winget search Ruby
```
Install the latest version with RubyWithDevKit
``` 
winget install RubyInstallerTeam.RubyWithDevKit.4.0
```
## Install jekyll and bundler
After the installation a new command line session needs to be started. Ruby will update the PATH variable.
Install jekyll and bundler from the blog root folder.

```
gem install jekyll bundler
```
## Update bundler verion
```
bundle update --bundler 
```
## Install gems
Trigger the installation of all listed gems from the blog root folder.
```
bundle install
```

## Result
Happy debugging in finding all issues which are caused due to old gem versions which are not compatible with the latest Ruby/jekyll/bundler combination. One of the symptoms I’ve run into:
-	Gem is not compatible with a version
-	Gem building fails
-	According to internet searches it’s fixed in the latest version
-	Silently an older gem version was installed which was installed because a nested gem isn’t compatible with other components

# Future approach
## Installation
1. Install the latest versions 
  Same approach as before but an improved process to find out all issues. 
1. Define latest github-pages gem
  Search for the latest version
  ```
  gem search github-pages
  ```
  and force the latest version in the gemfile
  ```
  gem "github-pages", "232"
  ```
1. Execute `bundle install`
  This may output a version conflict with the installed components. I don't have any idea how to check the supported Ruby, jekyll version without installing a version before.
  ```
    Because github-pages >= 228, < 232 depends on jekyll-commonmark-ghpages = 0.4.0
    and github-pages >= 232 depends on jekyll-commonmark-ghpages = 0.5.1,
    github-pages >= 228 requires jekyll-commonmark-ghpages = 0.4.0 OR = 0.5.1.
    And because jekyll-commonmark-ghpages >= 0.2.0 depends on jekyll-commonmark ~>
    1.4.0,
    github-pages >= 228 requires jekyll-commonmark ~> 1.4.0.
    And because jekyll-commonmark >= 1.4.0 depends on commonmarker ~> 0.22
    and commonmarker >= 0.22.0, < 1.0.0.pre depends on Ruby >= 2.6, < 4.0,
    github-pages >= 228 requires Ruby >= 2.6, < 4.0.
    So, because Gemfile depends on github-pages >= 230
    and current Ruby version is = 4.0.3,
    version solving has failed.
  ```
3. Install the allowed version of Ruby
4. Execute `bundle install` again
5. Execute `run_server.bat`file and take a look at the warnings regarding missing gems. There may be gems which are no longer installed by default.
` warning: fiddle/import is found in fiddle, which will no longer be part of the default gems starting from Ruby 4.0.0. `
## Minimal mistake migration
In case there's a new version of minimal mistakes:
1. Review the [Quick-Start Guide](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/) for new gem files to reference
2. Update the remote theme version
3. Execute `run_serve_trace` as this does not use the `incremental` flag which causes problems when updating files in the next step
4. The files in the `_includes` and `_layouts` should be compared and updated accordingly. The `custom.html` can be ignored, it contains only custom HTML.



