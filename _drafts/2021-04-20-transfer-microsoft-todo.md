---
title: "Migrating Microsoft To Do from work to private account"
categories:
  - Private  
tags:
 
excerpt:
    A short description how Microsoft To Do Task can be transferred to another account.

---

# How To
While looking for ways to easily copy Microsoft To Do tasks from one account to another I came up with this simple solution, which requires the Outlook desktop App:

1. Creating target lists     
  Create the necessary lists in the target account inside Microsoft To-Do.
  ![Demo lists is created in target account.](/assets/images/posts/2021-04-20-transfer-microsoft-todo/2021-04-19-23-28-00.png)

2. Adding a new account   
  Go to `File\Info` and add both accounts. The one from which the tasks should be transferred from and the one to which the tasks should be transferred to. This will require a restart of Outlook.
  ![Adding an other account in Outlook](/assets/images/posts/2021-04-20-transfer-microsoft-todo/2021-04-19-22-59-36.png)
3. Copy tasks via Outlook   
  If the lists haven't been synchronized yet, wait for it to complete. Once it's complete you can copy the tasks from one to another via ctrl+c/v.
  ![Copy tasks from one account list to the other.](/assets/images/posts/2021-04-20-transfer-microsoft-todo/2021-04-19-23-38-21.png)

4. Check the target account   
  Depending on the number of tasks it may take some time until they are synchronized, but it will happen and with all properties. This includes completion state, recurrence and categories.
  ![Copied tasks have been synchronized](/assets/images/posts/2021-04-20-transfer-microsoft-todo/2021-04-19-23-13-33.png)

{: .notice--info}
**Info:** If the same list name exists in multiple accounts, the account name is added after the list name.

# Alternatives
## Backing up /Restoring  Microsoft To-Do Tasks
While looking for a solution I stumbled across the following post:
[Backup / migrate Microsoft To Do tasks with PowerShell and Microsoft Graph](https://blog.osull.com/2020/09/14/backup-migrate-microsoft-to-do-tasks-with-powershell-and-microsoft-graph/)

I wanted to use this approach to transfer the tasks but was blocked because of the tenant administrator didn't grant the required permissions.

## Using flow (Power Automate)
Quote from
[How can I import tasks in Microsoft To Do ? (urgent)](https://techcommunity.microsoft.com/t5/office-365/how-can-i-import-tasks-in-microsoft-to-do-urgent/m-p/890928)
You can do this with Flow, but only for yourself, there is no bulk import tool that can do this. But there is a Create to-do flow action that you can loop through from a CSV file that you feed to the flow via OneDrive.


## Import in Outlook via .csv File
Quote from
[How can I import tasks in Microsoft To Do ? (urgent)](https://techcommunity.microsoft.com/t5/office-365/how-can-i-import-tasks-in-microsoft-to-do-urgent/m-p/2103339/highlight/true#M33120)

To do this, you must be signed in to Outlook on a desktop – as far as I know this will not work on the web version. On the bottom left there is a tab to navigate to the “Tasks” page – click on this. If you are signed in to the correct MS account, your To-do list should be synced to this page. Find the list you want to upload to, and make sure there is at least one filler task in their for the time being so that you have a template to work from. Then, go to file > Open and export > Import/Export > Export to a file > Comma Separated Values > select your desired folder/list > save the file. Then you can go in and open that file, and add your tasks according to the template that was downloaded. Remember to save this as a CSV!

After you have edited and saved your CSV, go to file > Open and export > Import/Export > Import from another program or file > Comma Separated Values > Select your file > select your desired folder/list > import your tasks!