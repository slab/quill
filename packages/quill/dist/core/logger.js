const levels = ['error', 'warn', 'log', 'info'];
let level = 'warn';
function debug(method) {
  if (level) {
    if (levels.indexOf(method) <= levels.indexOf(level)) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      console[method](...args); // eslint-disable-line no-console
    }
  }
}
function namespace(ns) {
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
//# sourceMappingURL=logger.js.map