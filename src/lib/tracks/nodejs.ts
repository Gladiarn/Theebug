import type { Track } from "./types";

export const nodejsTrack: Track = {
  id: "nodejs",
  title: "Node.js",
  description: "Modules, the file system, HTTP servers, and async I/O — JavaScript on the server.",
  color: "#339933",
  levels: [
    {
      id: 1,
      title: "CommonJS Modules",
      filename: "lesson1.js",
      difficulty: "easy",
      objective: "Export the greet function so another file can require() and use it",
      preview: ["Hello, Ada!"],
      codeLines: [
        "function greet(name) {",
        '  return `Hello, ${name}!`;',
        "}",
        "",
        "module.exports = {{zone1}};",
      ],
      zones: [{ id: "zone1", answer: "greet" }],
      blocks: [
        { id: "b1", code: "greet" },
        { id: "b2", code: "greet()" },
        { id: "b3", code: '"greet"' },
        { id: "b4", code: "module" },
      ],
      wormIntro:
        "Every Node.js file is its own module — nothing inside it is visible to other files unless you explicitly export it. Which block correctly exports the greet function itself?",
      wormCorrectAll:
        "Exactly! module.exports = greet hands out the function itself — not a string of its name, and not the result of calling it. Another file can now require() this one and get greet back! 📦",
      concept: {
        summary: "Node.js uses the CommonJS module system — every file is private by default until you explicitly export something from it.",
        details: [
          "module.exports is a special object every file gets automatically. Whatever you assign to it is exactly what another file receives when it calls require(\"./this-file\") — assign a function, an object, a class, or any value.",
          "greet() (with parentheses) would export the *result of calling* greet immediately, not the function itself — a common mix-up. Leaving off the parentheses exports the function so the file requiring it can call it whenever it wants, with its own arguments.",
          "You can export more than one thing by assigning an object: module.exports = { greet, farewell } — the receiving file then destructures whichever named exports it needs.",
        ],
        example: 'function add(a, b) {\n  return a + b;\n}\nmodule.exports = { add };',
      },
    },
    {
      id: 2,
      title: "require() & Built-in Modules",
      filename: "lesson2.js",
      difficulty: "easy",
      objective: "Require Node's built-in path module to join two path segments safely",
      preview: ["data/users.json"],
      codeLines: ["const path = {{zone1}}(\"path\");", "", 'console.log(path.join("data", "users.json"));'],
      zones: [{ id: "zone1", answer: "require" }],
      blocks: [
        { id: "b1", code: "require" },
        { id: "b2", code: "import" },
        { id: "b3", code: "include" },
        { id: "b4", code: "use" },
      ],
      wormIntro:
        "require() loads a module — either a built-in one that ships with Node itself, a file of your own, or a package from npm. Which keyword loads a module in Node's CommonJS system?",
      wormCorrectAll:
        "require() is exactly it! path is one of many modules that ship with Node itself, no installation needed — path.join() safely combines path segments using the right separator for whatever operating system the code runs on. 🗂️",
      concept: {
        summary: "require() loads a module by name — a Node built-in, a local file, or an installed npm package — and returns whatever that module exported.",
        details: [
          "A path starting with ./ or ../ (require(\"./utils\")) loads your own file; a bare name (require(\"path\"), require(\"express\")) loads either a Node built-in or a package installed in node_modules — Node checks built-ins first.",
          "path.join(\"data\", \"users.json\") is safer than manually writing \"data/users.json\" with a hardcoded slash — Windows uses backslashes in real file paths, and path.join() handles that difference automatically.",
          "import/export (ES modules) is a newer, separate module system Node also supports, but requires opting in (a \"type\": \"module\" field in package.json, or a .mjs extension) — require() is still the default and by far the most common in existing Node code.",
        ],
        example: 'const fs = require("fs");\nconst path = require("path");',
      },
    },
    {
      id: 3,
      title: "Reading Files with fs",
      filename: "lesson3.js",
      difficulty: "easy",
      objective: "Read notes.txt synchronously as a UTF-8 string",
      preview: ["Buy milk"],
      codeLines: [
        'const fs = require("fs");',
        "",
        'const contents = fs.readFileSync("notes.txt", {{zone1}});',
        "console.log(contents);",
      ],
      zones: [{ id: "zone1", answer: '"utf8"' }],
      blocks: [
        { id: "b1", code: '"utf8"' },
        { id: "b2", code: "true" },
        { id: "b3", code: "utf8" },
        { id: "b4", code: "null" },
      ],
      wormIntro:
        "Without an encoding, fs.readFileSync returns a raw Buffer of bytes, not readable text. Which block tells it to decode the file as a UTF-8 string instead?",
      wormCorrectAll:
        '"utf8" is right! Passing an encoding string as the second argument makes readFileSync return real text instead of a Buffer object — leave it off, and console.log would print something like <Buffer 42 75 79 ...> instead. 📄',
      concept: {
        summary: "fs.readFileSync reads a file's entire contents at once, blocking further code from running until it finishes.",
        details: [
          "Without a second argument, fs.readFileSync returns a Buffer — Node's representation of raw binary data. Passing \"utf8\" (or any valid encoding) as the second argument tells it to decode those bytes into a real JavaScript string instead.",
          "\"Sync\" in the name is a real warning, not just a naming detail: this function blocks Node's single thread entirely until the read finishes. Fine for a quick script or startup config; a real server handling multiple requests should reach for the async version instead (covered next).",
          "fs.readFileSync throws if the file doesn't exist, rather than returning null or undefined — wrapping it in try/catch is the standard way to handle a missing file gracefully.",
        ],
        example: 'const fs = require("fs");\ntry {\n  console.log(fs.readFileSync("config.json", "utf8"));\n} catch (err) {\n  console.log("Config file not found");\n}',
      },
    },
    {
      id: 4,
      title: "Creating an HTTP Server",
      filename: "lesson4.js",
      difficulty: "medium",
      objective: "Start the server listening on port 3000",
      preview: ["Server running on port 3000"],
      codeLines: [
        'const http = require("http");',
        "",
        "const server = http.createServer((req, res) => {",
        '  res.end("Hello from Node!");',
        "});",
        "",
        "server.{{zone1}}(3000, () => {",
        '  console.log("Server running on port 3000");',
        "});",
      ],
      zones: [{ id: "zone1", answer: "listen" }],
      blocks: [
        { id: "b1", code: "listen" },
        { id: "b2", code: "start" },
        { id: "b3", code: "run" },
        { id: "b4", code: "open" },
      ],
      wormIntro:
        "http.createServer() just builds the server object — it doesn't actually start accepting connections until you tell it which port to bind to. Which method starts it listening?",
      wormCorrectAll:
        "listen(3000, ...) is exactly right! Until this call, the server exists in memory but isn't bound to any port — nothing outside the process could reach it. The callback fires once it's actually ready to accept real connections. 🌐",
      concept: {
        summary: "http.createServer() takes a callback that runs once per incoming request — req describes what came in, res is how you send something back.",
        details: [
          "The callback receives two objects every time a request arrives: req (the incoming request — method, URL, headers, body) and res (the response you build and send back). Nothing is sent to the client until you call something on res.",
          "res.end() sends the response and signals that it's complete — calling it more than once for the same request throws an error, since you can't send a second response to an already-finished one.",
          "This is the raw, built-in way to run a server — real production apps almost always use a framework like Express on top of it (covered in a later level) for routing, middleware, and convenience, rather than writing every route's logic inside one giant createServer callback.",
        ],
        example: 'const http = require("http");\nhttp.createServer((req, res) => {\n  res.end("OK");\n}).listen(8080);',
      },
    },
    {
      id: 5,
      title: "Async/Await with fs.promises",
      filename: "lesson5.js",
      difficulty: "medium",
      objective: "Await the promise-based readFile so the function pauses until the read completes",
      preview: ["Buy milk"],
      codeLines: [
        'const fs = require("fs/promises");',
        "",
        "async function loadNotes() {",
        '  const contents = {{zone1}} fs.readFile("notes.txt", "utf8");',
        "  console.log(contents);",
        "}",
        "",
        "loadNotes();",
      ],
      zones: [{ id: "zone1", answer: "await" }],
      blocks: [
        { id: "b1", code: "await" },
        { id: "b2", code: "async" },
        { id: "b3", code: "yield" },
        { id: "b4", code: "return" },
      ],
      wormIntro:
        "fs.readFile from fs/promises returns a Promise, not the file contents directly. Which keyword pauses the function until that promise resolves, giving you the real value?",
      wormCorrectAll:
        "await is exactly it! It pauses loadNotes right at that line — without blocking the rest of Node like readFileSync would — and resumes with the resolved value once the read actually finishes. That's why loadNotes itself needs the async keyword. 🔄",
      concept: {
        summary: "fs/promises (unlike plain fs) returns real Promises, so await can pause an async function until an operation finishes — without blocking the rest of Node.",
        details: [
          "require(\"fs/promises\") is a separate, Promise-based version of the same fs API — fs.readFile from plain require(\"fs\") uses an older callback style instead ((err, data) => ...), not a Promise, so await won't work directly on it.",
          "await can only be used inside a function marked async — trying to use it at the top level of a regular function is a syntax error. async function loadNotes() {} marks this function as one that can pause internally.",
          "Unlike fs.readFileSync, awaiting fs.readFile doesn't block Node's single thread while waiting — other requests or timers can still run during that wait, which is exactly why the async/Promise-based APIs are preferred for a real, concurrent server.",
        ],
        example: 'async function main() {\n  const data = await fs.readFile("config.json", "utf8");\n  console.log(JSON.parse(data));\n}',
      },
    },
    {
      id: 6,
      title: "Basic Express Routing",
      filename: "lesson6.js",
      difficulty: "hard",
      objective: "Register a GET route for /users using Express's routing method",
      preview: ["[\"Ada\", \"Bo\"]"],
      codeLines: [
        'const express = require("express");',
        "const app = express();",
        "",
        'app.{{zone1}}("/users", (req, res) => {',
        '  res.json(["Ada", "Bo"]);',
        "});",
        "",
        "app.listen(3000);",
      ],
      zones: [{ id: "zone1", answer: "get" }],
      blocks: [
        { id: "b1", code: "get" },
        { id: "b2", code: "post" },
        { id: "b3", code: "route" },
        { id: "b4", code: "listen" },
      ],
      wormIntro:
        "Express is the near-universal framework for building Node servers — it replaces one giant createServer callback with a method per HTTP verb, per path. Which method registers a handler for a GET request?",
      wormCorrectAll:
        "app.get() is right! Express gives you one method per HTTP verb — get, post, put, delete — each taking a path and a handler. res.json() automatically sets the right content-type header and serializes the value, no manual JSON.stringify needed. 🚀",
      concept: {
        summary: "Express maps HTTP methods and URL paths to handler functions directly, instead of one big if/else chain inside a single createServer callback.",
        details: [
          "app.get(path, handler) only runs for GET requests to that exact path; app.post(\"/users\", ...) would be a completely separate handler for POST requests to the same path — Express dispatches based on both the method and the path together.",
          "res.json(data) is Express's convenience method that sets the Content-Type: application/json header and calls JSON.stringify for you — the plain Node http module has no equivalent; you'd write both of those steps by hand.",
          "Route paths can include parameters: app.get(\"/users/:id\", (req, res) => { ... req.params.id ... }) — a common next step once static paths like /users aren't enough.",
        ],
        example: 'app.post("/users", (req, res) => {\n  res.status(201).json({ created: true });\n});',
      },
    },
  ],
};
