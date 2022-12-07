const range = (n) => [...new Array(n).keys()];

let sizeMemo = {};
const getDirSize = (fs, path) => {
  const files = fs.dirs[path];

  if (!files) {
    return 0;
  }

  let size = 0;
  for (let file of files) {
    if (file.type === "file") {
      size += file.size;
      continue;
    }

    const dirName = file.pwd + "/" + file.name;

    if (typeof sizeMemo[dirName] === "number") {
      size += sizeMemo[dirName];
      continue;
    }

    const dirSize = getDirSize(fs, dirName);
    sizeMemo[dirName] = dirSize;

    size += dirSize;
  }

  return size;
};

const basename = (filename) => {
  const parts = filename.split("/");
  return parts[parts.length - 1] || "/";
};

const ls = (fs, path, indent = 1) => {
  const files = fs.dirs[path];

  const logIndent = (...msg) => {
    console.log(
      range(indent + 1)
        .map((_, index, array) => (index === array.length - 1 ? "-" : "  "))
        .join(""),
      ...msg
    );
  };

  if (!files) {
    return "";
  }

  indent--;
  logIndent(basename(path), "(dir)");
  indent++;

  for (let file of files) {
    if (file.type === "dir") {
      ls(fs, path + "/" + file.name, indent + 1);
    } else {
      logIndent(
        file.name,
        file.type === "dir" ? "(dir)" : "(file, size=" + file.size + ")"
      );
    }
  }
};

const cd = (fs, dest) => {
  if (dest === "/") {
    fs.pwd = "/";
    fs.parentPwd = [];
  } else if (dest === "..") {
    const [parent, ...other] = fs.parentPwd;
    fs.parentPwd = other;
    fs.pwd = parent;
  } else {
    let parentPwd = fs.pwd;
    fs.pwd = fs.pwd + "/" + dest;
    fs.parentPwd = [parentPwd, ...fs.parentPwd];
  }
};

const makeFs = (output) => {
  return output.reduce(
    (fs, line) => {
      if (line.startsWith("$ cd ")) {
        const dest = line.substr("$ cd ".length);
        cd(fs, dest);
      } else if (line.startsWith("$ ls")) {
        if (!fs.dirs[fs.pwd]) {
          fs.dirs[fs.pwd] = [];
        }
      } else {
        const [dirOrSize, name] = line.split(" ");
        fs.dirs[fs.pwd].push({
          type: dirOrSize === "dir" ? dirOrSize : "file",
          size: dirOrSize === "dir" ? undefined : Number(dirOrSize),
          name,
          pwd: fs.pwd,
        });
      }

      return fs;
    },
    { pwd: null, parentPwd: [], dirs: {} }
  );
};

export function part1(input) {
  const fs = makeFs(input.split("\n"));

  ls(fs, "/");

  return Object.keys(fs.dirs)
    .map((pwd) => {
      const size = getDirSize(fs, pwd);
      return size;
    })
    .filter((size) => size <= 100000)
    .reduce((a, b) => a + b);
}
