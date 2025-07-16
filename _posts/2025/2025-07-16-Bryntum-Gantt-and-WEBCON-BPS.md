---
title: "Bryntum Gantt and WEBCON BPS"
categories:
  - WEBCON BPS
tags:
 - Data sources
 - REST
excerpt:
    "Learnings from hooking up an item list with Bryntum Gantt"
bpsVersion: 2025.1.1.105
---


# Overview

{: .notice--info}
**Remark:** This post will focus on my learning when I hooked up Bryntum Gantt to an item list in WEBCON BPS. While I developed it, the source code is owned by Resalta and I can't share it.

Resalta uses WEBCON BPS to manage projects. Of course, projects have multiple tasks, and they depend on each other. The more tasks a project has, the harder it gets to plan which task should be executed when. The obvious solution is adding some kind of Gantt diagram for planning those tasks but there's no build in solution for visualizing data in a Gantt diagram. Ok we can have a Gantt view for absences, but that's not enough in this case anyway.

While searching for a good alternative [Aleš](https://www.linkedin.com/in/ale%C5%A1-jurak/) found the Gantt library from [Bryntum](https://bryntum.com/products/gantt/examples/). The linked examples showcase the extensive features of this library. This was the time when he got in touch with me to discuss, whether we could make us of it in WEBCON BPS to improve the planning experience for the users. Based on my previous experience and a short review of the documentation I was sure we could make it work. We would add a 'planning workflow' which would load the existing tasks to an item list and use this item list as data storage. As you can see in the video below everything worked out fine. :)


{% include video id="x5IuCKivDV4?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

# Installation
## How to use Bryntum

Bryntum offers a broad range of libraries for different [frameworks](https://bryntum.com/products/gantt/docs/):
- Angular
- React
- Salesforce
- Vanilla JS
- Vue

The question is, which of these can we use in WEBCON BPS?

In WEBCON BPS we have two options to customize forms and fields.
1. Creating a [form field extensions](https://developer.webcon.com/docs/form-field-extension/)
  These allow us to modify the UI and add additional logic to a form field by creating a REACT component
2. Adding HTML code 
  This can be done by executing form rules and/or adding an HTML field.

While form field extensions would offer us the ability to make use of REACT and features like imports, these are way slower to deploy and test than HTML code. That's the reason why I don't use them. Ok, we can't use form field extensions for item list anyway. :)

This had the drawback though, that I couldn't rely on IntelliSense support and static code analysis which would make using an unknown library a lot easier.

Since we inject HTML in the form, I also couldn't use imports used by the vanilla JS examples, which made it again a bit harder. 

## Deployment
One of the earliest questions was where we could deploy the library and necessary files. WEBCON doesn't have a build-in support which would allow us to use it as CDN. On the other hand, just because WEBCON doesn't offer it, it doesn't mean it's not possible. From my experience I can tell, that the [CDN PoC](https://daniels-notes.de/posts/2023/global-js#no-cdn-use-a-virtual-directory) still works. :) 
The good thing is, that the Resalta had another site, which we could use to deploy the files to. 


# Learnings
## Extensive library
The more you work with the library, the more features you will discover: These are just a few examples:

- Adding a new context menu?
  ```js
  /// PoC
  ,  displayWorkflow: {
                         text: 'Show task',
                         icon: 'b-fa b-fa-code',
                         onItem: ({ taskRecord }) => {
                             ccls.modal.dialog.displayUrl(taskRecord.name, `/db/23/app/53/element/${taskRecord.wfdId}/view?isModal=1`)
                         }
                    }
  ```
- Adding toolbar buttons? 
  ```js
         {
            type: 'button',
            text: 'Save',
            icon: 'b-fa-save',
            onAction: function () { resalta.bryntum.Gantt.SaveWorkflowInstance(true); }
        },
  ```
- Adding support for Excel/CSV export, copy & paste from the example
- Modifying the build in edit dialog, 
  ```js
   generalTab: {
                        items: {
                            // Remove "% Complete","Effort", and the divider in the "General" tab
                            effort: false,
                            divider: false
                        }
                    },
  ```

It's so easy to add more and more features that the actual problem is sticking to the necessary functionalities. It was hard to resist the urge to test all the features. :)
                  

## Loading the library
The most important thing to remember is that WEBCON BPS is in the end a single page application. Everything which has been added to the DOM will live on until the user executes the refresh of the browser. Therefore, you need to make sure that this won't create issues when the user navigates from one planning workflow to another.

Once the library has been loaded you can create a new Gantt object:
```js
  window.currentGantt = new bryntum.gantt.Gantt({
        appendTo: ...
```

## Data JSON model
Another thing I found quite late was a [good data example](https://bryntum.com/products/gantt/examples/_datasets/launch-saas-advanced.json) from which I could derive what I need to do.
This is the one which turned out to be really helpful for understanding how the WBS numbers and dependencies are calculated. The WBS numbers are inferred from the children while the dependencies are an own object.

Snippet:
```js
"tasks" : {
    "rows" : [
      {
        "id"          : 1000,
        "name"        : "Launch SaaS Product",
        "percentDone" : 34,
        "startDate"   : "2025-01-14",
        "endDate"     : "2025-03-20",
        "duration"    : 47,
        "expanded"    : true,
        "complexity"  : 3,
        "children"    : [
          {
            "id"          : 1,
            "name"        : "Setup web server",
            "percentDone" : 42.3,
            "duration"    : 7,
            "startDate"   : "2025-01-14",
            "rollup"      : true,
            "endDate"     : "2025-01-23",
            "expanded"    : true,
            "complexity"  : 2,
            "children"    : [
              {
                "id"          : 11,
                "name"        : "Install Apache",
                "percentDone" : 50,
                "startDate"   : "2025-01-14",
                "rollup"      : true,
                "duration"    : 3,
                "endDate"     : "2025-01-17",
                "cost"        : 200,
                "priority"    : 1,
                "complexity"  : 1,
                "baselines"   : [
                  {
                    "startDate" : "2025-01-15T00:00:00",
                    "endDate"   : "2025-01-17T00:00:00"
                  },
                  ..
                ]
              },
            ]
          },
          ...
      ]
  },
  "dependencies" : {
    "rows" : [
      {
        "id"       : 1,
        "fromTask" : 11,
        "toTask"   : 15,
        "lag"      : 2
      },
      ...
    ]
  }
```

## The events are overhead in WEBCON BPS
As a developer my first approach was to make use of the events. This way I could easily check whether my code worked, and the modifications are written back to the item list. 
While this worked fine in the beginning, it soon turned out to be a problem, when I extended the functionality to not only plan existing tasks but to create new tasks and remove existing ones.

This made me rethink my decision, and I realized that the events are just an overhead, in our context:
- Only a single user can edit the plan.
- We can't and don't need to automatically save the changes in the database.

If we take this into account, we can simplify this by adding a button which will then iterate the tasks of the Gantt project object and then update the item list.

This left one little issue. I wanted to see the result, without actually saving the workflow instance. Therefore, I added a 'debug' mode which would display the otherwise hidden item list and would allow me to write the current values back to it without saving the workflow instance.
```js
    if (document.location.search.includes('debug')) {
        toolbar.unshift({
            type: 'button',
            text: 'Write to item list',
            icon: 'b-fa-save',
            onClick: () => {
                resalta.bryntum.Gantt.SaveWorkflowInstance(false);
            }
        });
    }
``` 


{: .notice--info}
**Remark:** Ok, this is not 100% true. I used the "paste" event of the copy functionality, to remove some information from the new tasks like the original workflow id.

## Saving the data
If I don't use the events, how do I make sure that the modified data is written back to the item list?

One option is to hide the save button and any path buttons with JavaScript and trigger the save action/ path transition by a custom toolbar button.

If you don't want to hide the path buttons, you could add an `Additional path validation form rule`. 

![](/assets/images/posts/2025-06-20-Bryntum-Gantt-and-WEBCON-BPS/2025-06-11-22-38-05.png)
## WBS number is outdated
This was the one option I found quite late:
``` js
project.taskStore.wbsMode = 'auto';
```

This will automatically recalculate the WBS number, which was really necessary when I activated the copy & paste functionality.

## Add new task with edit dialog
Everything is easy, once you know how to do it. These few lines will add a new task and display the edit dialog for the newly added row.

``` js
toolbar = [
        {
            style: 'color: var(--colorNeutralForegroundOnBrand); background-color: var(--colorBrandBackground1);',
            icon: 'b-fa b-fa-plus',
            text: resalta.bryntum.GanttConfig.toolbarButtons.addButton.text,
            tooltip: resalta.bryntum.GanttConfig.toolbarButtons.addButton.tooltip,
            hidden: !resalta.bryntum.GanttConfig.toolbarButtons.addButton.visible,
            onAction: async function () {
                const added = currentGantt.taskStore.rootNode.appendChild({ name: this.L('New task'), duration: 1 });

                await currentGantt.project.commitAsync();
                await currentGantt.scrollRowIntoView(added);
                currentGantt.features.taskEdit.editTask(added);
            }
        },
```

## Filtering
The library offers complex filtering options, if you want to filter only a single field you could clear all filters and apply the new ones:
```js
 onChange: ({ value }) => {
                const filterValue = value ? value.toLowerCase() : '';
                // Remove any existing filters before applying a new one
                currentGantt.taskStore.clearFilters();
                if (filterValue) {
                    currentGantt.taskStore.filter(task => {

                        const responsibleName = (task.responsibleName || '').toLowerCase();
                        return responsibleName.includes(filterValue);
                    });
                }
            }
```

If you are going for more complex filters, you can add a filter with an id and remove the filter when necessary.
```js
const enabledPhases = resalta.bryntum.Gantt._enabledPhaseIdsCache = new Set(
        resalta.bryntum.GanttConfig.dataMapping.phases
            .filter(p => p.checked)
            .map(p => p.id)
    );
    currentGantt.taskStore.removeFilter('phase');
    currentGantt.taskStore.filter({
        id: 'phase',
        filterBy: function (record) {
            if (enabledPhases.size === resalta.bryntum.GanttConfig.dataMapping.phases.length) {
                return true;
            }
            return enabledPhases.has(record.phase);
        }

    });
```