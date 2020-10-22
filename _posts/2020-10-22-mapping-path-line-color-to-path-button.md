---
title: "Mapping path button colour to line colour"
categories: 
  - Webcon BPS
  - Cosmo Consult LS GmbH
tags:
  - User experience
excerpt:
    Example styles for matching the path button colour it's line in the workflow preview.
---
- [Explanation](#explanation)
- [Recommendation for colour usage and styling](#recommendation-for-colour-usage-and-styling)
  - [Save path (blue colour)](#save-path-blue-colour)
  - [Default positive path](#default-positive-path)
  - [Negative path](#negative-path)
  - [Admin paths](#admin-paths)

# Explanation
We can choose between four different colours for a path line, grey, blue, green and red. Choosing a colour makes it easier for the user to read the diagram. This is especially true, if you define when which colour is used. 

![alt](/assets/images/posts/mapping-path-colour/workflow-preview.png)

Applying the colour in the diagram is only one part styling. Defining a matching style for the path buttons will make improve this.

# Recommendation for colour usage and styling

## Save path (blue colour)
All paths which don't leave the step like a *save* path should use the blue colour.
```css
background-colour: rgba(7, 150, 221, 0.5);
```  
![Save path](/assets/images/posts/mapping-path-colour/path_save.png)

## Default positive path
The default positive path, which will lead to another step or the final positive step.
```css
background-colour: rgba(154, 205, 50, 0.5);
``` 
![Positive path](/assets/images/posts/mapping-path-colour/path_positive.png)

## Negative path
Negative paths which will lead to another step.
```css
background-colour:rgba(222, 13, 13, 0.5);
```
![image.png](/assets/images/posts/mapping-path-colour/path_negative.png)

## Admin paths
Admin paths, which are only visible if the Admin mode has been activated, should be distinctive. 
```css
background-colour: #fa7fff61;font-style: italic;font-weight: bolder;
```
![image.png](/assets/images/posts/mapping-path-colour/path_admin.png)