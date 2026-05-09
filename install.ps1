# Verify which github-pages version is compatible with ruby
# https://rubygems.org/gems/github-pages/versions/232
# I only noticed that a lower version has been installed
# gem "github-pages" installed (223) and there had been others, which caused issues and when I wanted to update to
# 
# gem "github-pages", ">=230",
<#
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
#>

# github-pages >= 228 requires Ruby >= 2.6, < 4.0.
#winget install RubyInstallerTeam.RubyWithDevKit.4.0
#winget install RubyInstallerTeam.RubyWithDevKit.3.4
#New  sessions 
# Open a new command prompt window from the start menu, so that changes to the PATH environment variable becomes effective. Install Jekyll and Bundler using 
gem install jekyll bundler

https://jekyllrb.com/docs/installation/windows/