---
title: "Update log4j using a PowerShell script"
categories:
  - WEBCON BPS  
tags:
  - PowerShell
excerpt:
    A short explanation of a PS script which can be used to automate the update of log4j files used by SOLR.
bpsVersion: 2021.1.3.205
---

# Overview  
On 2021-12-13 a documentation has been added to [update log4j](https://community.webcon.com/articles/security-apache-solr-affected-by-apache-log4j-cve-2021-44228/39) to fix the newly found vulnerabilities.

Since I don't like to do things manually, I created a PowerShell script for this process after returning from my vacation. 


# Script information
Basically the script does everything which is listed in the documentation.
1. The script downloads, the log4j version into the temp folder. Afterwards it's extracted and the unnecessary javadoc and sorces files are removed.
2. The search services is stopped
3. The existing files in the two folders are removed, requesting your confirmation.
4. The new files are copied into the folders
5. Search service is restarted
6. The verification URLs are opened to check whether SOLR could be restarted. This could take a few seconds until the page is displayed and you may need to refresh the URL.

The script checks, whether it's executed with administrative privileges. These are necessary to start/stop the search service.
Things which can be changed: 
1. The URL of the latest version
   ```powershell
   $fileUrl = "https://dlcdn.apache.org/logging/log4j/2.17.1/apache-log4j-2.17.1-bin.zip"
   ```
2. If you don't want to confirm the deletion you can remove the -Confirm flag. I used this to verify the correct file path.
   ```powershell
      # With confirmation
      Get-ChildItem $solrContribFolder  -Filter $log4jApiFilePattern | Remove-Item -Confirm
      # Without 
      Get-ChildItem $solrContribFolder  -Filter $log4jApiFilePattern | Remove-Item 
   ```
# Download
The script  can be downloaded from this [repository](https://github.com/Daniel-Krueger/webcon_helpers/tree/main/log4j_update).\
[Direct download](https://github.com/Daniel-Krueger/webcon_helpers/raw/main/log4j_update/update_log4j.ps1)

