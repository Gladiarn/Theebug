import type { TrackReference } from "./types";

export const javascriptReference: TrackReference = {
  trackId: "javascript",
  sections: [
    {
      id: "variables",
      title: "Variables & Data Types",
      body: [
        "JavaScript has three ways to declare a variable: let and const (both block-scoped, added in ES6) and the older var (function-scoped, best avoided in new code). Use const by default — it signals the binding won't be reassigned — and reach for let only when a value genuinely needs to change.",
        "Every value has one of a small set of primitive types: string (text), number (both integers and decimals — JavaScript has no separate int type), boolean (true/false), undefined (a declared-but-unassigned variable), and null (an intentional \"no value\"). Anything more complex — arrays, functions, plain objects — is technically an object.",
        "The typeof operator returns a string naming a value's type, handy for quick debugging — though it has a famous quirk: typeof null returns \"object\", a bug preserved for backwards compatibility since JavaScript's earliest versions.",
      ],
      examples: [
        { title: "Declaring variables", code: 'const name = "Ada";\nlet age = 30;\nage = 31; // let can be reassigned' },
        { title: "Checking a type", code: 'typeof "hello"; // "string"\ntypeof 42;      // "number"\ntypeof true;    // "boolean"' },
      ],
      tip: "Reassigning a const throws a TypeError — but if the const holds an object or array, you can still mutate its contents; only the binding itself is locked.",
    },
    {
      id: "operators",
      title: "Operators",
      body: [
        "Arithmetic operators (+ - * / %) work as expected, with % (modulo) returning the remainder of a division — useful for checking even/odd numbers or wrapping a value around a range.",
        "Comparison has two flavors: == checks equality after converting both sides to the same type (\"5\" == 5 is true), while === checks equality without converting anything (\"5\" === 5 is false). Prefer === almost everywhere; it avoids surprising type-coercion bugs.",
        "Logical operators && (AND), || (OR), and ! (NOT) combine boolean expressions. Both && and || short-circuit — they stop evaluating as soon as the result is determined, which is a common way to write default values or guard conditions.",
      ],
      examples: [
        { title: "Strict vs. loose equality", code: '"5" == 5;  // true  (converts types)\n"5" === 5; // false (no conversion)' },
        { title: "Short-circuiting for a default value", code: 'const nameToShow = userName || "Guest";' },
      ],
      tip: "== is rarely the right choice — reach for === unless you have a specific reason to allow type coercion.",
    },
    {
      id: "functions",
      title: "Functions",
      body: [
        "A function is a reusable block of code. Function declarations (function name() {}) are hoisted — usable before their definition in the file — while function expressions and arrow functions are not.",
        "Arrow functions (const fn = () => {}) are a shorter syntax popular for callbacks. Beyond brevity, they also don't have their own this binding, inheriting it from the surrounding scope instead — a detail that matters once you're writing methods on objects or classes.",
        "Parameters can have default values (function greet(name = \"friend\")), and the rest parameter (...args) collects any number of extra arguments into a real array.",
      ],
      examples: [
        { title: "Arrow function with a default parameter", code: 'const greet = (name = "friend") => `Hello, ${name}!`;' },
        {
          title: "Collecting arguments with rest",
          code: "function sum(...nums) {\n  return nums.reduce((total, n) => total + n, 0);\n}",
        },
      ],
      tip: "Arrow functions can't be used as constructors and don't have their own arguments object — for object methods that need this, a regular function is usually the safer choice.",
    },
    {
      id: "arrays",
      title: "Arrays",
      body: [
        "An array is an ordered list of values, created with square brackets: const fruits = [\"apple\", \"banana\"]. Items are accessed by zero-based index — fruits[0] is \"apple\" — and .length always reflects the current item count.",
        "Arrays come with mutating methods that change the array in place — push/pop add or remove from the end, shift/unshift do the same at the start — and non-mutating methods that return a new array or value without touching the original, like the transformation methods covered next.",
      ],
      examples: [
        { title: "Basic array operations", code: 'const fruits = ["apple", "banana"];\nfruits.push("cherry");\nfruits.length; // 3' },
        { title: "Checking membership", code: 'fruits.includes("banana"); // true' },
      ],
      tip: "push/pop/shift/unshift all mutate the original array — if you need to keep the original unchanged (common in React and other frameworks), copy first with spread syntax: [...fruits, \"cherry\"].",
    },
    {
      id: "array-methods",
      title: "Array Methods: map, filter, reduce",
      body: [
        "These methods cover almost everything you'll do with a list of data, and none of them mutate the original array. forEach runs a function on every item purely for its side effects (like logging) and returns undefined.",
        "map transforms every item and returns a new array of the same length — the tool for \"I have a list of X and want a list of Y\". filter keeps only the items that pass a test and returns a shorter (or equal-length) array.",
        "reduce is the most general: it walks the array accumulating a single result, driven by a callback that receives the running total and the current item. Anything map or filter can do, reduce can also do — but map/filter are usually clearer when they fit.",
      ],
      examples: [
        {
          title: "Transform and filter together",
          code: "const nums = [1, 2, 3, 4, 5];\nconst evenDoubled = nums.filter(n => n % 2 === 0).map(n => n * 2);\n// [4, 8]",
        },
        { title: "Summing with reduce", code: "const total = nums.reduce((sum, n) => sum + n, 0); // 15" },
      ],
      tip: "reduce's second argument is the starting value for the accumulator — forgetting it is a common source of bugs when the array might be empty.",
    },
    {
      id: "objects",
      title: "Objects",
      body: [
        "An object groups related data as key-value pairs: const user = { name: \"Ada\", age: 30 }. Properties are read with dot notation (user.name) or bracket notation (user[\"name\"]) — bracket notation is required when the key is dynamic or not a valid identifier.",
        "Object.keys(), Object.values(), and Object.entries() turn an object's keys, values, or [key, value] pairs into arrays, which is how you loop over an object using array methods like map or forEach.",
        "Methods are just functions stored as properties. Inside a regular function method, this refers to the object the method was called on.",
      ],
      examples: [
        {
          title: "Reading and looping",
          code: 'const user = { name: "Ada", age: 30 };\nObject.entries(user).forEach(([key, value]) => console.log(key, value));',
        },
        { title: "A method using this", code: "const counter = {\n  count: 0,\n  increment() { this.count++; },\n};" },
      ],
      tip: "Object property shorthand lets you write { name, age } instead of { name: name, age: age } when a variable already shares its name with the key.",
    },
    {
      id: "conditionals",
      title: "Conditionals",
      body: [
        "if/else if/else branches execution based on a condition. Any value can be used as a condition — JavaScript coerces it to true or false, and the \"falsy\" values worth memorizing are false, 0, \"\", null, undefined, and NaN. Everything else, including \"0\" and empty arrays/objects, is truthy.",
        "The ternary operator (condition ? valueIfTrue : valueIfFalse) is a compact if/else for a single expression, most useful when assigning a value rather than running a whole block of statements.",
        "switch compares one value against several possible cases and reads more cleanly than a long if/else if chain when you're checking the same variable repeatedly. Each case needs a break, or execution \"falls through\" into the next one.",
      ],
      examples: [
        { title: "Ternary for a quick assignment", code: 'const status = age >= 18 ? "adult" : "minor";' },
        {
          title: "switch with fallthrough guarded by break",
          code: 'switch (day) {\n  case "Sat":\n  case "Sun":\n    console.log("Weekend");\n    break;\n  default:\n    console.log("Weekday");\n}',
        },
      ],
      tip: "An empty array or object is truthy, even though it \"feels\" empty — check .length or Object.keys(obj).length if you need to know whether it actually has contents.",
    },
    {
      id: "loops",
      title: "Loops",
      body: [
        "for (let i = 0; i < n; i++) is the classic counting loop, giving full control over the start, condition, and step. It's the right tool when you need the index itself, not just each value.",
        "for...of iterates the values of anything iterable — arrays, strings, Maps, Sets — and is usually what you want for \"do something with each item\". for...in iterates the enumerable keys of an object instead, and is rarely used on arrays since it also picks up inherited/extra properties.",
        "while and do...while loops run based on a condition rather than a count, useful when you don't know in advance how many iterations you'll need.",
      ],
      examples: [
        { title: "for...of over an array", code: 'for (const fruit of ["apple", "banana"]) {\n  console.log(fruit);\n}' },
        { title: "A while loop", code: "let n = 10;\nwhile (n > 0) {\n  n = Math.floor(n / 2);\n}" },
      ],
      tip: "for...of works on strings too, iterating each character — a quick way to loop through text without indexing.",
    },
    {
      id: "strings",
      title: "Strings & Template Literals",
      body: [
        "Strings are immutable — every string method returns a new string rather than changing the original. Useful ones include .length, .slice(start, end), .toUpperCase()/.toLowerCase(), .includes(substring), .trim(), and .split(separator) to turn a string into an array.",
        "Template literals, written with backticks, allow ${...} interpolation directly inside the string and support real multi-line text without \\n escapes — both things regular \"...\" strings can't do.",
      ],
      examples: [
        { title: "Common string methods", code: '"  Hello World  ".trim().toLowerCase();\n// "hello world"' },
        {
          title: "Template literal interpolation",
          code: 'const name = "Ada";\nconst greeting = `Hello, ${name}! You have ${3 + 2} messages.`;',
        },
      ],
      tip: "Template literals can span multiple lines just by pressing enter inside the backticks — no \\n needed.",
    },
    {
      id: "destructuring",
      title: "Destructuring & Spread",
      body: [
        "Destructuring unpacks values from arrays or properties from objects into individual variables in one line: const [first, second] = list, or const { name, age } = user. Object destructuring can also rename and default: const { name: userName = \"Guest\" } = user.",
        "The spread operator (...) expands an array or object into individual elements — useful for copying (const copy = [...original]), merging ({ ...defaults, ...overrides }), or passing an array as individual function arguments (Math.max(...numbers)).",
      ],
      examples: [
        { title: "Destructuring with a default and rename", code: 'const { name: userName = "Guest" } = user;' },
        {
          title: "Merging objects with spread (later keys win)",
          code: "const settings = { ...defaults, ...userSettings };",
        },
      ],
      tip: "Object spread order matters — { ...defaults, ...userSettings } lets userSettings override defaults; swap the order and the effect reverses.",
    },
    {
      id: "errors",
      title: "Error Handling",
      body: [
        "try/catch lets you run code that might fail without crashing the whole program: code that throws inside the try block jumps straight to catch, where you get the error object.",
        "throw new Error(\"message\") creates and immediately throws an error — the standard way to signal something has gone wrong inside a function. finally runs a block of cleanup code whether or not an error occurred.",
      ],
      examples: [
        { title: "Basic try/catch", code: 'try {\n  JSON.parse("not valid json");\n} catch (err) {\n  console.log(err.message);\n}' },
        {
          title: "Throwing your own error",
          code: 'function divide(a, b) {\n  if (b === 0) throw new Error("Cannot divide by zero");\n  return a / b;\n}',
        },
      ],
      tip: "catch only catches errors thrown synchronously (or inside an awaited promise) — an error thrown inside setTimeout or an un-awaited promise slips past a surrounding try/catch.",
    },
    {
      id: "scope",
      title: "Scope & Closures",
      body: [
        "Scope determines where a variable is visible. let and const are block-scoped (visible only inside the {} they're declared in), while var is function-scoped — one of the main reasons let/const are preferred today.",
        "A closure is a function that \"remembers\" the variables from the scope it was created in, even after that outer function has finished running. This is how you build private state in JavaScript without classes.",
      ],
      examples: [
        { title: "Block scope with let", code: "if (true) {\n  let x = 1;\n}\n// x is not accessible here" },
        {
          title: "A closure creating a private counter",
          code: "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2",
        },
      ],
      tip: "Each call to makeCounter() creates a brand new, independent count variable — closures capture the variable, not a shared global.",
    },
  ],
};
