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

function inspectItem(monkey, item) {
  logger.verbose(
    " Monkey inspects an item with a worry level of " + item + "."
  );
  return monkey.fn(item);
}
function testItem(monkey, worry) {
  const test = worry % monkey.divisibleBy === 0;

  if (test) {
    logger.verbose(
      "     Current worry level is divisible by " + monkey.divisibleBy + "."
    );
  } else {
    logger.verbose(
      "     Current worry level is not divisible by " + monkey.divisibleBy + "."
    );
  }
  return {
    from: monkey.id,
    to: test ? monkey.ifTrue : monkey.ifFalse,
  };
}
function throwItem(monkeys, action, worry) {
  const [_item, ...rest] = monkeys[action.from].items;
  monkeys[action.from].items = rest || [];
  monkeys[action.to].items.push(worry);
}

function runRound(monkeys, onInspectItem, options = {}) {
  for (let monkey of monkeys) {
    logger.verbose("Monkey " + monkey.id + ":");
    while (monkey.items.length > 0) {
      const item = monkey.items[0];

      onInspectItem(monkey);

      let worry = inspectItem(monkey, item);

      if (!options?.noWorry) {
        logger.verbose(
          "       Monkey gets bored with item. Worry level is divided by 3 to " +
            Math.floor(worry / 3) +
            "."
        );
        worry = Math.floor(worry / 3);
      }

      const action = testItem(monkey, worry, item);
      logger.verbose(
        "       Item with worry level " +
          worry +
          " is thrown to monkey " +
          action.to +
          "."
      );
      throwItem(monkeys, action, worry);
    }
  }
}

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
      const astish = line
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

      monkey.fn = (arg) => {
        const left = astish.left === "old" ? arg : Number(astish.left);
        const right = astish.right === "old" ? arg : Number(astish.right);

        const op = {
          "*": (a, b) => {
            logger.verbose(
              "     Worry level is multiplied by " + b + " to " + a * b + "."
            );
            return a * b;
          },
          "+": (a, b) => {
            logger.verbose(
              "     Worry level increases by " + b + " to " + (a + b) + "."
            );
            return a + b;
          },
        };
        return op[astish.op](left, right);
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

export function part1(input) {
  const monkeys = makeState(input);
  const monkeysActivity = Object.keys(monkeys).map((id) => ({ [id]: 0 }));

  for (let i = 0; i < 20; i++) {
    runRound(monkeys, (monkey) => {
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

export function part2(input) {
  const monkeys = makeState(input);
  const monkeysActivity = Object.keys(monkeys).map((id) => ({ [id]: 0 }));

  for (let i = 0; i < 10000; i++) {
    runRound(
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
  }

  monkeys.forEach((monkey) => {
    logger.info(
      "Monkey " +
        monkey.id +
        ": " +
        monkey.items.join(", ") +
        ", " +
        monkeysActivity[monkey.id]
    );
  });

  return Object.values(monkeysActivity)
    .sort((a, b) => b - a)
    .splice(0, 2)
    .reduce((a, b) => a * b, 1);
}
