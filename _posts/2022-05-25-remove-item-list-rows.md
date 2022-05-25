---
title: "Remove item list rows"
categories:
  - WEBCON BPS  
tags:
  - Custom Action
  - SDK
  - Item list
  - 
excerpt:
    Description of the custom SDK action to remove specified rows from an item list.
bpsVersion: 2022.1.2.31
---

# Overview  
This post describes the configuration of a custom action which can be used to remove defined rows from an item list. This is not possible with the provided actions. The `change list item` action supports:
-  adding new rows
-  updating existing rows, which can also be used to add new rows
-  replacing the existing rows, this will delete all rows and add new ones.

You can use the  `Replace values` option to remove rows. There are two drawbacks. The first one is, that it's not so easy to identify the removed rows in  the version history. The second one depends on the use case. If you are referencing item list rows in other workflows, these references will be break.

Using the custom SDK action will only remove the defined ones, the other rows won`t be changed. So it will be easier to identify the changes in the history.

{% include figure image_path="/assets/images/posts/2022-05-25-remove-item-list-rows/version-history-change-item-list-result.gif" alt="How the changes of the different actions are displayed in the history." caption="How the changes of the different actions are displayed in the history." %}


# Configuration 
The configuration of the SDK action is simple, after uploading the plugin:
1. Choose the `Run an SDK action` 
2. Select the `RemoveItemListRows` action from the plugin

{% include figure image_path="/assets/images/posts/2022-05-25-remove-item-list-rows/2022-05-25-22-35-51.png" alt="Selecting the action" caption="Selecting the action" %}

Open the configuration and: 
1. Select the item list id
2. Define the column name which contains the DET_ID 
3. Provide the SQL command which will return the ids of the rows which should be removed
{% include figure image_path="/assets/images/posts/2022-05-25-remove-item-list-rows/2022-05-25-22-33-12.png" alt="RemoveItemList configuration" caption="RemoveItemList configuration" %}

Example SQL command which will return all item list rows which column value is true.
``` sql
select DET_ID
from WFElementDetails 
where DET_WFCONID = {WFCON:2160}
 and DET_WFDID = {WFD_ID} 
 and {DCNCOL:323} = 1
```

{: .notice--info}
**Info:** There's no option to test the SQL command, therefore create the script in another action or data source.

# SDK Action execution
The action will execute the SQL command against the current database. In case the SQL command fails, you can take a look at the history in admin mode to see the execute SQL command.

{% include figure image_path="/assets/images/posts/2022-05-25-remove-item-list-rows/2022-05-25-22-47-42.png" alt="Log example when there's an error in the SQL command." caption="Log example when there's an error in the SQL command." %}

It will also be checked whether the selected item list exists and if the result of the SQL command contains the column containing the DET_ID.

{% include figure image_path="/assets/images/posts/2022-05-25-remove-item-list-rows/2022-05-25-22-49-05.png" alt="Log example when the column name doesn't exist in the result." caption="Log example when the column name doesn't exist in the result." %}

If everything is fine, the rows will be removed. Which rows have been removed can be seen in the log, if you switched to admin mode.

{% include figure image_path="/assets/images/posts/2022-05-25-remove-item-list-rows/2022-05-25-22-50-36.png" alt="The list of the removed rows." caption="The list of the removed rows." %}



# Download
The repository of the custom SDK action can be found [here](https://github.com/Daniel-Krueger/webcon_cclsactions).\
If you don't want to build it yourself, you can download the .zip [here](https://github.com/Daniel-Krueger/webcon_cclsactions/releases).


