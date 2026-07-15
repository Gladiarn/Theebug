import type { Track } from "./types";

export const reactTrack: Track = {
  id: "react",
  title: "React",
  description: "Components, props, state, and the hooks that power modern React apps.",
  color: "#61dafb",
  levels: [
    {
      id: 1,
      title: "JSX & Components",
      filename: "lesson1.jsx",
      difficulty: "easy",
      objective: "Complete the JSX so the component renders \"Hello, world!\"",
      preview: ["Hello, world!"],
      codeLines: ["function Greeting() {", "  return <h1>Hello, {{zone1}}!</h1>;", "}"],
      zones: [{ id: "zone1", answer: "world" }],
      blocks: [
        { id: "b1", code: "world" },
        { id: "b2", code: "{world}" },
        { id: "b3", code: '"world"' },
        { id: "b4", code: "React" },
      ],
      wormIntro:
        "Welcome to React! A component is just a function that returns JSX — markup that looks like HTML but lives right inside your JavaScript. Which block completes the greeting as plain text?",
      wormCorrectAll:
        "Exactly! JSX text content is just plain text — no quotes, no braces needed. You only reach for {} when you want to drop in a real JavaScript value! 🎉",
      concept: {
        summary: "A React component is a function that returns JSX — a syntax that looks like HTML but is really JavaScript underneath.",
        details: [
          "JSX text content works exactly like HTML text: <h1>Hello, world!</h1> renders literally, no quotes or braces needed around plain words.",
          "Curly braces {} are how you drop a real JavaScript expression into JSX — {world} would try to read a variable named world, which doesn't exist here, so it's not what this blank needs.",
          "Every component name starts with a capital letter (Greeting, not greeting) — this is how React tells your own components apart from regular HTML tags like <div> or <h1> at a glance.",
        ],
        example: 'function Welcome() {\n  return <p>Welcome to React!</p>;\n}',
      },
    },
    {
      id: 2,
      title: "Props",
      filename: "lesson2.jsx",
      difficulty: "easy",
      objective: "Destructure the name prop so the component greets whoever it's passed",
      preview: ["Hello, Ada!"],
      codeLines: [
        "function Welcome({{zone1}}) {",
        "  return <p>Hello, {name}!</p>;",
        "}",
        "",
        '<Welcome name="Ada" />',
      ],
      zones: [{ id: "zone1", answer: "{ name }" }],
      blocks: [
        { id: "b1", code: "{ name }" },
        { id: "b2", code: "name" },
        { id: "b3", code: "props" },
        { id: "b4", code: "{ props }" },
      ],
      wormIntro:
        "Props are how a parent passes data into a component — like an argument into a function. The component receives one props object; which block unpacks just the name property directly in the parameter list?",
      wormCorrectAll:
        "Yes! Destructuring { name } right in the parameter list pulls name straight out of the props object — the same destructuring you'd use anywhere else in JavaScript! 🎯",
      concept: {
        summary: "Props are how a parent component passes data down into a child component — read-only from the child's perspective.",
        details: [
          "Every component actually receives one single props object as its argument — <Welcome name=\"Ada\" /> passes { name: \"Ada\" }. Destructuring in the parameter list ({ name }) pulls out just the properties you need, exactly like destructuring any other object.",
          "Without destructuring, you'd write function Welcome(props) and read props.name everywhere inside — valid, but more typing for the same result once a component uses more than one prop.",
          "Props flow one direction only: parent to child. A child component can't reach back up and change a prop it was given — if the value needs to change, that's what state (next lesson) is for.",
        ],
        example: 'function Badge({ label, color }) {\n  return <span style={{ color }}>{label}</span>;\n}',
      },
    },
    {
      id: 3,
      title: "State with useState",
      filename: "lesson3.jsx",
      difficulty: "easy",
      objective: "Call useState so the counter has somewhere to keep its count",
      preview: ["Count: 0"],
      codeLines: [
        'import { useState } from "react";',
        "",
        "function Counter() {",
        "  const [count, setCount] = {{zone1}}(0);",
        "  return <p>Count: {count}</p>;",
        "}",
      ],
      zones: [{ id: "zone1", answer: "useState" }],
      blocks: [
        { id: "b1", code: "useState" },
        { id: "b2", code: "useEffect" },
        { id: "b3", code: "useRef" },
        { id: "b4", code: "useContext" },
      ],
      wormIntro:
        "A component's local variables reset every time it re-renders — state is React's way of remembering a value across renders. Which hook creates a piece of state?",
      wormCorrectAll:
        "useState(0) is exactly right! It returns a pair: the current value (count) and a function to update it (setCount) — and React re-renders the component automatically whenever you call that setter! 🔢",
      concept: {
        summary: "useState gives a component a piece of memory that survives re-renders, plus a function to update it.",
        details: [
          "useState(0) returns an array of exactly two things: the current value and a setter function — const [count, setCount] = useState(0) destructures both at once, a pattern you'll see in almost every React file.",
          "Calling the setter (setCount(count + 1)) doesn't just change a variable — it tells React \"re-render this component with the new value,\" which is what actually updates what's on screen.",
          "The argument to useState (0 here) is only used once, as the *initial* value the first time the component ever renders — after that, the state's current value is whatever it was most recently set to, not the initial argument again.",
        ],
        example: 'const [isOpen, setIsOpen] = useState(false);\n// later: setIsOpen(true);',
      },
    },
    {
      id: 4,
      title: "Event Handling",
      filename: "lesson4.jsx",
      difficulty: "medium",
      objective: "Wire up the button so clicking it increases the count",
      preview: ["Clicked 0 times"],
      codeLines: [
        "function Counter() {",
        "  const [count, setCount] = useState(0);",
        "  return (",
        "    <button {{zone1}}={() => setCount(count + 1)}>",
        "      Clicked {count} times",
        "    </button>",
        "  );",
        "}",
      ],
      zones: [{ id: "zone1", answer: "onClick" }],
      blocks: [
        { id: "b1", code: "onClick" },
        { id: "b2", code: "onclick" },
        { id: "b3", code: "onChange" },
        { id: "b4", code: "click" },
      ],
      wormIntro:
        "React event handlers are camelCase JSX attributes, not the lowercase HTML kind. Which one fires when this button is clicked?",
      wormCorrectAll:
        "onClick is it! React events are always camelCase (onClick, onChange, onSubmit) — plain lowercase onclick is the HTML-attribute spelling, and React won't recognize it. 🖱️",
      concept: {
        summary: "React event handlers are camelCase JSX props that take a function — never a string, and never called directly.",
        details: [
          "onClick={() => setCount(count + 1)} passes a *function* to run later, on click — a common beginner mistake is writing onClick={setCount(count + 1)} instead, which calls it immediately during render, not on click.",
          "Every native DOM event has a React equivalent spelled in camelCase: onclick becomes onClick, onchange becomes onChange, onsubmit becomes onSubmit — the lowercase HTML versions simply don't do anything in JSX.",
          "The arrow function wrapper (() => ...) matters here specifically because setCount needs an argument (count + 1) — for a handler that takes no arguments, you can pass the function directly without wrapping it.",
        ],
        example: '<button onClick={() => alert("Hi!")}>Say hi</button>',
      },
    },
    {
      id: 5,
      title: "Conditional Rendering",
      filename: "lesson5.jsx",
      difficulty: "medium",
      objective: "Complete the ternary so the status text matches whether the user is online",
      preview: ["Online"],
      codeLines: ["function Status({ isOnline }) {", '  return <p>{isOnline {{zone1}} "Online" : "Offline"}</p>;', "}"],
      zones: [{ id: "zone1", answer: "?" }],
      blocks: [
        { id: "b1", code: "?" },
        { id: "b2", code: "&&" },
        { id: "b3", code: "==" },
        { id: "b4", code: "===" },
      ],
      wormIntro:
        "JSX can't contain an if statement directly — but a ternary expression works fine inside {}. Which symbol starts a ternary?",
      wormCorrectAll:
        "? is right! isOnline ? \"Online\" : \"Offline\" reads as \"if isOnline, use Online, otherwise Offline\" — the standard way to choose between two outputs right inside JSX. 🔀",
      concept: {
        summary: "JSX can only contain expressions, not statements — so choosing between two outputs uses a ternary, not an if/else block.",
        details: [
          "{isOnline ? \"Online\" : \"Offline\"} is a ternary *expression* — it evaluates to a value, which is exactly what {} inside JSX needs. An if/else statement doesn't evaluate to a value, so it can't be dropped in directly the same way.",
          "For an all-or-nothing case (show something, or show nothing at all), {isOnline && <Badge />} is the more common pattern — && short-circuits to render nothing when isOnline is false, with no separate else branch needed.",
          "A subtle && gotcha: {count && <p>{count} items</p>} renders a literal 0 on screen when count is 0, since 0 is falsy but still gets returned by && — writing {count > 0 && ...} avoids it.",
        ],
        example: 'function Badge({ show }) {\n  return show && <span>New!</span>;\n}',
      },
    },
    {
      id: 6,
      title: "Rendering Lists & Keys",
      filename: "lesson6.jsx",
      difficulty: "hard",
      objective: "Add the key prop React needs to track each item in the rendered list",
      preview: ["apple", "banana", "cherry"],
      codeLines: [
        "function FruitList({ fruits }) {",
        "  return (",
        "    <ul>",
        "      {fruits.map((fruit) => (",
        "        <li {{zone1}}={fruit}>{fruit}</li>",
        "      ))}",
        "    </ul>",
        "  );",
        "}",
      ],
      zones: [{ id: "zone1", answer: "key" }],
      blocks: [
        { id: "b1", code: "key" },
        { id: "b2", code: "id" },
        { id: "b3", code: "index" },
        { id: "b4", code: "name" },
      ],
      wormIntro:
        "Whenever you .map() over data to render a list of elements, React needs one special prop on the outermost element to tell items apart between renders. Which prop is it?",
      wormCorrectAll:
        "key is exactly right! It's not a real DOM attribute — it's a hint just for React, letting it match up which list item is which even after the list changes, instead of re-rendering everything from scratch. 🔑",
      concept: {
        summary: "key is a special prop, read only by React itself, that lets it track which rendered item is which across re-renders.",
        details: [
          "Without a stable key, React falls back to comparing list items by position — if an item is added, removed, or reordered, React can misattribute state to the wrong item, or re-render more than necessary. A stable, unique key (usually an id from your data) avoids both.",
          "key must be unique among siblings, not globally unique across the whole app — two different lists on the same page can safely reuse the same key values.",
          "Using the array index as a key (which this puzzle deliberately doesn't do) technically works and silences React's warning, but breaks exactly in the reordering/insertion case key exists to solve — it's a common shortcut that only looks correct until the list actually changes.",
        ],
        example: 'const items = [{ id: 1, text: "Milk" }, { id: 2, text: "Eggs" }];\nitems.map((item) => <li key={item.id}>{item.text}</li>);',
      },
    },
  ],
};
