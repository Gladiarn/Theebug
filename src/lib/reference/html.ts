import type { TrackReference } from "./types";

export const htmlReference: TrackReference = {
  trackId: "html",
  sections: [
    {
      id: "headings",
      title: "Headings & Paragraphs",
      body: "<h1>-<h6> for headings, <p> for paragraphs.",
      codeExample: "<h1>Welcome</h1>\n<p>This is a paragraph.</p>",
    },
    {
      id: "links",
      title: "Links",
      body: 'href="url" on an <a> tag creates a clickable link.',
      codeExample: '<a href="https://example.com">Visit Example</a>',
    },
    {
      id: "images",
      title: "Images",
      body: "src points to the image file, alt is fallback/accessibility text.",
      codeExample: '<img src="worm.png" alt="Debug the worm" />',
    },
    {
      id: "lists",
      title: "Lists",
      body: "<ul> for bullet lists, <li> for each item.",
      codeExample: "<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n</ul>",
    },
    {
      id: "divs",
      title: "Divs & Classes",
      body: '<div> groups content; class="..." gives it a name CSS can target.',
      codeExample: '<div class="card">Hello!</div>',
    },
  ],
};
