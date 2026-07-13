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
    },
  ],
};
