---
regenerate: true
title: "Show comments in reports"
categories:
  - WEBCON BPS 
tags:  
  - CSS
  - Reports

excerpt:
  WEBCON BPS 2024 added the option to view the last comment. We can achieve a similar result in earlier version, too.
bpsVersion: 2023.1.3.202
---

# Overview
One of the new features of [WEBCON BPS 2024 R1](https://community.webcon.com/community/public/uploads/editor/WEBCON_BPS_2024_Release_Notes_EN.pdf) is the `Last Comment` field which we can add to the reports. Besides displaying the comment in a report, it can also be shown in the task panel. 

While we cannot achieve the last one, we can use a calculated column to display achieve something similar in earlier versions.
The left column shows the last three comments returned by a calculated column while the right uses the new system field.

{% include figure image_path="/assets/images/posts/2024-08-26-show-comment-in-reports/2024-08-26-22-02-04.png" alt="The rendering of the last comment vs calculated column." caption="The rendering of the last comment vs calculated column." %}


# Report configuration
## Calculated column 
The first thing we need is to extract the comments from the column `WFD_Description`. I've provided two different options below. The whole statement including the round brackets needs to be copied to the calculated column configuration.
{% include figure image_path="/assets/images/posts/2024-08-26-show-comment-in-reports/2024-08-26-22-08-08.png" alt="The calculated column includes the starting and ending brackets." caption="The calculated column includes the starting and ending brackets." %}

If your database is running in compatibility mode 130 (SQL Server 2016) you can make use of the OPENJSON function which makes the statement way more readable:
- SQL Server 2016+, database compatibility mode 130<br/>
  
``` sql
  (
select string_agg(replace('['+convert(varchar(25),  [Date],120)+' (UTC) ' +Displayname+ ']'+ Char(10)+Comment,'\n',Char(10)),Char(10))
from (
select Top 3 [Date],Account,Displayname,Comment
from OPENJSON(WFD_Description)
	with (
		Date DATETIME2 '$.d',
		Account varchar(200) '$.l',
		Displayname varchar(200) '$.a',
		Comment nvarchar(max) '$.c'
	)   as Comments

order by [Date] desc) as test
)
```
- SQL Server 2014 and lower, database compatibility mode 120<br/>
  
``` sql
(
select string_agg(replace('['+convert(varchar(25),  [Date],120)+' (UTC) ' +Displayname+ ']'+ Char(10)+Comment,'\n',Char(10)),Char(10))
	from   (
	select  Top 3
    convert(datetime, SUBSTRING(dbo.ClearWFElemId(item),1,19)) as [Date]
		, dbo.ClearWFElemId(dbo.ClearWFElem(dbo.ClearWFElem(item))) as DisplayName
		, dbo.ClearWFElem(dbo.ClearWFElem(dbo.ClearWFElem(dbo.ClearWFElem(item)))) Comment
	from dbo.SplitToTable(
		  Replace(
			  Replace(
			    Replace(
				    Replace(
				      Replace(
					      Replace(convert(nvarchar(max),WFD_Description),'","c":"','#')
					      ,'","a":"','#')
				      ,'","l":"','#')
				    ,'"d":"','')
			    ,'['+Char(123),'')
			  ,'"'+Char(125)+']','')
		  ,'"'+Char(125)+','+Char(123))
		  /* Curly right bracket= Char 125,Curly left bracket = Char 125*/
	as splittedComments    
	order by [Date] desc  
	) as comments
)
```
I'm concatenating the strings using the line break character `Char(10)` so that the `pre-line` value for the `white-space` style will enforce a line break in the browser. In addition, it was necessary to replace the encoded line breaks `\n` with the appropriate line break character.

{: .notice--info}
**Info:** Depending on your requirements you can increase or limit the `Top 3` in the statement to another value.

{: .notice--info}
**Info:** You can find more information about the basic SQL statement [here](/posts/2023/comments-to-data-table-and-pdf#displaying-comments-in-a-data-table).

## Styling
The final step is to apply an advanced styling to the column.

{% include figure image_path="/assets/images/posts/2024-08-26-show-comment-in-reports/2024-08-26-22-11-45.png" alt="Styling the calculated column" caption="Styling the calculated column" %}

```json
{
  "$schema": "https://files.webcon.com/bps/reports/column-formatting.schema.v3.json",
  "children": [
      {
        "element": "span",
        "content": "=CurrentField",
        "style": { "white-space": "pre-line"}
      }
    ]
}
```


You can read up on the advanced styling [here](https://community.webcon.com/posts/post/advanced-cell-coloring-in-reports/18/35). 

{: .notice--info}
**Info:** If you have any idea on how to replicate the bold text of the new  `Last comment` system field, please drop me a message.


# More fun with comments
If also a few other articles in which I worked with the comment field aka `WFD_Description`.

- [Comments to data table and PDF](/posts/2023/comments-to-data-table-and-pdf)<br/>
- [Get current comment](/posts/2024/current-comment)<br/>
- [Simplification of entering a missing comment](/posts/2023/simplification-of-missing-comment)<br/>


