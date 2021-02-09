---
title: "Yet another simple punch clock"
categories:
  - GitHub Project
  - Private
tags:
  - Notification area
  - Time tracking
excerpt:
    A punch clock which is triggered by a simple click in the notification area.
---
  
# Short description
[Punch Clock](https://github.com/Daniel-Krueger/PunchClock) is another windows time tracking solution. The focus of this solution is to see whether you are clocked in or out.

![Clock in and out](/assets/images/punchclock/clockIn_out_notification.png)

Clocking in and out is achieved by clicking on the icon, which writes the current time and state, clocked in/out, to a csv file.
![CSV example](/assets/images/punchclock/punchclock_csvfile.png)

One csv file will be created per month and as long as the program runs, the current file is locked. You can still open the file in read only mode in excel or look at it with notepad.

# Setting up
## Installation
The latest version can be downloaded from [GitHub](https://github.com/Daniel-Krueger/PunchClock/releases). There's no installer, just a simple .zip file. Extract it, modify the configuration and run the .exe file.

## Configuration
There are a few elements which can be configured:
1. Folder in which the csv file will be written. 

**Warning:** It's necessary that the current user has write permissions to this location. If the folder doesn't exist it should be created automatically.
{: .notice--warning}
2. If the csv file for the current month does not exist yet, it will be created and this header will be written to it.
   
**Warning:**  Make sure to use the same csv delimiter as defined below.
{: .notice--warning}

1. Once a user clicks on the icon the current time will be written to the csv file. The time will be written in the defined format. Since this is a csv file, you can decide whether you want to have:
   - A single column with date and time
   - A single column with time only
   - Two columns
2. Define the label which will be written for clocking in and out.
3. Define the label for the icon when you are clocked in and out.
![Configuration file](/assets/images/punchclock/punchclock_config_file.png)

## Autostart
The .zip file contains a .bat file which creates a shortcut to the program and places this in the startup folder. Once it's placed in the startup folder the program will automatically be started with windows.

**Warning:**  You need administrator privileges for executing the batch file.
{: .notice--warning}

An alternative way is:
1. Create a shortcut for the program
2. Open the startup folder in the explorer 
3. Copy the following into the address bar
``
%userprofile%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
``
4. Place the shortcut in the startup folder

# Remarks
## How entries and rows are written to the csv file
Once you click on the notification icon the current state (clocked in/out) will be written to the csv file followed by the time. This ensures that you always now, if the written time is the clocked in or clocked out time.

If a clocked in line is written a line break will be added to the file before the state. The line break ensures here ensures that there can not be two clocked in times in the same line, even if the program was shut down without writing the clock out time.

## Notification icon is missing although the program is executed
By default Windows hides some notification icons. You can easily tell Windows to always show specific icons:
1. Click on the top arrow to show all notification icons
2. Select the icon
3. Drag and drop it to the area
   
![Drag and drop hidden notification icon](/assets/images/punchclock/punchclock_notification_icon_missing.png)