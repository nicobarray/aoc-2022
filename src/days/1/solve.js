export function part1(input) {
  return input
    .split("\n\n")
    .map((elf) =>
      elf
        .split("\n")
        .map(Number)
        .reduce((a, b) => a + b, 0)
    )
    .sort((a, b) => b - a)[0];
}

export function part2(input) {
  return input
    .split("\n\n")
    .map((elf) =>
      elf
        .split("\n")
        .map(Number)
        .reduce((a, b) => a + b, 0)
    )
    .sort((a, b) => b - a)
    .reduce((a, b, i) => (i < 3 ? a + b : a), 0);
}
