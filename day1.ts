import { readLines } from "./utils.ts";

const lines = readLines("inputs/day1.txt");

let sum = 0;
for (const line of lines) {
  let firstSeen = false;
  let current = "";
  let first = "";
  for (const letter of line) {
    const num = parseInt(letter);
    if (isNaN(num)) {
      continue;
    }
    if (!firstSeen) {
      first = letter;
      firstSeen = true;
    }
    current = letter;
  }
  if (current.length !== 0 && first.length !== 0) {
    sum += parseInt(first + current);
  }
}
console.log("Part 1: ", sum);

class Trie {
  children: Map<string, Trie>;
  word: string | null;

  constructor() {
    this.children = new Map();
    this.word = null;
  }

  add(...words: Array<string>): void {
    for (const word of words) {
      this._add(word, word);
    }
  }

  _add(rest: string, word: string): void {
    if (rest === "") {
      this.word = word;
      return;
    }
    const firstLetter = rest[0];
    const restOfWord = rest.slice(1);
    if (!this.children.has(firstLetter)) {
      this.children.set(firstLetter, new Trie());
    }
    const child = this.children.get(firstLetter)!;
    child._add(restOfWord, word);
  }

  findFirst(word: string): string | null {
    if (this.word != null || word === "") {
      return this.word;
    }
    const firstLetter = word[0];
    const restOfWord = word.slice(1);
    if (!this.children.has(firstLetter)) {
      return null;
    }
    const child = this.children.get(firstLetter)!;
    return child.findFirst(restOfWord);
  }
}

const trie = new Trie();
trie.add("zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine");
trie.add("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");

function writtenDigitToString(digit: string): string {
  switch (digit) {
    case "zero":
      return "0";
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8"
    case "nine":
      return "9";
    default:
      return digit;
  }
}

sum = 0;
for (const line of lines) {
  if (line.length === 0) {
    continue;
  }
  let firstSeen = false;
  let first = "";
  let current = "";
  for (let i = 0; i < line.length; i++) {
    const digit = trie.findFirst(line.substring(i));
    if (digit == null) {
      continue;
    }
    if (!firstSeen) {
      first = writtenDigitToString(digit);
      firstSeen = true;
    }
    current = writtenDigitToString(digit);
  }
    sum += parseInt(first + current);
}
console.log("Part 2: ", sum);
