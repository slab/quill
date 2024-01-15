import { Registry } from 'parchment';
import type { Attributor } from 'parchment';

import Block from '../../../src/blots/block';
import Break from '../../../src/blots/break';
import Cursor from '../../../src/blots/cursor';
import Scroll from '../../../src/blots/scroll';
import TextBlot from '../../../src/blots/text';
import ListItem, { ListContainer } from '../../../src/formats/list';
import Inline from '../../../src/blots/inline';
import Emitter from '../../../src/core/emitter';
import { normalizeHTML } from './utils';

export const createRegistry = (formats: unknown[] = []) => {
  const registry = new Registry();

  formats.forEach((format) => {
    registry.register(format as Attributor);
  });
  registry.register(Block);
  registry.register(Break);
  registry.register(Cursor);
  registry.register(Inline);
  registry.register(Scroll);
  registry.register(TextBlot);
  registry.register(ListContainer);
  registry.register(ListItem);

  return registry;
};

export const createScroll = (
  html: string | { html: string },
  registry = createRegistry(),
  container = document.body,
) => {
  const emitter = new Emitter();
  const root = container.appendChild(document.createElement('div'));
  root.innerHTML = normalizeHTML(html);
  const scroll = new Scroll(registry, root, {
    emitter,
  });
  return scroll;
};
