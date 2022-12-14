import fs from "fs/promises";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch (err) {
    return false;
  }
}

async function run() {
  const day = Number(process.argv[2]);

  if (Number.isNaN(day)) {
    console.log("$ aoc [day]");
    process.exit(1);
  }

  let buffer = "";
  const log = (...msg) => {
    console.log(msg.join(" "));
    buffer += msg.join(" ") + "\n";
  };

  let days = (await fs.readdir(path.join(__dirname, "days")))
    .map(Number)
    .sort((a, b) => a - b)
    .filter((d) => d === day);

  for (let day of days.map(Number).sort((a, b) => a - b)) {
    log(`\n## ⭐️ Day ${day} ⭐️`);

    const solver = path.resolve(
      path.join(__dirname, "days", String(day), "solve.js")
    );
    const input = path.resolve(
      path.join(__dirname, "days", String(day), "input.txt")
    );
    const example = path.resolve(
      path.join(__dirname, "days", String(day), "example.txt")
    );

    const parts = await import(solver);

    const inputString = (await fileExists(input))
      ? (await fs.readFile(input)).toString("utf-8")
      : null;
    const exampleString = (await fileExists(example))
      ? (await fs.readFile(example)).toString("utf-8")
      : null;
    for (let [fnName, fn] of Object.entries(parts)) {
      let exampleRes = undefined;
      if (exampleString) {
        exampleRes = await fn(exampleString);
      }
      let res = undefined;
      if (inputString) {
        res = await fn(inputString);
      }
      log(
        "\n###",
        fnName,
        "\n\n",
        res ? "Result:  " + res : undefined,
        "\n\n",
        exampleRes ? "Example: " + exampleRes : undefined
      );
    }

    log();
  }
}

run()
  .then((res) => {
    console.log("Success", res);
  })
  .catch((err) => {
    console.error("Failed", err);
  });
