export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function choose<T>(choices: T[]): T {
  return choices[randomInt(choices.length)];
}

export function runFuzz(testCase: () => void) {
  const start = performance.now();
  do {
    testCase();
  } while (performance.now() - start < 30 * 1000);
}
