import { readLines } from "./utils.ts";

const readings = readLines("inputs/day9.txt")
  .map((line) => line.split(" ").map(Number));

function genDerivatives(reading: Array<number>): Array<Array<number>> {
  const differences = [reading];
  while (differences.at(-1)!.some((x) => x != 0)) {
    const last = differences.at(-1)!;
    const newDifference = [];
    for (let i = 1; i < last.length; ++i) {
      newDifference.push(last[i] - last[i - 1]);
    }
    differences.push(newDifference);
  }
  return differences;
}

const nextReadingSum = readings.map((reading) => {
  const differences = genDerivatives(reading);
  let next = 0;
  for (let i = differences.length - 2; i >= 0; --i) {
    next += differences[i].at(-1)!;
  }
  return next;
}).reduce((a, b) => a + b);
console.log("Part 1:", nextReadingSum);

const previousReadingSum = readings.map((reading) => {
  const differences = genDerivatives(reading);
  let previous = 0;
  for (let i = differences.length - 2; i >= 0; --i) {
    previous = differences[i][0] - previous;
  }
  return previous;
}).reduce((a, b) => a + b);
console.log("Part 2:", previousReadingSum);
