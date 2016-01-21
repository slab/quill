let levels = ['error', 'warn', 'log', 'info'];
let level = 'warn';

function debug(method, ...args) {
  if (levels.indexOf(method) <= levels.indexOf(level)) {
    console[method].apply(console, args);
  }
}

function namespace(ns) {
  return levels.reduce(function(logger, method) {
    logger[method] = debug.bind(console, method, ns);
    return logger;
  }, {});
}

debug.level = namespace.level = function(newLevel) {
  level = newLevel;
};


export default namespace;
