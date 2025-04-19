---
title: "Author vs dedicated field"
categories:
  - WEBCON BPS
  - Private 
tags:
  - Best practice   
excerpt:
    "In my opinion, the use of the author field is limited to the audit trail"
bpsVersion: 2025.1.1.105
---

# Overview
I was asked, how we could display values like manager/department of the author of a workflow instance. While this is easy to do, I strongly advice against using the standard author value at all. I will answer the question and my reasons against it:

- Information is out of context
- Will someone create the workflow for someone else
- Business logic

{% include figure image_path="/assets/images/posts/2025-04-19-Author-vs-dedicated-field/2025-04-19-12-37-04.png" alt="Author or dedicated field?" caption="Author or dedicated field?" %}

{: .notice--info}
**Info:**  I would even create a global `Author` field if I would only create processes for myself. ;)

# Information is out of context
In most cases you won't be able to locate the author of a workflow instance very easily:
- The info panel may be hidden
- There is too much information in the panel, and you need to scroll
- It has a smaller font than the other information
- In my modal dialog its hidden by default

If you want to display additional information like manager or department of the author, they would be even more out of context.
{% include figure image_path="/assets/images/posts/2025-04-19-Author-vs-dedicated-field/2025-04-19-12-14-06.png" alt="We know the manager, but who's the author?" caption="We know the manager, but who's the author?" %}


With a dedicated field and a 'Roles' group you will always know who has which role in the workflow. 
{% include figure image_path="/assets/images/posts/2025-04-19-Author-vs-dedicated-field/2025-04-19-12-14-13.png" alt="With a dedicated field we always know the context of the information." caption="With a dedicated field we always know the context of the information." %}

Of course, we can work around the 'out of context' issue by adding a data row, to display the author in a field. While this will prevent saving duplicate information, it causes additional work on the server.




# Will someone create the workflow for someone else
Raise your hands the number of times, you needed to do something for someone else? This may be restricted by your role, but it will happen. For example, if HR or your manager enters a sick leave for you. Or you get a phone call from a colleague who’s on the road. If you would be using the standard author field you wouldn't be able to change this. 
 
Of course, we could make use of substitutions in the [`Working on behalf` mode]( https://docs.webcon.com/docs/2025R1/Portal/Substitutions/#substitution-type), but this won't always work out. 


# Business logic
My strongest objection against the standard author field is, that we can't track it's use.

One of the biggest benefits of the WEBCON is the data integrity, which also applies to the business logic.

I won't sacrifice this just to save a few bytes per workflow instance and use the standard author field in any business logic.
- Actions
- Business rule
- Form rules
- Task assignments
- Other workflows
- etc..

Everything is there, I don't need to remember where the author is involved. 

{% include figure image_path="/assets/images/posts/2025-04-19-Author-vs-dedicated-field/2025-04-19-12-26-01.png" alt="Good luck getting this information, if you are using the standard author field." caption="Good luck getting this information, if you are using the standard author field." %}



# General implementation to display additional information
If you want to display additional information about a user and want to store them in the workflow instance. You can achieve this for both options.

If you want to don't want a dedicated field, you can simply add field with a default value, and filter for the current user.
{% include figure image_path="/assets/images/posts/2025-04-19-Author-vs-dedicated-field/2025-04-19-12-06-30.png" alt="Store the current manager of the author." caption="Store the current manager of the author." %}


With a dedicated field it's quite similar.
- Set the default value of the field to the current user<br/>
 ![](/assets/images/posts/2025-04-19-Author-vs-dedicated-field/2025-04-19-12-08-29.png)
- Set the target fields in the advanced configuration<br/>
  ![](/assets/images/posts/2025-04-19-Author-vs-dedicated-field/2025-04-19-12-09-00.png)
- Ensure that the target field can be set by JavaScript <br/>
  ![](/assets/images/posts/2025-04-19-Author-vs-dedicated-field/2025-04-19-12-10-55.png)
  


{: .notice--warning}
**Remark:**  Regardless of your approach, never use the `Current user: Name` option. Always use the login. Otherwise, you will get an error, if there are two persons with the same name in the company. ;)
