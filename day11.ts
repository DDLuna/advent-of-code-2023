import { readLines } from "./utils.ts";

const image = readLines("inputs/day11.txt").map((line) => line.split(""));

const emptyRows: Array<number> = [];
const emptyCols: Array<number> = [];
for (let rowIndex = 0; rowIndex < image.length; rowIndex++) {
  const row = image[rowIndex];
  if (row.every((pixel) => pixel === ".")) {
    emptyRows.push(rowIndex);
  }
}
for (let colIndex = 0; colIndex < image[0].length; colIndex++) {
  let emptyCol = true;
  for (let rowIndex = 0; rowIndex < image.length; rowIndex++) {
    if (image[rowIndex][colIndex] !== ".") {
      emptyCol = false;
      break;
    }
  }
  if (emptyCol) {
    emptyCols.push(colIndex);
  }
}

function getStarsPositions(expansionFactor = 1): Array<[number, number]> {
  const starsPositions: Array<[number, number]> = [];
  for (let rowIndex = 0; rowIndex < image.length; rowIndex++) {
    for (let colIndex = 0; colIndex < image[rowIndex].length; colIndex++) {
      if (image[rowIndex][colIndex] === "#") {
        const extraRows = emptyRows.filter((row) => row < rowIndex).length *
          expansionFactor;
        const extraCols = emptyCols.filter((col) => col < colIndex).length *
          expansionFactor;
        starsPositions.push([rowIndex + extraRows, colIndex + extraCols]);
      }
    }
  }
  return starsPositions;
}

function pairDistances(starsPositions: Array<[number, number]>): number {
  let distances = 0;
  for (let i = 0; i < starsPositions.length; i++) {
    for (let j = i + 1; j < starsPositions.length; j++) {
      const [x1, y1] = starsPositions[i];
      const [x2, y2] = starsPositions[j];
      distances += Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
  }
  return distances;
}


let starsPositions = getStarsPositions();
console.log(`Part 1: ${pairDistances(starsPositions)}`);

starsPositions = getStarsPositions(999_999);
console.log(`Part 2: ${pairDistances(starsPositions)}`);
