const loadInventory = (input) => {
  const lines = input.split("\n");

  // initialize the stacks data.

  let cratesLines = [];
  let lineIndex = 0;
  while (!lines[lineIndex].startsWith(" 1 ")) {
    let line = lines[lineIndex];
    cratesLines.push(line);
    lineIndex++;
  }
  //   cratesLines.reverse();

  const stacksCount = lines[lineIndex]
    .split("   ")
    .map((n) => parseInt(n, 10))
    .reduce((a, b) => Math.max(a, b), -1);

  const stacks = [...new Array(stacksCount)].map((_) => []);

  for (let cratesLine of cratesLines) {
    for (let i = 0; i < stacks.length; i++) {
      const n = cratesLine.substring(i * 4, i * 4 + 4)[1];
      if (n !== " ") {
        stacks[i].push(n);
      }
    }
  }

  return [stacks, { lines, lineIndex }];
};

export function part1(input) {
  let [stacks, { lines, lineIndex }] = loadInventory(input);

  // move crates.
  lineIndex += 2;
  for (; lineIndex < lines.length; lineIndex++) {
    const op = lines[lineIndex];

    let [_move, times, _from, origin, _to, dest] = op.split(" ").map(Number);

    while (times > 0) {
      times--;
      let [crate, ...rest] = stacks[origin - 1];
      stacks[origin - 1] = rest;
      stacks[dest - 1] = [crate, ...stacks[dest - 1]];
    }
  }

  return stacks.map((s) => s[0]).join("");
}

export function part2(input) {
  let [stacks, { lines, lineIndex }] = loadInventory(input);

  // move crates.
  lineIndex += 2;
  for (; lineIndex < lines.length; lineIndex++) {
    const op = lines[lineIndex];

    let [_move, times, _from, origin, _to, dest] = op.split(" ").map(Number);

    let stackBuffer = [];

    while (times > 0) {
      times--;
      let [crate, ...rest] = stacks[origin - 1];
      stacks[origin - 1] = rest;
      stackBuffer.push(crate);
    }

    stacks[dest - 1] = [...stackBuffer, ...stacks[dest - 1]];
  }

  return stacks.map((s) => s[0]).join("");
}
