import type { TrackReference } from "./types";

export const javascriptReference: TrackReference = {
  trackId: "javascript",
  sections: [
    {
      id: "variables",
      title: "Variables",
      body: "Store data with let (reassignable) or const (fixed).",
      codeExample: 'let message = "Hello World";\nconst count = 42;',
    },
    {
      id: "functions",
      title: "Functions",
      body: "Reusable blocks of code that take inputs and return a value.",
      codeExample: "function add(a, b) {\n  return a + b;\n}",
    },
    {
      id: "arrays",
      title: "Arrays",
      body: ".length gives the item count; .map() transforms every item into a new array.",
      codeExample: "const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);",
    },
    {
      id: "conditionals",
      title: "Conditionals",
      body: "if/else branches on a condition. Comparison operators: === equal, >= greater-or-equal.",
      codeExample: 'if (age >= 18) {\n  return "You can vote!";\n}',
    },
  ],
};
