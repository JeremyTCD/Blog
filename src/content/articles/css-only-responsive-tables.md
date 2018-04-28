---
mimo_pageDescription: This article describes a method for creating card-style responsive tables using only CSS.
mimo_pageTitle: CSS-Only Responsive Tables
mimo_pageID: css-only-responsive-tables
mimo_date: Apr 27, 2018
mimo_socialMediaCard: true
mimo_shareOnFacebook: true
mimo_shareOnTwitter:
    hashtags: css, responsivetables
    via: JeremyTCD
---

This article describes a CSS-only method for creating card-style responsive tables. Such tables
display each row as a card when space is limited. This article 
also discusses alternative methods, some of
which are useful in certain situations.

# The Method

## Result
[!include-markdown] { 
    "src": "../../resources/articles/cssOnlyResponsiveTables/exampleTableWithWrappers.html",
    "before": "<div id=\"method-example\">\n",
    "after": "</div>\n"
}

> [!alert-note]
> To test the table's responsiveness, adjust your window's width.

## Code
[!include-code] { 
    "src": "../../resources/articles/cssOnlyResponsiveTables/exampleTableWithWrappers.html",
    "collapseLength":2,
    "showLineNumbers": true,
    "language": "html",
    "title": "HTML"
}

[!include-code] { 
    "src": "../../resources/articles/cssOnlyResponsiveTables/methodExample.css",
    "collapseLength":2,
    "showLineNumbers": true,
    "language": "css",
    "title": "CSS"
}

## Breakdown

