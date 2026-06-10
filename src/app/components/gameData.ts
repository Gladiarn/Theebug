export interface Block {
  id: string;
  code: string;
}

export interface ZoneDef {
  id: string;
  answer: string;
}

export interface Level {
  id: number;
  title: string;
  filename: string;
  objective: string;
  preview: string[];
  codeLines: string[];
  zones: ZoneDef[];
  blocks: Block[];
  wormIntro: string;
  wormCorrectAll: string;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Variables',
    filename: 'lesson1.js',
    objective: 'Assign values to the variables so the program outputs "Hello World 42"',
    preview: ['Hello World 42'],
    codeLines: [
      '// Variables store data values',
      'let message = {{zone1}};',
      'let count = {{zone2}};',
      '',
      'console.log(message, count);',
    ],
    zones: [
      { id: 'zone1', answer: '"Hello World"' },
      { id: 'zone2', answer: '42' },
    ],
    blocks: [
      { id: 'b1', code: '"Hello World"' },
      { id: 'b2', code: '42' },
      { id: 'b3', code: 'true' },
      { id: 'b4', code: 'null' },
      { id: 'b5', code: '[]' },
    ],
    wormIntro: "Hi! I'm Debug the worm! 🐛 Drag the correct values into the empty slots to assign the variables. Message should be a string, count should be a number!",
    wormCorrectAll: "Amazing! You assigned both variables correctly! Let's move to the next challenge! 🎉",
  },
  {
    id: 2,
    title: 'Functions',
    filename: 'lesson2.js',
    objective: 'Complete the "add" function so it returns the sum of a and b (should output 10)',
    preview: ['10'],
    codeLines: [
      'function add(a, b) {',
      '  return {{zone1}};',
      '}',
      '',
      'let result = add(3, 7);',
      'console.log(result); // 10',
    ],
    zones: [
      { id: 'zone1', answer: 'a + b' },
    ],
    blocks: [
      { id: 'b1', code: 'a + b' },
      { id: 'b2', code: 'a - b' },
      { id: 'b3', code: 'a * b' },
      { id: 'b4', code: 'a / b' },
    ],
    wormIntro: "This function should ADD two numbers together! Drag the expression that represents their sum into the return slot. What operation combines two values?",
    wormCorrectAll: "Perfect! a + b adds both parameters together! You're getting it! 🚀",
  },
  {
    id: 3,
    title: 'Array Length',
    filename: 'lesson3.js',
    objective: 'Use the correct array property to loop through all fruits and log each one',
    preview: ['apple', 'banana', 'cherry'],
    codeLines: [
      'const fruits = ["apple", "banana", "cherry"];',
      '',
      'for (let i = 0; i < fruits.{{zone1}}; i++) {',
      '  console.log(fruits[i]);',
      '}',
    ],
    zones: [
      { id: 'zone1', answer: 'length' },
    ],
    blocks: [
      { id: 'b1', code: 'length' },
      { id: 'b2', code: 'size' },
      { id: 'b3', code: 'count' },
      { id: 'b4', code: 'total' },
    ],
    wormIntro: "Arrays have a special property that tells you how many items they contain. Which one is it? Drag it into the slot after the dot!",
    wormCorrectAll: "Yes! .length gives us 3, so the loop runs from 0 to 2 and visits every fruit! 🍎🍌🍒",
  },
  {
    id: 4,
    title: 'Array Methods',
    filename: 'lesson4.js',
    objective: 'Use the right array method to create a new array with each number doubled',
    preview: ['[2, 4, 6, 8, 10]'],
    codeLines: [
      'const nums = [1, 2, 3, 4, 5];',
      'const doubled = nums.{{zone1}}(n => n * 2);',
      '',
      'console.log(doubled);',
      '// [2, 4, 6, 8, 10]',
    ],
    zones: [
      { id: 'zone1', answer: 'map' },
    ],
    blocks: [
      { id: 'b1', code: 'map' },
      { id: 'b2', code: 'filter' },
      { id: 'b3', code: 'reduce' },
      { id: 'b4', code: 'forEach' },
    ],
    wormIntro: "I need to TRANSFORM every number in the array into a new one! Which array method creates a NEW array with each element transformed? Think 🗺️!",
    wormCorrectAll: "Brilliant! .map() transforms each element and returns a brand new array! You're a natural coder! 🗺️✨",
  },
  {
    id: 5,
    title: 'Conditionals',
    filename: 'lesson5.js',
    objective: 'Add the right comparison operator to check if age is 18 OR older',
    preview: ['"You can vote!"', '"Too young"'],
    codeLines: [
      'function checkAge(age) {',
      '  if (age {{zone1}} 18) {',
      '    return "You can vote!";',
      '  }',
      '  return "Too young";',
      '}',
      '',
      'console.log(checkAge(20)); // "You can vote!"',
      'console.log(checkAge(15)); // "Too young"',
    ],
    zones: [
      { id: 'zone1', answer: '>=' },
    ],
    blocks: [
      { id: 'b1', code: '>=' },
      { id: 'b2', code: '<=' },
      { id: 'b3', code: '===' },
      { id: 'b4', code: '!==' },
      { id: 'b5', code: '>' },
    ],
    wormIntro: "The condition should be true when age is 18 OR older! Which comparison operator means \"greater than OR equal to\"? Not just greater than — equal counts too!",
    wormCorrectAll: "You did it! >= means greater than OR equal to, so 18 still passes! You've completed all 5 levels! You're a JavaScript hero! 🏆🎊",
  },
];
