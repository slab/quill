import { assertType, expectTypeOf } from 'vitest';
import Quill, { Delta } from '../../src/quill.js';
import type { EmitterSource, Parchment, Range } from '../../src/quill.js';
import type { default as Block, BlockEmbed } from '../../src/blots/block.js';
import SnowTheme from '../../src/themes/snow.js';
import { LeafBlot } from 'parchment';

{
  const Counter = (quill: Quill, options: { unit: string }) => {
    console.log(quill, options);
  };
  Quill.register('modules/counter', Counter);
  Quill.register('themes/snow', SnowTheme);
  Quill.register('themes/snow', SnowTheme, true);

  class MyBlot extends LeafBlot {}

  Quill.register(MyBlot);
  Quill.register(MyBlot, true);
  // @ts-expect-error
  Quill.register(SnowTheme);
  Quill.register({
    'modules/counter': Counter,
    'themes/snow': SnowTheme,
    'formats/my-blot': MyBlot,
  });
  Quill.register(
    {
      'modules/counter': Counter,
      'themes/snow': SnowTheme,
      'formats/my-blot': MyBlot,
    },
    true,
  );
}

const quill = new Quill('#editor');

{
  quill.deleteText(0, 1);
  quill.deleteText(0, 1, 'api');
  quill.deleteText({ index: 0, length: 1 });
  quill.deleteText({ index: 0, length: 1 }, 'api');
}

{
  assertType<Delta>(quill.getContents());
  assertType<Delta>(quill.getContents(1));
  assertType<Delta>(quill.getContents(1, 2));
}

{
  assertType<number>(quill.getLength());
}

{
  assertType<string>(quill.getSemanticHTML());
  assertType<string>(quill.getSemanticHTML(1));
  assertType<string>(quill.getSemanticHTML(1, 2));
}

{
  assertType<Delta>(
    quill.insertEmbed(10, 'image', 'https://example.com/logo.png'),
  );
  assertType<Delta>(
    quill.insertEmbed(10, 'image', 'https://example.com/logo.png', 'api'),
  );
}

{
  quill.insertText(0, 'Hello');
  quill.insertText(0, 'Hello', 'api');
  quill.insertText(0, 'Hello', 'bold', true);
  quill.insertText(0, 'Hello', 'bold', true, 'api');
  quill.insertText(5, 'Quill', {
    color: '#ffff00',
    italic: true,
  });
  quill.insertText(
    5,
    'Quill',
    {
      color: '#ffff00',
      italic: true,
    },
    'api',
  );
}

{
  quill.enable();
  quill.enable(true);
}

{
  quill.disable();
}

{
  assertType<boolean>(quill.editReadOnly(() => true));
  assertType<string>(quill.editReadOnly(() => 'success'));
}

{
  quill.setText('Hello World!');
  quill.setText('Hello World!', 'api');
}

{
  assertType<Delta>(quill.updateContents([{ insert: 'Hello World!' }]));
  assertType<Delta>(quill.updateContents([{ insert: 'Hello World!' }], 'api'));
  assertType<Delta>(quill.updateContents(new Delta().insert('Hello World!')));
  assertType<Delta>(
    quill.updateContents(new Delta().insert('Hello World!'), 'api'),
  );
}

{
  assertType<Delta>(quill.setContents([{ insert: 'Hello World!\n' }]));
  assertType<Delta>(quill.setContents([{ insert: 'Hello World!\n' }], 'api'));
  assertType<Delta>(quill.setContents(new Delta().insert('Hello World!\n')));
  assertType<Delta>(
    quill.setContents(new Delta().insert('Hello World!\n'), 'api'),
  );
}

{
  assertType<Delta>(quill.format('bold', true));
  assertType<Delta>(quill.format('bold', true, 'api'));
}

{
  quill.formatText(0, 1, 'bold', true);
  quill.formatText(0, 1, 'bold', true, 'api');
  quill.formatText(0, 5, {
    bold: false,
    color: 'rgb(0, 0, 255)',
  });
  quill.formatText(
    0,
    5,
    {
      bold: false,
      color: 'rgb(0, 0, 255)',
    },
    'api',
  );
}

{
  quill.formatLine(0, 1, 'bold', true);
  quill.formatLine(0, 1, 'bold', true, 'api');
  quill.formatLine(0, 5, {
    bold: false,
    color: 'rgb(0, 0, 255)',
  });
  quill.formatLine(
    0,
    5,
    {
      bold: false,
      color: 'rgb(0, 0, 255)',
    },
    'api',
  );
}

{
  quill.getFormat();
  quill.getFormat(1);
  quill.getFormat(1, 10);
  quill.getFormat({ index: 1, length: 1 });
}

{
  assertType<Delta>(quill.removeFormat(3, 2));
  assertType<Delta>(quill.removeFormat(3, 2, 'user'));
}

{
  quill.getBounds(3, 2);
}

{
  quill.getSelection();
  quill.getSelection(true);
}

{
  quill.setSelection(1, 2);
  quill.setSelection(1, 2, 'api');
  quill.setSelection({ index: 1, length: 2 });
  quill.setSelection({ index: 1, length: 2 }, 'api');
}

{
  quill.scrollSelectionIntoView();
  quill.scrollSelectionIntoView({ smooth: true });
}

{
  quill.blur();
}

{
  quill.focus();
}

{
  assertType<boolean>(quill.hasFocus());
}

{
  quill.update();
  quill.update('user');
}

{
  quill.scrollRectIntoView({ left: 0, right: 0, top: 0, bottom: 0 });
  quill.scrollRectIntoView(
    document.createElement('div').getBoundingClientRect(),
  );
  quill.scrollRectIntoView(
    document.createElement('div').getBoundingClientRect(),
    { smooth: true },
  );
}

{
  quill.on('text-change', (delta, oldDelta, source) => {
    expectTypeOf<Delta>(delta);
    expectTypeOf<Delta>(oldDelta);
    expectTypeOf<EmitterSource>(source);
  });
}

{
  quill.on('selection-change', (range, oldRange, source) => {
    expectTypeOf<Range>(range);
    expectTypeOf<Range>(oldRange);
    expectTypeOf<EmitterSource>(source);
  });
}

{
  assertType<[Parchment.LeafBlot | null, number]>(quill.getLeaf(0));
}

{
  assertType<[BlockEmbed | Block | null, number]>(quill.getLine(0));
}

{
  assertType<(BlockEmbed | Block)[]>(quill.getLines(0));
  assertType<(BlockEmbed | Block)[]>(quill.getLines(0, 10));
}
