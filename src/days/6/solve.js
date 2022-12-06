export function part1(input) {
  return [...input].reduce(
    ([buffer, result], char, index) => {
      // The solution was fount.
      if (result !== -1) {
        return [buffer, result];
      }

      buffer += char;

      // Initialize the buffer.
      if (buffer.length < 4) {
        return [buffer, -1];
      }

      // Find the solution.
      if (new Set([...buffer]).size === 4) {
        return [buffer, index + 1];
      }

      // Move the signal window.
      const [_removedChar, ...rest] = buffer;
      return [rest.join(""), result];
    },
    ["", -1]
  )[1];
}
