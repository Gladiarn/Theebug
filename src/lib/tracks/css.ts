import type { Track } from "./types";

export const cssTrack: Track = {
  id: "css",
  title: "CSS",
  description: "Style pages with selectors, the box model, flexbox, and more.",
  color: "#264de4",
  levels: [
    {
      id: 1,
      title: "Selectors & Color",
      filename: "lesson1.css",
      difficulty: "easy",
      objective: 'Select every <p> and make its text color "teal"',
      preview: ["All paragraph text turns teal"],
      codeLines: ["{{zone1}} {", "  color: {{zone2}};", "}"],
      zones: [
        { id: "zone1", answer: "p" },
        { id: "zone2", answer: "teal" },
      ],
      blocks: [
        { id: "b1", code: "p" },
        { id: "b2", code: ".p" },
        { id: "b3", code: "teal" },
        { id: "b4", code: "20px" },
        { id: "b5", code: "bold" },
      ],
      wormIntro:
        "Hi! I'm Debug the worm! 🐛 CSS rules start with a selector (what to style) then properties in curly braces. Which selector targets every <p> tag, and what value makes text teal?",
      wormCorrectAll: "Every paragraph on the page just changed color! That's the power of a tag selector! 🎨",
      concept: {
        summary: "A CSS rule is `selector { property: value; }` — the selector picks elements, the properties style them.",
        details: [
          "`p { color: teal; }` targets every `<p>` element on the page (a \"tag selector\") and sets its text color. One rule can affect many elements at once.",
          "This is why the whole platform's theming works the way it does: change one CSS variable in one place, and every element that references it updates everywhere — the same principle as this rule, just applied through custom properties instead of a hardcoded value.",
          "Selectors can target more than tags: `.card` selects by class (note the dot), `#header` selects by id (note the hash), and they can be combined for precision, like `.card p` (paragraphs inside anything with class card).",
        ],
        example: "p {\n  color: teal;\n  font-size: 16px;\n}",
      },
    },
    {
      id: 2,
      title: "The Box Model",
      filename: "lesson2.css",
      difficulty: "easy",
      objective: "Give .card 20px of padding and a 1px solid border",
      preview: ["Card has breathing room and a visible outline"],
      codeLines: [".card {", "  {{zone1}}: 20px;", "  border: 1px solid {{zone2}};", "}"],
      zones: [
        { id: "zone1", answer: "padding" },
        { id: "zone2", answer: "black" },
      ],
      blocks: [
        { id: "b1", code: "padding" },
        { id: "b2", code: "margin" },
        { id: "b3", code: "black" },
        { id: "b4", code: "20px" },
      ],
      wormIntro:
        "Every box has space INSIDE its border (that pushes content away from the edge) and space OUTSIDE (that pushes other elements away). Which one do we want here — inside or outside?",
      wormCorrectAll: "padding adds inner breathing room, and now the border traces neatly around it! 📦",
      concept: {
        summary: "Every element is a box: content, then padding (inside the border), then the border itself, then margin (outside it).",
        details: [
          "`padding` adds space between an element's content and its own border — it pushes the border outward, growing the visible box. `margin` adds space outside the border, pushing away *other* elements — it never affects the element's own size.",
          "`border: 1px solid black` sets three things at once: width (`1px`), style (`solid`), and color (`black`), all in one shorthand property.",
          "Mixing up padding and margin is one of the most common CSS bugs — if you want breathing room *inside* a box (like around text before it hits an edge), that's padding; if you want space *between* two boxes, that's margin.",
        ],
        example: ".card {\n  padding: 16px;   /* space inside the border */\n  margin: 24px;    /* space outside, pushing siblings away */\n  border: 1px solid #ccc;\n}",
      },
    },
    {
      id: 3,
      title: "Flexbox Basics",
      filename: "lesson3.css",
      difficulty: "medium",
      objective: "Turn .row into a flex container with items centered horizontally",
      preview: ["Items line up in a row, centered"],
      codeLines: [".row {", "  display: {{zone1}};", "  justify-content: {{zone2}};", "}"],
      zones: [
        { id: "zone1", answer: "flex" },
        { id: "zone2", answer: "center" },
      ],
      blocks: [
        { id: "b1", code: "flex" },
        { id: "b2", code: "block" },
        { id: "b3", code: "center" },
        { id: "b4", code: "left" },
      ],
      wormIntro:
        "display: flex turns on flexbox layout for the container's children. Then justify-content controls how they line up along the row. Which value centers them?",
      wormCorrectAll: "flex + center — your items are now lined up perfectly in the middle! That's flexbox! 🧩",
      concept: {
        summary: "`display: flex` turns a container into a flexbox, letting `justify-content` and `align-items` line up its children.",
        details: [
          "Once a container has `display: flex`, its direct children automatically line up in a row (by default) instead of stacking. `justify-content` then controls their alignment along that row — `center`, `flex-start`, `flex-end`, or `space-between` are the most common values.",
          "`align-items` does the same job but on the perpendicular axis (vertically, for a row) — the two properties together are how flexbox solves the classic \"how do I center this\" problem that used to require awkward hacks.",
          "This whole app's IDE-style layout — sidebar, editor, panels sitting side by side — is built almost entirely with flexbox, so this one property pair shows up constantly in real-world CSS.",
        ],
        example: ".row {\n  display: flex;\n  justify-content: center; /* horizontal */\n  align-items: center;     /* vertical */\n}",
      },
    },
    {
      id: 4,
      title: "Font & Text",
      filename: "lesson4.css",
      difficulty: "easy",
      objective: "Make the heading 32px and centered",
      preview: ["Big, centered heading"],
      codeLines: ["h1 {", "  font-size: {{zone1}};", "  text-align: {{zone2}};", "}"],
      zones: [
        { id: "zone1", answer: "32px" },
        { id: "zone2", answer: "center" },
      ],
      blocks: [
        { id: "b1", code: "32px" },
        { id: "b2", code: "32%" },
        { id: "b3", code: "center" },
        { id: "b4", code: "middle" },
      ],
      wormIntro:
        "font-size takes a pixel value to control text size. text-align controls horizontal position — but careful, its 'centered' keyword isn't the word you might expect!",
      wormCorrectAll: "32px and center — that heading is now big and balanced right in the middle! ✍️",
      concept: {
        summary: "`font-size` scales text, `text-align` positions it horizontally within its container.",
        details: [
          "`font-size: 32px` sets an absolute pixel size. You'll also see relative units like `1.5rem` (relative to the page's root font size) or `%` (relative to the parent) — pixels are the simplest to reason about, which is why this track starts there.",
          "`text-align` accepts `left`, `right`, `center`, or `justify` — note it's `center`, not `middle` (a common mix-up, since `middle` is used elsewhere in CSS for vertical alignment of table cells and images).",
          "`text-align` only affects text and inline content inside the element — it doesn't move or center the element itself on the page. Centering a whole block is a flexbox/margin job instead.",
        ],
        example: 'h1 {\n  font-size: 2rem;\n  text-align: center;\n  font-weight: bold;\n}',
      },
    },
    {
      id: 5,
      title: "Backgrounds & Radius",
      filename: "lesson5.css",
      difficulty: "medium",
      objective: "Give .button a lightblue background and fully rounded corners",
      preview: ["A pill-shaped, light blue button"],
      codeLines: [".button {", "  background-color: {{zone1}};", "  border-radius: {{zone2}};", "}"],
      zones: [
        { id: "zone1", answer: "lightblue" },
        { id: "zone2", answer: "999px" },
      ],
      blocks: [
        { id: "b1", code: "lightblue" },
        { id: "b2", code: "darkblue" },
        { id: "b3", code: "999px" },
        { id: "b4", code: "0px" },
      ],
      wormIntro:
        "background-color paints the box. border-radius rounds its corners — a huge value bigger than the box's height rounds it all the way into a pill shape!",
      wormCorrectAll: "lightblue + 999px — that button is now a smooth, rounded pill! Ready to click! 🔘",
      concept: {
        summary: "`background-color` fills a box, `border-radius` rounds its corners — a large enough radius makes a pill or circle.",
        details: [
          "`background-color` paints the entire box (padding included), independent of any border. `border-radius` rounds the corners; small values like `4px` give a subtle rounding, while a huge value like `999px` rounds corners all the way into a full pill or circle shape, since the radius simply gets capped at half the box's height.",
          "A perfect circle needs the element to be square (`width` equal to `height`) plus `border-radius: 50%` — the same technique used for avatar images across the web.",
          "This site's own `--accent`, `--panel`, etc. color variables are exactly this property applied consistently through CSS custom properties instead of one-off hex codes.",
        ],
        example: '.avatar {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%; /* perfect circle */\n  background-color: lightblue;\n}',
      },
    },
    {
      id: 6,
      title: "Hover State",
      filename: "lesson6.css",
      difficulty: "medium",
      objective: "Make .link turn orange when the mouse hovers over it",
      preview: ["Link text turns orange on hover"],
      codeLines: [".link:{{zone1}} {", "  color: {{zone2}};", "}"],
      zones: [
        { id: "zone1", answer: "hover" },
        { id: "zone2", answer: "orange" },
      ],
      blocks: [
        { id: "b1", code: "hover" },
        { id: "b2", code: "active" },
        { id: "b3", code: "orange" },
        { id: "b4", code: "hidden" },
      ],
      wormIntro:
        "Pseudo-classes like :hover apply a style only in a certain state — here, only while the mouse is over the element. Which pseudo-class means 'mouse is over me'?",
      wormCorrectAll:
        "You did it! :hover + orange means the link now lights up the moment someone points at it. You've completed the CSS track! 🏆",
      concept: {
        summary: "Pseudo-classes like `:hover` style an element only in a specific state, without needing any JavaScript.",
        details: [
          "`.link:hover { color: orange; }` only applies while the mouse is actively over the element — the moment it moves away, the style reverts automatically. No JavaScript event listener required.",
          "Other common pseudo-classes follow the same pattern: `:active` (while being clicked), `:focus` (while a form field is selected), and `:first-child`/`:last-child` (position-based, not interaction-based).",
          "Combine `transition: color 0.2s;` on the base `.link` rule with the `:hover` state to animate the color change smoothly instead of snapping instantly — that's the same technique this site uses for its own hover effects.",
        ],
        example: '.link {\n  color: gray;\n  transition: color 0.2s;\n}\n.link:hover {\n  color: orange;\n}',
      },
    },
  ],
};
