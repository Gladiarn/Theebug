import type { TrackReference } from "./types";

export const nodejsReference: TrackReference = {
  trackId: "nodejs",
  sections: [
    {
      id: "what-is-nodejs",
      title: "What Is Node.js?",
      body: [
        "Node.js is a runtime that runs JavaScript outside a browser — on a server, in a script, or as a CLI tool. It's the same JavaScript language you already know; what's different is the environment: no window, no document, no DOM, but real access to the file system, network, and operating system that a browser deliberately hides from web pages for security.",
        "Node runs on Chrome's V8 engine (the same one powering the Chrome browser) plus a set of built-in modules (fs, http, path, and more) that expose that server-level access. A .js file run with node app.js executes top to bottom, same as any JavaScript file, just with a different set of APIs available.",
        "Node is fundamentally single-threaded but handles many operations concurrently through an event loop — long-running work like reading a file or a network request doesn't block other code from running meanwhile, as long as it's written using Node's async APIs rather than their blocking/Sync counterparts.",
      ],
      examples: [{ title: "A minimal Node script", code: 'console.log("Running in Node, not a browser!");\nconsole.log(process.version);' }],
      tip: "Running a file is just node filename.js from a terminal — there's no build step or bundler required for a plain Node script to run, unlike a browser-targeted app that usually needs one.",
    },
    {
      id: "commonjs-modules",
      title: "CommonJS Modules",
      body: [
        "Every Node file is its own module — private by default, nothing inside it is visible elsewhere unless explicitly exported. module.exports is a special object every file gets automatically; whatever you assign to it is exactly what another file receives when it require()s this one.",
        "require(\"./utils\") (a path starting with ./ or ../) loads your own file; require(\"path\") or require(\"express\") (a bare name) loads either a Node built-in or an installed npm package — Node checks built-ins first, then node_modules.",
        "Exporting more than one thing is done by assigning an object: module.exports = { add, subtract } — the file requiring it then destructures whichever named exports it actually needs: const { add } = require(\"./math\").",
      ],
      examples: [
        { title: "Exporting from one file", code: "function add(a, b) {\n  return a + b;\n}\nmodule.exports = { add };" },
        { title: "Requiring it from another file", code: 'const { add } = require("./math");\nconsole.log(add(2, 3)); // 5' },
      ],
      tip: "ES modules (import/export) are also supported in modern Node, but need opting in — a \"type\": \"module\" field in package.json, or a .mjs file extension. require()/module.exports (CommonJS) remains the default and by far the more common style in existing Node code.",
    },
    {
      id: "npm-and-package-json",
      title: "npm & package.json",
      body: [
        "package.json describes a Node project: its name, version, the scripts it defines (npm run dev, npm test), and its dependencies — other packages the project needs installed to run. npm init creates a starter one; npm install <package> adds a new dependency and records it there automatically.",
        "Installed packages live in a node_modules folder, which is regenerated from package.json (npm install with no arguments reads the file and installs everything listed) rather than being committed to version control — it's routinely excluded via .gitignore.",
        "dependencies are needed at runtime (the app won't work without them); devDependencies (npm install --save-dev) are only needed during development — a test runner or a linter, for instance — and aren't required just to run the finished app.",
      ],
      examples: [
        {
          title: "A minimal package.json",
          code: '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "scripts": { "start": "node index.js" },\n  "dependencies": { "express": "^4.18.0" }\n}',
        },
      ],
      tip: "The ^ in a version number (^4.18.0) means \"this version or any newer compatible one\" — npm can install a slightly newer patch/minor version automatically, which is normal and usually desired, not a typo.",
    },
    {
      id: "filesystem",
      title: "The File System (fs)",
      body: [
        "The built-in fs module reads and writes files. fs.readFileSync(path, \"utf8\") reads a whole file synchronously and returns it as a string — without the encoding argument, it returns a raw Buffer of bytes instead of readable text.",
        '"Sync" in a function name is a real warning: fs.readFileSync blocks Node\'s single thread entirely until the read finishes. That\'s fine for a one-off script or reading startup config, but a real server handling multiple requests should use the async version instead — fs.readFile with a callback, or fs.promises.readFile with await.',
        "fs.readFileSync throws if the file doesn't exist rather than returning null — wrapping a read in try/catch is the standard way to handle a missing file without crashing the whole process.",
      ],
      examples: [
        { title: "Reading a file synchronously", code: 'const fs = require("fs");\nconst text = fs.readFileSync("notes.txt", "utf8");' },
        { title: "Handling a missing file", code: 'try {\n  fs.readFileSync("missing.txt", "utf8");\n} catch (err) {\n  console.log("File not found");\n}' },
      ],
      tip: "fs.writeFileSync(path, data) is the equally common counterpart for writing a file — like readFileSync, it overwrites the entire file rather than appending, unless you specifically pass the { flag: \"a\" } option.",
    },
    {
      id: "async-promises",
      title: "Async/Await with Promises",
      body: [
        "fs/promises (require(\"fs/promises\")) is a Promise-based version of the same fs API — await pauses an async function until the Promise resolves, without blocking the rest of Node the way the Sync functions do. Other requests or timers can still run during that wait.",
        "await can only be used inside a function declared async — using it at the top level of a regular function is a syntax error. Modern Node (recent versions) does also support top-level await in ES modules specifically, an exception to that rule.",
        "The older, callback-based fs API (fs.readFile(path, (err, data) => {...})) still exists and works fine, but doesn't return a Promise — await won't work on it directly without wrapping it (Node's util.promisify can convert an old callback-style function into a Promise-returning one).",
      ],
      examples: [
        { title: "Awaiting a file read", code: 'const fs = require("fs/promises");\n\nasync function main() {\n  const data = await fs.readFile("config.json", "utf8");\n  console.log(JSON.parse(data));\n}' },
        { title: "Running two reads concurrently", code: "const [a, b] = await Promise.all([\n  fs.readFile(\"a.txt\", \"utf8\"),\n  fs.readFile(\"b.txt\", \"utf8\"),\n]);" },
      ],
      tip: "Awaiting several independent operations one after another in sequence (await a(); await b();) is a common performance miss when they don't actually depend on each other — Promise.all([a(), b()]) runs both concurrently instead, finishing in whichever takes longer, not the sum of both.",
    },
    {
      id: "http-module",
      title: "The http Module",
      body: [
        "http.createServer((req, res) => {...}) builds a raw HTTP server — the callback runs once per incoming request. req describes what came in (method, URL, headers); res is how a response gets built and sent back. Nothing reaches the client until something is called on res.",
        "server.listen(port) is what actually starts accepting connections — createServer alone only constructs the server object in memory, bound to nothing yet. The optional callback to listen() fires once the port is genuinely ready.",
        "res.end() sends the response and marks it complete — calling it a second time for the same request throws, since an already-finished response can't be sent again. This raw http module is what frameworks like Express (next section) are themselves built on top of.",
      ],
      examples: [
        {
          title: "A minimal raw HTTP server",
          code: 'const http = require("http");\n\nhttp.createServer((req, res) => {\n  res.end("Hello from Node!");\n}).listen(3000, () => {\n  console.log("Listening on port 3000");\n});',
        },
      ],
      tip: "Real production servers almost never use the raw http module directly for routing logic — a framework like Express handles routing, middleware, and body parsing on top of it, which is exactly why it exists.",
    },
    {
      id: "express-basics",
      title: "Express Basics",
      body: [
        "Express is the near-universal framework for building Node servers — it replaces one big createServer callback with a method per HTTP verb, per path: app.get(\"/users\", handler), app.post(\"/users\", handler), and so on. Express dispatches based on the method and path together, not just the path alone.",
        "res.json(data) is Express's convenience method — it sets the Content-Type: application/json header and serializes the value for you, something the plain http module has no equivalent for (you'd set the header and call JSON.stringify manually).",
        "Route paths can include named parameters: app.get(\"/users/:id\", (req, res) => { const id = req.params.id; ... }) — a common next step once a static path like /users isn't specific enough.",
      ],
      examples: [
        { title: "A GET route returning JSON", code: 'app.get("/users", (req, res) => {\n  res.json(["Ada", "Bo"]);\n});' },
        { title: "A route with a URL parameter", code: 'app.get("/users/:id", (req, res) => {\n  res.json({ id: req.params.id });\n});' },
      ],
      tip: "app.use(express.json()) is the standard middleware that parses an incoming JSON request body into req.body — without it, req.body is undefined even on a POST request that clearly sent JSON.",
    },
    {
      id: "environment-variables",
      title: "Environment Variables",
      body: [
        "process.env is an object exposing environment variables — settings passed in from outside the code itself, like PORT, DATABASE_URL, or an API key. process.env.PORT reads whatever value was set in the environment the process was started in.",
        "Environment variables are how real apps keep secrets (API keys, database credentials) out of the source code — a value in process.env is set on the hosting platform (or a local .env file, loaded by a package like dotenv) rather than hardcoded and committed to version control.",
        "Every value read from process.env is a string, even if it looks numeric — process.env.PORT is \"3000\", not the number 3000, so comparing or using it arithmetically without converting first (Number(process.env.PORT)) can produce a subtle bug.",
      ],
      examples: [
        { title: "Reading a port with a fallback", code: "const port = process.env.PORT || 3000;\napp.listen(port);" },
        { title: "Converting a string env var to a real number", code: 'const port = Number(process.env.PORT) || 3000;' },
      ],
      tip: "Never commit a real .env file containing actual secrets to version control — it's standard practice to .gitignore it and commit only a .env.example with placeholder values, so real credentials never end up in git history.",
    },
    {
      id: "npm-scripts",
      title: "npm Scripts",
      body: [
        'The "scripts" field in package.json defines named shortcuts run with npm run <name> — npm run dev, npm test (a special case that doesn\'t need "run"), npm start. They\'re just shell commands with a memorable name, nothing more magical than that.',
        '"start" and "test" are the two script names npm treats specially — npm start (no "run" needed) and npm test both work without the "run" keyword, purely by convention; every other script name needs the full npm run <name>.',
        "Scripts can call other locally-installed command-line tools directly by name (npm run lint might just run eslint .) without needing a global install or a full path — npm automatically adds node_modules/.bin to the path while a script runs.",
      ],
      examples: [
        { title: "Common script definitions", code: '{\n  "scripts": {\n    "start": "node index.js",\n    "dev": "nodemon index.js",\n    "test": "vitest"\n  }\n}' },
      ],
      tip: "nodemon (a popular dev dependency) automatically restarts the server whenever a file changes — plain node index.js does not, so without it every code change needs a manual stop-and-restart during development.",
    },
    {
      id: "error-handling",
      title: "Error Handling in Async Code",
      body: [
        "try/catch around an await catches a rejected Promise the same way it catches a thrown error in synchronous code — a failed fs.readFile or a failed network request inside an async function is caught exactly like any other exception, as long as it's awaited inside the try block.",
        "An uncaught error inside an Express route handler, if not passed to Express's error-handling mechanism, can crash the entire server process for every user, not just the one request that failed — wrapping async route handler bodies in try/catch (or a small wrapper utility that does it automatically) is standard practice, not optional polish.",
        "process.on(\"uncaughtException\", ...) exists as a last-resort safety net for truly unexpected errors, but relying on it as the primary error-handling strategy is considered bad practice — by the time it fires, the process may already be in an inconsistent state; real error handling belongs at the specific try/catch or .catch() closest to where the error can actually occur.",
      ],
      examples: [
        {
          title: "Catching a rejected promise in an async route",
          code: 'app.get("/users", async (req, res) => {\n  try {\n    const users = await db.getUsers();\n    res.json(users);\n  } catch (err) {\n    res.status(500).json({ error: "Something went wrong" });\n  }\n});',
        },
      ],
      tip: "A route handler that never sends a response when an error occurs (no catch, no res.status(500)...) leaves the client's request hanging forever, waiting for a reply that's never coming — always make sure every code path, including the error path, eventually calls something on res.",
    },
  ],
};
