---
regenerate: true
title: "Copy a database"
categories:
  - WEBCON BPS
  - Private 
tags:  
  - User Experience
  - CSS
excerpt:
    A checklist on how to copy/restore a WEBCON process database. Formerly known as content database.
bpsVersion: 2023.1.2.44, 2022.1.4.155
---

# Overview  
Depending on the regulations to which you have to comply you will sooner or later realize that it is a good idea to test a WEBCON BPS update. Using your development environment or a clone from it will be the first step. If you want to be sure though, you will need to test it with production data. For this you will copy (restore) the production database to the development database. This is the topic of this post.

{: .notice--info}
**Info:**
This is only a guideline / checklist, you will have to verify it in your environment. This is very important for the provided SQL script which is provided as is. You will have to test and modify for your situation.

![Restoring a datab](/assets/images/posts/2023-10-27-copy-a-database/2023-10-25-22-36-26.png)

# Restore database script
I put together a [script](https://github.com/Daniel-Krueger/webcon_snippets/blob/main/RestoreAs/RestoreAs.sql) for restoring a backup as a *new* database in an existing/new environment.
The script utilizes variables and has to be executed in SQL command mode. If you are using the SQL Management Studio, you can enable it in the Query actions.
![Enable the SQL command mode](/assets/images/posts/2023-10-27-copy-a-database/2023-10-25-22-36-26.png)

General assumptions:
1. The content database has one attachment and one archive database
2. The attachment and archive database name follow the default naming convention. Their name begins with the content database name and either a `_Att` or `_Arch` suffix is added.
3. You have a dedicated sql user
4. The SQL user and the application pool should get db_owner privileges. 

{: .notice--warning}
**Remark:**
These are just some general information and should make you aware for obvious differences to your environment. You should take a look at the script nevertheless and verify which parts you want to use.

The script does the following:
1. Restoring the databases\
   The scripts restores the content database, one attachment database and one archive database as new databases on the SQL server.
   The backups, data and log file location and new database name are set by variables. There's only one `targetDatabase` variable which is used for the process database. The archive and attachment database name will be created using the default suffixed `_Att` and `_Arch`. 
2. Updating the references in the tables\
   There are few tables which contain references to the old/source databases.
3. Adding the new content db\
  The script  adds a row for the new content database in the config database.
  I have no idea, whether there's a better/supported way of doing so. Maybe adding the database via `Tools and application management` and overwriting these during the restore.
4. SQL and application pool account are added\
   The SQL user and application pool account will receive db_owner privileges to all three databases. 
   

The result and errors of the script are saved to a text file. 
![The output and error are saved in a file.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-13-36.png)

# Acrhive database: modify V_WFElements

{: .notice--info}
**Info:**
This is only a necessary, if the name of the content database was changed.

The archive database contains a V_WFELements view, which references information from the content database. Therefore, you need to update the view using the new content database name.


{: .notice--warning}
**Remark:**
I have no idea, whether this view is used, but upgrading to BPS 2023 won't be possible. BPS 2023 will add the calculated columns to the view and if the references database doesn't exist, it will throw an error.

The easiest way is to use the `CREATE OR ALTER To` action from the context menu, update the database name and execute the script.
![Select create or alter from the context menu.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-16-48.png)

![The view references the old database.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-17-47.png)

# Change database type

{: .notice--info}
**Info:**
This is only a necessary, if you restored a database from environment to another, for example from production to development.

I haven't found a better official documentation than this chapter.
[11. Reset the WEBCON BPS license](https://community.webcon.com/posts/post/going-sharepointless-how-to-transform-your-environment-into-standalone/168)

My personal checklist is:
1. Stop workflow service
2. Start the ressource toolkit from, which is located in the WEBCON BPS installation folder at `Migration Tools\WebCon.BPS.ResourceKit.zip`
![Resource toolkit can be found in the `Migration Tools` folder](/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-21-37-21.png)
3. Display the change database type
   1. Provide the connection details in the configuration window.
   2.  Switch to `Change database type`.
   ![Connection and Change database](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-19-45.png)
4. Change database (1) and save (2)
   ![Change database type and save.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-20-44.png)
5. Restart the workflow service


This may trigger reactivation of the license.
![License information have been lost after changing the database type.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-34-27.png)

# Execute update 
In case you restored a database on a server with a newer WEBCON BPS version, you need to upgrade the database version.
Execute the setup.exe, choose the "Update" and click through
![Select the `Update or expand existing WEBCON BPS installation` to upgrade the database version.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-32-25.png)

![Upgrade process will upgrade the single database.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-23-33.png)

# Grant admin permissions
# Old version without admin access
In case you are accessing the Designer Studio which can't be used in the new environment, it may be necessary to update the system administrators of the database.
For this you can use the `WEBCON BPS System administrators.exe` tool.

![WEBCON BPS System administrator.exe location](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-26-43.png)

1. Provide the connection details
2. Connect to the server
3. Select the database
4. Modify the existing administrators using the actions at the right.
![Changing the system administrators of a database.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-28-53.png)

# Newer version with admin access option
WEBCON BPS 2023 added the `Admin access`, which is enabled by default when installing environment. You can activate this for existing environments using the administrators tool. 
![Admin access](/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-31-20.png)

With the admin access you will be able to access the Designer Studio and change the system administrators.

# Restart WEBCON Workflow Service and application pool
If you haven't done so, you should restart the workflow service and the application pool hosting the WEBCON BPS web site.

# Run user synchronization
If the new environment uses a different source for user synchronization or you have utilized local accounts, you should trigger a full user synchronization.

![Trigger the user synchronization.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-22-00-36.png)

# Search database
I have no idea whether and how it would be possible to transport and connect the search database. 
Depending on the database size you should at least trigger the reindexation of the BPS Portal navigation.

![Executing reindexation of the database](/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-21-58-38.png)


# Same application  multiple databases
If you are in a situation where you need to import an application from one database to another in the same environment. You may receive an error, that this is not possible, because the process GUID is already used in another database.

This behavior is controlled by the global parameter `ImportValidateAppProcPresUniqueness` in the config database. If it is set to 0 you will be able to import the same application into multiple databases.
![`ImportValidateAppProcPresUniqueness` controls whether an application can be imported into multiple databases ](/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-22-01-31.png)

The only problem I'm aware of is, that embedding BPS Portal elements is limited to unique application ids. The generated URL doesn't contain a database id, so it won't work.

![Creating a link to embed a component does not contain the database id.](/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-22-08-00.png)