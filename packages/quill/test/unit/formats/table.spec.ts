import Delta from 'quill-delta';
import Editor from '../../../src/core/editor';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory';
import { describe, expect, test } from 'vitest';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '../../../src/formats/table';
import Header from '../../../src/formats/header';

const createScroll = (html: string) =>
  baseCreateScroll(
    html,
    createRegistry([TableBody, TableCell, TableContainer, TableRow, Header]),
  );

const tableDelta = new Delta()
  .insert('A1')
  .insert('\n', { table: 'a' })
  .insert('A2')
  .insert('\n', { table: 'a' })
  .insert('A3')
  .insert('\n', { table: 'a' })
  .insert('B1')
  .insert('\n', { table: 'b' })
  .insert('B2')
  .insert('\n', { table: 'b' })
  .insert('B3')
  .insert('\n', { table: 'b' })
  .insert('C1')
  .insert('\n', { table: 'c' })
  .insert('C2')
  .insert('\n', { table: 'c' })
  .insert('C3')
  .insert('\n', { table: 'c' });

const tableHTML = `
  <table>
    <tbody>
      <tr>
        <td data-row="a">A1</td>
        <td data-row="a">A2</td>
        <td data-row="a">A3</td>
      </tr>
      <tr>
        <td data-row="b">B1</td>
        <td data-row="b">B2</td>
        <td data-row="b">B3</td>
      </tr>
      <tr>
        <td data-row="c">C1</td>
        <td data-row="c">C2</td>
        <td data-row="c">C3</td>
      </tr>
    </tbody>
  </table>
  `;

