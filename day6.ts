import { readLines } from "./utils.ts";

function getWinningCases(time: number, record: number): number {
  let cases = 0;
  for (let holdTime = 0; holdTime <= time; holdTime++) {
    const distance = holdTime * (time - holdTime);
    if (distance > record) {
      cases++;
    }
  }
  return cases;
}

const lines = readLines("inputs/day6.txt");

const [times, records] = lines.map((line) =>
  line.split(/: +/)[1].split(/ +/).map(Number)
);
let score = 1;
for (let i = 0; i < times.length; i++) {
  const time = times[i];
  const record = records[i];
  const cases = getWinningCases(time, record);
  score *= cases;
}
console.log("Par1: ", score);

const [time, record] = lines.map((line) =>
  parseInt(line.split(/: +/)[1].replaceAll(" ", ""))
);
const cases = getWinningCases(time, record);
console.log("Par2: ", cases);
