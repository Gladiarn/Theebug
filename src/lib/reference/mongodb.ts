import type { TrackReference } from "./types";

export const mongodbReference: TrackReference = {
  trackId: "mongodb",
  sections: [
    {
      id: "documents-and-collections",
      title: "Documents & Collections",
      body: [
        "MongoDB is a document database — instead of rows in a fixed-schema table, each record is a document: a flexible, JSON-like object. { name: \"Ada\", age: 30 } is a complete, valid document on its own, no separate table definition required before you can store it.",
        "Documents are grouped into collections (roughly analogous to a SQL table), and collections live inside a database. A single MongoDB server can host many databases, each with many collections, each holding many documents.",
        "Documents in the same collection don't need identical fields — one user document could have a phone field while another doesn't. Real applications usually keep a consistent shape by convention and application-level validation, not because MongoDB itself enforces one.",
      ],
      examples: [{ title: "A document is just a JS object", code: '{ name: "Ada", age: 30, roles: ["admin"] }' }],
      tip: "Every document gets a unique _id field automatically if you don't supply one yourself — MongoDB generates it (an ObjectId) at insert time, and it's how a specific document gets looked up, updated, or deleted afterward.",
    },
    {
      id: "inserting",
      title: "Inserting Documents",
      body: [
        "insertOne(doc) adds exactly one new document and returns { acknowledged, insertedId } — insertedId is the auto-generated (or your own, if supplied) unique identifier for that new document.",
        "insertMany([doc1, doc2, ...]) adds several documents in a single call — more efficient than looping and calling insertOne repeatedly when you already have all the data ready at once, since it's one round-trip to the database instead of many.",
        "Neither insert method requires declaring a schema up front — the very first document ever inserted into a brand-new collection can simply be inserted, and the collection is created implicitly at that point if it didn't already exist.",
      ],
      examples: [
        { title: "Inserting one document", code: 'const result = await users.insertOne({ name: "Ada", age: 30 });\nconsole.log(result.insertedId);' },
        { title: "Inserting several at once", code: 'await users.insertMany([\n  { name: "Ada" },\n  { name: "Bo" },\n]);' },
      ],
      tip: "insertOne/insertMany throw if a document violates a unique index (e.g. inserting a duplicate email when one is marked unique) — wrapping an insert in try/catch is worth doing wherever uniqueness actually matters.",
    },
    {
      id: "finding",
      title: "Finding Documents",
      body: [
        "findOne(filter) returns a single matching document directly (or null if nothing matches) — ready to use immediately, no extra step needed. An empty filter, {}, matches the first document in the collection with no real filtering at all.",
        "find(filter) returns a Cursor, not documents directly — the actual query only really executes once you call .toArray() (or otherwise iterate the cursor), at which point you get a real array of every matching document.",
        "A filter with multiple fields is an implicit AND: { name: \"Ada\", age: 30 } matches only a document where both fields match — combining conditions on different fields doesn't need an explicit $and unless you're combining several conditions on the very same field.",
      ],
      examples: [
        { title: "A single document", code: 'const user = await users.findOne({ name: "Ada" });' },
        { title: "Every matching document", code: 'const admins = await users.find({ role: "admin" }).toArray();' },
      ],
      tip: "findOne returning null (not throwing) for no match is easy to forget — always check the result before reading a property off it, the same defensive habit as checking a possibly-missing object key.",
    },
    {
      id: "query-operators",
      title: "Query Operators",
      body: [
        'Query operators (always prefixed with $) go inside a field\'s filter value to express something beyond an exact match: { age: { $gte: 18 } } means "age is 18 or more," not "age equals the object { $gte: 18 }."',
        "The core comparison operators are $gt (greater than), $gte (greater than or equal), $lt (less than), $lte (less than or equal), and $ne (not equal) — the same comparisons every language has, spelled as operator names instead of symbols.",
        "$in matches if a field's value is any one of a list: { status: { $in: [\"active\", \"pending\"] } }. Multiple operators can combine on one field too: { age: { $gte: 13, $lt: 20 } } expresses an inclusive-exclusive range in a single filter.",
      ],
      examples: [
        { title: "A range filter", code: 'await users.find({ age: { $gte: 18, $lt: 65 } }).toArray();' },
        { title: "Matching one of several values", code: 'await orders.find({ status: { $in: ["shipped", "delivered"] } }).toArray();' },
      ],
      tip: "Forgetting the $ on an operator (writing gte instead of $gte) doesn't error — MongoDB just treats it as a literal field name to match against, silently returning zero results instead of the range you meant to query.",
    },
    {
      id: "updating",
      title: "Updating Documents",
      body: [
        "updateOne(filter, update) takes two separate objects: the filter decides *which* document to change, and the update — almost always wrapped in an operator like $set — decides *what* changes about it.",
        "$set changes only the specific fields listed inside it, leaving every other field on the document untouched: { $set: { age: 31 } } changes just age. Passing a bare object with no operator is invalid in modern MongoDB, specifically to prevent accidentally replacing an entire document's contents.",
        "$inc changes a numeric field relative to its current value rather than requiring you to read it first: { $inc: { age: 1 } } increases age by exactly 1, whatever it currently is — useful for counters and scores without a separate read-then-write round trip.",
      ],
      examples: [
        { title: "Changing one field", code: 'await products.updateOne({ name: "Widget" }, { $set: { price: 12.99 } });' },
        { title: "Incrementing a counter", code: 'await posts.updateOne({ _id: postId }, { $inc: { views: 1 } });' },
      ],
      tip: "updateOne only updates the *first* matching document — updateMany(filter, update) is the equivalent for changing every document that matches, the same one/many naming pattern used throughout the driver's API.",
    },
    {
      id: "deleting",
      title: "Deleting Documents",
      body: [
        "deleteOne(filter) removes the first document matching the filter and returns { deletedCount: 1 } (or 0 if nothing matched). deleteMany(filter) removes every matching document instead — picking the wrong one of these two is a real, common, hard-to-undo mistake.",
        "deleteMany({}) with a genuinely empty filter deletes every document in the collection — a real one-line, immediate, unrecoverable mistake (absent a backup) worth double-checking before ever running, especially against a production database.",
        "A soft-delete pattern (setting a deletedAt or isDeleted field with $set, instead of actually removing the document) is a common alternative when \"deleted\" data still needs to be recoverable or auditable later — a deliberate design choice, not a MongoDB feature by itself.",
      ],
      examples: [
        { title: "Deleting one document", code: 'await users.deleteOne({ name: "Ada" });' },
        { title: "Deleting every match", code: 'await sessions.deleteMany({ expiresAt: { $lt: new Date() } });' },
      ],
      tip: "Before running a deleteMany with a broad filter against real data, running the identical filter through find(filter).toArray() first to see exactly what would be deleted is a cheap, common safety habit.",
    },
    {
      id: "aggregation",
      title: "Aggregation Pipeline",
      body: [
        "An aggregation pipeline processes documents through an ordered series of stages, each stage's output feeding into the next — $match filters documents, $group collapses many documents into one per key, $sort orders the results, and more.",
        '$group requires an _id specifying what to group by: { $group: { _id: "$userId", total: { $sum: "$amount" } } } produces one output document per distinct userId, with total summing amount across every document in that group — the aggregation equivalent of a SQL GROUP BY with SUM().',
        "Stage order matters and affects performance, not just the final shape of the result: a $match placed *before* $group filters documents out early and cheaply (the group stage never even sees them), while a $sort placed *after* $group orders the already-summarized results, not the original raw documents.",
      ],
      examples: [
        { title: "Counting documents per category", code: 'await products.aggregate([\n  { $group: { _id: "$category", count: { $sum: 1 } } },\n]).toArray();' },
        { title: "Filtering before grouping", code: 'await orders.aggregate([\n  { $match: { status: "completed" } },\n  { $group: { _id: "$userId", total: { $sum: "$amount" } } },\n]).toArray();' },
      ],
      tip: "$sum: 1 (a literal 1, not a field reference) is the standard idiom for \"count how many documents are in this group\" — summing the constant 1 once per document is equivalent to counting them.",
    },
    {
      id: "indexes",
      title: "Indexes",
      body: [
        "An index is a data structure that lets MongoDB find matching documents without scanning every single one — the same purpose an index serves in a SQL database. Without an index on a field you query often, MongoDB falls back to a full collection scan for every query on it.",
        "createIndex({ email: 1 }) creates an ascending index on email (1 for ascending, -1 for descending — the direction rarely matters for a single-field index, but matters more for sorting or multi-field indexes). Every collection already has one index automatically, on _id.",
        "A unique index (createIndex({ email: 1 }, { unique: true })) additionally enforces that no two documents can share the same value for that field — inserting a duplicate throws an error instead of silently succeeding.",
      ],
      examples: [
        { title: "Creating a simple index", code: 'await users.createIndex({ email: 1 });' },
        { title: "Enforcing uniqueness", code: 'await users.createIndex({ email: 1 }, { unique: true });' },
      ],
      tip: "Indexes speed up reads but slightly slow down writes (every insert/update also has to update each index) and take up additional storage — worth adding on fields you actually query or sort by often, not preemptively on every field.",
    },
    {
      id: "schema-design",
      title: "Schema Design: Embedding vs. Referencing",
      body: [
        "Without enforced schemas, a real modeling decision still exists: embed related data directly inside a document, or reference it by storing another document's _id and querying separately — MongoDB's equivalent of the \"one big object\" vs. \"a foreign key\" choice.",
        "Embedding (a blog post document containing its comments directly, as an array) is fast to read (one query gets everything) and is the natural fit for data that's always accessed together and doesn't grow unboundedly.",
        "Referencing (storing a userId inside an order document, looking up the user separately, or joining via $lookup in an aggregation) fits data that's shared across many documents, changes independently, or would make an embedding document grow too large or too often.",
      ],
      examples: [
        { title: "Embedding: comments live inside the post", code: '{ title: "Post", comments: [{ text: "Nice!", author: "Bo" }] }' },
        { title: "Referencing: linking by id instead", code: '{ title: "Post", authorId: ObjectId("...") }\n// looked up separately, or joined via $lookup' },
      ],
      tip: "A single MongoDB document has a hard 16MB size limit — an embedded array that could grow without bound (every comment ever posted on a viral post, for instance) is a real, concrete reason to reach for referencing instead, not just a stylistic preference.",
    },
    {
      id: "connecting-from-nodejs",
      title: "Connecting from Node.js",
      body: [
        "The official mongodb npm package provides MongoClient — MongoClient.connect(uri) (or new MongoClient(uri).connect()) opens a connection using a connection string that includes the host, credentials, and options.",
        "A real application typically creates one MongoClient and reuses it for the lifetime of the process, rather than connecting and disconnecting per request — connecting is relatively expensive, and the driver already manages a connection pool internally once connected.",
        "client.db(\"myapp\").collection(\"users\") is how you get a handle to a specific collection to run operations against — db() picks the database, collection() picks the collection within it, both cheap, synchronous calls (no network round-trip) that just return a reference object.",
      ],
      examples: [
        {
          title: "Connecting and getting a collection",
          code: 'const { MongoClient } = require("mongodb");\n\nconst client = new MongoClient(process.env.MONGO_URI);\nawait client.connect();\nconst users = client.db("myapp").collection("users");',
        },
      ],
      tip: "The connection string (often an environment variable like MONGO_URI, never hardcoded in source) contains real credentials — treating it exactly like any other secret (gitignored locally, encrypted on the hosting platform) matters just as much as any API key.",
    },
  ],
};
