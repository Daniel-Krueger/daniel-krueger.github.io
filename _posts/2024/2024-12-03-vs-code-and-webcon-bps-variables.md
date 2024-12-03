---
title: "VS Code: Execute default search & replace with a key"
categories:
  - WEBCON BPS
  - Private 
tags:
 - JavaScript
excerpt:
    "RIP: Code formatting brakes variables in VS Code"
---

# Overview
Any regular visitor of my blog will know that I'm creating quite a lot of JavaScript. Most of the time I will be using VS Code and while I'm in the early stages I'm copying the code back and forth between VS Code and the Designer Studio.
Sometimes I let VS Code format the code and when I copy the code back to Designer Studio it is broken.

{% include figure image_path="/assets/images/posts/2024-12-03-vs-code-and-webcon-bps-variables/2024-12-03-22-10-40.png" alt="Copying back the formatted code from VS Code to Designer Studio" caption="Copying back the formatted code from VS Code to Designer Studio" %}

# Root cause
The issue is that the variable, if they are not marked as a text with `'," or ```, are interpreted as JavaScript and therefore formatted.
I didn't find an out of the box solution which would allow me to exclude the WEBCON BPS variables from the formatting using regular expressions. Thinking of regular expressions though allowed me to come up with a workaround.

# Workaround
While it is possible with a custom extension / more sophisticated formatting extension to exclude the WEBCON BPS variables, I stumbled about the VS Code key bindings and [built-in commands](https://code.visualstudio.com/api/references/commands)

>editor.actions.findWithArgs - Open a new In-Editor Find Widget with specific options.
> - searchString - String to prefill the find input
> - replaceString - String to prefill the replace input
> - isRegex - enable regex
> - preserveCase - try to keep the same case when replacing
> - findInSelection - restrict the find location to the current selection
> - matchWholeWord
> - isCaseSensitive

This command allows us to configure a default search and replace expression. 

I opted for the following short cut combination:
- ctrl+alt+1 will format the text<br/>
  ![](/assets/images/posts/2024-12-03-vs-code-and-webcon-bps-variables/2024-12-03-22-45-54.png)
- ctrl+alt+2 will open the search and replace<br/>
  ![](/assets/images/posts/2024-12-03-vs-code-and-webcon-bps-variables/2024-12-03-22-54-44.png)
- ctrl+alt+enter will execute the search and replace. This is a default binding for the action. <br/>
  ![](/assets/images/posts/2024-12-03-vs-code-and-webcon-bps-variables/2024-12-03-22-46-23.png)

This will allows us to execute the format and replace action in less than a second. 


# Keybindings
Opening the search & replace widget with a default expression will require a custom key binding.

You can open the keybindings.json by searching `> keyboard` and execute the `Preferences: Open Keyboard Shortcuts (JSON)` item.

{% include figure image_path="/assets/images/posts/2024-12-03-vs-code-and-webcon-bps-variables/2024-12-03-22-20-30.png" alt="Open the personal keybindings file. " caption="Open the personal keybindings file. " %}

The first element in the array defines the new action while the, third element in the array will remove the default action to format the document from the key `shift+alt+f` and assign it to `ctrl+alt+1`, the second element.
```JSON
// Place your key bindings in this file to override the defaults
[
    {
      "key": "ctrl+alt+2", 
      "command": "editor.actions.findWithArgs",
      "args": {
        "searchString": "#\\{\\s+(\\w*):\\s*(\\d*)\\s*\\}#",
        "replaceString": "#{$1:$2}#",
        "isRegex": true        
      },
      "when": "editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly && !inCompositeEditor"
    },
    {
      "key": "ctrl+alt+1",
      "command": "editor.action.formatDocument",
      "when": "editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly && !inCompositeEditor"
    },
    {
      "key": "shift+alt+f",
      "command": "-editor.action.formatDocument",
      "when": "editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly && !inCompositeEditor"
    }
]
```

Instead of changing the keybinding for the default action within the JSON you can bring up the `Keyboard shortcuts`, search for the binding and replace it using the pen icon in the  UI.
{% include figure image_path="/assets/images/posts/2024-12-03-vs-code-and-webcon-bps-variables/2024-12-03-22-44-01.png" alt="Open the keyboard shortcuts UI" caption="Open the keyboard shortcuts UI" %}
{% include figure image_path="/assets/images/posts/2024-12-03-vs-code-and-webcon-bps-variables/2024-12-03-22-44-56.png" alt="Change the binding of the default action using the pen." caption="Change the binding of the default action using the pen." %}
