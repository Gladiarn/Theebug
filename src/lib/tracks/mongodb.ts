import type { Track } from "./types";

export const mongodbTrack: Track = {
  id: "mongodb",
  title: "MongoDB",
  description: "Documents, queries, updates, and aggregation — the database Theebug itself runs on.",
  color: "#47A248",
  levels: [
    {
      id: 1,
      title: "Inserting a Document",
      filename: "lesson1.js",
      difficulty: "easy",
      objective: "Insert a single new user document into the collection",
      preview: ["ObjectId(...)"],
      codeLines: [
        'const result = await users.{{zone1}}({ name: "Ada", age: 30 });',
        "console.log(result.insertedId);",
      ],
      zones: [{ id: "zone1", answer: "insertOne" }],
      blocks: [
        { id: "b1", code: "insertOne" },
        { id: "b2", code: "insertMany" },
        { id: "b3", code: "insert" },
        { id: "b4", code: "create" },
      ],
      wormIntro:
        "MongoDB stores data as JSON-like documents, not rows in a table. Which method inserts exactly one new document into a collection?",
      wormCorrectAll:
        "insertOne is exactly right! It takes a plain JavaScript object and stores it as a new document, then returns a result object containing the auto-generated insertedId. 📄",
      concept: {
        summary: "MongoDB is a document database — each record is a flexible JSON-like object (a document), grouped into collections instead of rows in a fixed-schema table.",
        details: [
          "insertOne(doc) adds exactly one document and returns { acknowledged, insertedId } — insertedId is a unique identifier MongoDB generates automatically unless you supply your own _id field.",
          "Unlike a SQL table, documents in the same collection don't need identical fields — one user document could have an age field while another doesn't, though real applications usually keep a consistent shape by convention, not by a strictly enforced schema.",
          "insertMany([doc1, doc2]) is the equivalent for adding several documents in a single call — more efficient than calling insertOne repeatedly in a loop when you already have all the data ready at once.",
        ],
        example: 'const result = await products.insertOne({ name: "Widget", price: 9.99 });\nconsole.log(result.insertedId);',
      },
    },
    {
      id: 2,
      title: "Finding Documents",
      filename: "lesson2.js",
      difficulty: "easy",
      objective: "Find the single user document matching this filter",
      preview: ['{ name: "Ada", age: 30 }'],
      codeLines: ['const user = await users.{{zone1}}({ name: "Ada" });', "console.log(user);"],
      zones: [{ id: "zone1", answer: "findOne" }],
      blocks: [
        { id: "b1", code: "findOne" },
        { id: "b2", code: "find" },
        { id: "b3", code: "get" },
        { id: "b4", code: "select" },
      ],
      wormIntro:
        "findOne and find both search a collection, but they return different shapes. Which one returns a single matching document directly, ready to use right away?",
      wormCorrectAll:
        "findOne is right! It returns the first matching document directly (or null if nothing matches) — find() instead returns a cursor representing *all* matches, which needs .toArray() before you get real documents back. 🔍",
      concept: {
        summary: "findOne returns a single matching document (or null); find returns a cursor over every match, which needs .toArray() to become a real array.",
        details: [
          "{ name: \"Ada\" } is a filter — MongoDB compares each document's name field for an exact match. An empty filter, {}, matches every document in the collection.",
          "findOne returns null (not an error) when nothing matches — always worth checking for before reading a property off the result, the same as handling a missing dictionary key.",
          "find(filter), by contrast, returns a Cursor immediately without querying yet — the actual database round-trip happens when you call .toArray() (or iterate it), which is why find() alone doesn't give you documents directly.",
        ],
        example: 'const allAdmins = await users.find({ role: "admin" }).toArray();\nconsole.log(allAdmins.length);',
      },
    },
    {
      id: 3,
      title: "Query Operators",
      filename: "lesson3.js",
      difficulty: "easy",
      objective: "Find every user whose age is 18 or greater",
      preview: ["[{ name: \"Ada\", age: 30 }]"],
      codeLines: ["const adults = await users.find({ age: { {{zone1}}: 18 } }).toArray();"],
      zones: [{ id: "zone1", answer: "$gte" }],
      blocks: [
        { id: "b1", code: "$gte" },
        { id: "b2", code: "$gt" },
        { id: "b3", code: ">=" },
        { id: "b4", code: "$more" },
      ],
      wormIntro:
        '"18 or greater" needs to include 18 itself, not just ages strictly above it. Which query operator means "greater than or equal to"?',
      wormCorrectAll:
        "$gte is exactly it! Query operators always start with a dollar sign — $gte (greater-or-equal), $gt (strictly greater), $lte, and $lt are the comparison family, used inside a field's filter object instead of a plain value. 📊",
      concept: {
        summary: "Query operators (always prefixed with $) go inside a field's filter to express comparisons and conditions beyond a plain exact match.",
        details: [
          "{ age: 18 } means \"age is exactly 18\"; { age: { $gte: 18 } } means \"age is 18 or more\" — wrapping the value in an operator object changes an exact match into a comparison.",
          "The core comparison operators are $gt (greater than), $gte (greater than or equal), $lt (less than), and $lte (less than or equal) — the same four comparisons every language has, just spelled as MongoDB operator names instead of symbols.",
          "Multiple operators can combine on the same field: { age: { $gte: 18, $lte: 65 } } matches an inclusive range in a single filter, no separate $and needed for this common case.",
        ],
        example: 'const teens = await users.find({ age: { $gte: 13, $lt: 20 } }).toArray();',
      },
    },
    {
      id: 4,
      title: "Updating Documents",
      filename: "lesson4.js",
      difficulty: "medium",
      objective: "Update Ada's age to 31 using the correct update operator",
      preview: ["{ acknowledged: true, modifiedCount: 1 }"],
      codeLines: ['await users.updateOne({ name: "Ada" }, { {{zone1}}: { age: 31 } });'],
      zones: [{ id: "zone1", answer: "$set" }],
      blocks: [
        { id: "b1", code: "$set" },
        { id: "b2", code: "set" },
        { id: "b3", code: "$update" },
        { id: "b4", code: "$replace" },
      ],
      wormIntro:
        "updateOne takes a filter (which document) and an update operator (what to change) — passing a plain object without an operator is actually a MongoDB error. Which operator changes just the fields you list, leaving everything else untouched?",
      wormCorrectAll:
        "$set is exactly right! { $set: { age: 31 } } changes only the age field, leaving every other field on the document exactly as it was. Without $set, MongoDB would try to replace the *entire* document with just { age: 31 } — deleting every other field. 🔧",
      concept: {
        summary: "$set changes only the specific fields you list inside it — the rest of the document is left completely untouched.",
        details: [
          "updateOne(filter, update) takes two separate objects: the filter decides *which* document to change, the update (almost always wrapped in an operator like $set) decides *what* changes about it.",
          "Passing a bare object as the update with no operator ({ age: 31 } instead of { $set: { age: 31 } }) is actually invalid starting in modern MongoDB versions specifically to prevent the common mistake of accidentally wiping out a document's other fields.",
          "$inc is a related, common operator for numeric changes: { $inc: { age: 1 } } increases age by 1 relative to its current value, rather than requiring you to read the current value first and compute the new one yourself.",
        ],
        example: 'await products.updateOne({ name: "Widget" }, { $set: { price: 12.99 } });',
      },
    },
    {
      id: 5,
      title: "Deleting Documents",
      filename: "lesson5.js",
      difficulty: "medium",
      objective: "Delete the single user document matching this filter",
      preview: ["{ acknowledged: true, deletedCount: 1 }"],
      codeLines: ['await users.{{zone1}}({ name: "Ada" });'],
      zones: [{ id: "zone1", answer: "deleteOne" }],
      blocks: [
        { id: "b1", code: "deleteOne" },
        { id: "b2", code: "delete" },
        { id: "b3", code: "remove" },
        { id: "b4", code: "drop" },
      ],
      wormIntro:
        "Deleting a document follows the same one/many naming pattern as inserting. Which method deletes exactly the first document matching this filter?",
      wormCorrectAll:
        "deleteOne is right! It removes the first document matching the filter and returns { deletedCount: 1 } (or 0 if nothing matched) — deleteMany would remove *every* matching document instead, a real and easy mistake to make by picking the wrong one. 🗑️",
      concept: {
        summary: "deleteOne removes the first matching document; deleteMany removes every matching document — picking the wrong one is a real, common, hard-to-undo mistake.",
        details: [
          "deleteOne({ name: \"Ada\" }) stops after removing the first match — if multiple documents happen to share that name, only one is deleted, and which one isn't something you should rely on without a more specific filter.",
          "deleteMany(filter) removes every document matching the filter — deleteMany({}) with an empty filter deletes an *entire collection's* documents, a genuinely dangerous one-line mistake worth double-checking before ever running.",
          "Neither delete method undoes automatically — unlike a soft-delete pattern (marking a document as deleted with a flag instead of actually removing it), a real deleteOne/deleteMany is immediate and permanent unless your database has backups configured.",
        ],
        example: 'await sessions.deleteMany({ expiresAt: { $lt: new Date() } }); // clear expired sessions',
      },
    },
    {
      id: 6,
      title: "Aggregation Pipeline",
      filename: "lesson6.js",
      difficulty: "hard",
      objective: "Sum each user's order amounts using the aggregation pipeline's group operator",
      preview: ["[{ _id: \"ada\", total: 150 }]"],
      codeLines: [
        "const totals = await orders",
        "  .aggregate([",
        '    { $group: { _id: "$userId", total: { {{zone1}}: "$amount" } } },',
        "  ])",
        "  .toArray();",
      ],
      zones: [{ id: "zone1", answer: "$sum" }],
      blocks: [
        { id: "b1", code: "$sum" },
        { id: "b2", code: "$add" },
        { id: "b3", code: "sum" },
        { id: "b4", code: "$total" },
      ],
      wormIntro:
        "An aggregation pipeline processes documents through a series of stages — $group here collapses many order documents down into one total per user. Which operator adds up a field across every document in each group?",
      wormCorrectAll:
        "$sum is exactly right! { total: { $sum: \"$amount\" } } adds up the amount field across every document that landed in the same group (same userId) — this exact pattern is what Theebug's own leaderboard uses to total up scores across tracks! 🏆",
      concept: {
        summary: "The aggregation pipeline processes documents through an ordered series of stages — $match filters, $group collapses many documents into one per key, $sort orders the results — each stage feeding the next.",
        details: [
          "$group requires an _id field specifying what to group by — \"$userId\" (the dollar sign means \"read this field's value\") groups all documents sharing the same userId into one output document per distinct value.",
          "$sum inside a $group stage adds up a field across every document in that group — { total: { $sum: \"$amount\" } } produces one summed total per group, the aggregation equivalent of a SQL GROUP BY with SUM().",
          "Stages run in the array order they're listed — a $match stage placed before $group filters documents out early (cheaper, since $group never even sees them), while a $sort placed after $group orders the already-summarized results, not the original raw documents.",
        ],
        example: 'const byCategory = await products.aggregate([\n  { $group: { _id: "$category", count: { $sum: 1 } } },\n]).toArray();',
      },
    },
  ],
};
