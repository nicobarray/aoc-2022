import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const undef = (x) => typeof x === "undefined";
const isnum = (x) => typeof x === "number";
const range = (x) => [...new Array(x).keys()];
const indent = (x) =>
  range(x)
    .map(() => "  ")
    .join("");

const checkValidSignal = (leftSignal, rightSignal, depth = 0) => {
  const [left, ...leftRest] = leftSignal;
  const [right, ...rightRest] = rightSignal;

  if (undef(left) && undef(right)) {
    return;
  }

  if (undef(left) && !undef(right)) {
    console.log(
      indent(depth),
      chalk.grey(
        "- Left side ran out of items, so inputs are " +
          chalk.white("in the right order")
      )
    );
    throw true;
  }

  if (!undef(left) && undef(right)) {
    console.log(
      indent(depth),
      chalk.grey(
        "- Right side ran out of items, so inputs are " +
          chalk.white("not") +
          " in the right order"
      )
    );
    throw false;
  }

  console.log(
    chalk.grey(
      indent(depth),
      "- Compare",
      JSON.stringify(left),
      "vs",
      JSON.stringify(right)
    )
  );

  if (isnum(left) && isnum(right)) {
    if (left < right) {
      console.log(
        chalk.grey(
          indent(depth + 1),
          "- Left side is smaller, so inputs are " +
            chalk.white("in the right order")
        )
      );

      throw true;
    }

    if (right < left) {
      console.log(
        chalk.grey(
          indent(depth + 1),
          "- Right side is smaller, so inputs are " +
            chalk.white("not") +
            " in the right order"
        )
      );

      throw false;
    }

    if (right === left) {
      checkValidSignal(leftRest, rightRest, depth);
      return;
    }
  }

  if (isnum(left) && !isnum(right)) {
    console.log(
      chalk.grey(
        indent(depth + 1),
        "- Mixed types; convert left to [" + left + "] and retry comparison"
      )
    );
    checkValidSignal([[left], ...leftRest], rightSignal, depth + 1);
    return;
  }

  if (!isnum(left) && isnum(right)) {
    console.log(
      chalk.grey(
        indent(depth + 1),
        "- Mixed types; convert right to [" + right + "] and retry comparison"
      )
    );

    checkValidSignal(leftSignal, [[right], ...rightRest], depth + 1);
    return;
  }

  checkValidSignal(left, right, depth + 1);
  checkValidSignal(leftRest, rightRest, depth);
};

function lexInput(line) {
  let numberBuffer = "";
  return line.split("").reduce((token, char) => {
    const figure = Number(char);
    if (Number.isNaN(figure)) {
      if (numberBuffer) {
        token.push(Number(numberBuffer));
        numberBuffer = "";
      }

      token.push(char);
    } else {
      numberBuffer += char;
    }

    return token;
  }, []);
}

function parseInput(packet, array = []) {
  const [head, ...tail] = packet.tokens;
  packet.tokens = tail;

  const value = Number(head);
  if (Number.isInteger(value)) {
    array.push(value);
    return parseInput(packet, array);
  }

  if (!tail) {
    return [];
  }

  if (head === "[") {
    array.push(parseInput(packet));
    return parseInput(packet, array);
  }

  if (head === "]") {
    return array;
  }

  if (head === ",") {
    return parseInput(packet, array);
  }

  if (!head) {
    return array;
  }

  return parseInput(packet, array);
}

export async function part1(input) {
  return input.split("\n\n").reduce((sum, line, index) => {
    const pairIndex = index + 1;
    const [left, right] = line
      .split("\n")
      .map((signal) => parseInput({ tokens: lexInput(signal) }));
    console.log();
    console.log("== Pair " + pairIndex + " ==");
    try {
      checkValidSignal(left, right);
    } catch (result) {
      return sum + (result ? pairIndex : 0);
    }

    return sum;
  }, 0);
}

export function part2(input) {
  return [...input.split("\n"), "[[2]]", "[[6]]"]
    .filter(Boolean)
    .flatMap((line) => parseInput({ tokens: lexInput(line) }))
    .sort((a, b) => {
      try {
        checkValidSignal(a, b);
      } catch (result) {
        return result ? -1 : 1;
      }
    })
    .reduce((mult, signal, index) => {
      if (["[[2]]", "[[6]]"].includes(JSON.stringify(signal))) {
        return (mult *= index + 1);
      }
      return mult;
    }, 1);
}