describe('Table', () => {
  test('initialize', () => {
    const editor = new Editor(createScroll(tableHTML));
    expect(editor.getDelta()).toEqual(tableDelta);
    expect(editor.scroll.domNode).toEqualHTML(tableHTML);
  });

  test('add', () => {
    const editor = new Editor(createScroll(''));
    editor.applyDelta(new Delta([...tableDelta.ops]).delete(1));
    expect(editor.scroll.domNode).toEqualHTML(tableHTML);
  });

  test('add format plaintext', () => {
    const editor = new Editor(createScroll('<p>Test</p>'));
    editor.formatLine(0, 5, { table: 'a' });
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="a">Test</td>
          </tr>
        </tbody>
      </table>
    `);
  });

  test('add format replace', () => {
    const editor = new Editor(createScroll('<h1>Test</h1>'));
    editor.formatLine(0, 5, { table: 'a' });
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="a">Test</td>
          </tr>
        </tbody>
      </table>
    `);
  });

  test('remove format plaintext', () => {
    const editor = new Editor(
      createScroll('<table><tr><td data-row="a">Test</td></tr></table>'),
    );
    editor.formatLine(0, 5, { table: null });
    expect(editor.scroll.domNode).toEqualHTML('<p>Test</p>');
  });

  test('remove format replace', () => {
    const editor = new Editor(
      createScroll('<table><tr><td data-row="a">Test</td></tr></table>'),
    );
    editor.formatLine(0, 5, { header: 1 });
    expect(editor.scroll.domNode).toEqualHTML('<h1>Test</h1>');
  });

  test('group rows', () => {
    const editor = new Editor(
      createScroll(
        `
      <table>
        <tbody>
          <tr><td data-row="a">A</td></tr>
          <tr><td data-row="a">B</td></tr>
        </tbody>
      </table>
    `,
      ),
    );
    // @ts-expect-error
    editor.scroll.children.head.children.head.children.head.optimize();
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="a">A</td>
            <td data-row="a">B</td>
          </tr>
        </tbody>
      </table>
    `);
  });

  test('split rows', () => {
    const editor = new Editor(
      createScroll(
        `
      <table>
        <tbody>
          <tr><td data-row="a">A</td><td data-row="b">B</td></tr>
        </tbody>
      </table>
    `,
      ),
    );
    // @ts-expect-error
    editor.scroll.children.head.children.head.children.head.optimize();
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="a">A</td>
          </tr>
          <tr>
            <td data-row="b">B</td>
          </tr>
        </tbody>
      </table>
    `);
  });

  test('group and split rows', () => {
    const editor = new Editor(
      createScroll(`
      <table>
        <tbody>
          <tr><td data-row="a">A</td><td data-row="b">B1</td></tr>
          <tr><td data-row="b">B2</td></tr>
        </tbody>
      </table>
    `),
    );
    // @ts-expect-error
    editor.scroll.children.head.children.head.children.head.optimize();
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="a">A</td>
          </tr>
          <tr>
            <td data-row="b">B1</td>
            <td data-row="b">B2</td>
          </tr>
        </tbody>
      </table>
    `);
  });

  test('balance cells', () => {
    const editor = new Editor(
      createScroll(
        `<table>
        <tbody>
          <tr>
            <td data-row="a">A1</td>
          </tr>
          <tr>
            <td data-row="b">B1</td>
            <td data-row="b">B2</td>
          </tr>
          <tr>
            <td data-row="c">C1</td>
            <td data-row="c">C2</td>
            <td data-row="c">C3</td>
          </tr>
        </tbody>
      </table>`,
      ),
    );
    // @ts-expect-error
    editor.scroll.children.head.balanceCells();
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="a">A1</td>
            <td data-row="a"><br /></td>
            <td data-row="a"><br /></td>
          </tr>
          <tr>
            <td data-row="b">B1</td>
            <td data-row="b">B2</td>
            <td data-row="b"><br /></td>
          </tr>
          <tr>
            <td data-row="c">C1</td>
            <td data-row="c">C2</td>
            <td data-row="c">C3</td>
          </tr>
        </tbody>
      </table>
    `);
  });

  test('format', () => {
    const editor = new Editor(createScroll('<p>a</p><p>b</p><p>1</p><p>2</p>'));
    editor.formatLine(0, 4, { table: 'a' });
    editor.formatLine(4, 4, { table: 'b' });
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="a">a</td>
            <td data-row="a">b</td>
          </tr>
          <tr>
            <td data-row="b">1</td>
            <td data-row="b">2</td>
          </tr>
        </tbody>
      </table>
    `);
  });

  test('applyDelta', () => {
    const editor = new Editor(createScroll('<p><br /></p>'));
    editor.applyDelta(
      new Delta().insert('\n\n', { table: 'a' }).insert('\n\n', { table: 'b' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="a"><br /></td>
            <td data-row="a"><br /></td>
          </tr>
          <tr>
            <td data-row="b"><br /></td>
            <td data-row="b"><br /></td>
          </tr>
        </tbody>
      </table>
      <p><br /></p>
    `);
  });

  test('unbalanced table applyDelta', () => {
    const editor = new Editor(createScroll('<p><br /></p>'));
    editor.applyDelta(
      new Delta()
        .insert('A1\nB1\nC1\n', { table: '1' })
        .insert('A2\nB2\nC2\n', { table: '2' })
        .insert('A3\nB3\n', { table: '3' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
            <td data-row="1">B1</td>
            <td data-row="1">C1</td>
          </tr>
          <tr>
            <td data-row="2">A2</td>
            <td data-row="2">B2</td>
            <td data-row="2">C2</td>
          </tr>
          <tr>
            <td data-row="3">A3</td>
            <td data-row="3">B3</td>
          </tr>
        </tbody>
      </table>
      <p><br /></p>
    `);
  });

  test('existing table applyDelta', () => {
    const editor = new Editor(
      createScroll(
        `
      <table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
          </tr>
          <tr>
            <td data-row="2"><br /></td>
            <td data-row="2">B1</td>
          </tr>
        </tbody>
      </table>`,
      ),
    );
    editor.applyDelta(
      new Delta()
        .retain(3)
        .retain(1, { table: '1' })
        .insert('\n', { table: '2' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
            <td data-row="1"><br /></td>
          </tr>
          <tr>
            <td data-row="2"><br /></td>
            <td data-row="2">B1</td>
          </tr>
        </tbody>
      </table>
    `);
  });
});
