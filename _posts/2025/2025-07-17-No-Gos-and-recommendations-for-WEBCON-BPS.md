---
title: "No-Go’s and recommendations for WEBCON BPS"
categories:
  - WEBCON BPS
tags:
 - Best practice
excerpt:
    "A (short) list of No-Go’s and recommendations when starting with WEBCON BPS"
bpsVersion: 2025.1.1.105
---

# Overview
This will be a very subjective post, but I will provide my reasons why the topics mentioned. 
Feel free to comment to add another view or additional points. Also, I would prefer if you got in touch with me for additional No-Go’s /recommendation to help new WEBCON BPS users, so that I can include them in the blog.


If you are starting with WEBCON BPS, you may also look at my [Expert series](/posts/2021/series-expert-guide-part-1). While this is from 2021 and a few elements would be implemented differently today, it will provide you with a deep dive into the inner working of WEBCON BPS. 


# Fixed item lists and logic
While I can understand the use case of fixed item list, I very rarely use them. The reason is quite simple, if there's even a slight chance that logic must be executed based on the selected values, they are a bad idea. Instead of a fixed item list it's better to use a SQL query with constants as ids. 

{% include figure image_path="/assets/images/posts/2025-07-17-No-Gos-in-WEBCON-BPS/2025-07-16-21-56-22.png" alt="Use constants for ids, instead of fixed values." caption="Use constants for ids, instead of fixed values." %}

While you may remember which value represents which entry while you are developing a solution, I wouldn’t be able to remember it during the next change in a few months., Besides this, I think this is more readable.
```
  where PublishingModeField = PublishingMode:Ignore
```
  vs
```
  where PublishingModeField = 1
```

While the readability isn’t necessarily a game change, the option to see where a specific value is used via "Usages" tab is one.
{% include figure image_path="/assets/images/posts/2025-07-17-No-Gos-in-WEBCON-BPS/2025-07-16-21-58-52.png" alt="We can identify where a value is used using the usages tab." caption="We can identify where a value is used using the usages tab." %}

If you don't feel like you want to create the SQL query yourself, you could take a look at this post:
[SQL command for fixed values used in a picker field](/posts/2021/little-excel-helpers#sql-command-for-fixed-values-used-in-a-picker-field)


Whether the XML in the Excel cell for the advanced configuration will work depends on your WEBCON BPS version. The best would be to configure a field in the Designer Studio manually and copy the configuration back to the Excel file.

{: .notice--info}
**Tip:** If necessary, you can also create an MS SQL data source with the query and use global constants. This would simulate the fixed item list without the drawbacks.


# Dictionary data sources
While the automatic data sources for dictionaries are a good thing, they are lacking. In 99% of the cases I create a BPS internal view and these are the reasons:

1. Not all system fields exist even something important like the business entity is missing.<br/>
  There are at least two user voices regarding this [mine from 2022](https://community.webcon.com/forum/thread/2394?messageid=2394) and a [new one](https://community.webcon.com/forum/thread/7421/15)
2. Value cannot be rendered as a link <br/>
  If you are using a dictionary data source, you won't be able to display the value as a link in the form or a report. You can read up on it [here](/posts/2024/related-workflows#dictionaries-and-hyperlinks).

# SQL Queries
## Always add a filter for the company
If you are not filtering for a specific instance id
```
where WFD_WFDID = {WFD_ID}
```

but are filtering for a form type or similar always add the company.
```
where WFD_DTYPEID = 123 and WFD_COMID = {COM_ID}
```

It won't hurt and if you get used to it from the start, you won't forget it, when it counts. You may use a single business entity now, but this may change in a few years. Good luck to add this condition to all queries then.

## Use order by, when using Top
Whenever you need to get the first row, define an order.

I wrongly assumed that the result of an SQL query would be returned in the order of the primary key if no order is defined. This is not the case, as you can see it for yourself. The order of the WFD_ID in the below query is completely random.
{% include figure image_path="/assets/images/posts/2025-07-17-No-Gos-in-WEBCON-BPS/2025-07-16-22-16-57.png" alt="Without Order by results are returned in an unpredictable order" caption="Without Order by results are returned in an unpredictable order" %}


# Build-in `Users` business rules
There are a few build-in business rules related to users
> - CURRENT USER IS ONE OF – checks if the current user is in a specific group of people; if so, "TRUE" is returned, otherwise "FALSE",
> - USER IS ONE OF – checks whether the given user, list of users, or group is included in the given list or group of users,
> - USERS – the function allows you to download a list of users as a collection of ID#Name values separated with semicolons (;),
> - GROUP MEMBERS – allows for assigning tasks directly to group members. By using the BPS_ID, it loads a list of all users that are members of the selected group, including any embedded subgroups. The user list is returned as a collection of values, i.e. ID#Name, separated with semicolons,


While it's tempting to use these, I always argue against it for two simple reasons:
- The passed value is hard coded
- You will never know whether a group is still used

Instead create a custom business rule and create constants for the users/groups. 
{% include figure image_path="/assets/images/posts/2025-07-17-No-Gos-in-WEBCON-BPS/2025-07-16-22-30-59.png" alt="Use your own business rule instead of the build in ones." caption="Use your own business rule instead of the build in ones." %}

Creating constants for the groups will enhance maintainability drastically:
{% include figure image_path="/assets/images/posts/2025-07-17-No-Gos-in-WEBCON-BPS/2025-07-16-22-32-47.png" alt="I always know when a group is used for more than simple privileges assignment." caption="I always know when a group is used for more than simple privileges assignment." %}


The below sql query, will return all users of the passed group. In addition, you can pass a semicolon separated list of users, which shouldn't be returned. This can proof helpful, if you need to reassign a task to a group, but some users shouldn't receive the task. 

```sql
SELECT users.COS_BpsID
FROM [dbo].[CacheOrganizationStructure] as users 
    join [dbo].CacheOrganizationStructureGroupRelations as groupMebers
       on users.COS_ID = groupMebers.COSGR_UserID 
	join [dbo].[CacheOrganizationStructure] as [group] 
       on groupMebers.COSGR_GroupID = [group].COS_ID
  where [group].COS_BpsID= 'Parameter_GroupBPSID'
  and users.COS_BpsID not in (select *
  from dbo.SplitToTable('Parameter_With_User_BPS_IDS_Or_EMPTY_STRING',';'))
```

# Using the author field
While the author field is there by default, I don't recommend to use it. You can read up on my reasoning [here](/posts/2025/author-vs-dedicated-field).


# Path colors and buttons
When you start with WEBCON BPS, take a look at the available path colors and make a list in which situations you want to use each color. This will help you and your users to create a consistent feeling.

{% include video id="Qb7SBvrdSaY?autoplay=0&loop=1&mute=1&rel=0" provider="youtube" %}

Unfortunately, there's no standard option to apply the color of the paths to the buttons. 
If you want, you can take a look at my other blog post regarding this [Revised uniform path button styling](https://daniels-notes.de/posts/2023/path-button-styling-revisited)