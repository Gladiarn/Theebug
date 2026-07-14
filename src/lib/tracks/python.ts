import type { Track } from "./types";

export const pythonTrack: Track = {
  id: "python",
  title: "Python",
  description: "Variables, functions, lists, and conditionals — the fundamentals of Python.",
  color: "#3776ab",
  levels: [
    {
      id: 1,
      title: "Variables",
      filename: "lesson1.py",
      objective: 'Assign values to the variables so the program outputs "Hello World 42"',
      preview: ["Hello World 42"],
      codeLines: [
        "# Variables store data values",
        "message = {{zone1}}",
        "count = {{zone2}}",
        "",
        "print(message, count)",
      ],
      zones: [
        { id: "zone1", answer: '"Hello World"' },
        { id: "zone2", answer: "42" },
      ],
      blocks: [
        { id: "b1", code: '"Hello World"' },
        { id: "b2", code: "42" },
        { id: "b3", code: "True" },
        { id: "b4", code: "None" },
        { id: "b5", code: "[]" },
      ],
      wormIntro:
        "Hi! I'm Debug the worm! 🐛 Drag the correct values into the empty slots to assign the variables. message should be a string, count should be a number!",
      wormCorrectAll: "Amazing! You assigned both variables correctly! Let's move to the next challenge! 🎉",
      concept: {
        summary: "Python variables need no keyword and no declared type — just a name, `=`, and a value.",
        details: [
          "`message = \"Hello World\"` stores text (a string, in quotes); `count = 42` stores a number. No `let` or `var` needed — the `=` sign alone creates the variable.",
          "Python figures out the type from the value itself: strings, numbers, booleans (`True`/`False`, capitalized), and `None` (Python's version of \"nothing\") are all assigned the same way.",
          "Unlike JavaScript, Python cares about indentation, not curly braces, to know what's inside a block — you'll see this matter a lot starting with functions and `if` statements.",
        ],
        example: 'pi = 3.14\nname = "Ada"\nis_ready = True\nprint(name, pi, is_ready)',
      },
    },
    {
      id: 2,
      title: "Functions",
      filename: "lesson2.py",
      objective: 'Complete the "add" function so it returns the sum of a and b (should output 10)',
      preview: ["10"],
      codeLines: ["def add(a, b):", "    return {{zone1}}", "", "result = add(3, 7)", "print(result)  # 10"],
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
        summary: "def defines a function; indentation (not braces) marks what's inside it.",
        details: [
          "`def add(a, b):` starts a function named `add` taking parameters `a` and `b`. Everything indented underneath the colon is the function's body — Python uses that indentation instead of `{ }` to know where the function ends.",
          "`return` sends a value back to whoever called the function and immediately stops it, exactly like JavaScript. A function with no `return` gives back `None` automatically.",
          "Calling `add(3, 7)` doesn't print anything by itself — you have to capture the result (`result = add(3, 7)`) or wrap the call in `print()` to actually see it.",
        ],
        example: 'def multiply(a, b):\n    return a * b\n\nprint(multiply(4, 5))  # 20',
      },
    },
    {
      id: 3,
      title: "List Length",
      filename: "lesson3.py",
      objective: "Use the correct built-in function to loop through all fruits and print each one",
      preview: ["apple", "banana", "cherry"],
      codeLines: [
        'fruits = ["apple", "banana", "cherry"]',
        "",
        "for i in range({{zone1}}(fruits)):",
        "    print(fruits[i])",
      ],
      zones: [{ id: "zone1", answer: "len" }],
      blocks: [
        { id: "b1", code: "len" },
        { id: "b2", code: "size" },
        { id: "b3", code: "count" },
        { id: "b4", code: "total" },
      ],
      wormIntro:
        "Python has a built-in function that tells you how many items are in a list. Which one is it? Drag it in front of the parentheses!",
      wormCorrectAll: "Yes! len(fruits) gives us 3, so the loop runs from 0 to 2 and visits every fruit! 🍎🍌🍒",
      concept: {
        summary: "len() counts the items in a list, string, or other collection.",
        details: [
          "`len(fruits)` returns how many items are in the `fruits` list. `range(len(fruits))` then produces the sequence `0, 1, 2` — exactly the valid index positions — for the loop to walk through.",
          "In real Python, `for fruit in fruits:` (looping directly over the items) is usually cleaner than looping over indexes when you don't actually need the index number. You'll see both patterns; this level teaches the index-based one because it mirrors how loops work in most other languages too.",
          "`len()` isn't just for lists — it works on strings (`len(\"hello\")` is 5) and other collections too, which makes it one of Python's most-used built-ins.",
        ],
        example: 'nums = [10, 20, 30, 40]\nprint(len(nums))  # 4\nfor n in nums:\n    print(n)  # loop directly over items, no index needed',
      },
    },
    {
      id: 4,
      title: "List Comprehensions",
      filename: "lesson4.py",
      objective: "Complete the list comprehension so it doubles every number",
      preview: ["[2, 4, 6, 8, 10]"],
      codeLines: [
        "nums = [1, 2, 3, 4, 5]",
        "doubled = [n {{zone1}} 2 for n in nums]",
        "",
        "print(doubled)",
        "# [2, 4, 6, 8, 10]",
      ],
      zones: [{ id: "zone1", answer: "*" }],
      blocks: [
        { id: "b1", code: "*" },
        { id: "b2", code: "+" },
        { id: "b3", code: "-" },
        { id: "b4", code: "/" },
      ],
      wormIntro:
        "I need to DOUBLE every number in the list! Which operator multiplies a value? Drag it between n and 2! ✖️",
      wormCorrectAll: "Brilliant! n * 2 doubles each element as the list comprehension builds the new list! 🐍✨",
      concept: {
        summary: "A list comprehension builds a new list in one line: `[expression for item in list]`.",
        details: [
          "`[n * 2 for n in nums]` reads almost like English: \"for each `n` in `nums`, put `n * 2` in the new list.\" It's Python's compact equivalent of JavaScript's `.map()`.",
          "You can filter while building by adding a condition at the end, like `[n for n in nums if n > 2]`, which only keeps items where the condition is true — no separate `.filter()` call needed.",
          "Comprehensions are popular in Python because they're often more readable than an equivalent `for` loop with `.append()` calls, but for very complex logic, a plain loop can still be clearer — reach for whichever reads better.",
        ],
        example: 'nums = [1, 2, 3, 4]\nsquares = [n * n for n in nums]\nprint(squares)  # [1, 4, 9, 16]',
      },
    },
    {
      id: 5,
      title: "Conditionals",
      filename: "lesson5.py",
      objective: "Add the right comparison operator to check if age is 18 OR older",
      preview: ['"You can vote!"', '"Too young"'],
      codeLines: [
        "def check_age(age):",
        "    if age {{zone1}} 18:",
        '        return "You can vote!"',
        '    return "Too young"',
        "",
        'print(check_age(20))  # "You can vote!"',
        'print(check_age(15))  # "Too young"',
      ],
      zones: [{ id: "zone1", answer: ">=" }],
      blocks: [
        { id: "b1", code: ">=" },
        { id: "b2", code: "<=" },
        { id: "b3", code: "==" },
        { id: "b4", code: "!=" },
        { id: "b5", code: ">" },
      ],
      wormIntro:
        'The condition should be true when age is 18 OR older! Which comparison operator means "greater than OR equal to"? Not just greater than — equal counts too!',
      wormCorrectAll:
        "You did it! >= means greater than OR equal to, so 18 still passes! You've completed all 5 levels! You're a Python hero! 🏆🎊",
      concept: {
        summary: "Comparison operators (>=, <=, ==, !=) turn a question into True or False, which `if` acts on.",
        details: [
          "`>=` means \"greater than or equal to\" and `<=` means \"less than or equal to\" — both include the boundary value, unlike plain `>` or `<`.",
          "Python uses `==` to check if two values are equal and `!=` to check if they're not — no `===` here, since Python doesn't do the silent type-juggling JavaScript's `==` does, so a plain `==` is already safe.",
          "`if condition:` only runs its indented body when the condition is `True`. A `return` inside it exits the function immediately, so any code after the `if` block is skipped for that case.",
        ],
        example: 'def can_rent(age):\n    if age >= 25:\n        return True\n    return False\n\nprint(can_rent(25))  # True — 25 counts as >= 25',
      },
    },
  ],
};