### HTML
#### Description
The only difference between the HTML for this method and the HTML for a typical table is that contents of `<td>` elements 
must be wrapped. For example, in the HTML for this method, the contents of `<td>` elements are wrapped in `<span>` elements:
[!include-code] { 
    "src": "../../resources/articles/cssOnlyResponsiveTables/exampleTableWithWrappers.html",
    "ranges": [{"start": 12, "end": 15}],
    "collapseLength":2,
    "language": "html"
}
> [!alert-note]
> [\<td\> elements](https://html.spec.whatwg.org/multipage/tables.html#the-td-element) have the 
> [flow content](https://html.spec.whatwg.org/multipage/dom.html#flow-content) content model,
> so it is fine for them to have child `<span>` elements.

#### Rationale
Wrapping allows the content of a `<td>` element to be laid out in its own [box](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model) 
when the table is in card mode. For example, consider a `<td>` element in the DOM tree when the 
table is in card mode:
[!include-code] { 
    "src": "<td data-label=\"Breed\">
  ::before
  <span>Persian Cat</span>
</td>",
    "language": "html"
}
This structure allows `Persian Cat` to be laid out in a box adjacent to the `::before` pseudo element's box. This can be done using styles like
`td:before, td > span { display: inline-block; }` or `td:before, td > span { display: table-cell; }`. If there is no wrapper element, the
same `<td>` element would have the following structure in the DOM tree:
[!include-code] { 
    "src": "<td data-label=\"Breed\">
  ::before
  Persian Cat
</td>",
    "language": "html"
}
`Persian Cat` would be a text node in the same box that contains the `::before` element. Hacky solutions would be required to lay `Persian Cat` out adjacent to 
the `::before` element. Some such solutions are discussed in the [alternative methods](http://localhost:8080/articles/css-only-responsive-tables#without-wrappers-in-td-elements) 
section.

### CSS
#### Description
If the non-optional (non-presentational) styles for this method were inlined, the `<table>` element would look like this in the DOM tree:
[!include-code] { 
    "src": "<table style=\"display: block\">
  <thead style=\"display: none\">...</thead>
  <tbody style=\"display: table\">
    <tr style=\"display: table-row-group\">
      <td data-label=\"label\" style=\"display: table-row\">
        ::before <!-- content: attr(data-label); display: table-cell; -->
        <span style=\"display: table-cell\">value</span>
      </td>
      <!-- More <td> elements ommitted for brevity -->
    </tr>
    <!-- More <tr> elements ommitted for brevity -->
  </tbody>
</table>",
    "language": "html"
}

This is equivalent to a HTML table with the following structure:
[!include-code] { 
    "src": "<table> <!-- <tbody> element with display: table -->
  <tbody> <!-- <tr> element with display: table-row-group -->
    <tr> <!-- <td> element with display: table-row -->
      <td> <!-- ::before pseudo element with display: table-cell -->
        label
      </td> 
      <td> <!-- <span> element with display: table-cell -->
        value
      </td>
    </tr>
    <!-- More <tr> elements ommitted for brevity -->
  </tbody>
  <!-- More <tbody> elements ommitted for brevity -->
</table>",
    "language": "html"
}

#### Rationale
The above-mentioned table structure is a simple and reliable structure for two-column cards. The following are some reasons why:
- No need to set column widths or row heights, since browsers handle table [column widths](https://www.w3.org/TR/CSS22/tables.html#auto-table-layout) and 
[row heights](https://www.w3.org/TR/CSS22/tables.html#height-layout).
- `<tbody>` elements demarcate cards, allowing for per-card styles, such as alternating background colors.
- The structure can be made accessible to screen readers through the use of [ARIA roles](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/table/table.html).
This is elaborated on in the next section.

### Notes
#### Accessibility
Accessibility is a problem for responsive tables. The root issue is that table elements (`<table>`, `<tr>`, `<td>`, etc) lose their semantic meanings 
when their `display` properties are changed. For example,
consider the accessibility tree (viewable in Chrome's [accessibility pane](https://developers.google.com/web/updates/2018/01/devtools#a11y-pane)) of
a row in the example table when in normal mode (`display` properties unchanged):

[!include-code] { 
    "src": "> table
  > row
    > gridcell \"Persian Cat\"
    > gridcell \"12-17 years\"
    > gridcell \"Iran\"
    > gridcell \"The Persian Cat is a...\""
}

The browser correctly interprets semantic meanings, identifying `<tr>` elements as rows, `<td>` elements as gridcells and so on. 
On the other hand, when the table is in card mode (`display` properties changed), the accessibility tree of the table is just a bunch 
of `GenericContainers`.

Unfortunately, all CSS-only, card-style, responsive table methods change `display` properties. That said, when using this method, JS can be used to improve accessibility by applying
[ARIA roles](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/table/table.html). For example, consider the card mode DOM tree with ARIA attributes applied:

[!include-code] {
    "src": "<tbody role=\"table\">
  <tr role=\"rowgroup\">
    <td data-label=\"Breed\" role=\"row\">
      ::before
      <span role=\"cell\">Persian Cat</span>
    </td>
    <!-- More <td> elements ommitted for brevity -->
  </tr>
  <!-- More <tr> elements ommitted for brevity -->
</tbody>",
    "language": "html"
}

The accessibility tree of a row in the table would be as follows:

[!include-code] { 
    "src": "> table
  > row
    > gridcell \"Breed\"
    > gridcell \"Persian Cat\""
}

> [!alert-note]
> Chrome correctly infers the semantic meaning of the `::before` element.

#### Use of Standard Table Elements
For this method, `<div>` elements coupled with `display` properties and ARIA attributes can be used in place of table elements. 
That said, table elements offer some conveniences:
- No need to specify CSS `display` properties when in normal mode.
- No need to specify ARIA roles when in normal mode.

# Alternatives

## Without Wrappers in \<td\> Elements 
There are situations where wrapping the contents of `<td>` elements isn't possible. Methods for card-style responsive tables in such situations
typically involve
taking `td:before` out of [normal flow](https://developer.mozilla.org/en-US/docs/Web/CSS/Visual_formatting_model#Normal_flow). The following method
uses `position: absolute` to do just that:

### Result
[!include-markdown] { 
    "src": "../../resources/articles/cssOnlyResponsiveTables/exampleTableNoWrappers.html",
    "before": "<div id=\"alternative-example\">\n",
    "after": "</div>\n"
}

> [!alert-note]
> The table's responsiveness can be tested by adjusting your window's width.

### Code
[!include-code] { 
    "src": "../../resources/articles/cssOnlyResponsiveTables/exampleTableNoWrappers.html",
    "collapseLength":2,
    "showLineNumbers": true,
    "language": "html",
    "title": "HTML"
}

[!include-code] { 
    "src": "../../resources/articles/cssOnlyResponsiveTables/alternativeExample.css",
    "collapseLength":2,
    "showLineNumbers": true,
    "language": "css",
    "title": "CSS"
}

### Notes
Arbitrary dimensions are often used for such methods. This causes
brittleness. For example,
in the method above, `td:before` has `width: 50%` so that labels do not wrap and overflow the `<td>` element. 
Even then, if a label is longer than `50%` of the table's width, wrapping will still occur.  

This brittleness makes it difficult to apply such methods across an entire site without making tweaks for each table.
For example, like the method above, [this method](https://codepen.io/AllThingsSmitty/pen/MyqmdM) takes `td:before` out of normal flow, using `float: left` - 
as is, it cannot be applied to the example table content used in this article.
Nonetheless, such methods are useful when it isn't possible to wrap the contents of `<td>` elements or when table content is always similar.

## With Wrappers in \<td\> Elements 
There alternatives methods to create card-style responsive tables when the contents of `<td>` elements are wrapped:
- `display: inline-block` and `display: flex` can be used to lay out card rows. The downside to these layout methods is that column widths will not be
handled by browsers.
- CSS grid could be used in place of CSS tables after the
[subgrids](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout#Subgrid) feature is released.

# Notes
- The examples in this article are written using plain CSS for simplicity's sake. I'd recommend using [Sass](https://sass-lang.com/) or [Less](http://lesscss.org/) for greater flexibility. 
- If a page relocates elements for responsiveness, [EQCSS](https://elementqueries.com/) or [ResizeObserver](https://developers.google.com/web/updates/2016/10/resizeobserver)
could be helpful. For example, this page relocates its side menus to the top of the page (as drop-down menus) as window width decreases; at the widths where a menu has just been relocated,
tables are wider than they were before (despite window width decreasing). Critically, table width is not linearly correlated with window width - setting breakpoints 
according to table widths (using EQCSS or ResizeObserver) could offer a better user experience than setting breakpoints according to window width (`@media (min/max-width: <breakpoint>)`).
- The method described in this article does not consider table elements like `<caption>`, `<col>` or `<tfoot>`, nor does it consider table element attributes like `span`. If this method is applied 
across a site, it might need some enhancements.

# Conclusion
The CSS-Only, card style, responsive tables method described in this article is a useful general solution. Nonetheless, it is not a silver bullet - circumstances should be taken into account. 
Thanks for reading, I hope this article has been useful, feel free to share tips or to point out mistakes in the comments below!

# Additional Reading
- [HTML spec for tables](https://html.spec.whatwg.org/multipage/tables.html)
- [CSS spec for tables](https://www.w3.org/TR/CSS22/tables.html)

# Citations
- Persian cat. (n.d.). In Wikipedia. Retrieved April 27, 2017, from https://en.wikipedia.org/wiki/Persian_cat
- Maine Coon. (n.d.). In Wikipedia. Retrieved April 27, 2017, from https://en.wikipedia.org/wiki/Maine_Coon
- British Shorthair. (n.d.). In Wikipedia. Retrieved April 27, 2017, from https://en.wikipedia.org/wiki/British_Shorthair