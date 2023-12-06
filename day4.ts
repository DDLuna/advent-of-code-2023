import { readLines } from "./utils.ts";

function parseLine(line: string): [Set<number>, Array<number>] {
  const [leftStr, rightStr] = line.split(/ +\| +/);
  const left = leftStr.split(/\: +/)[1].split(/ +/).map((x) => Number(x));
  const right = rightStr.split(/ +/).map((x) => Number(x));
  return [new Set(left), right];
}
const input = readLines("inputs/day4.txt").map(parseLine);

const totalScore = input.map(([winning, numbers]) => {
  let count = 0;
  numbers.forEach((num) => {
    if (winning.has(num)) {
      count++;
    }
  });
  return count > 0 ? Math.pow(2, count - 1) : 0;
})
  .reduce((a, b) => a + b);
console.log("Part 1:", totalScore);

const copies = new Map<number, number>();
input.forEach(([winning, numbers], index) => {
  if (!copies.has(index)) {
    copies.set(index, 1);
  }
  let count = 0;
  numbers.forEach((num) => {
    if (winning.has(num)) {
      count++;
    }
  });
  for (let i = index + 1; i < index + 1 + count; i++) {
    copies.set(i, (copies.get(i) ?? 1) + copies.get(index)!);
  }
});
const result = Array.from(copies.values()).reduce((a, b) => a + b);
console.log("Part 2:", result);
