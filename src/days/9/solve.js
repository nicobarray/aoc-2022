const range = (n) => [...new Array(Number(n)).keys()];

const moveToVect = (dir) => {
  return {
    U: [0, 1],
    D: [0, -1],
    L: [-1, 0],
    R: [1, 0],
  }[dir];
};
const addVect = (a, b) => [a[0] + b[0], a[1] + b[1]];
const isAdj = (a, b) =>
  Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2) <= 2;

function print(head, tail, marked, width, height) {
  const w = width || 6;
  const h = height || 5;

  for (let y = h - 1; y >= 0; y--) {
    console.log(
      ...range(w)
        .map((_, x) => {
          if (marked && marked.has([x, y].join("_"))) {
            return "#";
          }

          if (head[0] === x && head[1] === y) {
            return "H";
          }

          if (tail[0] === x && tail[1] === y) {
            return "T";
          }

          if (x === 0 && y === 0) {
            return "s";
          }

          return ".";
        })
        .join("")
    );
  }
  console.log();
}

export function part1(input) {
  const data = input.split("\n").reduce(
    (data, move) => {
      let [dir, count] = move.split(" ");
      let dirVect = moveToVect(dir);

      for (let i = 0; i < Number(count); i++) {
        data.head = addVect(data.head, dirVect);

        if (isAdj(data.head, data.tail)) {
          data.marked.add(data.tail.join("_"), true);
          continue;
        }

        // diagonal
        if (data.head[0] !== data.tail[0] && data.head[1] !== data.tail[1]) {
          const dx = data.head[0] - data.tail[0] > 0 ? 1 : -1;
          const dy = data.head[1] - data.tail[1] > 0 ? 1 : -1;
          data.tail = addVect(data.tail, [dx, dy]);
          // horizontal
        } else if (data.head[0] !== data.tail[0]) {
          const headLeftOfTail = data.head[0] < data.tail[0];
          const dir_ = headLeftOfTail ? moveToVect("L") : moveToVect("R");

          data.tail = addVect(data.tail, dir_);

          // vertical
        } else {
          const headUpOfTail = data.head[1] > data.tail[1];
          const dir_ = headUpOfTail ? moveToVect("U") : moveToVect("D");
          data.tail = addVect(data.tail, dir_);
        }
        data.marked.add(data.tail.join("_"), true);
      }

      return data;
    },
    {
      head: [0, 0],
      tail: [0, 0],
      marked: new Set(),
    }
  );

  let minX = 0,
    minY = 0,
    maxX = 0,
    maxY = 0;

  for (let p of data.marked) {
    const [x, y] = p.split("_").map(Number);

    if (!minX || x < minX) {
      minX = x;
    }
    if (!minY || y < minY) {
      minY = y;
    }
    if (!maxX || x > maxX) {
      maxX = x;
    }
    if (!maxY || y > maxY) {
      maxY = y;
    }
  }

  // 5873 is not enougth
  print(data.head, data.tail, data.marked, maxX - minX, maxY - minY);

  return [...data.marked].length;
}
