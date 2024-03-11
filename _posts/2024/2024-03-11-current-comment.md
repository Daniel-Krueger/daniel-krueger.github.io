---
title: "Get current comment"
categories:
  - WEBCON BPS   
  - Private  
tags: 
  - Business Rule
excerpt:
    How to get the current comment, and not only the latest comment.
bpsVersion: 2023.1.3.29
---



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
3. Handle the edge case, when a comment was added with a new instance. In this case there are already two versionsm and we can simple check whether the current version is 2.

I used this logic to define a business rule which would return the current/new comment. 

```sql
select 
  case 
    when  WFD_Version = 1 then '{WFLASTCOMMENT_TEXT}' 
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


{% include figure image_path="/assets/images/posts/2024-03-11-current-comment/2024-03-11-22-43-00.png" alt="Example of a global business rule using the SQL command." caption="Example of a global business rule using the SQL command." %}

How you implement this will depend on your use . For example you could use this in a condition which checks whether the rule returns something. In this case you could do something.