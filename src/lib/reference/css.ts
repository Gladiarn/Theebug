import type { TrackReference } from "./types";

export const cssReference: TrackReference = {
  trackId: "css",
  sections: [
    {
      id: "selectors",
      title: "Selectors & Color",
      body: [
        "A selector decides which elements a rule applies to. A tag name (p { }) selects every matching element on the page, .card { } selects every element with class=\"card\", and #header { } selects the one element with id=\"header\". A rule is written as selector { property: value; }.",
        "color sets text color. CSS accepts color in several equivalent formats: named colors (teal, coral), hex codes (#3498db), rgb(52, 152, 219), and hsl(204, 70%, 53%) — hex and named colors are the most common for a fixed color, hsl is often easier to reason about when you want to programmatically lighten/darken a shade.",
        "Selectors can combine: .card p { } selects only <p> elements *inside* an element with class=\"card\" (a descendant selector), while .card.featured { } (no space) selects an element that has *both* classes at once.",
      ],
      examples: [
        { title: "Tag, class, and id selectors", code: "p {\n  color: teal;\n}\n\n.warning {\n  color: red;\n}\n\n#site-header {\n  color: navy;\n}" },
        { title: "Descendant vs. combined-class selectors", code: ".card p { }      /* a <p> inside .card */\n.card.featured { } /* has both classes */" },
      ],
      tip: "When two rules could both apply to the same element, a more specific selector (#id beats .class beats a bare tag name) wins regardless of which one appears later in the file — this is CSS's specificity system, a frequent source of \"why isn't my style applying\" confusion.",
    },
    {
      id: "box-model",
      title: "The Box Model",
      body: [
        "Every element is a rectangular box made of four layers, from the inside out: content (the actual text/image), padding (space between the content and the border), border (a visible or invisible edge), and margin (space outside the border, separating this box from its neighbors).",
        "By default, width and height set only the *content* box's size — padding and border are added on top of that, so a 200px-wide box with 20px of padding and a 1px border actually occupies 242px total. This trips up almost everyone at least once.",
        "box-sizing: border-box changes width/height to mean the *total* size instead, padding and border included — most modern CSS resets set this globally (* { box-sizing: border-box; }) specifically because it matches how most people intuitively expect sizing to work.",
      ],
      examples: [
        { title: "A box with padding and a border", code: ".card {\n  padding: 20px;\n  border: 1px solid black;\n}" },
        { title: "Opting into intuitive sizing", code: "* {\n  box-sizing: border-box;\n}" },
      ],
      tip: "margin-top and margin-bottom between two stacked block elements can visually \"collapse\" into a single margin (the larger of the two, not their sum) — a real, specced CSS behavior, not a bug, that surprises a lot of people the first time they hit it.",
    },
    {
      id: "flexbox",
      title: "Flexbox Basics",
      body: [
        "display: flex turns an element into a flex container, and its direct children automatically line up in a row (by default) as flex items. It's the standard modern tool for laying out a row or column of elements, replacing older float-based layout tricks.",
        "justify-content aligns children along the main axis (horizontally, by default) — flex-start, center, flex-end, space-between (pushes items to the edges, even gaps between), and space-around are the common values. align-items does the equivalent alignment along the *cross* axis (vertically, by default).",
        "flex-direction: column switches the main axis to vertical, which also swaps what justify-content and align-items each control. gap adds consistent spacing between flex items without needing margin on each one individually.",
      ],
      examples: [
        { title: "A centered row", code: ".row {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 12px;\n}" },
        { title: "Switching to a column", code: ".stack {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}" },
      ],
      tip: "flex: 1 on a child means \"grow to fill any remaining space in the container\" — the single most useful flex shorthand for things like a sidebar-plus-main-content layout where the main content should take up whatever room is left.",
    },
    {
      id: "grid",
      title: "CSS Grid",
      body: [
        "display: grid turns an element into a grid container, and grid-template-columns defines the columns — repeat(3, 1fr) creates three equal-width columns, 1fr meaning \"one fraction of the available space.\" Grid is two-dimensional (rows *and* columns at once), where Flexbox is fundamentally one-dimensional.",
        "gap works exactly the same way it does in Flexbox — consistent spacing between grid cells without manual margins. minmax(220px, 1fr) inside repeat() is a common pattern for a responsive card grid: each column is at least 220px, but grows to fill extra space evenly.",
        "auto-fit combined with repeat() and minmax() (repeat(auto-fit, minmax(220px, 1fr))) creates a grid that automatically adds or removes columns as the container resizes — a genuinely responsive grid with zero media queries needed for the common \"cards that wrap\" case.",
      ],
      examples: [
        { title: "A simple 3-column grid", code: ".gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}" },
        { title: "A responsive card grid with no media queries", code: ".cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 16px;\n}" },
      ],
      tip: "Reach for Grid when you're laying out in two dimensions at once (a page shell, a photo gallery); reach for Flexbox for a single row or column of items — they solve overlapping but different problems, and real layouts often use both together.",
    },
    {
      id: "typography",
      title: "Font & Text",
      body: [
        "font-size sets text size (commonly in px, rem, or em — see the Units section), font-weight controls boldness (normal, bold, or a number like 400/700), and text-align: center centers text horizontally within its container.",
        "line-height sets the vertical space a line of text occupies — a unitless value like 1.5 (meaning \"1.5× the font size\") is usually the right choice over a fixed px value, since it scales automatically if the font size ever changes.",
        "font-family lists fonts in order of preference, ending in a generic fallback: font-family: \"Inter\", Arial, sans-serif — the browser uses the first font in the list it actually has available, falling all the way back to *some* sans-serif font if none of the named ones load.",
      ],
      examples: [
        { title: "Sizing and centering a heading", code: "h1 {\n  font-size: 32px;\n  font-weight: 700;\n  text-align: center;\n}" },
        { title: "A font stack with a generic fallback", code: 'body {\n  font-family: "Inter", Arial, sans-serif;\n  line-height: 1.5;\n}' },
      ],
      tip: "Always end a font-family list with a generic keyword (sans-serif, serif, or monospace) — without it, a user whose device can't load any of your named fonts falls back to a completely unstyled, browser-default font instead of at least the right general category.",
    },
    {
      id: "backgrounds",
      title: "Backgrounds & Radius",
      body: [
        "background-color sets a solid fill color. background-image: url(...) adds an image instead (or on top, layered), and background-size: cover scales it to fill the element completely, cropping as needed rather than stretching or leaving gaps.",
        "border-radius rounds an element's corners — a small value (border-radius: 8px) gives a subtle rounded-card look, while border-radius: 50% on a square element turns it into a perfect circle.",
        "background is also a shorthand property that can set color, image, position, and size all in one declaration — convenient, but if you only remember one longhand form, background-color and background-image separately are easier to read back later.",
      ],
      examples: [
        { title: "A rounded card with a background color", code: ".button {\n  background-color: teal;\n  border-radius: 8px;\n}" },
        { title: "A full-bleed cover image", code: '.hero {\n  background-image: url("hero.jpg");\n  background-size: cover;\n}' },
      ],
      tip: "border-radius: 50% only makes a circle if the element's width and height are equal — on a rectangle it produces an ellipse instead, a common surprise the first time you try it on a non-square box.",
    },
    {
      id: "positioning",
      title: "Positioning",
      body: [
        "position defaults to static — an element just flows normally in the document, and top/left/right/bottom do nothing. relative keeps an element in its normal flow position but lets top/left/etc. nudge it visually from where it would otherwise sit, without affecting other elements around it.",
        "absolute removes an element from the normal flow entirely and positions it relative to its nearest ancestor that has position: relative (or absolute/fixed) set — this is why position: relative is so often added to a parent purely to give an absolutely-positioned child something to anchor to.",
        "fixed positions relative to the browser viewport itself, staying in place even as the page scrolls — the standard technique for a sticky header or a floating \"back to top\" button. z-index controls stacking order when positioned elements overlap: a higher number renders on top.",
      ],
      examples: [
        {
          title: "A badge anchored to its card's corner",
          code: ".card {\n  position: relative;\n}\n.badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}",
        },
        { title: "A fixed header that stays put while scrolling", code: ".header {\n  position: fixed;\n  top: 0;\n  width: 100%;\n  z-index: 10;\n}" },
      ],
      tip: "absolute positioning silently does nothing useful (it anchors to the whole page, not the box you meant) unless some ancestor has position: relative set — if an absolutely positioned element isn't landing where expected, this is the first thing to check.",
    },
    {
      id: "units",
      title: "Units",
      body: [
        "px is an absolute, fixed-size unit — 16px is always 16px regardless of context. % is relative to the parent element's corresponding size (width: 50% means half the parent's width).",
        "em is relative to the *current* element's font-size, which means em compounds unpredictably when nested (a font-size: 1.5em inside another 1.5em element becomes 2.25× the base, not 1.5×). rem solves this by always being relative to the root <html> element's font-size instead, regardless of nesting — which is why rem is generally the safer default for font sizes and spacing.",
        "Viewport units (vw, vh) are relative to the browser window itself — 100vw is exactly the full viewport width, 50vh is half the viewport height — commonly used for a hero section sized to the screen rather than to its content.",
      ],
      examples: [
        { title: "rem avoids compounding nested em sizes", code: "html {\n  font-size: 16px;\n}\n.text {\n  font-size: 1.5rem; /* always 24px, regardless of nesting */\n}" },
        { title: "A full-viewport-height hero section", code: ".hero {\n  min-height: 100vh;\n}" },
      ],
      tip: "When in doubt for font-size and spacing, reach for rem over em — it behaves predictably regardless of how deeply nested the element is, which is usually what you actually want.",
    },
    {
      id: "responsive-design",
      title: "Responsive Design & Media Queries",
      body: [
        "A media query applies a block of CSS only when a condition is met — most commonly a viewport width: @media (max-width: 600px) { } applies its rules only when the browser window is 600px wide or narrower, the standard way to adjust layout for phones vs. desktops.",
        'Mobile-first is the common modern approach: write your base (un-queried) CSS for the smallest/narrowest layout first, then use @media (min-width: ...) queries to progressively add complexity for larger screens — rather than designing for desktop and cramming a phone layout in afterward as an exception.',
        "Media queries aren't the only responsive tool — CSS Grid's auto-fit/minmax() pattern (see the Grid section) and Flexbox's flex-wrap can each handle real responsive behavior with zero media queries at all, and are often simpler for exactly the \"cards that reflow\" case.",
      ],
      examples: [
        {
          title: "A mobile-first breakpoint",
          code: ".nav {\n  flex-direction: column;\n}\n\n@media (min-width: 768px) {\n  .nav {\n    flex-direction: row;\n  }\n}",
        },
      ],
      tip: "Test responsive CSS by actually resizing the browser window (or a real device), not just by assuming a media query's numbers are right — layouts frequently break at widths in between the breakpoints you explicitly tested.",
    },
    {
      id: "hover",
      title: "Hover & Other Pseudo-Classes",
      body: [
        ":hover applies a style only while the mouse is over the element — .link:hover { color: orange; } changes color only during hover, reverting the instant the mouse moves away. Pair it with transition for a smooth animated change instead of an instant snap.",
        ":focus applies while an element has keyboard focus (tabbed to, or clicked into) — critical for accessibility, since a keyboard-only user relies entirely on a visible focus style to know where they are on the page. Never remove focus styles (outline: none) without providing a real replacement.",
        ":active applies during the actual click/press (a brief, real-time state), and :nth-child(2) (or :nth-child(odd), :nth-child(even)) selects an element based on its position among its siblings — commonly used for zebra-striping table rows without adding a class to every single one.",
      ],
      examples: [
        { title: "A smooth hover transition", code: ".link {\n  color: teal;\n  transition: color 0.15s;\n}\n.link:hover {\n  color: orange;\n}" },
        { title: "Zebra-striping table rows", code: "tr:nth-child(even) {\n  background: #f5f5f5;\n}" },
      ],
      tip: "outline: none on :focus with no real replacement is a genuine, common accessibility bug — it makes the page unusable for anyone navigating by keyboard, since there's no longer any visible indicator of where focus currently is.",
    },
  ],
};
