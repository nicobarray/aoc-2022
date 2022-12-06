function findMarker(input, packetLength) {
  return [...input].reduce(
    ([buffer, result], char, index) => {
      // The solution was fount.
      if (result !== -1) {
        return [buffer, result];
      }

      buffer += char;

      // Initialize the buffer.
      if (buffer.length < packetLength) {
        return [buffer, -1];
      }

      // Find the solution.
      if (new Set([...buffer]).size === packetLength) {
        return [buffer, index + 1];
      }

      // Move the signal window.
      const [_removedChar, ...rest] = buffer;
      return [rest.join(""), result];
    },
    ["", -1]
  )[1];
}

export function part1(input) {
  return findMarker(input, 4);
}

export function part2(input) {
  return findMarker(input, 14);
}
