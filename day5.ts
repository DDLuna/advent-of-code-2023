import { readFile } from "./utils.ts";

class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  intersects(other: Range): boolean {
    return this.start <= other.end && this.start >= other.start ||
      this.end <= other.end && this.end >= other.start ||
      this.start <= other.start && this.end >= other.end;
  }

  merge(other: Range): Range {
    return new Range(Math.min(this.start, other.start),
      Math.max(this.end, other.end));
  }
}

class RangeMap {
  destinationStart: number;
  sourceStart: number;
  length: number;

  constructor(destinationStart: number, sourceStart: number, length: number) {
    this.destinationStart = destinationStart;
    this.sourceStart = sourceStart;
    this.length = length;
  }

  contains(value: number): boolean {
    return (
      value >= this.sourceStart &&
      value < this.sourceStart + this.length
    );
  }

  mapValue(value: number): number {
    if (!this.contains(value)) {
      throw Error(`${value} is not in ${this}`);
    }
    return value - this.sourceStart + this.destinationStart;
  }
}

class RangesMap {
  ranges: Array<RangeMap>;

  constructor(ranges: Array<RangeMap>) {
    this.ranges = ranges;
  }

  mapValue(value: number): number {
    for (const range of this.ranges) {
      if (range.contains(value)) {
        return range.mapValue(value);
      }
    }
    return value;
  }

  static fromString(str: string): RangesMap {
    const lines = str.split("\n");
    const ranges: Array<RangeMap> = [];
    for (let i = 1; i < lines.length; ++i) {
      const line = lines[i];
      const [destinationStart, sourceStart, length] = line.split(/ +/).map((x) => parseInt(x));
      ranges.push(new RangeMap(destinationStart, sourceStart, length));
    }
    return new RangesMap(ranges);
  }
}

const [seedsInput, ...mapsInput] = readFile("inputs/day5.txt").split("\n\n");
const seeds = seedsInput.split(": ")[1].split(/ +/).map((x) => parseInt(x));
const maps = mapsInput.map(RangesMap.fromString);

const part1 = seeds.map(seed => {
  let transform = seed;
  for (const map of maps) {
    transform = map.mapValue(transform);
  }
  return transform;
}).reduce((a, b) => a < b ? a : b);
console.log("Part 1:", part1);

const ranges: Array<Range> = [];
for (let i = 0; i < seeds.length; i += 2) {
  const start = seeds[i];
  const end = seeds[i] + seeds[i + 1] - 1;
  let newRange = new Range(start, end);

  const matches: Array<number> = [];
  ranges.forEach((range, index) => {
    if (range.intersects(newRange)) {
      matches.push(index);
    }
  })
  let spliceCount = 0;
  matches.forEach(match => {
    newRange = newRange.merge(ranges[match - spliceCount]);
    ranges.splice(match - spliceCount, 1);
    spliceCount++;
  })
  ranges.push(newRange);
}

const part2 = ranges.map(range => {
  let min = Infinity;
  for (let seed = range.start; seed <= range.end; seed++) {
    let transform = seed;
    for (const map of maps) {
      transform = map.mapValue(transform);
    }
    min = Math.min(min, transform);
  }
  return min;
}).reduce((a, b) => a < b ? a : b);
console.log("Part 2:", part2);
