import type { TrackReference } from "./types";

export const pythonReference: TrackReference = {
  trackId: "python",
  sections: [
    {
      id: "variables",
      title: "Variables",
      body: ["Python variables need no declaration keyword — just assign a value and the type is inferred."],
      examples: [{ title: "Example", code: 'message = "Hello World"\ncount = 42' }],
    },
    {
      id: "functions",
      title: "Functions",
      body: ["Defined with def, indentation (not braces) marks the function body, and return sends back a value."],
      examples: [{ title: "Example", code: "def add(a, b):\n    return a + b" }],
    },
    {
      id: "lists",
      title: "Lists",
      body: ["len() gives the item count; list comprehensions build a new list by transforming each item."],
      examples: [{ title: "Example", code: "nums = [1, 2, 3]\ndoubled = [n * 2 for n in nums]" }],
    },
    {
      id: "conditionals",
      title: "Conditionals",
      body: ["if/elif/else branches on a condition. Comparison operators: == equal, >= greater-or-equal."],
      examples: [{ title: "Example", code: 'if age >= 18:\n    return "You can vote!"' }],
    },
  ],
};
