import { readLines } from "./utils.ts";

const lines = readLines("inputs/day3.txt");

function isNumber(c: string): boolean {
  return c >= "0" && c <= "9";
}

function isSymbol(c: string): boolean {
  return !isNumber(c) && c !== ".";
}

function isSymbolAdjacent(row: number, col: number): boolean {
  if (row > 0) {
    if (col > 0) {
      if (isSymbol(lines[row - 1][col - 1])) {
        return true;
      }
    }
    if (isSymbol(lines[row - 1][col])) {
      return true;
    }
    if (col + 1 < lines[row].length) {
      if (isSymbol(lines[row - 1][col + 1])) {
        return true;
      }
    }
  }
  if (row + 1 < lines.length) {
    if (col > 0) {
      if (isSymbol(lines[row + 1][col - 1])) {
        return true;
      }
    }
    if (isSymbol(lines[row + 1][col])) {
      return true;
    }
    if (col + 1 < lines[row].length) {
      if (isSymbol(lines[row + 1][col + 1])) {
        return true;
      }
    }
  }
  if (col > 0) {
    if (isSymbol(lines[row][col - 1])) {
      return true;
    }
  }
  if (col + 1 < lines[row].length) {
    if (isSymbol(lines[row][col + 1])) {
      return true;
    }
  }
  return false;
}

function parseNumber(row: number, col: number): [number, number] {
  let symbol = false;
  let number = "";
  let current = lines[row][col];
  while (col < lines[row].length && isNumber(current)) {
    number += current;
    symbol ||= isSymbolAdjacent(row, col);
    col++;
    current = lines[row][col];
  }
  const num = symbol ? parseInt(number) : 0;
  return [num, col];
}

let partNumbers = 0;
for (let row = 0; row < lines.length; row++) {
  for (let col = 0; col < lines[row].length; col++) {
    if (isNumber(lines[row][col])) {
      const [num, nextCol] = parseNumber(row, col);
      partNumbers += num;
      col = nextCol;
    }
  }
}
console.log("Part 1: ", partNumbers);

class Pair<L, T> {
  left: L;
  right: T;
  constructor(left: L, right: T) {
    this.left = left;
    this.right = right;
  }
}

function findAdjacents(row: number, col: number): Array<number> {
  const result = [];
  const marked = new Map<number, Map<number, boolean>>();
  for (let rowPtr = row - 1; rowPtr <= row + 1; rowPtr++) {
    for (let colPtr = col - 1; colPtr <= col + 1; colPtr++) {
      if (
        rowPtr < 0 || rowPtr >= lines.length ||
        colPtr < 0 || colPtr >= lines[rowPtr].length
      ) {
        continue;
      }
      if (marked.get(rowPtr)?.get(colPtr) == null && isNumber(lines[rowPtr][colPtr])) {
        let start = colPtr;
        while (start > 0 && isNumber(lines[rowPtr][start - 1])) {
          start--;
        }
        const [num, endCol] = parseNumber(rowPtr, start);
        result.push(num);
        if (!marked.has(rowPtr)) {
          marked.set(rowPtr, new Map());
        }
        const markedRow = marked.get(rowPtr)!;
        for (let c = start; c < endCol; c++) {
          markedRow.set(c, true);
        }
      }
    }
  }
  return result;
}

let gearRatios = 0;
for (let row = 0; row < lines.length; row++) {
  for (let col = 0; col < lines[row].length; col++) {
    if (lines[row][col] === "*") {
      const adjacents = findAdjacents(row, col);
      if (adjacents.length === 2) {
        gearRatios += adjacents[0] * adjacents[1];
      }
    }
  }
}
console.log("Part 2: ", gearRatios);
