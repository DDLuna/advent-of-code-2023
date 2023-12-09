import { readFile } from "./utils.ts";

class Node {
  left: string;
  right: string;

  constructor(left: string, right: string) {
    this.left = left;
    this.right = right;
  }
}

const [instructions, nodesStr] = readFile("inputs/day8.txt").split("\n\n");

const nodes = new Map<string, Node>();
nodesStr.split("\n").forEach((line) => {
  const [node, edges] = line.split(" = ");
  const [left, right] = edges.substring(1, edges.length - 1).split(", ");
  nodes.set(node, new Node(left, right));
});

let currentNode = "AAA";
let steps = 0;
while (true) {
  const instruction = instructions[steps % instructions.length];
  switch (instruction) {
    case "L":
      currentNode = nodes.get(currentNode)!.left;
      break;
    case "R":
      currentNode = nodes.get(currentNode)!.right;
      break;
  }
  steps++;
  if (currentNode === "ZZZ") {
    break;
  }
}
console.log("Part 1:", steps);

let currentNodes = Array.from(nodes.keys()).filter((key) => key.endsWith("A"));
let loops: Array<number | null> = currentNodes.map(() => null);
steps = 0;
while (true) {
  const instruction = instructions[steps % instructions.length];
  switch (instruction) {
    case "L":
      currentNodes = currentNodes.map((node) => nodes.get(node)!.left);
      break;
    case "R":
      currentNodes = currentNodes.map((node) => nodes.get(node)!.right);
      break;
  }
  steps++;
  loops = loops.map((loop, i) => currentNodes[i].endsWith("Z") ? steps : loop);
  if (loops.every((loop) => loop != null)) {
    break;
  }
}

// Maths
function lcm(...arr: Array<number>): number {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const _lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
}
const part2 = lcm(...(loops as Array<number>));
console.log("Part 2:", part2);
