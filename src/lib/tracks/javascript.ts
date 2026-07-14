import type { Track } from "./types";

export const javascriptTrack: Track = {
  id: "javascript",
  title: "JavaScript",
  description: "Variables, functions, arrays, and conditionals — the fundamentals of JS.",
  color: "#f0db4f",
  levels: [
    {
      id: 1,
      title: "Variables",
      filename: "lesson1.js",
      objective: 'Assign values to the variables so the program outputs "Hello World 42"',
      preview: ["Hello World 42"],
      codeLines: [
        "// Variables store data values",
        "let message = {{zone1}};",
        "let count = {{zone2}};",
        "",
        "console.log(message, count);",
      ],
      zones: [
        { id: "zone1", answer: '"Hello World"' },
        { id: "zone2", answer: "42" },
      ],
      blocks: [
        { id: "b1", code: '"Hello World"' },
        { id: "b2", code: "42" },
        { id: "b3", code: "true" },
        { id: "b4", code: "null" },
        { id: "b5", code: "[]" },
      ],
      wormIntro:
        "Hi! I'm Debug the worm! 🐛 Drag the correct values into the empty slots to assign the variables. Message should be a string, count should be a number!",
      wormCorrectAll: "Amazing! You assigned both variables correctly! Let's move to the next challenge! 🎉",
      concept: {
        summary: "let declares a variable that can hold any type of value.",
        details: [
          "A variable is just a named box for a value. `let message = \"Hello World\"` stores text (a string, always in quotes); `let count = 42` stores a number (no quotes).",
          "JavaScript doesn't make you declare a type up front — the same `let` works for strings, numbers, booleans, or anything else. That flexibility is convenient, but it also means typos like forgetting quotes around text are easy to make and won't be caught until the program runs.",
          "You'll also see `const` for variables that should never be reassigned after their first value, and old-style `var` (best avoided in modern code — it has confusing scoping rules `let`/`const` fixed).",
        ],
        example: 'const pi = 3.14; // const: value never changes\nlet score = 0;   // let: value will change later\nscore = score + 10;',
      },
    },
    {
      id: 2,
      title: "Functions",
      filename: "lesson2.js",
      objective: 'Complete the "add" function so it returns the sum of a and b (should output 10)',
      preview: ["10"],
      codeLines: [
        "function add(a, b) {",
        "  return {{zone1}};",
        "}",
        "",
        "let result = add(3, 7);",
        "console.log(result); // 10",
      ],
      zones: [{ id: "zone1", answer: "a + b" }],
      blocks: [
        { id: "b1", code: "a + b" },
        { id: "b2", code: "a - b" },
        { id: "b3", code: "a * b" },
        { id: "b4", code: "a / b" },
      ],
      wormIntro:
        "This function should ADD two numbers together! Drag the expression that represents their sum into the return slot. What operation combines two values?",
      wormCorrectAll: "Perfect! a + b adds both parameters together! You're getting it! 🚀",
      concept: {
        summary: "Functions package up reusable logic and hand back a result with return.",
        details: [
          "`function add(a, b) { ... }` defines a function named `add` that takes two inputs (parameters) `a` and `b`. Nothing runs until you actually call it, like `add(3, 7)`.",
          "`return` is what sends a value back out of the function to whoever called it. Once `return` runs, the function stops immediately — code written after it never executes.",
          "A function with no `return` statement implicitly gives back `undefined`. Forgetting `return` is one of the most common beginner bugs — the function runs fine but the caller gets nothing useful.",
        ],
        example: 'function multiply(a, b) {\n  return a * b;\n}\nconsole.log(multiply(4, 5)); // 20',
      },
    },
    {
      id: 3,
      title: "Array Length",
      filename: "lesson3.js",
      objective: "Use the correct array property to loop through all fruits and log each one",
      preview: ["apple", "banana", "cherry"],
      codeLines: [
        'const fruits = ["apple", "banana", "cherry"];',
        "",
        "for (let i = 0; i < fruits.{{zone1}}; i++) {",
        "  console.log(fruits[i]);",
        "}",
      ],
      zones: [{ id: "zone1", answer: "length" }],
      blocks: [
        { id: "b1", code: "length" },
        { id: "b2", code: "size" },
        { id: "b3", code: "count" },
        { id: "b4", code: "total" },
      ],
      wormIntro:
        "Arrays have a special property that tells you how many items they contain. Which one is it? Drag it into the slot after the dot!",
      wormCorrectAll: "Yes! .length gives us 3, so the loop runs from 0 to 2 and visits every fruit! 🍎🍌🍒",
      concept: {
        summary: "`.length` tells you how many items are in an array, which is what makes a for loop able to visit every one.",
        details: [
          "Arrays are ordered lists: `fruits[0]` is the first item, `fruits[1]` the second, and so on. `fruits.length` is a live count — it updates automatically if you add or remove items.",
          "The classic `for (let i = 0; i < fruits.length; i++)` loop starts `i` at 0 and keeps going while `i` is still less than the length, which is exactly the range of valid index positions.",
          "A very common bug is using `<=` instead of `<` — that runs one iteration too many and tries to read `fruits[3]` on a 3-item array, which doesn't exist and gives `undefined`.",
        ],
        example: 'const colors = ["red", "green", "blue"];\nconsole.log(colors.length); // 3\nconsole.log(colors[colors.length - 1]); // "blue" (last item)',
      },
    },
    {
      id: 4,
      title: "Array Methods",
      filename: "lesson4.js",
      objective: "Use the right array method to create a new array with each number doubled",
      preview: ["[2, 4, 6, 8, 10]"],
      codeLines: [
        "const nums = [1, 2, 3, 4, 5];",
        "const doubled = nums.{{zone1}}(n => n * 2);",
        "",
        "console.log(doubled);",
        "// [2, 4, 6, 8, 10]",
      ],
      zones: [{ id: "zone1", answer: "map" }],
      blocks: [
        { id: "b1", code: "map" },
        { id: "b2", code: "filter" },
        { id: "b3", code: "reduce" },
        { id: "b4", code: "forEach" },
      ],
      wormIntro:
        "I need to TRANSFORM every number in the array into a new one! Which array method creates a NEW array with each element transformed? Think 🗺️!",
      wormCorrectAll: "Brilliant! .map() transforms each element and returns a brand new array! You're a natural coder! 🗺️✨",
      concept: {
        summary: "`.map()` transforms every item in an array and returns a brand new array — it never changes the original.",
        details: [
          "`nums.map(n => n * 2)` runs the function `n => n * 2` once per item and collects the results into a new array. The original `nums` array is untouched.",
          "Its cousins do different jobs: `.filter(fn)` keeps only the items where `fn` returns true (shrinking the array, not transforming it), and `.reduce(fn, start)` combines every item down into a single value, like a total.",
          "Because `.map()` always returns an array the same length as the input, it's the right tool whenever you want 'the same list, but each item changed' — not when you want to remove or combine items.",
        ],
        example: 'const names = ["ana", "bo"];\nconst shouted = names.map(n => n.toUpperCase());\nconsole.log(shouted); // ["ANA", "BO"]',
      },
    },
    {
      id: 5,
      title: "Conditionals",
      filename: "lesson5.js",
      objective: "Add the right comparison operator to check if age is 18 OR older",
      preview: ['"You can vote!"', '"Too young"'],
      codeLines: [
        "function checkAge(age) {",
        "  if (age {{zone1}} 18) {",
        '    return "You can vote!";',
        "  }",
        '  return "Too young";',
        "}",
        "",
        'console.log(checkAge(20)); // "You can vote!"',
        'console.log(checkAge(15)); // "Too young"',
      ],
      zones: [{ id: "zone1", answer: ">=" }],
      blocks: [
        { id: "b1", code: ">=" },
        { id: "b2", code: "<=" },
        { id: "b3", code: "===" },
        { id: "b4", code: "!==" },
        { id: "b5", code: ">" },
      ],
      wormIntro:
        'The condition should be true when age is 18 OR older! Which comparison operator means "greater than OR equal to"? Not just greater than — equal counts too!',
      wormCorrectAll:
        "You did it! >= means greater than OR equal to, so 18 still passes! You've completed all 5 levels! You're a JavaScript hero! 🏆🎊",
      concept: {
        summary: "Comparison operators (>=, <=, ===, !==) turn a question into true or false, which `if` then acts on.",
        details: [
          "`>=` means \"greater than or equal to\" and `<=` means \"less than or equal to\" — both include the boundary value itself, unlike plain `>` or `<`.",
          "`===` checks that two values are strictly equal (same value AND same type), and `!==` checks that they're strictly not equal. Prefer these over `==`/`!=`, which silently convert types before comparing and can produce surprising results like `\"5\" == 5` being true.",
          "An `if` block only runs its body when the condition evaluates to `true`. Once a `return` inside it fires, the function exits immediately — the code after the `if` never runs for that case.",
        ],
        example: 'function canRent(age) {\n  if (age >= 25) return true;\n  return false;\n}\nconsole.log(canRent(25)); // true — 25 counts as >= 25',
      },
    },
  ],
};
