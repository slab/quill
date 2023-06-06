export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function choose<T>(choices: T[]): T {
  return choices[randomInt(choices.length)];
}
