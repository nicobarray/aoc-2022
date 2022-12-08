export function part1(input) {
  const grid = {};

  const rows = input.split("\n");
  const height = rows.length;
  const width = rows[0].length;

  rows.forEach((row, y) => {
    grid[y] = {};
    row.split("").forEach((h, x) => {
      grid[y][x] = Number(h);
    });
  });

  let memo = {};
  function isVisible(x, y) {
    if (typeof memo[x + "_" + y] !== "undefined") {
      return memo[x + "_" + y];
    }

    const h = grid[y][x];

    if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
      memo[x + "_" + y] = true;
      return true;
    }

    function checkTrees(init, test, modifier, accessor) {
      for (let i = init(); test(i); i = modifier(i)) {
        const hh = accessor(grid, i);
        if (hh >= h) {
          return false;
        }
      }
      return true;
    }

    const visibleFromLeft = checkTrees(
      () => x - 1,
      (i) => i >= 0,
      (i) => i - 1,
      (grid, i) => grid[y][i]
    );
    const visibleFromRight = checkTrees(
      () => x + 1,
      (i) => i < width,
      (i) => i + 1,
      (grid, i) => grid[y][i]
    );
    const visibleFromTop = checkTrees(
      () => y - 1,
      (i) => i >= 0,
      (i) => i - 1,
      (grid, i) => grid[i][x]
    );
    const visibleFromBottom = checkTrees(
      () => y + 1,
      (i) => i < height,
      (i) => i + 1,
      (grid, i) => grid[i][x]
    );

    const result =
      visibleFromLeft ||
      visibleFromRight ||
      visibleFromTop ||
      visibleFromBottom;

    memo[x + "_" + y] = result;
    return result;
  }

  let visibleCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const visibleTree = isVisible(x, y);

      if (visibleTree) {
        visibleCount++;
      }
    }
  }

  return visibleCount;
}
