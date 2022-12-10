export function part1(input) {
  let cycle = 0;
  let x = 1;
  let str = 0;

  function tick() {
    cycle++;
    if (cycle >= 20 && (cycle - 20) % 40 === 0) {
      str += x * cycle;
      console.log(cycle + "=", x * cycle, x);
    }
  }

  const opImpl = {
    noop: tick,
    addx: (v) => {
      tick();
      tick();
      x += v;
    },
  };

  for (let instr of input.split("\n")) {
    const [op, v] = instr.split(" ");
    opImpl[op](Number(v));
  }

  return str;
}
