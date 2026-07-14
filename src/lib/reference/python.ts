import type { TrackReference } from "./types";

export const pythonReference: TrackReference = {
  trackId: "python",
  sections: [
    {
      id: "variables",
      title: "Variables & Data Types",
      body: [
        'Python variables need no declaration keyword — just assign a value: name = "Ada". Unlike JavaScript\'s let/const, there\'s no way to lock a Python variable from reassignment at the language level (though naming a constant ALL_CAPS is a common convention signaling "please don\'t reassign this").',
        "Every value has a type, though Python infers it rather than requiring you to state it: str (text), int (whole numbers), float (decimals), bool (True/False, capitalized unlike JS), and None (Python's version of \"no value\", equivalent to JS's null). Collections — list, tuple, dict, set — are covered in their own sections.",
        "The type() function returns a value's type, handy for debugging: type(42) is <class 'int'>. Python variable names conventionally use snake_case (count_of_items), not JavaScript's camelCase (countOfItems).",
      ],
      examples: [
        { title: "Assigning variables", code: 'name = "Ada"\nage = 30\nage = "thirty"  # legal -- Python is dynamically typed' },
        { title: "Checking a type", code: "type(42)      # <class 'int'>\ntype(\"hi\")    # <class 'str'>\ntype(True)    # <class 'bool'>" },
      ],
      tip: "Python has no true constants — ALL_CAPS names like MAX_SIZE = 100 are a naming convention only, not enforced by the language. Reassigning one won't raise an error, unlike JavaScript's const.",
    },
    {
      id: "operators",
      title: "Operators",
      body: [
        "Arithmetic operators (+ - * /) work as expected, plus two Python-specific ones: // (floor division, rounds down to the nearest whole number) and ** (exponentiation, 2 ** 3 is 8). Regular division / always returns a float in Python 3, even 4 / 2 gives 2.0.",
        'Comparison operators (== != > < >= <=) compare values directly — Python has no separate strict-equality operator like JavaScript\'s ===, because == doesn\'t silently convert types the way JavaScript\'s does: "5" == 5 is False in Python, already the "safe" behavior by default.',
        "Logical operators are spelled-out words, not symbols: and, or, and not instead of &&, ||, and !. Like JavaScript, and and or short-circuit — they stop evaluating as soon as the result is known.",
      ],
      examples: [
        { title: "Floor division vs. regular division", code: "7 / 2    # 3.5\n7 // 2   # 3\n2 ** 3   # 8" },
        { title: "No type coercion in comparisons", code: '"5" == 5   # False -- different types, no conversion' },
      ],
      tip: "// rounds toward negative infinity, not just \"drops the decimal\" — -7 // 2 is -4, not -3. Use int() to truncate toward zero instead if that's what you actually want.",
    },
    {
      id: "functions",
      title: "Functions",
      body: [
        "A function is defined with def, and everything indented underneath its colon is the function body — Python uses indentation instead of curly braces to mark blocks, so consistent indentation isn't just style, it's required syntax.",
        'Parameters can have default values (def greet(name="friend")), just like JavaScript. *args collects any number of extra positional arguments into a tuple, and **kwargs collects extra keyword arguments into a dict — together they\'re Python\'s equivalent of JavaScript\'s rest parameter.',
        "A function with no return statement returns None automatically, same as JavaScript implicitly returning undefined. return immediately exits the function, same as JS.",
      ],
      examples: [
        { title: "A function with a default parameter", code: 'def greet(name="friend"):\n    return f"Hello, {name}!"' },
        { title: "Collecting extra arguments", code: "def total(*nums):\n    return sum(nums)\n\ntotal(1, 2, 3)  # 6" },
      ],
      tip: "Mutable default arguments (like def f(items=[])) are a classic Python gotcha — the same list gets reused across every call that doesn't pass its own, so mutations pile up unexpectedly. Use None as the default and create the list inside the function instead.",
    },
    {
      id: "lists",
      title: "Lists",
      body: [
        'A list is an ordered, mutable collection, created with square brackets: fruits = ["apple", "banana"]. Items are accessed by zero-based index — fruits[0] is "apple" — and len(fruits) gives the current item count (Python\'s equivalent of JavaScript\'s .length property, but as a function, not a property).',
        "Slicing pulls out a sub-list with fruits[start:end] — the start index is included, the end index is not, matching JavaScript's .slice(). Negative indexes count from the end: fruits[-1] is the last item.",
        "append() adds an item to the end (like JS's push), and pop() removes and returns the last item — both mutate the list in place, the same trade-off as JavaScript's mutating array methods.",
      ],
      examples: [
        { title: "Basic list operations", code: 'fruits = ["apple", "banana"]\nfruits.append("cherry")\nlen(fruits)  # 3' },
        { title: "Slicing and negative indexing", code: 'fruits[0:2]   # ["apple", "banana"]\nfruits[-1]    # "cherry"' },
      ],
      tip: "Slicing always returns a new list, never a reference into the original — fruits[:] is actually a common, quick way to make a full copy of a list.",
    },
    {
      id: "list-comprehensions",
      title: "List Comprehensions",
      body: [
        'A list comprehension builds a new list in one line: [n * 2 for n in nums] reads almost like English — "for each n in nums, put n * 2 in the new list." It\'s Python\'s equivalent of JavaScript\'s .map(), condensed into its own syntax rather than a method call.',
        "Add a condition at the end to filter while building: [n for n in nums if n > 2] only keeps items where the condition is true — no separate .filter() call needed, both steps happen in the same expression.",
        "Comprehensions aren't limited to lists — the same syntax with {} instead of [] builds a dict or set comprehension. For truly complex transformation logic, a regular for loop with .append() is sometimes clearer; comprehensions shine for straightforward transform-and-filter cases.",
      ],
      examples: [
        { title: "Transform and filter together", code: "nums = [1, 2, 3, 4, 5]\neven_doubled = [n * 2 for n in nums if n % 2 == 0]\n# [4, 8]" },
        { title: "A dict comprehension", code: "squares = {n: n * n for n in range(4)}\n# {0: 0, 1: 1, 2: 4, 3: 9}" },
      ],
      tip: "sum(), max(), min(), and sorted() are built-in functions that work directly on any list — you rarely need a comprehension just to total or sort a list; save comprehensions for when you're actually transforming each item.",
    },
    {
      id: "dictionaries",
      title: "Dictionaries",
      body: [
        'A dictionary groups related data as key-value pairs: user = {"name": "Ada", "age": 30} — Python\'s equivalent of a JavaScript object, though dictionary keys are far more commonly written as explicit strings in quotes rather than bare identifiers.',
        'Values are read with square-bracket key access: user["name"] — Python has no dot-notation shortcut like JavaScript\'s user.name for dictionaries specifically (dot notation is reserved for actual object attributes and methods).',
        ".keys(), .values(), and .items() return the dictionary's keys, values, or (key, value) pairs respectively — .items() is what you loop over to get both at once, Python's equivalent of JavaScript's Object.entries().",
      ],
      examples: [
        { title: "Reading and looping", code: 'user = {"name": "Ada", "age": 30}\nfor key, value in user.items():\n    print(key, value)' },
        { title: "Safe access with a default", code: 'user.get("email", "no email set")' },
      ],
      tip: 'Accessing a missing key with user["email"] raises a KeyError and crashes — use .get("email", default) instead when a key might not exist, it returns the default instead of raising.',
    },
    {
      id: "conditionals",
      title: "Conditionals",
      body: [
        'if, elif, and else branch on a condition, the same three-way structure as JavaScript\'s if/else if/else — just spelled elif instead of "else if", and using a colon + indentation instead of curly braces.',
        'Python has its own set of "falsy" values that act as False in a condition: 0, 0.0, "" (empty string), [] (empty list), {} (empty dict), and None. Every other value is truthy — including the string "False", which is a common beginner trap since it\'s a non-empty string.',
        "A conditional expression (Python's ternary) reads as value_if_true if condition else value_if_false — the condition sits in the middle, unlike JavaScript's condition ? a : b.",
      ],
      examples: [
        { title: "elif chain", code: 'if age >= 18:\n    status = "adult"\nelif age >= 13:\n    status = "teen"\nelse:\n    status = "child"' },
        { title: "Conditional expression", code: 'label = "adult" if age >= 18 else "minor"' },
      ],
      tip: "Chained comparisons work directly in Python: 0 <= age <= 17 is valid and means what it looks like — no need to write age >= 0 and age <= 17 like you would in JavaScript.",
    },
    {
      id: "loops",
      title: "Loops",
      body: [
        "Python's for loop iterates directly over an iterable's items — for fruit in fruits: — rather than JavaScript's classic index-counting for (let i = 0; ...) loop. Use range(n) when you specifically need a sequence of numbers: for i in range(5) counts 0 through 4.",
        "enumerate() gives you both the index and the value while looping, when you need both: for i, fruit in enumerate(fruits) — Python's cleaner alternative to manually tracking an index counter.",
        "while loops work like JavaScript's — looping as long as a condition holds. break exits a loop immediately and continue skips to the next iteration, both spelled the same as in JavaScript.",
      ],
      examples: [
        { title: "Looping with and without an index", code: "for fruit in fruits:\n    print(fruit)\n\nfor i, fruit in enumerate(fruits):\n    print(i, fruit)" },
        { title: "range() for a numeric loop", code: "for i in range(5):\n    print(i)  # 0 1 2 3 4" },
      ],
      tip: "range(5) stops before 5, just like array indexes and JavaScript's classic for (let i = 0; i < 5; i++) loop — it produces exactly 5 values (0-4), not 5 inclusive.",
    },
    {
      id: "strings",
      title: "Strings & f-strings",
      body: [
        "Strings can use single or double quotes interchangeably in Python — unlike JavaScript, where single/double quotes are equivalent but backticks specifically enable template literals. Python's equivalent of a template literal is an f-string: prefix the string with f and embed expressions in curly braces.",
        'f-strings (f"Hello, {name}!") evaluate any expression inside the braces, not just variable names — f"{price * 1.1:.2f}" formats a computed value to two decimal places in the same breath.',
        'Common string methods: .upper()/.lower() change case, .strip() removes surrounding whitespace, .split(",") breaks a string into a list, and ",".join(list) does the reverse — gluing a list of strings back together with a separator.',
      ],
      examples: [
        { title: "f-string interpolation", code: 'name = "Ada"\nprint(f"Hello, {name}!")' },
        { title: "Splitting and joining", code: '"a,b,c".split(",")   # ["a", "b", "c"]\n"-".join(["a", "b"]) # "a-b"' },
      ],
      tip: "f-strings were added in Python 3.6 — older code often uses .format() or % formatting instead; you'll see all three in the wild, but f-strings are the modern default for new code.",
    },
    {
      id: "unpacking",
      title: "Tuples & Unpacking",
      body: [
        "A tuple is an ordered, immutable collection — written with parentheses (though the parentheses are often optional): point = (3, 4). \"Immutable\" means once created, a tuple's items can't be reassigned, unlike a list.",
        "Unpacking assigns multiple variables from a tuple or list in one line: x, y = point — Python's equivalent of JavaScript's array destructuring (const [x, y] = point), and it works the same way for swapping two variables without a temp: a, b = b, a.",
        "A * before a name during unpacking collects any remaining items into a list: first, *rest = [1, 2, 3, 4] gives first = 1 and rest = [2, 3, 4] — the same idea as JavaScript's rest-in-destructuring ([first, ...rest]).",
      ],
      examples: [
        { title: "Basic unpacking", code: "point = (3, 4)\nx, y = point\nprint(x, y)  # 3 4" },
        { title: "Swapping without a temp variable", code: "a, b = 1, 2\na, b = b, a\nprint(a, b)  # 2 1" },
      ],
      tip: "A one-item tuple needs a trailing comma to actually be a tuple: (1) is just the number 1 in parentheses, but (1,) is a real one-item tuple — an easy typo to make.",
    },
    {
      id: "errors",
      title: "Error Handling",
      body: [
        "try/except lets you run code that might fail without crashing the whole program — Python's equivalent of JavaScript's try/catch, just spelled except instead of catch. Code that raises inside the try block jumps straight to except, where you get the exception object.",
        'raise ValueError("message") creates and immediately raises an exception — Python\'s equivalent of JavaScript\'s throw new Error("message"). Python has many specific built-in exception types (ValueError, TypeError, KeyError, and more) rather than one generic Error, so except can target a specific kind of failure.',
        "finally runs a block of cleanup code whether or not an exception occurred, same as JavaScript — commonly used to close a file or release a resource no matter how the try block turned out.",
      ],
      examples: [
        { title: "Basic try/except", code: 'try:\n    int("not a number")\nexcept ValueError as err:\n    print(err)' },
        { title: "Raising a specific exception", code: 'if age < 0:\n    raise ValueError("age cannot be negative")' },
      ],
      tip: "A bare except: (with no exception type) catches everything, including errors you didn't anticipate and genuinely want to crash loudly — always name the specific exception type you're expecting to catch instead.",
    },
    {
      id: "scope",
      title: "Scope",
      body: [
        "A variable created inside a function is local to that function — it doesn't exist outside it, the same rule as JavaScript. Python looks up a name using the LEGB rule: Local scope first, then Enclosing (an outer function), then Global (module-level), then Built-in.",
        "Unlike JavaScript, assigning to a variable inside a function always creates a new local variable by default — even if a global variable shares the same name, the function can't modify it without an explicit global keyword declaring the intent first.",
        "A closure is a function that remembers variables from the scope it was created in, even after that outer function has finished running — the same concept as JavaScript closures, just without needing let/const block-scoping to make it work cleanly.",
      ],
      examples: [
        { title: "global is required to modify a global variable", code: "count = 0\ndef increment():\n    global count\n    count += 1" },
        { title: "A closure", code: "def make_counter():\n    count = 0\n    def increment():\n        nonlocal count\n        count += 1\n        return count\n    return increment" },
      ],
      tip: "nonlocal is global's counterpart for closures — it lets an inner function modify a variable from its immediately enclosing function (not the true global scope), which global can't reach.",
    },
  ],
};
