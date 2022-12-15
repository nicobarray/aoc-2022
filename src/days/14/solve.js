import chalk from "chalk";
import { execSync } from "child_process";

const SAND_SOURCE = [500, 0];

function renderFrame(sparseGrid, sandPos) {
  const xs = Object.keys(sparseGrid).map((k) => Number(k.split("_")[0]));
  const ys = Object.keys(sparseGrid).map((k) => Number(k.split("_")[1]));

  const minX = Math.min(...xs) - 1;
  const maxX = Math.max(...xs) + 1;
  const minY = 0;
  const maxY = Math.max(...ys) + 1;

  let screenBuffer = [];
  for (let y = minY - 1; y < maxY + 1; y++) {
    let lineBuffer = "";
    for (let x = minX - 1; x < maxX + 1; x++) {
      if (sandPos && x === sandPos[0] && y === sandPos[1]) {
        lineBuffer += chalk.yellow("o");
      } else if (x === SAND_SOURCE[0] && y === SAND_SOURCE[1]) {
        lineBuffer += chalk.bgGreen(" ");
      } else if (sparseGrid[x + "_" + y] === "rock") {
        lineBuffer += chalk.bgGrey(" ");
      } else if (sparseGrid[x + "_" + y] === "sand") {
        lineBuffer += chalk.bgYellow(" ");
      } else {
        lineBuffer += " ";
      }
    }
    screenBuffer.push(lineBuffer);
  }

  console.clear();

  function splitScreen(amount) {
    const part = Math.round(screenBuffer.length / amount);
    for (let i = 0; i < screenBuffer.length / amount; i++) {
      let lineBuffer = "";
      for (let a = 0; a < amount; a++) {
        lineBuffer += screenBuffer[i + a * part];
      }
      console.log(lineBuffer);
    }
  }

  splitScreen(1);
}

export function part1(input) {
  const sparseGrid = input.split("\n").reduce((grid, lineDef) => {
    let prev = null;
    lineDef
      .split(" -> ")
      .flatMap((raw) => {
        const point = raw.split(",").map(Number);

        let line = [];
        if (prev) {
          const sameX = prev[0] === point[0];
          const min = sameX
            ? Math.min(prev[1], point[1])
            : Math.min(prev[0], point[0]);
          const max = sameX
            ? Math.max(prev[1], point[1])
            : Math.max(prev[0], point[0]);
          for (let i = min; i <= max; i++) {
            line.push([sameX ? prev[0] : i, sameX ? i : prev[1]]);
          }
        }

        prev = point;
        return line;
      })
      .forEach((point) => {
        grid[point.join("_")] = "rock";
      });

    return grid;
  }, {});

  const ys = Object.keys(sparseGrid).map((k) => Number(k.split("_")[1]));
  const maxY = Math.max(...ys);

  let sandPos = null;

  const isEmpty = (x, y) => {
    return !sparseGrid[x + "_" + y];
  };

  function tickSand() {
    if (!sandPos) {
      sandPos = [...SAND_SOURCE];
    } else {
      if (sandPos[1] > maxY) {
        return false;
      }

      if (isEmpty(sandPos[0], sandPos[1] + 1)) {
        sandPos[1]++;
      } else if (isEmpty(sandPos[0] - 1, sandPos[1] + 1)) {
        sandPos[1]++;
        sandPos[0]--;
      } else if (isEmpty(sandPos[0] + 1, sandPos[1] + 1)) {
        sandPos[1]++;
        sandPos[0]++;
      } else {
        sparseGrid[sandPos.join("_")] = "sand";
        sandPos = null;
      }
    }

    return true;
  }

  let i = 0;
  while (tickSand()) {
    i++;
    // renderFrame(sparseGrid, sandPos);
  }

  return Object.keys(sparseGrid).reduce(
    (sum, p) => (sparseGrid[p] === "sand" ? sum + 1 : sum),
    0
  );
}

export function part2(input) {
  const sparseGrid = input.split("\n").reduce((grid, lineDef) => {
    let prev = null;
    lineDef
      .split(" -> ")
      .flatMap((raw) => {
        const point = raw.split(",").map(Number);

        let line = [];
        if (prev) {
          const sameX = prev[0] === point[0];
          const min = sameX
            ? Math.min(prev[1], point[1])
            : Math.min(prev[0], point[0]);
          const max = sameX
            ? Math.max(prev[1], point[1])
            : Math.max(prev[0], point[0]);
          for (let i = min; i <= max; i++) {
            line.push([sameX ? prev[0] : i, sameX ? i : prev[1]]);
          }
        }

        prev = point;
        return line;
      })
      .forEach((point) => {
        grid[point.join("_")] = "rock";
      });

    return grid;
  }, {});

  const ys = Object.keys(sparseGrid).map((k) => Number(k.split("_")[1]));
  const maxY = Math.max(...ys);

  let sandPos = null;

  const isEmpty = (x, y) => {
    if (y >= maxY + 2) {
      return false;
    }

    return !sparseGrid[x + "_" + y];
  };

  function tickSand() {
    if (!sandPos) {
      sandPos = [...SAND_SOURCE];
    } else {
      if (isEmpty(sandPos[0], sandPos[1] + 1)) {
        sandPos[1]++;
      } else if (isEmpty(sandPos[0] - 1, sandPos[1] + 1)) {
        sandPos[1]++;
        sandPos[0]--;
      } else if (isEmpty(sandPos[0] + 1, sandPos[1] + 1)) {
        sandPos[1]++;
        sandPos[0]++;
      } else {
        if (sandPos.join("_") === SAND_SOURCE.join("_")) {
          return false;
        }

        sparseGrid[sandPos.join("_")] = "sand";
        sandPos = null;
      }
    }

    return true;
  }

  let i = 0;
  while (tickSand()) {
    i++;
  }

  renderFrame(sparseGrid, sandPos);

  return (
    Object.keys(sparseGrid).reduce(
      (sum, p) => (sparseGrid[p] === "sand" ? sum + 1 : sum),
      0
    ) + 1
  );
}
