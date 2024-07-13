---
title: "Get current comment"
categories:
  - WEBCON BPS   
  - Private  
tags: 
  - Business rules
excerpt:
    How to get the current comment, and not only the latest comment.
bpsVersion: 2023.1.3.76
last_modified_at: 2023-07-13

---

# Update 2023-07-13
Added an example and the test cases using WEBCON BPS 2024.1.1.48.

# Overview
This post is an answer to question which bothered me in the past and I got reminded of it with this forum question [Notifications on comments 
](https://community.webcon.com/forum/thread/4535)
While the question itself is about sending mails, when a comment was added, Grzegorz answer reminded me of providing an alternative to the `Last Comment Text`. 
The issue with the `Last comment text` is, that's always the latest added comment, regardless of how old it may be. 


{% include video id="nZa6NS25-iI?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


# Retrieving the current/new comment
This is actually pretty simple, at least if you have a rough idea about the internal workings of WEBCON BPS.
Whenever you save an instance, the data itself is written to the tables in a transaction. Therefore, you can read these changes with a SQL query. If you read the data of the current workflow instance from the WFElements table, you will retrieve the data of the new version. The WFHistoryElements table will also contain a 'mirror' record of this version. 
With this knowledge it's very easy to get the current comment. 
1. Left Join the two tables using the instance id and the previous version. The left join is probably not necessary.
2. Compare the comment column WFD_Description, if it's different a new comment was added. If it's different you can use the last comment variable.
3. Handle the edge case, when a comment was added with a new instance. In this case there are already two versions and we can simple check whether the current version is 2.

I used this logic to define a business rule which would return the current/new comment. 

```sql
select 
  case 
    when  WFD_Version = 2 then '{WFLASTCOMMENT_TEXT}' 
    when cast(WFD_Description as varchar(max)) <> cast(WFH_Description as varchar(max)) then '{WFLASTCOMMENT_TEXT}' 
    else ''
  end as CommentText
  , WFD_Description
  , WFD_Version
  , WFH_Version
  , WFH_Description
from WFElements  left join WFHistoryElements
on WFD_ID = WFH_OrgID
and WFH_Version = (WFD_Version -1)
where WFD_ID = {WFD_ID}
```


{% include figure image_path="/assets/images/posts/2024-03-11-current-comment/2024-07-13-14-23-14.png" alt="Example of a global business rule using the SQL command." caption="Example of a global business rule using the SQL command." %}

How you implement this will depend on your use use.

# Example and test cases
I tested this with a simple workflow and all the options I could think of. For this I added:
- A field for the test case
- A field for storing the latest comment using the default function.
- A field for storing the current comment using the new business rule.
- An if operator condition to send a mail.

The fields are set with an action in an automation.

![The automations](/assets/images/posts/2024-03-11-current-comment/2024-07-13-14-18-32.png)

The automation is used in the global saving action as well in the `OnEntry` step of the workflow instance. This is important, as the SQL statement won't be working otherwise when a comment is saved using a path.

![Usage of the business rule.](/assets/images/posts/2024-03-11-current-comment/2024-07-13-14-19-40.png)

I've tested the following:
- Saving a new instance with a comment
- Executing a path transition with and without a comment
- Using the save action with and without a comment
- Adding a comment in the view mode of an instance.

Result:

![The test cases using the function to get the current comment.](/assets/images/posts/2024-03-11-current-comment/2024-07-13-14-12-28.png)



Here's also an overview of values using an SQL statement:

|WFH_Version|Test case|New comment field|Latest comment field|Last added comment from JSON value|
|-|-|-|-|-|
|1|New instance with comment|||New instance with comment|
|2|New instance with comment|New instance with comment|New instance with comment|New instance with comment|
|3|Path transition without comment||New instance with comment|New instance with comment|
|4|Path transition with comment|Path transition with comment|Path transition with comment|Path transition with comment|
|5|Save in edit mode with comment|Save in edit mode with comment|Save in edit mode with comment|Save in edit mode with comment|
|6|Save in edit mode without comment||Save in edit mode with comment|Save in edit mode with comment|
|7|Save in edit mode without comment|Comment added in view mode|Comment added in view mode|Comment added in view mode|

In case someone needs to work with the comment in an SQL statement, I'm providing the one I used to get the last comment.
``` sql
SELECT
	WFH_Version
	, WFH_AttText1 as [Test case]
	, WFH_AttLong2 as [New comment field]
	, WFH_AttLong1 as [Latest comment field]
	 , (
		SELECT Top 1 JSON_VALUE(value, '$.c') AS LastAddedComment
		FROM OPENJSON(WFH_Description ,'$')
		order by [key] desc
	) [Last added comment from JSON value]
FROM [dbo].[WFHistoryElements]
where WFH_OrgID = 2329
```
