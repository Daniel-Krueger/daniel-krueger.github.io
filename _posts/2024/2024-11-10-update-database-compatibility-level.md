---
regenerate: true
title: "Update database compatibility level"
categories:
  - WEBCON BPS 
tags:  
excerpt:
  "The compatibility level needs to be updated for existing databases manually."
bpsVersion: 2025.1.1.23
---

# Overview
Since WEBCON BPS 2025 the supported database compatibility level is 160. Upgrading to the latest version won't update the level for existing database:

> Changed the default compatibility level for new SQL databases created during the installation of the WEBCON BPS platform. As a result, the previous compatibility level set to 120 (SQL Server 2014) has been replaced with the highest possible level, which, however, cannot exceed 160 (SQL Server 2022). This modification does not affect existing databases, which will retain their compatibility level of 120.


If WEBCON doesn't update the compatibility level during the migration, which should we do such an update? Are there any drawbacks?
I'm not a DB administrator but as far as I know, you could actually be degrade the performance. Therefore, Microsoft has a suggestion on how to proceed if you want to upgrade the compatibility level:
1. Create a base line against which you can compare the the performance
2. Upgrade the compatibility level
3. Verify the changes
[Change the database compatibility level and use the Query Store](https://learn.microsoft.com/en-us/sql/database-engine/install-windows/change-the-database-compatibility-mode-and-use-the-query-store?view=sql-server-ver16)


I somehow doubt, that this will be necessary for small databases, but I'm neither an expert here nor do I have the experience. 
This is my reasoning/my assumptions:
- WEBCON did test the compatibility level and not only on small databases
- The database structure is the same for old and new created databases
- Importing the processes from an old database to a new one and recreating the data would be the sames as just upgrading the database level


I don't want to persuade anyone to do this upgrade blindly and it's up to you to decide, which approach you want to take.


# SQL statement
Review the current compatibility level

```sql
select name, compatibility_level
from sys.databases
where name LIKE '%BPS%'
order by name

```




The base version of the SQL script has been generated with ChatGPT. I added some the `dryrun` option and I couldn't test the script with different SQL Server versions but the case does look good.

If you do want to execute the statement set the `dryrun` value to 0.

```sql

DECLARE @dbName NVARCHAR(128)
DECLARE @maxCompatibilityLevel INT
declare @dryrun bit = 1

-- Determine the maximum compatibility level supported by the current SQL Server instance
SELECT @maxCompatibilityLevel = CASE
    WHEN CAST(SERVERPROPERTY('ProductVersion')as varchar(20)) LIKE '12.%' THEN 130 -- SQL Server 2014
    WHEN CAST(SERVERPROPERTY('ProductVersion')as varchar(20)) LIKE '13.%' THEN 130 -- SQL Server 2016
    WHEN CAST(SERVERPROPERTY('ProductVersion')as varchar(20)) LIKE '14.%' THEN 140 -- SQL Server 2017
    WHEN CAST(SERVERPROPERTY('ProductVersion')as varchar(20)) LIKE '15.%' THEN 150 -- SQL Server 2019
    ELSE 160 -- Current maximum level is 160 (WEBCON BPS 2025)
END

DECLARE db_cursor CURSOR FOR
SELECT name
FROM sys.databases
WHERE name LIKE'%BPS_%'
order by name

OPEN db_cursor
FETCH NEXT FROM db_cursor INTO @dbName

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @sql NVARCHAR(MAX) = 'ALTER DATABASE [' + @dbName + '] SET COMPATIBILITY_LEVEL = ' + CAST(@maxCompatibilityLevel AS NVARCHAR)
	
	if (@dryrun = 1) begin		
		Print 'SQL statement to execute: '+ @sql 	
	end
	else begin
		Print 'Executing: '+ @sql 	
		EXEC sp_executesql @sql	
	end	
    FETCH NEXT FROM db_cursor INTO @dbName
END

CLOSE db_cursor
DEALLOCATE db_cursor

```


{% include figure image_path="/assets/images/posts/2024-11-10-update-database-compatibility-level/2024-11-10-10-30-13.png" alt="Dry run of the modification script" caption="Dry run of the modification script" %}

{% include figure image_path="/assets/images/posts/2024-11-10-update-database-compatibility-level/2024-11-10-10-30-51.png" alt="Without dry run" caption="Without dry run" %}

# Reference
[ALTER DATABASE (Transact-SQL) compatibility level](https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-compatibility-level)

|         **Product**        | **Database Engine version** | **Default compatibility level designation** | **Supported compatibility level values** |
|:--------------------------:|:---------------------------:|:-------------------------------------------:|:----------------------------------------:|
| Azure SQL Database         | 16                          | 160                                         | 160, 150, 140, 130, 120, 110, 100        |
| Azure SQL Managed Instance | 16                          | 150                                         | 160, 150, 140, 130, 120, 110, 100        |
| SQL Server 2022 (16.x)     | 16                          | 160                                         | 160, 150, 140, 130, 120, 110, 100        |
| SQL Server 2019 (15.x)     | 15                          | 150                                         | 150, 140, 130, 120, 110, 100             |
| SQL Server 2017 (14.x)     | 14                          | 140                                         | 140, 130, 120, 110, 100                  |
| SQL Server 2016 (13.x)     | 13                          | 130                                         | 130, 120, 110, 100                       |
| SQL Server 2014 (12.x)     | 12                          | 120                                         | 120, 110, 100                            |
| SQL Server 2008 (10.0.x)   | 10                          | 100                                         | 100, 90, 80                              |
| SQL Server 2005 (9.x)      | 9                           | 90                                          | 90, 80                                   |
| SQL Server 2000 (8.x)      | 8                           | 80                                          | 80                                       |


