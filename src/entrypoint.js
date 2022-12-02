import fs from "fs/promises";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

async function run() {
  let buffer = "";
  const log = (...msg) => {
    console.log(msg.join(" "));
    buffer += msg.join(" ") + "\n";
  };

  const days = await fs.readdir(path.join(__dirname, "days"));

  for (let day of days.map(Number)) {
    log(`⭐️ Day ${day} ⭐️`);

    const solver = path.resolve(
      path.join(__dirname, "days", String(day), "solve.js")
    );
    const input = path.resolve(
      path.join(__dirname, "days", String(day), "input.txt")
    );

    const parts = await import(solver);

    const inputString = (await fs.readFile(input)).toString("utf-8");
    for (let [fnName, fn] of Object.entries(parts)) {
      const res = await fn(inputString);
      log(fnName, res);
    }

    log();
  }

  if (process.argv[2] === "--save") {
    const solutionFile = path.resolve(
      path.join(__dirname, "..", "solutions.md")
    );
    await fs.copyFile(
      solutionFile,
      solutionFile + "." + Date.now() + ".backup"
    );
    await fs.writeFile(
      path.resolve(path.join(__dirname, "..", "solutions.md")),
      buffer
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
