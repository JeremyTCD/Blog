---
mimo_pageDescription: A tutorial on building DocFx markdown plugins. Part of a series on extending DocFX.
mimo_pageTitle: Extending DocFX - Markdown Plugins
mimo_pageID: extending-docfx-markdown-plugins
mimo_date: Apr 30, 2018

mimo_disableComments: true
mimo_socialMediaCard: true
mimo_shareOnFacebook: true
mimo_shareOnTwitter:
    hashtags: css, responsivetables
    via: JeremyTCD
---

Notes
- DocFX markdown validation and rewriting (https://dotnet.github.io/docfx/tutorial/validate_your_markdown_files.html) is unecessary. 
Instead, run generated html through a sanitizer.

Questions
- How does DocFX choose a markdown engine
    - DocumentBuilder.Build
        - CompositionContainer.GetExport<IMarkdownServiceProvider>(...)
        - DocumentBuilder.BuildCore
        - SingleDocumentBuilder.CreateMarkdownService calls IMarkdownServiceProvider.CreateMarkdownService which returns
          a MarkdownService instance
- How to add a markdig extension


# Setting Up a Plugin Project

# Writing a Plugin

# Using a Plugin