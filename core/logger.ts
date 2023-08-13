const levels = ['error', 'warn', 'log', 'info'] as const;
export type DebugLevel = (typeof levels)[number];
let level: DebugLevel | false = 'warn';

function debug(method: DebugLevel, ...args: unknown[]) {
  if (level) {
    if (levels.indexOf(method) <= levels.indexOf(level)) {
      console[method](...args); // eslint-disable-line no-console
    }
  }
}

function namespace(
  ns: string,
): Record<DebugLevel, (...args: unknown[]) => void> {
  return levels.reduce(
    (logger, method) => {
      logger[method] = debug.bind(console, method, ns);
      return logger;
    },
    {} as Record<DebugLevel, (...args: unknown[]) => void>,
  );
}

namespace.level = (newLevel: DebugLevel | false) => {
  level = newLevel;
};
debug.level = namespace.level;

export default namespace;
