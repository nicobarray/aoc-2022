const sum = (a, b) => a + b;

export function part1(input) {
  return input
    .split("\n")
    .map((line) => line.split(","))
    .map(([left, right]) => {
      const leftSection = left.split("-").map(Number);
      const rightSection = right.split("-").map(Number);

      // left : .2345.
      // right: ..34..
      if (
        leftSection[0] < rightSection[0] &&
        leftSection[1] >= rightSection[1]
      ) {
        return true;
      }

      // left : .23...
      // right: 1234..
      if (
        leftSection[0] > rightSection[0] &&
        leftSection[1] <= rightSection[1]
      ) {
        return true;
      }

      // if they share a border, they are contained.
      if (
        leftSection[0] === rightSection[0] ||
        leftSection[1] === rightSection[1]
      ) {
        return true;
      }

      return false;
    })
    .map((test) => (test ? 1 : 0))
    .reduce(sum, 0);
}

export function part2(input) {
  return input
    .split("\n")
    .map((line) => line.split(","))
    .map(([left, right]) => {
      const [a, b] = left.split("-").map(Number);
      const [c, d] = right.split("-").map(Number);

      const inLeft = (n) => n >= a && n <= b;

      for (let i = c; i <= d; i++) {
        if (inLeft(i)) {
          return true;
        }
      }

      return false;
    })
    .map((test) => (test ? 1 : 0))
    .reduce(sum, 0);
}
