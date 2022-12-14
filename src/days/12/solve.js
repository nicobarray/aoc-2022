import chalk from "chalk";
import { execSync } from "child_process";

const makeGrid = (input) => {
  return input.split("\n").map((row) => row.split(""));
};

const enqueue = (state, value) => {
  state.openList.push(value);
};

const mag = (a, b) => {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
};

const add = (a, b) => {
  return [a[0] + b[0], a[1] + b[1]];
};

const isEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};

const dequeueMin = (state) => {
  const [min, ...rest] = state.openList.sort((a, b) => {
    const aa = state.scores[a.join("_")] + state.heuristic[a.join("_")];
    const bb = state.scores[b.join("_")] + state.heuristic[b.join("_")];
    return aa - bb;
  });

  state.openList = rest;
  state.closedList.push(min);
  state.current = min;
};

const getElevation = (grid, point) => {
  let letter = grid[point[1]][point[0]];
  if (letter === "S") {
    letter = "a";
  } else if (letter === "E") {
    letter = "z";
  }

  return letter.charCodeAt(0);
};

const printGrid = (grid, mapper) => {
  let buffer = "\n";
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[0].length; i++) {
      buffer += mapper(grid[j][i], i, j);
    }
    buffer += "\n";
  }
  return buffer;
};

function aStar(grid, start, options = {}) {
  const state = {
    grid,
    closedList: [],
    openList: [],
    current: [],
    distances: {},
    heuristic: {},
    scores: {},
    parent: {},
    path: [],
  };

  state.start = start;

  state.openList = [state.start];

  state.end = state.grid.reduce((end, row, j) => {
    const i = row.findIndex((el) => el === "E");
    if (i !== -1) {
      return [i, j];
    }
    return end;
  }, null);

  printGrid(grid, (_, x, y) => {
    state.distances[x + "_" + y] = 9999;
    state.heuristic[x + "_" + y] = mag([x, y], state.end);
  });
  state.distances[[0, 0].join("_")] = 0;

  let i = 0;
  while (state.openList.length > 0) {
    if (options?.cancel && options.cancel()) {
      console.log("skip");
      return 9999;
    }

    i++;

    dequeueMin(state);

    if (options?.video && i % 10 === 0) {
      console.clear();
      console.log(
        printGrid(state.grid, (value, x, y) => {
          if (isEqual(state.current, [x, y])) {
            return chalk.blueBright("@");
          }

          if (state.closedList.some((a) => isEqual(a, [x, y]))) {
            return chalk.green("#");
          }

          if (state.openList.some((e) => isEqual(e, [x, y]))) {
            return chalk.blue("#");
          }

          return chalk.grey(value);
        })
      );
      execSync("sleep .01");
    }

    const elevation = getElevation(state.grid, state.current);

    const neighbours = [
      add(state.current, [1, 0]),
      add(state.current, [-1, 0]),
      add(state.current, [0, 1]),
      add(state.current, [0, -1]),
    ];
    for (let neighbour of neighbours) {
      const [x, y] = neighbour;

      if (
        x < 0 ||
        y < 0 ||
        x >= state.grid[0].length ||
        y >= state.grid.length
      ) {
        continue;
      }

      if (state.closedList.some((p) => isEqual(p, neighbour))) {
        continue;
      }

      if (getElevation(state.grid, neighbour) > elevation + 1) {
        continue;
      }

      const distance = state.distances[state.current.join("_")] + 1;
      const isNotVisited = !state.openList.some((x) => isEqual(x, neighbour));

      if (isNotVisited || distance <= state.distances[neighbour.join("_")]) {
        if (isNotVisited) {
          enqueue(state, neighbour);
        }

        state.parent[neighbour.join("_")] = state.current.join("_");
        state.distances[neighbour.join("_")] = distance;
        state.scores[neighbour.join("_")] =
          distance + state.heuristic[neighbour.join("_")];
      }
    }
  }

  let sentry = state.end;

  while (!isEqual(sentry, state.start)) {
    if (!state.parent[sentry.join("_")]) {
      return 9999;
    }

    state.path.push(sentry.join("_"));
    sentry = state.parent[sentry.join("_")].split("_").map(Number);
  }
  state.path.reverse();

  function formatDirection(next, prev) {
    if (next[0] < prev[0]) {
      return "<";
    }
    if (next[0] > prev[0]) {
      return ">";
    }
    if (next[1] > prev[1]) {
      return "v";
    }
    if (next[1] < prev[1]) {
      return "^";
    }
    return "?";
  }

  if (options.video) {
    console.clear();
    console.log(
      printGrid(state.grid, (value, x, y) => {
        if (value === "E") {
          return value;
        }

        if (value === "S") {
          return chalk.yellow("S");
        }

        const key = x + "_" + y;
        const pathIndex = state.path.indexOf(key);

        if (pathIndex !== -1) {
          const [prev, next] = state.path
            .slice(pathIndex, pathIndex + 2)
            .map((p) => p.split("_").map(Number));

          return chalk.green(formatDirection(next, prev));
        }

        return chalk.grey(".");
      })
    );
  }

  return state.path.length;
}

export function part1(input) {
  const grid = makeGrid(input);

  const start = grid.reduce((start, row, j) => {
    const i = row.findIndex((el) => el === "S");
    if (i !== -1) {
      return [i, j];
    }
    return start;
  }, null);

  const res = aStar(grid, start);

  return res;
}

export async function part2(input) {
  const grid = makeGrid(input);

  const startPos = [];
  printGrid(grid, (value, x, y) => {
    if (value === "S" || value === "a") {
      startPos.push([x, y]);
    }
  });

  let min = 9999;
  let i = 0;
  for (let start of startPos) {
    i++;
    console.log(
      String(i).padStart(String(startPos.length).length),
      "/",
      startPos.length,
      "Checking",
      start.map((p) => String(p).padStart(3)),
      "(min=",
      min,
      ")"
    );

    const pathLength = aStar(grid, start, {
      video: true,
    });
    if (pathLength < min) {
      min = pathLength;
    }
  }

  return min;
}
