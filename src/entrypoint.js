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
  let buffer = "";
  const log = (...msg) => {
    console.log(msg.join(" "));
    buffer += msg.join(" ") + "\n";
  };

  const days = await fs.readdir(path.join(__dirname, "days"));

  for (let day of days.map(Number)) {
    log(`## ⭐️ Day ${day} ⭐️`);

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

    const inputString = (await fs.readFile(input)).toString("utf-8");
    const exampleString = (await fileExists(example))
      ? (await fs.readFile(example)).toString("utf-8")
      : null;
    for (let [fnName, fn] of Object.entries(parts)) {
      let exampleRes = undefined;
      if (exampleString) {
        exampleRes = await fn(exampleString);
      }
      const res = await fn(inputString);
      log("-", fnName, res, exampleRes ? "(" + exampleRes + ")" : undefined);
    }

    log();
  }

  if (process.argv[2] === "--save") {
    const headerFile = path.resolve(
      path.join(__dirname, "..", "readme-header.md")
    );
    const solutionFile = path.resolve(path.join(__dirname, "..", "readme.md"));

    const headerBuffer = await fs.readFile(headerFile);

    await fs.copyFile(
      solutionFile,
      solutionFile + "." + Date.now() + ".backup"
    );

    await fs.writeFile(
      path.resolve(path.join(__dirname, "..", "readme.md")),
      Buffer.concat([headerBuffer, Buffer.from("\n"), Buffer.from(buffer)])
    );
  }
}

run()
  .then((res) => {
    console.log("Success", res);
  })
  .catch((err) => {
    console.error("Failed", err);
  });
