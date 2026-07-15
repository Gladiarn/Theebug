import type { TrackReference } from "./types";

export const reactReference: TrackReference = {
  trackId: "react",
  sections: [
    {
      id: "jsx",
      title: "JSX Syntax",
      body: [
        "JSX lets you write markup that looks like HTML directly inside JavaScript: const el = <h1>Hello!</h1>. Under the hood, a build tool (Babel, or Next.js's compiler) transforms it into plain JavaScript function calls — JSX is a convenience, not something browsers understand natively.",
        "Curly braces {} embed a real JavaScript expression inside JSX — {name}, {1 + 1}, {items.length} all work, since each is a single expression that evaluates to a value. A full statement (if, for, a variable declaration) can't go directly inside {} — JSX only accepts expressions.",
        "Every JSX element must have exactly one root/outermost element — two sibling elements at the top level is a compile error. When there's no single natural wrapper, a Fragment (<>...</>) groups multiple elements without adding an extra DOM node.",
      ],
      examples: [
        { title: "Embedding an expression", code: "const name = \"Ada\";\nconst el = <h1>Hello, {name}!</h1>;" },
        { title: "Grouping siblings with a Fragment", code: "return (\n  <>\n    <h1>Title</h1>\n    <p>Body text</p>\n  </>\n);" },
      ],
      tip: "className, not class — since class is a reserved word in JavaScript, JSX uses className for the HTML class attribute. It's one of the most common \"why isn't my style applying\" mistakes when coming from plain HTML.",
    },
    {
      id: "components-props",
      title: "Components & Props",
      body: [
        "A component is just a function that returns JSX, named starting with a capital letter (Welcome, not welcome) — that capitalization is exactly how React and JSX tell your custom components apart from built-in HTML tags like <div>.",
        'Props are how a parent passes data into a child: <Welcome name="Ada" /> passes { name: "Ada" } as a single object, which the component receives as its one function argument — destructuring it in the parameter list ({ name }) is the common, readable way to read specific props.',
        "Props flow one direction only, parent to child — a component can read the props it was given, but can never reassign or modify them. If a value needs to change over time, that's what state (next section) is for, not props.",
      ],
      examples: [
        { title: "A component reading props via destructuring", code: 'function Badge({ label, color }) {\n  return <span style={{ color }}>{label}</span>;\n}' },
        { title: "Passing props from a parent", code: '<Badge label="New" color="teal" />' },
      ],
      tip: "children is a special, automatically-passed prop containing whatever was written between a component's opening and closing tags — <Card><p>Hi</p></Card> gives Card a children prop equal to that <p> element.",
    },
    {
      id: "usestate",
      title: "State with useState",
      body: [
        "useState gives a component a piece of memory that survives across re-renders — const [count, setCount] = useState(0) returns a pair: the current value, and a function to update it. Both names are yours to choose; only the pairing and order (value, then setter) is fixed.",
        "Calling the setter doesn't just update a plain variable — it tells React to re-render the component with the new value. A component's regular local variables reset to their initial expression on every render; state is specifically what persists between them.",
        "The value passed to useState(...) is only used once — the very first time the component renders. After that, the state's current value is whatever it was most recently set to, completely independent of that initial argument.",
      ],
      examples: [
        { title: "A boolean toggle", code: "const [isOpen, setIsOpen] = useState(false);\nsetIsOpen(!isOpen);" },
        { title: "Updating from the previous value safely", code: "setCount((prev) => prev + 1);" },
      ],
      tip: "When a new state value depends on the previous one, pass a function to the setter (setCount(prev => prev + 1)) instead of reading the outer variable directly — it avoids a real, if subtle, stale-value bug when multiple updates happen in quick succession.",
    },
    {
      id: "events",
      title: "Event Handling",
      body: [
        "React event handler props are camelCase, not lowercase: onClick, onChange, onSubmit — the plain lowercase HTML versions (onclick) simply do nothing in JSX, since React defines its own consistent naming for every event.",
        "A handler prop always takes a function, never the result of calling one — onClick={() => setCount(count + 1)} passes a function to run *later*, on click. Writing onClick={setCount(count + 1)} instead calls it immediately during render, a very common early mistake.",
        "The event object React passes to a handler (onChange={(e) => ...}) is a SyntheticEvent — a cross-browser wrapper around the native browser event, normalized so the same code behaves consistently regardless of which browser is running it.",
      ],
      examples: [
        { title: "A click handler with an argument", code: '<button onClick={() => setCount(count + 1)}>+1</button>' },
        { title: "Reading input as the user types", code: '<input onChange={(e) => setText(e.target.value)} />' },
      ],
      tip: "A handler that doesn't need an argument can be passed directly without an arrow-function wrapper: onClick={handleClick} — only wrap it in () => ... when you need to pass a specific argument or run more than one statement.",
    },
    {
      id: "conditional-rendering",
      title: "Conditional Rendering",
      body: [
        "JSX can only contain expressions, not statements — an if/else block doesn't evaluate to a value, so it can't be dropped directly inside {}. A ternary (condition ? a : b) does evaluate to a value, making it the standard way to choose between two outputs inline.",
        "For an all-or-nothing case — show something, or show nothing — {condition && <Component />} is the more common shorthand: && short-circuits to render nothing at all when condition is false, with no separate else branch needed.",
        "A well-known && gotcha: {count && <p>{count} items</p>} renders a literal 0 on screen when count is exactly 0, since 0 is falsy but is still what && returns. Writing {count > 0 && ...} (an actual boolean) avoids it.",
      ],
      examples: [
        { title: "Ternary for two possible outputs", code: '{isOnline ? "Online" : "Offline"}' },
        { title: "&& for show-or-nothing", code: '{unreadCount > 0 && <Badge count={unreadCount} />}' },
      ],
      tip: "If a conditional starts nesting more than one level deep inside JSX, it's usually clearer to compute the result in a variable *before* the return statement, then reference that variable in the JSX — rather than cramming the logic inline.",
    },
    {
      id: "lists-and-keys",
      title: "Rendering Lists & Keys",
      body: [
        "Array.map() is the standard way to turn a list of data into a list of elements: {items.map((item) => <li key={item.id}>{item.text}</li>)} — the same .map() from plain JavaScript, just returning JSX instead of plain values.",
        "key is a special prop, read only by React itself (never passed down to your actual component), that lets React track which rendered item is which across re-renders — without a stable key, React falls back to comparing by position, which can misattribute state after an insertion, deletion, or reorder.",
        "key must be unique only among *sibling* elements in that specific list, not globally unique across the whole app — two unrelated lists elsewhere on the page can safely reuse the same key values with no conflict.",
      ],
      examples: [
        { title: "Mapping data to list items with a stable key", code: 'const todos = [{ id: 1, text: "Milk" }, { id: 2, text: "Eggs" }];\ntodos.map((t) => <li key={t.id}>{t.text}</li>);' },
      ],
      tip: "Using the array index as a key (items.map((item, i) => <li key={i}>...)) silences React's console warning and often *looks* fine — but it breaks exactly in the case key exists to solve (reordering or inserting items), since the index doesn't actually identify the item.",
    },
    {
      id: "useeffect",
      title: "useEffect & Side Effects",
      body: [
        "useEffect runs code *after* a render commits to the screen — for anything that reaches outside React's own rendering, like fetching data, subscribing to an event, or manually working with a DOM API. useEffect(() => { ... }, [deps]) takes a function to run and a dependency array controlling when it re-runs.",
        "The dependency array is the part that trips people up most: [] (empty) means \"run once, after the first render only\"; [count] means \"re-run whenever count changes\"; omitting the array entirely means \"run after every single render,\" almost never what you actually want.",
        "Returning a function from inside the effect defines cleanup — React calls it right before the effect re-runs, and once more when the component is removed entirely. This is how you unsubscribe from something you subscribed to, preventing a real memory leak.",
      ],
      examples: [
        { title: "Running once on mount", code: 'useEffect(() => {\n  console.log("mounted");\n}, []);' },
        {
          title: "Subscribing with cleanup",
          code: "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);",
        },
      ],
      tip: "A missing or wrong dependency array is one of the most common sources of real React bugs — either an effect that never updates when it should (missing a dependency), or one that runs far more often than intended (an empty array left off by accident).",
    },
    {
      id: "forms",
      title: "Forms & Controlled Inputs",
      body: [
        'A "controlled" input has its value driven entirely by React state, not by the DOM itself: <input value={text} onChange={(e) => setText(e.target.value)} /> — every keystroke updates state, and state is what determines what the input displays, keeping React as the single source of truth.',
        "Without the onChange handler, a controlled input (one with a value prop) becomes read-only — React will keep resetting the displayed value back to whatever's in state, ignoring what the user actually typed, since there's nothing telling state to update.",
        "checkboxes use checked instead of value (checked={isAgreed}, with an onChange to flip it), and a <select> uses value on the <select> element itself rather than a selected attribute on the individual <option>s — small but real differences from plain HTML forms.",
      ],
      examples: [
        { title: "A fully controlled text input", code: 'const [text, setText] = useState("");\n<input value={text} onChange={(e) => setText(e.target.value)} />' },
        { title: "A controlled checkbox", code: '<input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} />' },
      ],
      tip: 'A checkbox reads e.target.checked, not e.target.value, in its onChange handler — using .value on a checkbox is a common copy-paste mistake from a regular text input.',
    },
    {
      id: "composing-components",
      title: "Composing Components",
      body: [
        "Real React apps are built by composing many small components together, not one giant component — a Page might render a Header, a List of Card components, and a Footer, each handling its own small piece of the UI.",
        "When two sibling components both need access to the same changing value, the fix is \"lifting state up\": move the useState call to their closest common parent, then pass the value and its setter down as props to both children — rather than trying to have one child talk directly to another.",
        "The children prop (mentioned in Components & Props) is what makes generic wrapper components possible — a Card component can render <div className=\"card\">{children}</div> and work with any content placed between its tags, without knowing in advance what that content will be.",
      ],
      examples: [
        {
          title: "Lifting state up to a shared parent",
          code: "function Parent() {\n  const [value, setValue] = useState(\"\");\n  return (\n    <>\n      <Input value={value} onChange={setValue} />\n      <Preview value={value} />\n    </>\n  );\n}",
        },
      ],
      tip: "If you find yourself passing the same prop down through three or four layers of components that don't actually use it themselves (just to reach a component further down), that's a common sign it might be worth reaching for Context instead — a way to make a value available to a whole subtree without manually threading it through every level.",
    },
    {
      id: "custom-hooks",
      title: "Custom Hooks",
      body: [
        "A custom hook is just a regular JavaScript function whose name starts with use, that itself calls other hooks (useState, useEffect, etc.) inside it — a way to extract and reuse stateful logic between components, without repeating the same useState/useEffect pair everywhere it's needed.",
        "The use prefix isn't just convention for readability — React's own tooling (and the linter rule that ships with React) uses it to know which functions need to follow the Rules of Hooks (like never calling a hook conditionally), so skipping the prefix on a function that calls hooks internally will cause real, hard-to-diagnose lint gaps.",
        "A custom hook returns whatever the component calling it needs — often an array like useState's own [value, setter] pattern, or an object with several named values — and every component that calls it gets its own, completely independent copy of that state.",
      ],
      examples: [
        {
          title: "A reusable toggle hook",
          code: "function useToggle(initial = false) {\n  const [value, setValue] = useState(initial);\n  const toggle = () => setValue((v) => !v);\n  return [value, toggle];\n}",
        },
      ],
      tip: "A custom hook doesn't share state between the components that call it — each call to useToggle() in the example gets its own independent value, the same way each call to useState() does. A hook shares reusable *logic*, not the state's actual data.",
    },
  ],
};
