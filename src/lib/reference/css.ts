import type { TrackReference } from "./types";

export const cssReference: TrackReference = {
  trackId: "css",
  sections: [
    {
      id: "selectors",
      title: "Selectors & Color",
      body: "A tag name selects every matching element; color sets text color.",
      codeExample: "p {\n  color: teal;\n}",
    },
    {
      id: "box-model",
      title: "The Box Model",
      body: "padding is space inside the border; margin is space outside it.",
      codeExample: ".card {\n  padding: 20px;\n  border: 1px solid black;\n}",
    },
    {
      id: "flexbox",
      title: "Flexbox",
      body: "display: flex turns on flexbox; justify-content aligns children along the row.",
      codeExample: ".row {\n  display: flex;\n  justify-content: center;\n}",
    },
    {
      id: "typography",
      title: "Font & Text",
      body: "font-size sets text size; text-align: center centers it horizontally.",
      codeExample: "h1 {\n  font-size: 32px;\n  text-align: center;\n}",
    },
    {
      id: "hover",
      title: "Hover State",
      body: ":hover applies a style only while the mouse is over the element.",
      codeExample: ".link:hover {\n  color: orange;\n}",
    },
  ],
};
