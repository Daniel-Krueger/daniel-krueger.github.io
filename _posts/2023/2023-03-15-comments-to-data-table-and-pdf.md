---
title: "Comments to data table and PDF"
categories:
  - WEBCON BPS
  - CC LS  
tags:
  - Snippet  
excerpt:
    An example on how to display comments of multiple workflows in one place and printing them to a PDF report.
bpsVersion: 2022.1.4.155
---

# Overview  
In this post I will describe an option how to show the comments of all (sub) workflows in the parent workflow and how to print these into a pdf.
This post origin dates back to [February 2022](https://community.webcon.com/forum/thread/1478) and is related to a new one from [March 2023](https://community.webcon.com/forum/thread/2806). Coincidently I had the request to display any comment from any sub workflow in the parent as well as all other sub workflows. 


{% include figure image_path="/assets/images/posts/2023-03-15-working-with-comments/2023-03-15-20-53-55.png" alt="Comments are displayed in a data table which is used in an HTML template" caption="Comments are displayed in a data table which is used in an HTML template" %}


# Displaying comments in a data table
## SQL Server 2016+
If you are running at least SQL Server 2016 you can make use of [OPENJSON](https://learn.microsoft.com/en-us/sql/t-sql/functions/openjson-transact-sql?view=sql-server-ver16) which will really simplify the SQL statement. 

{: .notice--info}
**Remark:** You may have to update the database compatibility level of your databases though. This shouldn't be a problem. I'm only aware of one comment regarding the database compatibility level and this targets [SQL Server 2019](https://community.webcon.com/posts/post/webcon-bps-databases-in-the-sql-2019-compatibility-level/320)

The example will get all comments of all 'related' workflows. It's a simplified example, because the hierarchy of workflows is using the same process.
{% include figure image_path="/assets/images/posts/2023-03-15-working-with-comments/2023-03-15-20-58-47.png" alt="Example data source" caption="Example data source" %}

```sql
select 
	instances.WFD_ID
	, {WFCONCOL:771} as Title
	, WFD_DTYPEID
	, Comments.Date
	, Comments.Account 
	, Comments.Displayname
	, Comments.Comment
from WFElements instances cross apply OPENJSON(instances.WFD_Description)
	with (
		Date DATETIME2 '$.d',
		Account varchar(200) '$.l',
		Displayname varchar(200) '$.a',
		Comment nvarchar(max) '$.c'
	)   as Comments
where
{DTYPE_ID} = {DT:51}  and {WFCONCOL:775} =  {775}
order by WFD_ID, Date
```

## SQL Server 2014 and less
If you can't or don't want to change the database compatibility level, you can use the below SQL statement. This will create the same or at least similar output. It basically 'converts' the JSON array to a multi value string, with multiple display names.

{: .notice--info}
**Info:** In WEBCON BPS `{}` are used to identify variables. Since these characters are also used in a JSON string, we can't use the `{}` themselves but the character value in a SQL statement
```sql
select
  instances.WFD_ID
	, {WFCONCOL:771} as Title
	, WFD_DTYPEID
  , convert(datetime, SUBSTRING(dbo.ClearWFElemId(item),1,19)) as [Date]
  , dbo.ClearWFElemId(dbo.ClearWFElem(item)) as Account
  , dbo.ClearWFElemId(dbo.ClearWFElem(dbo.ClearWFElem(item))) as Displayname
  , dbo.ClearWFElem(dbo.ClearWFElem(dbo.ClearWFElem(dbo.ClearWFElem(item)))) as Comment
from WFElements instances
    cross apply
      dbo.SplitToTable(
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
where {DTYPE_ID} = {DT:51}  and {WFCONCOL:775} =  {775}
order by WFD_ID, Date
```
# Displaying comments in an HTML template
Using an HTML template to generate a PDF is way more flexible, than a Word template. This is especially true in regard to item lists and data tables. While you are limited to a table in Word, you can use any tags in the HTML template. For example, you could create 'chapters' with heading for each row in the data table. 

{% include figure image_path="/assets/images/posts/2023-03-15-working-with-comments/2023-03-15-21-52-27.png" alt="Displaying data tables/item list in 'chapters' instead of a table." caption="Displaying data tables/item list in 'chapters' instead of a table." %}

Even so this is possible, I will use a simple table to render the comments. 

{% include figure image_path="/assets/images/posts/2023-03-15-working-with-comments/2023-03-15-21-04-33.png" alt="Result of the below HTML template" caption="Result of the below HTML template" %}

The important parts in the below snippet are `SQLGRIDHEADERTEMPLATE` and `SQLGRIDROWTEMPLATE`. You refer to the columns in the data source using `{NAMEOFCOLUMN}`.

```
<html dir="ltr" >
<head >
<style type="text/css">
/* DivTable.com */
.divTable{
	display: table;
}
.divTableRow {
	display: table-row;
}
.divTableHeading {
	display: table-header-group;
}
.divTableCell, .divTableHead {
	border: 1px solid #999999;
	display: table-cell;
	padding: 3px 10px;
}
.divTableCellNoBorder, .divTableHeadNoBorder {
	display: table-cell;
	padding: 3px 10px;
}
.divTableHeading {
	display: table-header-group;
	font-weight: bold;
}
.divTableFoot {
	display: table-footer-group;
	font-weight: bold;
}
.divTableBody {
	display: table-row-group;
}
body{
	font-family: Arial, Helvetica, sans-serif;
	font-size: 1em;
}
</style>
</head>
<body >
	<h1>Title field: {WFD_AttText1}</h1>
	<p>		
		<div class="divTable">
			{SQLGRIDHEADERTEMPLATE:779}
			<div class="divTableHeading">
				<div class="divTableHead">Title</div>
				<div class="divTableHead">Comment</div>
				<div class="divTableHead">Date</div>
				<div class="divTableHead">Employee</div>			
			</div>	
			{/SQLGRIDHEADERTEMPLATE}
			<div class="divTableBody">
			{SQLGRIDROWTEMPLATE:779}
			 
			<div class="divTableRow">				
				<div class="divTableCell">{Title}</div>
				<div class="divTableCell">{Comment}</div>
				<div class="divTableCell">{Date}</div>
				<div class="divTableCell">{Displayname}</div>
			</div>
			{/SQLGRIDROWTEMPLATE}
		</div>
	</p>
</body>
</html>
```

{: .notice--info}
**Info:** I had to disable the code highlighting, because some texts would not be visible otherwise.

{: .notice--info}
**Info:** You can also make use of these variables in an email template.

# Documentation of HTML tags
You can find the documentation regarding this in the Online help under:

`Designer Studio\Applications\Processes\Workflows\Steps\Actions\Action types\Reports and printouts\Generate an HTL printout\HTML and PDF template creation`

I personally use a different approach. I search for 'Variables' and at the bottom of the page, there's a link.
{% include figure image_path="/assets/images/posts/2023-03-15-working-with-comments/2023-03-15-21-14-08.png" alt="Variables page contains a link to the HTMP and PDF print tags." caption="Variables page contains a link to the HTMP and PDF print tags." %}

{: .notice--info}
**Remark:** As of 2023 we will be able to use [GUIDs in  HTML templates](https://community.webcon.com/posts/post/guid-identifier-in-html-templates/379/3), which will allow us to transport the templates. Currently we have to use the integer Ids, so the templates have to be amended for each environment.


