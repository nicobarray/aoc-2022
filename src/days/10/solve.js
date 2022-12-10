function vm(program, onTick) {
  let cycle = 0;
  let x = 1;

  function tick() {
    cycle++;
    onTick({ x, cycle });
  }

  const opImpl = {
    noop: tick,
    addx: (v) => {
      tick();
      tick();
      x += v;
    },
  };

  for (let instr of program) {
    const [op, v] = instr.split(" ");
    opImpl[op](Number(v));
  }
}

export function part1(input) {
  let str = 0;
  vm(input.split("\n"), ({ x, cycle }) => {
    if (cycle >= 20 && (cycle - 20) % 40 === 0) {
      str += x * cycle;
    }
  });
  return str;
}

export function part2(input) {
  const crt = {
    width: 40,
    height: 6,
    buffer: [],
  };

  vm(input.split("\n"), ({ x, cycle }) => {
    const pointX = (cycle - 1) % 40;
    const spriteX = x;

    if (Math.abs(spriteX - pointX) <= 1) {
      crt.buffer.push("#");
    } else {
      crt.buffer.push(".");
    }
  });

  let outputBuffer = "\n\n```\n";
  console.log();

  let line = "";
  for (let i = 0; i < crt.buffer.length; i++) {
    if (i > 0 && i % crt.width === 0) {
      outputBuffer += line + "\n";
      line = "";
    }

    line += crt.buffer[i];
  }
  outputBuffer += line + "\n```";

  return outputBuffer;
}
