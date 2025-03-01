---
title: "Integrating Excel into a process"
categories:
  - WEBCON BPS
tags:
 - Excel
excerpt:
    "A show case on how to integrate Excel into process"
bpsVersion: 2025.1.1.44
---

# Use case
Now and again, we stumble about a process in which we need some kind of dynamic calculations. While sometimes these can easily be handled directly in WEBCON BPS we may also encounter situations, in which this is not possible. One of these can be a quality assurance process:
- Depending on the product type we have different checks to do
- The calculations vary greatly
- The business should be able to define these
- At the end of the process we need to generate a report with the result of the calculations and taken images.

Before I started, I wasn't sure, whether I would need to create something. In the end everything was possible with the standard WEBCON BPS Actions.

- Demo
  - [0:00](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=0s) Introduction
  - [0:15](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=15s) Storing different Excel templates in dictionaries
  - [0:38](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=38s) Selecting the Excel template to use in the process
  - [1:00](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=60s) Adding images
  - [1:20](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=80s) Result review
  - [1:35](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=95s) Order information, Excel file and taken images are merged into a final document
- Process configuration
  - [2:20](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=140s) Merging the documents
  - [2:43](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=163s) Showing the attachment in the step
  - [3:10](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=190s) Reading/writing the date from/to the Excel file
  - [4:00](https://www.youtube.com/watch?v=9ikUVh1-6Sg&t=240s) Setting up the Excel file


{% include video id="9ikUVh1-6Sg?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

# Excel configuration
## Reading / writing to an item list
Reading / writing an item list to an Excel file requires, that you format the range in excel as a `Table`. Then you can reference the `Table` in the Excel actions. The address is then mapped to the item list.
{% include figure image_path="/assets/images/posts/2025-03-01-Integrating-Excel-into-a-process/2025-03-01-13-09-06.png" alt="Mapping a formatted table to an item list." caption="Mapping a formatted table to an item list." %}

## Printing preparation
I've modified the Excel file, so that only the important information is printed.

1. Hide unimportant worksheets.
  {% include figure image_path="/assets/images/posts/2025-03-01-Integrating-Excel-into-a-process/2025-03-01-13-13-03.png" alt="Unimportant worksheets are hidden" caption="Unimportant worksheets are hidden" %}
2. Set the printing area.
  {% include figure image_path="/assets/images/posts/2025-03-01-Integrating-Excel-into-a-process/2025-03-01-13-13-49.png" alt="Hide the printing ara" caption="Hide the printing ara" %}

You can verify whether the printing is setup correctly, when you click on the `Preview` action.
{% include figure image_path="/assets/images/posts/2025-03-01-Integrating-Excel-into-a-process/2025-03-01-13-15-46.png" alt="Check the printing with the preview action" caption="Check the printing with the preview action" %}

You may need to enable the `Preview Excel files as PDF`. 
{% include figure image_path="/assets/images/posts/2025-03-01-Integrating-Excel-into-a-process/2025-03-01-13-16-36.png" alt="Activate the preview of Excel files" caption="Activate the preview of Excel files" %}
