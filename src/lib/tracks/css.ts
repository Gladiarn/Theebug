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
    },
    {
      id: 2,
      title: "The Box Model",
      filename: "lesson2.css",
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
    },
    {
      id: 3,
      title: "Flexbox Basics",
      filename: "lesson3.css",
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
    },
    {
      id: 4,
      title: "Font & Text",
      filename: "lesson4.css",
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
    },
    {
      id: 5,
      title: "Backgrounds & Radius",
      filename: "lesson5.css",
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
    },
    {
      id: 6,
      title: "Hover State",
      filename: "lesson6.css",
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
    },
  ],
};
