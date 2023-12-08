import { readLines } from "./utils.ts";

enum HandType {
  HIGH_CARD = 1,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND,
}

class HandBidPair {
  hand: string;
  bid: number;
  type: HandType;

  protected static strengths = new Map([
    ["A", 13],
    ["K", 12],
    ["Q", 11],
    ["J", 10],
    ["T", 9],
    ["9", 8],
    ["8", 7],
    ["7", 6],
    ["6", 5],
    ["5", 4],
    ["4", 3],
    ["3", 2],
    ["2", 1],
  ]);

  constructor(hand: string, bid: number) {
    this.hand = hand;
    this.bid = bid;
    const cardMap = new Map<string, number>();
    for (const card of hand) {
      cardMap.set(card, (cardMap.get(card) ?? 0) + 1);
    }
    if (cardMap.size === 1) {
      this.type = HandType.FIVE_OF_A_KIND;
    } else if (cardMap.size === 2) {
      if (Array.from(cardMap.values()).some((cardSize) => cardSize === 4)) {
        this.type = HandType.FOUR_OF_A_KIND;
      } else {
        this.type = HandType.FULL_HOUSE;
      }
    } else if (cardMap.size === 3) {
      if (Array.from(cardMap.values()).some((cardSize) => cardSize === 3)) {
        this.type = HandType.THREE_OF_A_KIND;
      } else {
        this.type = HandType.TWO_PAIR;
      }
    } else if (cardMap.size === 4) {
      this.type = HandType.ONE_PAIR;
    } else {
      this.type = HandType.HIGH_CARD;
    }
  }

  compareTo(other: HandBidPair): number {
    if (this.type !== other.type) {
      return this.type - other.type;
    }
    for (let i = 0; i < 5; i++) {
      if (this.hand[i] !== other.hand[i]) {
        // Use this.constructor to allow child classes to override strengths.
        return this.constructor.strengths.get(this.hand[i])! -
          this.constructor.strengths.get(other.hand[i])!;
      }
    }
    return 0;
  }
}

function totalWinnings(pairs: Array<HandBidPair>): number {
  return pairs.sort((a, b) => a.compareTo(b))
    .reduce((acc, pair, index) => acc += pair.bid * (index + 1), 0);
}

const lines = readLines("inputs/day7.txt");

const pairs1 = lines.map((line) => {
  const [hand, bid] = line.split(" ");
  return new HandBidPair(hand, parseInt(bid));
});

console.log("Part 1:", totalWinnings(pairs1));

class HandBidPairV2 extends HandBidPair {
  static strengths = new Map(super.strengths).set("J", 0);

  constructor(hand: string, bid: number) {
    super(hand, bid);
    let jCount = 0;
    for (const card of hand) {
      if (card === "J") {
        jCount++;
      }
    }
    hand = hand.replaceAll("J", "");
    const cardMap = new Map<string, number>();
    for (const card of hand) {
      cardMap.set(card, (cardMap.get(card) ?? 0) + 1);
    }
    switch (jCount) {
      case 5:
      case 0:
        break;
      case 4:
        this.type = HandType.FIVE_OF_A_KIND;
        break;
      case 3:
        this.type = cardMap.size === 1
          ? HandType.FIVE_OF_A_KIND
          : HandType.FOUR_OF_A_KIND;
        break;
      case 2:
        if (cardMap.size === 1) {
          this.type = HandType.FIVE_OF_A_KIND;
        } else if (cardMap.size === 2) {
          this.type = HandType.FOUR_OF_A_KIND;
        } else {
          this.type = HandType.THREE_OF_A_KIND;
        }
        break;
      case 1:
        if (cardMap.size === 1) {
          this.type = HandType.FIVE_OF_A_KIND;
        } else if (cardMap.size === 2) {
          const maxGroup = Math.max(...Array.from(cardMap.values()));
          this.type = maxGroup === 3
            ? HandType.FOUR_OF_A_KIND
            : HandType.FULL_HOUSE;
        } else if (cardMap.size === 3) {
          this.type = HandType.THREE_OF_A_KIND;
        } else {
          this.type = HandType.ONE_PAIR;
        }
        break;
      default:
        throw Error();
    }
  }
}

const pairs2 = lines.map((line) => {
  const [hand, bid] = line.split(" ");
  return new HandBidPairV2(hand, parseInt(bid));
});
console.log("Part 2:", totalWinnings(pairs2));
