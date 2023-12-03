import { readLines } from "./utils.ts";

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

class ColorSet {
  red: number;
  green: number;
  blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
}

class Game {
  id: number;
  sets: Array<ColorSet>;

  constructor(id: number, sets: Array<ColorSet>) {
    this.id = id;
    this.sets = sets;
  }

  static fromLine(line: string): Game {
    const [idPart, setsPart] = line.split(": ");
    const id = parseInt(idPart.split(" ")[1]);
    const sets = setsPart.split("; ").map((setString) => {
      let red = 0;
      let green = 0;
      let blue = 0;
      setString.split(", ").forEach((colorString) => {
        const [count, color] = colorString.split(" ");
        switch (color) {
          case "red":
            red += parseInt(count);
            break;
          case "green":
            green += parseInt(count);
            break;
          case "blue":
            blue += parseInt(count);
            break;
          default:
            throw Error(`Unknown color ${color}`);
        }
      });
      return new ColorSet(red, green, blue);
    });
    return new Game(id, sets);
  }

  isPossible(): boolean {
    for (const set of this.sets) {
      if (set.red > MAX_RED || set.green > MAX_GREEN || set.blue > MAX_BLUE) {
        return false;
      }
    }
    return true;
  }

  minColors(): ColorSet {
    let red = 0;
    let green = 0;
    let blue = 0;
    this.sets.forEach(set => {
      red = Math.max(red, set.red);
      green = Math.max(green, set.green);
      blue = Math.max(blue, set.blue);
    })
    return new ColorSet(red, green, blue);
  }
}

const games = readLines("inputs/day2.txt")
  .filter(line => line.trim().length > 0)
  .map(Game.fromLine);

let possibleGames = 0;
for (const game of games) {
  if (game.isPossible()) {
    possibleGames += game.id;
  }
}
console.log("Part 1: ", possibleGames);

let power = 0;
for (const game of games) {
  const min = game.minColors();
  power += min.red * min.green * min.blue;
}
console.log("Part 2: ", power);
