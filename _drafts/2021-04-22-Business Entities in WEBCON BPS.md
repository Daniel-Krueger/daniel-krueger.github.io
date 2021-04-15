---
title: "Companies/Subsidiaries (Business Entities) in WEBCON BPS"
categories:
  - Private
  - WEBCON BPS  
tags:
  - Business Entity
  - Privileges
  - Data sources
excerpt:
    How the same workflow can be used by multiple Companies/Subsidiaries (Business Entities) in WEBCON BPS.
bpsVersion: 2021.1.2.101
---

# Overview

I started my career with Navision where I first encountered the concept that multiple companies / subsidiaries can share the logic of an ERP system but store their data separately. This is a good way to enforce that the different entities of a parent company use the predefined processes without implementing the logic multiple times. The same concept could be applied to SharePoint where the "companies" are site collections which business logic is represented by the used features. When I learned about WEBCON BPS I was really surprised to see the same concept applied to a process platform. 

While Navision used the term `Company` in WEBCON BPS it is `Business Entity`. There are three areas in the platform where you can make use of a Business Entity

1.  Data separation
2.  Defining privileges
3.  Different data sources

While the first two are similar two Navision or Business Central (BC) which is it's current name, the last one is one of my favourite WEBCON BPS features.

Since this Blog is about WEBCON BPS I will use the term `Business Entity` instead of companies, which is more appropriate anyway. I have seen cases where an own 'company' has been created for the HR department out of security reasons.

# Data separation
In most cases Business Entities shouldn't have access to the data of other Business entities. In some cases their may even be legal reasons for this. Therefore there must be an option to identify which record in the database is associated to which Business entity. When Microsoft introduced the SQL Server database for Navision it was decided to create own tables for each business entity and prefix the table with the business entity name.
![The highlighted part is the company(Business Entity) name in Navision](/assets/images/posts/2021-04-01-path-button-styling/2021-04-15-23-04-32.png)

As mentioned before you could represent a business entity in SharePoint by creating an own Site Collection for it, but a different implementation from Navision was chosen for this. This time, the data could be separated by a column value instead of an own table. There's a site collection table which key is reused in other tables.
The same approach is used in WEBCON BPS. The business entities are stored in the table `Companies` which key is used in table `WFElements` to separate the data.
![The id of a company is stored in an own column WFD_COMID for each created workflow instance.](/assets/images/posts/2021-04-01-path-button-styling/2021-04-15-23-13-30.png)

{: .notice--warning}
**Remark:** All of the described approaches are fine, while the best one is another option in SharePoint. You can create an own database for each site collection, so the data is not only separated by a column value or table inside the same database file but are different database files all together.

{: .notice--warning}
**Remark:** WEBCON BPS is more than ten years old, so there have been different name changes in the UI which couldn't be reflected in the backend. Therefore `Business entity` in the UI is internally still a `Company`


# Defining privileges
# Different data sources


{: .notice--warning}
**Remark:** There's one major draw back if attribute selectors are used. The selector matches *each* character. If one of the values contains an additional white space it won't be matched. 
