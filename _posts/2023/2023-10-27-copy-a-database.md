---
regenerate: true
title: "Copy a database"
categories:
  - WEBCON BPS
  - Private 
tags:  
  - Governance
  - Installation
excerpt:
    A checklist on how to copy/restore a WEBCON process database. The process database was formerly known as content database.
bpsVersion: 2023.1.2.44
---

# Overview  
As with every software you should test a new WEBCON BPS version. The first step would be updating your development environment. It would even better to clone it before doing the update. Regardless of your approach, if you want to be sure, you will need to test it with production data. For this you will copy (restore) the production database to the development database. The restore and all the involved steps is the topic of this post.

{: .notice--info}
**Info:**
This is only a guideline / checklist, you will have to modify it to fit your environment. This is very important for the provided SQL script which is provided as is. Make sure to read through the **whole** post before you start.


# SQL
## Restore database script
I put together a [script](https://github.com/Daniel-Krueger/webcon_snippets/blob/main/RestoreAs/RestoreAs.sql) for restoring a backup as a *new* database in an existing/new environment.
The script utilizes variables and has to be executed in SQL command mode. If you are using the SQL Management Studio, you can enable it in the Query actions.
{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-25-22-36-26.png" alt="Enable the SQL command mode" caption="Enable the SQL command mode" %}

General assumptions:
1. The content database has one attachment and one archive database.
2. The attachment and archive database name follow the default naming convention. Their name begins with the content database name and either a `_Att` or `_Arch` suffix is added.
3. You have a dedicated SQL user.
4. The SQL user and the application pool should get db_owner privileges. 

{: .notice--warning}
**Remark:**
These are just some general information and should make you aware of obvious differences to your environment. You should take a look at the script anyways and verify whether you want to use any of it.

The script does the following:
1. Restoring the databases\
   The script restores the content database, one attachment database and one archive database as new databases on the SQL server.
   The backups, data and log file location and new database name are set by variables. There's only one `targetDatabase` variable which is used for the process database. The archive and attachment database name will be created using the default suffixes `_Att` and `_Arch`. 
2. Updating the references in the tables\
   There are few tables which contain references to the old/source databases.
3. Adding the new content db\
  The script  adds a row for the new content database in the config database.
  I have no idea, whether there's a better/supported way of doing so. Maybe adding the database via `Tools and application management` and overwriting these during the restore would be one option.
4. SQL and application pool account are added\
   The SQL user and application pool account will receive db_owner privileges to all three databases. 
   

The result and errors of the script are saved to a text file. 
{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-13-36.png" alt="The output and error are saved in a file." caption="The output and error are saved in a file." %}

## Modify V_WFElements in archive db

{: .notice--info}
**Info:**
This is only a necessary if the name of the content database was changed.

The archive database contains a V_WFELements view, which references information from the content database. Therefore, you need to update the view using the new content database name.


{: .notice--warning}
**Remark:**
I have no idea, whether this view is used, but upgrading to BPS 2023 will fail otherwise. BPS 2023 will add the calculated columns to the view and if the references database doesn't exist, it will throw an error.

The easiest way is to use the `CREATE OR ALTER To` action from the context menu, update the database name and execute the script.
{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-16-48.png" alt="Select create or alter from the context menu." caption="Select create or alter from the context menu." %}

{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-17-47.png" alt="The view references the old database." caption="The view references the old database." %}

# WEBCON BPS Tools
## Change database type

{: .notice--warning}
**Remark:**
While there's a difference between the environment and database type you won't be able to access the environment at all. 

I haven't found a better official documentation than this chapter.
[11. Reset the WEBCON BPS license](https://community.webcon.com/posts/post/going-sharepointless-how-to-transform-your-environment-into-standalone/168)

My personal checklist is:
1. Stop the workflow service
2. Start the resource toolkit\
   It is located in the WEBCON BPS installation folder at `Migration Tools\WebCon.BPS.ResourceKit.zip`
   {% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-21-37-21.png" alt="Resource toolkit can be found in the `Migration Tools` folder" caption="Resource toolkit can be found in the `Migration Tools` folder" %}
3. Display the change database type
   1. Provide the connection details in the configuration window.
   2.  Switch to `Change database type`.
   {% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-19-45.png" alt="Connection and Change database" caption="Connection and Change database" %}
4. Change database (1) and save (2)
   {% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-20-44.png" alt="Change database type and save." caption="Change database type and save." %}
5. Restart the workflow service


You may loose the license information and need to download the licenses again.
{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-34-27.png" alt="License information have been lost after changing the database type." caption="License information have been lost after changing the database type." %}

## Upgrade the database 
In case you restored a database on a server with a newer WEBCON BPS version, you need to upgrade the database version.
Execute the setup.exe, choose the "Update" and click through. The upgrade will check what needs to be done and it will only upgrade the new database.
{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-32-25.png" alt="Select the `Update or expand existing WEBCON BPS installation` to upgrade the database version." caption="Select the `Update or expand existing WEBCON BPS installation` to upgrade the database version." %}

{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-23-33.png" alt="Upgrade process will upgrade the single database." caption="Upgrade process will upgrade the single database." %}

## Associate to workflow service
The restore script will add an entry to the `ContentDatabases` table of the configuration database. That's not enough though. You still need to associate the new database to the workflow service. 
1. Select `Tools for application management` from setup.exe.
2. Choose `Farm services configuration`.
3. Click on add.
4. Select the new database from the drop down.

{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-29-12-46-06.png" alt="Associate new database to the workflow service." caption="Associate new database to the workflow service." %}

## Grant admin permissions
### Old version without admin access
In case you are accessing the Designer Studio with a user, which is not available in the new environment, you have to grant new system administrator privileges. For this you can use the `WEBCON BPS System administrators.exe` tool.

{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-26-43.png" alt="WEBCON BPS System administrator.exe location" caption="WEBCON BPS System administrator.exe location" %}

1. Provide the connection details
2. Connect to the server
3. Select the database
4. Modify the existing administrators using the actions at the right.
{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-28-53.png" alt="Changing the system administrators of a database." caption="Changing the system administrators of a database." %}

{: .notice--info}
**Info:**
I sort the folder by `File type`. This way I will have the .exe files at the top.

### Newer version with admin access option
WEBCON BPS 2023 added the `Admin access`, which is enabled by default when installing environment. You can activate this for existing environments using the administrators tool. 
{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-16-22-31-20.png" alt="Admin access" caption="Admin access" %}

With the admin access you will be able to access the Designer Studio and change the system administrators.

# Restart WEBCON Workflow Service and application pool
If you haven't done so, you should restart the workflow service and the application pool hosting the WEBCON BPS web site.

# Designer Studio
## Run user synchronization
If the new environment uses a different source for user synchronization or you have utilized local accounts, you should trigger a full user synchronization.

{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-22-00-36.png" alt="Trigger the user synchronization." caption="Trigger the user synchronization." %}

## Update search 
I have no idea whether and how it would be possible to transport and connect the search database. 
Depending on the database size you should at least trigger the reindexation of the BPS Portal navigation.

{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-21-58-38.png" alt="Executing reindexation of the database" caption="Executing reindexation of the database" %}


# Same application multiple databases
Copying a database will allow you to have the same application multiple times in the same environment. If you tried this via the export/import mechanism you may have received an error, that this is not possible. The error would be something like `the process GUID is already used in another database.`.

This behavior is controlled by the global parameter `ImportValidateAppProcPresUniqueness` in the config database. If it is set to 0 you will be able to import the same application into multiple databases.
{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-22-01-31.png" alt="`ImportValidateAppProcPresUniqueness` controls whether an application can be imported into multiple databases " caption="`ImportValidateAppProcPresUniqueness` controls whether an application can be imported into multiple databases " %}

The only technical problem I'm aware of is, that embedding BPS Portal elements is limited to unique application ids. The generated URL doesn't contain a database id, so it won't work. 

{% include figure image_path="/assets/images/posts/2023-10-27-copy-a-database/2023-10-26-22-08-00.png" alt="Creating a link to embed a component does not contain the database id." caption="Creating a link to embed a component does not contain the database id." %}