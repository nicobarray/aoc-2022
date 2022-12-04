const sum = (a, b) => a + b;

const priority = (item) => {
  const jsCode = item.charCodeAt(0);

  if (jsCode >= "a".charCodeAt(0)) {
    return jsCode - "a".charCodeAt(0) + 1;
  }

  if (jsCode >= "A".charCodeAt(0)) {
    return jsCode - "A".charCodeAt(0) + 27;
  }

  throw new Error("Unknown item: " + item);
};

export async function part1(input) {
  return input
    .split("\n")
    .map((rucksack) => {
      const left = rucksack.substring(0, rucksack.length / 2);
      const right = rucksack.substring(rucksack.length / 2);

      for (let item of left) {
        if (right.includes(item)) {
          return priority(item);
        }
      }

      throw new Error("Input must have common item in each rucksack");
    })
    .reduce(sum, 0);
}
