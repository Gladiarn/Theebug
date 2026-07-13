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
    },
  ],
};
