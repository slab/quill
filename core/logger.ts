const levels = ['error', 'warn', 'log', 'info'];
let level = 'warn';

function debug(method: string, ...args: unknown[]) {
  if (levels.indexOf(method) <= levels.indexOf(level)) {
    console[method](...args); // eslint-disable-line no-console
  }
}

function namespace(ns: string): Record<typeof levels[number], typeof debug> {
  return levels.reduce((logger, method) => {
    logger[method] = debug.bind(console, method, ns);
    return logger;
  }, {});
}

namespace.level = newLevel => {
  level = newLevel;
};
debug.level = namespace.level;

export default namespace;
