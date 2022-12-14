function makeLogger(initialLevel = "verbose") {
  let level = initialLevel;
  return {
    verbose: (...args) =>
      level === "verbose" ? console.log(...args) : undefined,
    info: (...args) => (level === "info" ? console.log(...args) : undefined),
    setLevel(level_) {
      level = level_;
    },
  };
}

const logger = makeLogger("none");

function makeState(input) {
  return input.split("\n").reduce((monkeys, line) => {
    if (line.startsWith("Monkey ")) {
      let id = line.substr("Monkey ".length);
      id = Number(id.substr(0, id.length - 1));
      monkeys.push({ id });
      return monkeys;
    }

    const monkey = monkeys[monkeys.length - 1];

    if (line.startsWith("  Starting items:")) {
      monkey.items = line
        .substr("  Starting items:".length)
        .split(",")
        .map((n) => n.trim())
        .map(Number);
    }

    if (line.startsWith("  Operation: ")) {
      const ast = line
        .substr("  Operation: ".length)
        .split(" ")
        .reduce(
          (fn, token) => {
            if (["=", "new"].includes(token)) {
              return fn;
            }

            if (!fn.left) {
              fn.left = token;
            } else if (!fn.op) {
              fn.op = token;
            } else if (!fn.right) {
              fn.right = token;
            }

            return fn;
          },
          {
            left: null,
            right: null,
            op: null,
          }
        );

      const op = {
        "*": (a, b) => {
          return a * b;
        },
        "+": (a, b) => {
          return a + b;
        },
      };

      monkey.ast = ast;
      monkey.op = op[ast.op];
      monkey.left = (arg) => (ast.left === "old" ? arg : Number(ast.left));
      monkey.right = (arg) => (ast.right === "old" ? arg : Number(ast.right));
      monkey.fn = (arg) => {
        return monkey.op(monkey.left(arg), monkey.right(arg));
      };
    }

    if (line.startsWith("  Test: divisible by ")) {
      monkey.divisibleBy = Number(line.substr("  Test: divisible by ".length));
    }

    if (line.startsWith("    If true: throw to monkey ")) {
      monkey.ifTrue = Number(
        line.substr("    If true: throw to monkey ".length)
      );
    }

    if (line.startsWith("    If false: throw to monkey ")) {
      monkey.ifFalse = Number(
        line.substr("    If false: throw to monkey ".length)
      );
    }

    return monkeys;
  }, []);
}

function pgcd(a, b) {
  if (!b) {
    return a;
  }

  return pgcd(b, a % b);
}

function ppcm(a, b) {
  return (a * b) / pgcd(a, b);
}

function playRound(monkeys, onInspectItem, options = {}) {
  for (let monkey of monkeys) {
    while (monkey.items.length > 0) {
      const item = monkey.items[0];

      onInspectItem(monkey, item);

      let worry = monkey.op(monkey.left(item), monkey.right(item));

      if (!options?.noWorry) {
        worry = Math.floor(worry / 3);
      }

      const test = worry % monkey.divisibleBy === 0;

      const [_item, ...rest] = monkey.items;
      monkeys[monkey.id].items = rest || [];
      monkeys[test ? monkey.ifTrue : monkey.ifFalse].items.push(worry);
    }
  }
}

export function part1(input) {
  const monkeys = makeState(input);
  const monkeysActivity = Object.keys(monkeys).map((id) => ({ [id]: 0 }));

  for (let i = 0; i < 20; i++) {
    playRound(monkeys, (monkey) => {
      if (!monkeysActivity[monkey.id]) {
        monkeysActivity[monkey.id] = 1;
      }
      monkeysActivity[monkey.id]++;
    });
  }

  return Object.values(monkeysActivity)
    .sort((a, b) => b - a)
    .splice(0, 2)
    .reduce((a, b) => a * b, 1);
}

function logActivity(round, monkeys, monkeysActivity) {
  logger.info(`== After round ${round} ==`);
  monkeys.forEach((monkey) => {
    logger.info(
      `Monkey ${monkey.id} inspected items ${monkeysActivity[monkey.id]} times.`
    );
  });
  logger.info();
}

export function _part2(input) {
  const monkeys = makeState(input);
  const monkeysActivity = Object.keys(monkeys).map((id) => ({ [id]: 0 }));

  for (let i = 0; i < 10_000; i++) {
    playRound(
      monkeys,
      (monkey) => {
        if (!monkeysActivity[monkey.id]) {
          monkeysActivity[monkey.id] = 1;
        }
        monkeysActivity[monkey.id]++;
      },
      {
        noWorry: true,
      }
    );
    if ((i + 1) % 1000 === 0) {
      logActivity(i + 1, monkeys, monkeysActivity);
    }
  }

  return Object.values(monkeysActivity)
    .sort((a, b) => b - a)
    .splice(0, 2)
    .reduce((a, b) => a * b, 1);
}
