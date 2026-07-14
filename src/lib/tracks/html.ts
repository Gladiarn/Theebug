import type { Track } from "./types";

export const htmlTrack: Track = {
  id: "html",
  title: "HTML",
  description: "Structure the web with tags, attributes, and semantic elements.",
  color: "#e34c26",
  levels: [
    {
      id: 1,
      title: "Headings & Paragraphs",
      filename: "lesson1.html",
      objective: "Use the correct tags to make a heading and a paragraph",
      preview: ["Welcome", "This is my first page."],
      codeLines: [
        "<{{zone1}}>Welcome</{{zone1}}>",
        "<{{zone2}}>This is my first page.</{{zone2}}>",
      ],
      zones: [
        { id: "zone1", answer: "h1" },
        { id: "zone2", answer: "p" },
      ],
      blocks: [
        { id: "b1", code: "h1" },
        { id: "b2", code: "p" },
        { id: "b3", code: "div" },
        { id: "b4", code: "span" },
        { id: "b5", code: "title" },
      ],
      wormIntro:
        "Hi! I'm Debug the worm! 🐛 HTML pages are built from tags. Which tag makes a big heading, and which one makes a paragraph of text?",
      wormCorrectAll: "A page needs structure, and now yours has it! h1 for the heading, p for the paragraph! 🎉",
      concept: {
        summary: "HTML elements are pairs of tags — `<h1>` for the biggest heading, `<p>` for a paragraph.",
        details: [
          "Every element normally has an opening tag (`<h1>`) and a matching closing tag (`</h1>`, with a slash) wrapped around its content. Forgetting the closing tag is one of the most common HTML mistakes.",
          "There are six heading levels, `<h1>` through `<h6>`, in decreasing importance/size — `<h1>` should be used once per page for the main title, not just for \"big text\" styling (that's CSS's job).",
          "`<p>` marks a block of body text. Browsers add spacing above and below it automatically, which is why stacking multiple `<p>` tags reads as separate paragraphs.",
        ],
        example: "<h1>My Page</h1>\n<h2>A Section</h2>\n<p>Some body text goes here.</p>",
      },
    },
    {
      id: 2,
      title: "Links",
      filename: "lesson2.html",
      objective: 'Complete the link so it points to "https://example.com" and shows "Visit Example"',
      preview: ["Visit Example (links to https://example.com)"],
      codeLines: ['<a {{zone1}}="https://example.com">Visit {{zone2}}</a>'],
      zones: [
        { id: "zone1", answer: "href" },
        { id: "zone2", answer: "Example" },
      ],
      blocks: [
        { id: "b1", code: "href" },
        { id: "b2", code: "src" },
        { id: "b3", code: "link" },
        { id: "b4", code: "Example" },
        { id: "b5", code: "Website" },
      ],
      wormIntro:
        "Links need an attribute that tells the browser WHERE to go. Which attribute holds the URL? And what should the visible link text say — check the objective!",
      wormCorrectAll: "Perfect! href points the link, and the text between the tags is what users click on! 🔗",
      concept: {
        summary: "Attributes add extra information inside an opening tag, like `href` telling `<a>` where to link.",
        details: [
          "`<a href=\"https://example.com\">Visit Example</a>` — the `<a>` tag makes a clickable link, `href` (\"hypertext reference\") is the attribute holding the destination URL, and the text between the tags is what the user actually sees and clicks.",
          "Attributes always live inside the opening tag as `name=\"value\"` pairs — never in the closing tag, and always with quotes around the value.",
          "For links leaving your site, it's good practice to add `target=\"_blank\"` (opens in a new tab) along with `rel=\"noopener noreferrer\"` for security — you'll see that exact combo used in this site's own footer.",
        ],
        example: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">\n  Opens in a new tab\n</a>',
      },
    },
    {
      id: 3,
      title: "Images",
      filename: "lesson3.html",
      objective: 'Add an image with the right attributes: src "worm.png" and alt text "Debug the worm"',
      preview: ["[image: Debug the worm]"],
      codeLines: ['<img {{zone1}}="worm.png" {{zone2}}="Debug the worm" />'],
      zones: [
        { id: "zone1", answer: "src" },
        { id: "zone2", answer: "alt" },
      ],
      blocks: [
        { id: "b1", code: "src" },
        { id: "b2", code: "alt" },
        { id: "b3", code: "href" },
        { id: "b4", code: "title" },
      ],
      wormIntro:
        "Images need to know WHERE the picture file is, and need backup text for screen readers if it fails to load. Which attribute is which?",
      wormCorrectAll: "src loads the picture, alt describes it — great for accessibility! You're picture perfect! 🖼️",
      concept: {
        summary: "`<img>` is a self-closing tag — `src` says which file to load, `alt` describes it if it can't.",
        details: [
          "`<img>` has no separate closing tag (you may also see it written `<img />`) because it has no content between tags to wrap — it just displays a file.",
          "`src` (\"source\") points to the image file's location. `alt` (\"alternative text\") is what screen readers announce for visually impaired users and what shows up if the image fails to load — it's not optional in professional-quality HTML.",
          "Skipping `alt` is a common accessibility mistake that also hurts SEO, since search engines read `alt` text to understand what an image shows.",
        ],
        example: '<img src="logo.png" alt="Company logo" />',
      },
    },
    {
      id: 4,
      title: "Lists",
      filename: "lesson4.html",
      objective: "Build an unordered list with two items: Apples and Bananas",
      preview: ["• Apples", "• Bananas"],
      codeLines: [
        "<{{zone1}}>",
        "  <{{zone2}}>Apples</{{zone2}}>",
        "  <{{zone2}}>Bananas</{{zone2}}>",
        "</{{zone1}}>",
      ],
      zones: [
        { id: "zone1", answer: "ul" },
        { id: "zone2", answer: "li" },
      ],
      blocks: [
        { id: "b1", code: "ul" },
        { id: "b2", code: "li" },
        { id: "b3", code: "ol" },
        { id: "b4", code: "list" },
      ],
      wormIntro:
        "Bulleted lists wrap everything in one tag, with each item in its own tag inside. Which outer tag makes it 'unordered' (bullets, not numbers)?",
      wormCorrectAll: "ul wraps the whole list, li marks each item — same tag reused for both bullets! 🍎🍌",
      concept: {
        summary: "`<ul>` makes a bulleted list, `<ol>` makes a numbered one — both hold `<li>` items inside.",
        details: [
          "`<ul>` (\"unordered list\") wraps the whole list and gives each item a bullet by default. `<li>` (\"list item\") marks each individual entry, and you write one `<li>` per item, all nested inside the same `<ul>`.",
          "Swap `<ul>` for `<ol>` (\"ordered list\") when the sequence matters, like numbered steps — the browser then numbers each `<li>` automatically instead of bulleting it.",
          "Nesting works too: a `<ul>` can contain another `<ul>` inside one of its `<li>` items, which is how sub-menus and nested outlines are built.",
        ],
        example: "<ol>\n  <li>Preheat the oven</li>\n  <li>Mix the batter</li>\n  <li>Bake for 20 minutes</li>\n</ol>",
      },
    },
    {
      id: 5,
      title: "Divs & Classes",
      filename: "lesson5.html",
      objective: 'Wrap the text in a div with class "card" so it can be styled later',
      preview: ["A card container holding: Hello!"],
      codeLines: ['<{{zone1}} {{zone2}}="card">Hello!</{{zone1}}>'],
      zones: [
        { id: "zone1", answer: "div" },
        { id: "zone2", answer: "class" },
      ],
      blocks: [
        { id: "b1", code: "div" },
        { id: "b2", code: "class" },
        { id: "b3", code: "id" },
        { id: "b4", code: "span" },
      ],
      wormIntro:
        "A div is a generic container — perfect for grouping content you'll style later. Which attribute labels it with a reusable style name?",
      wormCorrectAll: "div groups content, class gives it a name CSS can target — you'll use this combo constantly! 📦",
      concept: {
        summary: "`<div>` is a generic box for grouping content; `class` names it so CSS (or JavaScript) can target it.",
        details: [
          "`<div>` carries no meaning of its own — no heading, no link, nothing — it's purely a container for grouping other elements together so you can style or position them as a unit.",
          "`class=\"card\"` doesn't do anything by itself; it's a label. A CSS rule like `.card { border-radius: 8px; }` (note the leading dot) then targets every element with that class, however many there are.",
          "The same class can be reused on many elements at once (unlike `id`, which is meant to be unique per page), which is exactly why `class` is the standard way to style repeated components like cards.",
        ],
        example: '<div class="card">\n  <p>Reusable across the whole page.</p>\n</div>',
      },
    },
  ],
};
