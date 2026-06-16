import { Registry } from 'parchment';
const MAX_REGISTER_ITERATIONS = 100;
const CORE_FORMATS = ['block', 'break', 'cursor', 'inline', 'scroll', 'text'];
const createRegistryWithFormats = (formats, sourceRegistry, debug) => {
  const registry = new Registry();
  CORE_FORMATS.forEach(name => {
    const coreBlot = sourceRegistry.query(name);
    if (coreBlot) registry.register(coreBlot);
  });
  formats.forEach(name => {
    let format = sourceRegistry.query(name);
    if (!format) {
      debug.error(`Cannot register "${name}" specified in "formats" config. Are you sure it was registered?`);
    }
    let iterations = 0;
    while (format) {
      registry.register(format);
      format = 'blotName' in format ? format.requiredContainer ?? null : null;
      iterations += 1;
      if (iterations > MAX_REGISTER_ITERATIONS) {
        debug.error(`Cycle detected in registering blot requiredContainer: "${name}"`);
        break;
      }
    }
  });
  return registry;
};
export default createRegistryWithFormats;
//# sourceMappingURL=createRegistryWithFormats.js.map