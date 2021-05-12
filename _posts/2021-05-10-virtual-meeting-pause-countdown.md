---
title: "Virtual meeting pause countdown"
categories:
  - GitHub Project
  - Private  
tags:
 
excerpt:
    A short explanation of the PowerShell script to display the left time of a pause in a browser.
last_modified_at: 2021-05-12

---

# Description
Virtual meetings are common in today's world and it's also known that you should take a [break](https://www.forbes.com/sites/brucerogers/2021/04/20/our-brains-need-breaks-from-virtual-meetings/) in a longer meeting. I  prefer to show the participants a little countdown until the break ends. Since I dislike doing repetitive tasks manually, I created a small PowerShell script to do this for me[^1]:

[^1]: At the time the gif was created the 'Sound reminder' option was not available.
{% include figure image_path="/assets/images/posts/2021-05-10-virtual-meeting-pause-countdown/display_pause.gif" alt="Starting pause countdown" caption="Starting pause countdown" %}


# Explanation
## Countdown display
[Webuhr.de](https://webuhr.de) is used for displaying the countdown. I didn't try to do a fancy countdown on my own, since there are already existing once in the web and if the URL is not accessible you probably won't participate in a virtual meeting anyway.

The script launches the URL in private mode of a browser. This should prevent that any confidential information are displayed along with the countdown window. The downside of this is, that the I can't make us of the default browser for opening URLs and therefore need to explicitly define the opening command for the browsers. The script tries the following browsers in this order:
1. Edge
2. Chrome
3. Firefox
4. Internet Explorer

If no browser is started, you will get an info with the option to copy the URL into the browser of your choice. 
{% include figure image_path="/assets/images/posts/2021-05-10-virtual-meeting-pause-countdown/2021-05-06-22-31-26.png" alt="Error message, if browser could not be started" caption="Error message, if browser could not be started" %}

## Form options

1. Pause name
  The default title of the pause is `Pause ends` this can either be changed in the form for a single use case.
![](assets/images/posts/2021-05-10-virtual-meeting-pause-countdown/2021-05-12-22-53-12.png)

2. Available pauses
   By default, the drop down will list the next 16 five-minute intervals after the current one. This adds up to 1:30h in total, which should be enough even for a launch break.
3. Sound reminder
   If checked, a reminder will be played two minutes before the pause ends.

{% include figure image_path="/assets/images/posts/2021-05-10-virtual-meeting-pause-countdown/2021-05-12-22-56-40.png" alt="Individual settings for a pause." caption="Individual settings for a pause." %}

## Time format
The time format depends on your regional settings. If your system uses a 12-hour format with am/pm designator the drop down values as well as the end of the pause will use the same format. 
{% include figure image_path="/assets/images/posts/2021-05-10-virtual-meeting-pause-countdown/2021-05-06-22-06-14.png" alt="Depending on the regional settings 12-hour or 24-hour format is used." caption="Depending on the regional settings 12-hour or 24-hour format is used." %}

## Default settings
The setup of the script is defined by the first lines.
- `$pauseTitleText` defines the default name of the pause
- `$numberOf5MinuteOptions` defines the number of displayed option values. If you need more/less you can change the number here
- `$reminderChecked` the default value of the `Play reminder` checkbox. Most of my breaks are no longer than 10 minutes, so I don't need an reminder.
- `$alarmSoundPath` the path of the sound file to play.
- `$playReminderMinutesBeforePauseEnd` the reminder will be sound this number of minutes before the end of the pause.
  
{% include figure image_path="/assets/images/posts/2021-05-10-virtual-meeting-pause-countdown/2021-05-12-23-00-51.png" alt="Depending on the regional settings 12-hour or 24-hour format is used." caption="Depending on the regional settings 12-hour or 24-hour format is used." %}

# Possible issues

## Script doesn't work
If you run the PowerShell script and nothing happens, there are two options:
- Windows doesn't trust the downloaded file
- You are not allowed to execute PowerShell scripts

### Windows doesn't trust the file
You can fix this by right clicking the file and tick the unblock checkbox.
{% include figure image_path="/assets/images/posts/2021-05-10-virtual-meeting-pause-countdown/2021-05-06-22-59-11.png" alt="Unblock file" caption="Unblock file" %}
### Execution of PowerShell scripts is not allowed
You can download the batch file. The batch file will tell the system to temporarily allow the execution of the specified file. Both files must be in the same folder.

# Download
Since PowerShell scripts and batch files can harm your computer, the download is blocked by default. Therefore, I've linked the source code which you can download via `save as`. If you need the batch file make sure to use the name `displaypause.ps1` for the PowerShell script or modify the batch file accordingly.

{% include figure image_path="/assets/images/posts/2021-05-10-virtual-meeting-pause-countdown/2021-05-06-23-04-45.png" alt="Save the source code by right clicking in the browser and choose save as." caption="Save the source code by right clicking in the browser and choose save as." %}

- [PowerShell Script](https://raw.githubusercontent.com/Daniel-Krueger/PowerShell_Snippets/main/DisplayPause/displaypause.ps1)
- [Batch file](https://raw.githubusercontent.com/Daniel-Krueger/PowerShell_Snippets/main/DisplayPause/Run%20display%20pause.bat)


