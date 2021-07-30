---
title: "Deploying database scripts"
categories:
  - Private
  - WEBCON BPS  
tags:
  - Application Template  
excerpt:
    This post describes an approach to transfer database artifacts, which are not part of the application package.
bpsVersion: 2021.1.2.136
---

# Overview  
In most cases the application package contains everything you need to transport an application from one environment to another. It starts with the data model, workflow definition and form. Furthermore, it contains UI elements, custom extensions and optional documents, configuration values, user groups and security settings for the environments. If all of these are part of the package, in which cases do you need to deploy additional artifacts by yourself? 
In some situation you may encounter limitations when you are writing SQL statements, even so these can be really [advanced](https://alterpaths.com/how-configure-form-field-with-advenced-sql-query/). Another one is when you need to reuse the same SQL statement in different places. Of course, you could replicate it everywhere, but this would increase the number of places which need to be maintained. This can be solved by creating custom views, stored procedures, or functions in the database. If you are wondering whether this is actually allowed:


{: .notice--info}
**Quote from the help:** In case of more complex queries, the _recommended approach is defining a view or a table-valued function_ and using them to return the data.
{% include figure image_path="/assets/images/posts/2021-08-04-deploying-database-scripts/2021-07-28-20-53-01.png" alt="The quote is taken from the help of the `MSSQL database` data source." caption="The quote is taken from the help of the `MSSQL database` data source." %}

The drawback is, that these changes will not be part of the package and need to be transferred manually. 


# Dictionary process to the rescue
A dictionary process can be used to transfer data from one environment to another. In combination with the [Run a SQL procedure](https://community.webcon.com/posts/post/the-run-an-sql-procedure-action/230) we can use this feature to automate the deployment of artifacts.
1. The dictionary process stores the SQL statements. 
2. Upon path transition the statements are executed against the `current` database.

This allows a controlled deployment of any custom database modifications, while utilizing the audit features of WEBCON BPS, workflow history and logging of action execution.

{: .notice--info}
**Info:** The path transition is also triggered when the dictionary entries are updated using the import option from the report.
{% include figure image_path="/assets/images/posts/2021-08-04-deploying-database-scripts/2021-07-28-22-53-51.png" alt="`Import from Excel` also triggers the path transition. " caption="`Import from Excel` also triggers the path transition. " %}

# Application `Artifact deployment`
## Using the application
The application `Artifact deployment` contains the dictionary process `Database script`. This process executes either the `Activation script` or `Deactivation script`. The executed one depending on the `Active` flag when the path `Update database ` is executed.

{% include figure image_path="/assets/images/posts/2021-08-04-deploying-database-scripts/2021-07-28-23-12-21.png" alt="A database script dictionary entry." caption="A database script dictionary entry." %}

Using this application, you can easily deploy new or update existing artifacts. This can be done via the export/import from excel option mentioned above or by exporting/importing the application itself. 

## Sample database artifacts
The application package contains also a few scripts:


Location | Value | Explained in chapter
---------|----------|---------
 Global constant Group | `DatabaseScripts` | [Referencing each usage of a database](#referencing-each-usage-of-a-database)
 Process business rule | `GetGlobalConstantGuid` | [Getting constant values in reports](#getting-constant-values-in-reports)
 Process business rule | `GetProcessConstantGuid` | [Getting constant values in reports](#getting-constant-values-in-reports)
 Process business rule | `SampleUsage` | [Referencing each usage of a database](#referencing-each-usage-of-a-database)
 Process constant rule | `SampleUsage` | [Referencing each usage of a database](#referencing-each-usage-of-a-database)
 Report | `Function and calculated column` | [Getting constant values in reports](#getting-constant-values-in-reports)

The reason for these is, explained in next chapters.

## Referencing each usage of a database artifact
Ok, we have solved the issue that we have to deploy database artifacts ourselves along with logging these changes. The next little issue is, that you ~~may~~will forget, where a specific artifact is used. This can be solved by following this convention:
1. Create a global constant for each script, with the GUID and name of the dictionary entry
2. Reference the constant in a script in a comment
3. The usages tab of the global constant will show you the locations


{% include figure image_path="/assets/images/posts/2021-08-04-deploying-database-scripts/2021-07-30-22-42-41.png" alt="Mapping a script to a constant and you can see its usage." caption="Mapping a script to a constant and you can see its usage." %}


{: .notice--info}
**Info:** Of course, you can use this approach without this application.


The only problem is that we can't make use of this in reports.

## Getting constant values in reports
Now and then I find myself in the situation, that I would need constant value in a calculated column, for example when creating an URL pointing to another application. Since the ids change, I can't simply hard code the value. [Currently](https://community.webcon.com/forum/thread/71) we have no option to do this without some 'tricks'. My solution is to call a custom function within the calculated field.
{% include figure image_path="/assets/images/posts/2021-08-04-deploying-database-scripts/2021-07-30-22-08-24.png" alt="A calculated field retrieves the value of constant" caption="A calculated field retrieves the value of constant" %}

The provided value is the GUID of the constant which value should be retrieved. In quite a lot of places you can retrieve the GUID of an object by clicking on an icon next to the id.

{% include figure image_path="/assets/images/posts/2021-08-04-deploying-database-scripts/2021-07-30-22-13-18.png" alt="By clicking on the icon, you can see the GUID of the object." caption="By clicking on the icon, you can see the GUID of the object." %}

This is not the case for constants though. I added the process business rules `GetGlobalConstantGuid`, `GetProcessConstantGuid` to cope with this. 
1. Testing the rule will request the id of the constant.
2. The expression preview will display its GUID.

{% include figure image_path="/assets/images/posts/2021-08-04-deploying-database-scripts/2021-07-30-22-15-03.png" alt="Getting the GUID of a constant." caption="Getting the GUID of a constant." %}

{: .notice--warning}
**Warning:** The function is executed for **each** row. If you are using this in a highly frequented report it may cause additional load on the SQL server.

# Provided functions
## Sample ComplexQuery
This is just a sample script used for chapter [Referencing each usage of a database](#referencing-each-usage-of-a-database).

## Get (global) constant value
These can be used in calculated columns to retrieve the value of a constant as described in [Getting constant values in reports](#getting-constant-values-in-reports). The retrieved value depends on the current environment.

## Searching tables
These stored procedures allow to search all text fields for a specific string.


Stored procedure | Usage
---------|----------
 dkr_SearchAllTables | Searches through all tables in the whole database. This may take a lot of time and shouldn't be executed on a production database.
 dkr_SearchConfigurationTables | Searches through all 'configuration' tables. Tables, storing workflow instance data and the like, are ignored. This should be used when searching for a value used in a SQL statement or similar. This should be fairly fast in comparison.
 dkr_SearchDataTables | Searches through all 'data' tables. Configuration tables are ignored to improve the performance a little bit, though it still shouldn't be executed against a production database. This can be used to find all references of a user assignment for example. If you need this more often you could think about using [this application](https://daniels-notes.de/posts/2021/series-expert-guide-part-1)


# Remarks
## Insufficient database privileges
It's assumed that the account executing the script has sufficient privileges to modify the database. If this is not the case and you need to use another user, you can replace the existing actions with a `Run a PowerShell script` action. This will allow you to create the credentials for another user which can be used to execute the [Invoke-Sqlcmd](https://docs.microsoft.com/en-us/powershell/module/sqlserver/invoke-sqlcmd?view=sqlserver-ps)

{% include figure image_path="/assets/images/posts/2021-08-04-deploying-database-scripts/2021-07-30-21-28-32.png" alt="The `Run a PowerShell script` action" caption="The `Run a PowerShell script` action" %}

## Scripts are applied against the current database
The scripts are executed against the current database only. So you either need have a copy (separate instance) in each database. Or to modify the actions so that these are executed against all databases.

# Download TODO
If you would like the application template or only the compiled custom action, you can download it [here](https://github.com/Daniel-Krueger/webcon_reportSubscriptions/releases).

If you are only interested in the Custom Action, you can find the source code [here](https://github.com/Daniel-Krueger/webcon_reportSubscriptions).
