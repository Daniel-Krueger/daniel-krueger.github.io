---
title: "Unicode *formatted* text to ascii"
categories:
  - Private  
tags:
  - PowerShell
excerpt:
    An PowerShell version to convert Unicode characters to ascii.
---

# Overview  
I'm currently in the process in moving my [I series](https://www.linkedin.com/feed/update/urn:li:activity:7109409448346955777/) from LinkedIn to my blog. LinkedIn is to short lift for this kind of information.

While I didn't want to rewrite everything, I decided to remove the *Unicode formatting*. But how should I remove the formatting?

{% include figure image_path="/assets/images/posts/2023-11-21-Unicode-to-ascii/2023-11-21-20-25-55.png" alt="Unicode format example" caption="Unicode format example" %}

# Removing the Unicode *format*
I had no idea on how to approach this, so I used ChatGPT. After a few false positives, pointing out the mistakes it generated a PowerShell script which was actually working for my cases.

Usage:
- Replace the text between ```@""@``` with your Unicode text
- Review the result in the output window
- If it's fine you can paste the text to the target place, as it is already copied to the clipboard.

``` powershell
function Convert-To-ASCII ($text) {
    # Normalize the text using FormKD (Compatibility Decomposition, followed by Canonical Composition)
    $normalizedText = [System.Text.RegularExpressions.Regex]::Replace($text, '\p{M}', '').Normalize([System.Text.NormalizationForm]::FormKD)

    # Remove diacritic marks
    $asciiText = [System.Text.RegularExpressions.Regex]::Replace($normalizedText, '\p{M}', '')

    return $asciiText
}

# Example usage
$textToClean = 
@"
This is not only useful in daily business. You can '𝗺𝗶𝘀𝘂𝘀𝗲' 𝘁𝗵𝗶𝘀 𝗳𝗲𝗮𝘁𝘂𝗿𝗲 to:
- Do 𝗱𝗲𝗺𝗼𝘀 with different roles as a single person.
  I’ve used browser profiles before, but the change of the role was easily missed. This is not the case when using the Work on behalf feature.
- 𝗧𝗲𝘀𝘁𝘀 the application with different roles.
- 𝗗𝗲𝗯𝘂𝗴 𝗮 𝗽𝗿𝗼𝗰𝗲𝘀𝘀 if something only happens for a specific user.
  The user can simply tell the system that you are allowed to do so, and you ca𝗻 𝗱𝗲𝗯𝘂𝗴 𝗶𝘁 𝗶𝗻 𝗵𝗶𝘀 𝗻𝗮𝗺𝗲 on your machine 𝗶𝗻𝘀𝘁𝗲𝗮𝗱 𝗼𝗳 𝘀𝘁𝗲𝗮𝗹𝗶𝗻𝗴 𝗵𝗶𝘀 𝘁𝗶𝗺𝗲 with a screenshare.
"@
$asciiText = Convert-To-ASCII -text $textToClean
Write-Host $asciiText 
$asciiText | clip
```

# Converting text to Unicode *format* 
If you are wondering on how to create a formatted text, there are numerous tools out there. For example [YayText](https://yaytext.com/).

# Caveats of using Unicode *format*
The text looks like it is formatted to humans technically it is something completely different. The result of this is, that a search engine won't recognize the word 'ship' in a text if it was formatted using Unicode. Even if you are tempted by the options Unicode offers, don't use it if you want to be found. :)

You can test it yourself, try to search for 'Debug' on this page. The browser won't find it, although you can see it in the PowerShell example.



