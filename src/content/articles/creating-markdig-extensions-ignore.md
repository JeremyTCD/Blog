---
mimo_pageDescription: A tutorial on creating markdig extensions.
mimo_pageTitle: Creating Markdig Extensions
mimo_pageID: creating-markdig-extensions
mimo_date: May 3, 2018

mimo_disableComments: true
mimo_socialMediaCard: true
mimo_shareOnFacebook: true
mimo_shareOnTwitter:
    hashtags: markdig, extension
    via: JeremyTCD
---

# How Markdig Works

- BlockProcessor.TryContinueBlocks calls block.Parser.TryContinue, if it returns
	- BlockState.Skip
		- continue (current block should close, but a child may keep it open)
	- BlockState.None
		- break (current block and all its children close)
	- BlockState.Break
		- does nothing?
	- BlockState.BreakDiscard
		- break and stop processing line
	- BlockState.Continue or BlockState.ContinueDiscard
		- set block.IsOpen to true
- BlockProcessor.TryOpenBlocks calls block.Parser.TryOpen, if it returns
	- BlockState.none
		- continue
	- Blockstate.BreakDiscard
		- if no new blocks added
			- break and stop processing line

- container block vs leaf block
    - container block: block that contains other blocks
    - leaf block: block that contains inline content
- what is a lazy continuation?
	- within certain blocks, such as list items and blockquotes, if a line is a continuation of a paragraph, it does not need to begin with special characters like "  " or ">".
	- when such a line is reached, block processor tries to continue the paragraph's parent block. since the line does not begin with the parent block's special characters, 
      parent block is marked for closing.
	- blockprocessor then tries to open blocks (TryOpenBlocks). since CurrentBlock is a paragraph block, TryOpenBlocks tries to continue the CurrentBlock. When it succeeds,
      it calls OpenAll, marking the parent block and its last child (paragraph block) as open.  
- container inline vs leaf inline
    - ?

- step through markdig, get a solid understanding of how it works
    - Step through custom container tests, also, step through GenericAttributes tests, need them
        - Specs/Specs.cs
- write article outline in point form
    
- create a container block extension
    - sections
- create a leaf block extension
    - code blocks
        - options extension 
- create an inline extension
    - inline include

- write article
- finish up extensions

Markdown.cs
    - ToHtml
        - MarkdownParser.Parse(markdown, pipeline), returns MarkdownDocument, an AST
            - MarkdownParser.ProcessBlocks
                - reads each line, calls BlockProcessor.ProcessLine()
                    - Calls BlockProcessor.TryContinueBlocks(), tries to continue open blocks
                        - Calls BlockParser.TryContinue
                            - This is the extensible bit
                        - depending on the result and whether the current block is a
                            - container block
                            - leaf block
                          acts accordingly.
                    - If open blocks don't consume line, calls BlockProcessor.TryOpenBlocks(), tries to open a new block
                        - gets parsers for the opening char of the line
                        - calls BlockParser.TryOpen
                            - Extensible
                    - Calls BlockParser.Close for closed blocks
                - closes all blocks once all lines have been processed
            - MarkdownParser.ProcessInlines
                - Uses a stack to traverse tree of blocks
                    - If block is a LeafBlock (block with no child blocks), calls InlineProcessor.ProcessInlineLeaf
                        - Gets inline parsers for opening char
        - HtmlRenderer.Render(document), renders MarkdownDocument as HTML
            - Recursively writes block and inline MarkdownObjects
            - Calls HtmlObjectRenderer<T>.Write
    - Basically, for each line, set all blocks to closed, then iterate from outermost block to inner most block
        - if a block gets closed, all its children naturally get closed too, so just break (all set to close already)
        - if a block remains open, set to open and iterate to next child


# Block Extensions

# Inline Extensions