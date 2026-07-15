import type { TrackReference } from "./types";

export const htmlReference: TrackReference = {
  trackId: "html",
  sections: [
    {
      id: "document-structure",
      title: "Document Structure",
      body: [
        "Every HTML page starts with the same skeleton: <!DOCTYPE html> tells the browser to use modern standards mode, <html> wraps everything, <head> holds information the browser needs but doesn't display (the page title, character encoding, links to stylesheets), and <body> holds everything a visitor actually sees.",
        "Two tags inside <head> matter from day one: <meta charset=\"UTF-8\"> makes sure text (including emoji and non-English characters) displays correctly, and <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> tells mobile browsers to render the page at the phone's actual width instead of zoomed-out desktop scale.",
        "Nothing you write outside <html>, <head>, and <body> is guaranteed to work the same across browsers — this skeleton isn't boilerplate you can skip, it's the contract that makes the rest of the page predictable.",
      ],
      examples: [
        {
          title: "A minimal complete page",
          code: '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8" />\n    <title>My Page</title>\n  </head>\n  <body>\n    <p>Hello, world!</p>\n  </body>\n</html>',
        },
      ],
      tip: "Forgetting the viewport meta tag is one of the most common reasons a page looks fine on a laptop but tiny and unreadable on a phone — browsers assume a ~980px-wide desktop layout without it.",
    },
    {
      id: "headings",
      title: "Headings & Paragraphs",
      body: [
        "<h1> through <h6> are headings, in decreasing importance — <h1> is the single main heading of the page (search engines and screen readers both pay close attention to it), and <h2>-<h6> are progressively smaller sub-headings. <p> wraps a paragraph of regular text.",
        "Headings aren't just \"big bold text\" — that's what CSS is for. Using a real <h2> instead of a <p> styled to look big matters for accessibility (screen reader users often jump between headings to skim a page) and for SEO, since search engines use heading structure to understand what a page is actually about.",
        "Skipping heading levels (jumping from <h1> straight to <h4>) is a common mistake — it can look fine visually while breaking the logical outline of the page for anyone navigating by heading structure rather than by eye.",
      ],
      examples: [
        {
          title: "A simple heading hierarchy",
          code: "<h1>Theebug</h1>\n<h2>Why it exists</h2>\n<p>Most tutorials start you on a blank page...</p>\n<h2>How it works</h2>",
        },
      ],
      tip: "There should only ever be one <h1> per page — it's meant to represent the single main topic, not a section heading you reach for because it happens to look the biggest.",
    },
    {
      id: "links",
      title: "Links",
      body: [
        'An <a> tag with an href attribute creates a clickable link: <a href="https://example.com">text</a>. The href value can be an absolute URL (a full address, starting with https://) or a relative one (a path on the same site, like /about or ../images/logo.png).',
        'target="_blank" opens the link in a new tab — commonly paired with rel="noopener noreferrer" for external links, which prevents the new page from getting a reference back to the original tab (a real, documented security consideration, not just convention).',
        "A link's href can also point to a spot on the same page using a fragment (#section-id), matching an element with a corresponding id attribute elsewhere on the page — this is exactly how in-page \"jump to section\" navigation works.",
      ],
      examples: [
        { title: "A basic link", code: '<a href="https://example.com">Visit Example</a>' },
        { title: "Opening in a new tab safely", code: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">\n  Visit Example\n</a>' },
      ],
      tip: 'Link text like "click here" tells a screen reader user nothing about where the link goes when it\'s read out of context — write link text that describes the destination, like "Read the full changelog" instead.',
    },
    {
      id: "images",
      title: "Images",
      body: [
        'An <img> tag embeds an image: src points to the image file (a URL or a local path), and alt provides fallback/accessibility text describing the image — <img src="worm.png" alt="Debug the worm" />. Unlike most HTML tags, <img> is self-closing; it has no separate closing tag or content between tags.',
        "alt isn't optional decoration — it's read aloud by screen readers, shown if the image fails to load, and used by search engines, since they can't \"see\" an image the way a human can. For a purely decorative image with no real content, an empty alt=\"\" is the correct choice (it tells assistive tech to skip it) — a missing alt attribute entirely is not the same thing and is a real accessibility gap.",
        "Explicit width and height attributes let the browser reserve the correct space for an image before it finishes loading, preventing the rest of the page from visibly jumping around as images pop in — a real, measurable performance/UX detail, not just extra typing.",
      ],
      examples: [
        { title: "An image with real alt text", code: '<img src="worm.png" alt="Debug the worm" width="64" height="64" />' },
        { title: "A purely decorative image", code: '<img src="divider.svg" alt="" />' },
      ],
      tip: 'A missing alt attribute is worse than an empty one — screen readers often fall back to reading the entire filename out loud (imagine hearing "IMG dash 4 2 0 1 dot JPEG") when there\'s nothing else to go on.',
    },
    {
      id: "lists",
      title: "Lists",
      body: [
        "<ul> creates an unordered (bulleted) list, and <ol> creates an ordered (numbered) list — both work the same way otherwise, wrapping each item in its own <li> (list item) tag. Which one to use is about meaning, not appearance: use <ol> when the sequence itself matters (steps in a recipe), <ul> when it doesn't (a set of features).",
        "Lists can nest — an <li> can contain its own <ul> or <ol> inside it, producing a sub-list indented under that specific item. This is the standard way to represent hierarchical content like a table of contents or a nested menu.",
        "<ol> supports a start attribute to begin counting from a number other than 1, and a reversed attribute to count backwards — both real, if less commonly needed, features worth knowing exist.",
      ],
      examples: [
        { title: "An unordered list", code: "<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n</ul>" },
        { title: "A nested list", code: "<ul>\n  <li>Fruit\n    <ul>\n      <li>Apples</li>\n      <li>Bananas</li>\n    </ul>\n  </li>\n</ul>" },
      ],
      tip: "Reaching for a <div> per row instead of a real <ul>/<li> structure is a common shortcut that loses real meaning — screen readers announce \"list, 3 items\" for a real list, letting a user know how much content to expect, which a stack of <div>s can't communicate.",
    },
    {
      id: "divs-and-spans",
      title: "Divs, Spans & Classes",
      body: [
        "<div> and <span> are both generic containers with no meaning of their own — they exist purely to group content so CSS or JavaScript can target it. The difference is display behavior: <div> is block-level (starts on its own line, stacks vertically), <span> is inline (flows within a line of text, like wrapping a single word).",
        'class="..." attaches one or more names to an element that CSS selectors and JavaScript can target — an element can have multiple space-separated classes: class="card featured". id="..." gives an element one unique identifier on the page, used for in-page links (#section-id) and when exactly one specific element needs to be targeted.',
        "A class is meant to be reused across many elements (every .card on the page); an id is meant to be unique — using the same id value twice on one page is invalid HTML and can cause subtle, hard-to-debug bugs since some CSS/JS APIs assume ids are unique and only look for the first match.",
      ],
      examples: [
        { title: "div vs. span", code: '<div class="card">\n  This is a <span class="highlight">block</span> of content.\n</div>' },
        { title: "Multiple classes on one element", code: '<div class="card featured">Hello!</div>' },
      ],
      tip: "If you're reaching for a <div> and there's a more specific, semantically meaningful tag available for what you're building (see the next section), prefer that instead — a <div> is the right choice only when nothing more specific fits.",
    },
    {
      id: "semantic-html",
      title: "Semantic HTML",
      body: [
        "Semantic tags describe what their content *means*, not just how it should look: <header>, <nav>, <main>, <section>, <article>, and <footer> all render as plain blocks by default (visually identical to a <div>), but they carry real meaning that <div> doesn't.",
        "That meaning is read by more than just other developers: screen readers let users jump straight to <nav> or <main>, browsers' reader-mode features use these tags to figure out what the \"real content\" of a page is, and search engines weight content inside <article>/<main> differently than a generic <div>.",
        "A rough guide: <header> for introductory/navigation content at the top, <nav> for a block of navigation links, <main> for the one primary content area of the page (there should only be one), <article> for self-contained content that would make sense on its own (a blog post, a product card), <section> for a thematic grouping within the page, and <footer> for closing content.",
      ],
      examples: [
        {
          title: "A page shell using semantic tags",
          code: "<header>\n  <nav><a href=\"/\">Home</a></nav>\n</header>\n<main>\n  <article>\n    <h1>Post title</h1>\n    <p>Content...</p>\n  </article>\n</main>\n<footer>© 2026</footer>",
        },
      ],
      tip: "Semantic tags are a free accessibility and SEO improvement for the cost of picking a slightly more specific tag name — there's rarely a good reason to reach for a generic <div> once you know the semantic option that fits.",
    },
    {
      id: "forms",
      title: "Forms & Inputs",
      body: [
        "<form> wraps a group of inputs meant to be submitted together. <input> is the most common field, and its type attribute changes its behavior entirely — type=\"text\" for plain text, type=\"email\" (validates a basic email shape and shows an email-optimized mobile keyboard), type=\"password\" (masks input), type=\"checkbox\", and more.",
        '<label> connects human-readable text to a specific input via a matching for/id pair: <label for="email">Email</label> paired with <input id="email">. Clicking the label text then focuses (or toggles, for a checkbox) the input itself — a real usability feature, not just a caption sitting nearby.',
        '<button> triggers an action — inside a <form>, a <button> defaults to type="submit" and submits the form unless you explicitly set type="button". placeholder text (placeholder="you@example.com") shows a hint inside an empty input, but disappears the instant the user starts typing, so it should never be the only label an input has.',
      ],
      examples: [
        {
          title: "A labeled input with a submit button",
          code: '<form>\n  <label for="email">Email</label>\n  <input id="email" type="email" placeholder="you@example.com" />\n  <button type="submit">Sign up</button>\n</form>',
        },
      ],
      tip: 'placeholder text disappearing on focus means it can\'t double as a label for accessibility or for anyone who forgets what an empty field was for once they start typing — always pair a real input with a real <label>, even if you visually hide the label with CSS.',
    },
    {
      id: "tables",
      title: "Tables",
      body: [
        "<table> holds tabular data — rows and columns that genuinely relate to each other, like a spreadsheet. <tr> defines a table row, <td> defines a regular data cell within a row, and <th> defines a header cell (bold and centered by default, and announced as a column/row header by screen readers).",
        "<thead> and <tbody> group the header row(s) separately from the data rows — not strictly required for a table to work, but it's the conventional structure and makes styling the header differently from the body straightforward.",
        "Tables are for real tabular data only — using a <table> purely to lay out a page's visual columns (a once-common trick before CSS Flexbox/Grid existed) breaks the meaning screen readers rely on and is considered outdated practice today; use CSS for layout instead.",
      ],
      examples: [
        {
          title: "A simple table with a header row",
          code: "<table>\n  <thead>\n    <tr><th>Name</th><th>Score</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ana</td><td>90</td></tr>\n    <tr><td>Bo</td><td>85</td></tr>\n  </tbody>\n</table>",
        },
      ],
      tip: "If you catch yourself reaching for a <table> just to line things up visually rather than to show genuinely related rows/columns of data, that's a sign you actually want CSS Grid or Flexbox instead.",
    },
    {
      id: "accessibility-basics",
      title: "Accessibility Basics",
      body: [
        "Accessible HTML mostly comes for free from writing semantic, meaningful markup — real headings, real lists, real buttons instead of a <div onclick=\"...\">, real alt text — rather than from a separate pass bolted on at the end.",
        'aria-label provides an accessible name for an element when there\'s no visible text to use — most common on icon-only buttons: <button aria-label="Close">×</button> announces "Close, button" to a screen reader even though the visible content is just a symbol.',
        "A <button> (not a styled <div> or <span>) is keyboard-focusable and clickable via Enter/Space automatically, with no extra code — recreating that behavior manually on a non-button element is real, easy-to-get-subtly-wrong work that a real <button> gives you for free.",
      ],
      examples: [
        { title: "An accessible icon-only button", code: '<button aria-label="Close">×</button>' },
        { title: "A decorative image that screen readers correctly skip", code: '<img src="divider.svg" alt="" />' },
      ],
      tip: "A quick real test: try tabbing through your own page using only the keyboard (no mouse). If you can't tell where focus currently is, or can't reach something a mouse user could click, that's a genuine accessibility gap, not a theoretical one.",
    },
  ],
};
