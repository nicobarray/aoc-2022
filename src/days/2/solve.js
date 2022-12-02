function wins(a, b) {
  const rockWinsSissors = a === "A" && b === "C";
  const paperWinsRock = a === "B" && b === "A";
  const sissorsWinsPaper = a === "C" && b === "B";

  return rockWinsSissors || paperWinsRock || sissorsWinsPaper;
}

function scoreOutcome(a, b) {
  if (a === b) {
    return 3;
  }

  if (wins(a, b)) {
    return 0;
  }

  return 6;
}

function scoreHand(a) {
  return {
    A: 1,
    B: 2,
    C: 3,
  }[a];
}

function scoreTurn([a, b]) {
  return scoreOutcome(a, b) + scoreHand(b);
}

export function part1(input) {
  // A = rock
  // B = paper
  // C = sissors

  return input
    .split("\n")
    .map((turn) =>
      scoreTurn(
        turn
          .split(" ")
          .map((n) => ({ X: "A", Y: "B", Z: "C", A: "A", B: "B", C: "C" }[n]))
      )
    )
    .reduce((a, b) => a + b, 0);
}

export function part2(input) {
  function solveTurn([a, b]) {
    const WinRotation = {
      A: "B",
      B: "C",
      C: "A",
    };
    const LooseRotation = Object.keys(WinRotation).reduce(
      (acc, hand) => ({ ...acc, [WinRotation[hand]]: hand }),
      {}
    );

    const myHand =
      b === "X" ? LooseRotation[a] : b === "Y" ? a : WinRotation[a];

    return scoreTurn([a, myHand]);
  }

  return input
    .split("\n")
    .map((turn) => solveTurn(turn.split(" ")))
    .reduce((a, b) => a + b, 0);
}
