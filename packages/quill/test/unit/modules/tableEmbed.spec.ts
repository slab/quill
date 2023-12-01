import Delta from 'quill-delta';
import { tableHandler } from '../../../src/modules/tableEmbed';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('tableHandler', () => {
  beforeEach(() => {
    Delta.registerEmbed('table-embed', tableHandler);
  });

  afterEach(() => {
    Delta.unregisterEmbed('table-embed');
  });

  describe('compose', () => {
    test('adds a row', () => {
      const base = new Delta([
        {
          insert: {
            'table-embed': {
              rows: [
                { insert: { id: '11111111' }, attributes: { height: 20 } },
              ],
              columns: [
                { insert: { id: '22222222' } },
                { insert: { id: '33333333' }, attributes: { width: 30 } },
                { insert: { id: '44444444' } },
              ],
              cells: {
                '1:2': {
                  content: [{ insert: 'Hello' }],
                  attributes: { align: 'center' },
                },
              },
            },
          },
        },
      ]);

      const change = new Delta([
        {
          retain: { 'table-embed': { rows: [{ insert: { id: '55555555' } }] } },
        },
      ]);

      expect(base.compose(change)).toEqual(
        new Delta([
          {
            insert: {
              'table-embed': {
                rows: [
                  { insert: { id: '55555555' } },
                  { insert: { id: '11111111' }, attributes: { height: 20 } },
                ],
                columns: [
                  { insert: { id: '22222222' } },
                  { insert: { id: '33333333' }, attributes: { width: 30 } },
                  { insert: { id: '44444444' } },
                ],
                cells: {
                  '2:2': {
                    content: [{ insert: 'Hello' }],
                    attributes: { align: 'center' },
                  },
                },
              },
            },
          },
        ]),
      );
    });

    test('adds two rows', () => {
      const base = new Delta([
        {
          insert: {
            'table-embed': {
              rows: [
                { insert: { id: '11111111' }, attributes: { height: 20 } },
              ],
              columns: [
                { insert: { id: '22222222' } },
                { insert: { id: '33333333' }, attributes: { width: 30 } },
                { insert: { id: '44444444' } },
              ],
              cells: {
                '1:2': {
                  content: [{ insert: 'Hello' }],
                  attributes: { align: 'center' },
                },
              },
            },
          },
        },
      ]);

      const change = new Delta([
        {
          retain: {
            'table-embed': {
              rows: [
                { insert: { id: '55555555' } },
                { insert: { id: '66666666' } },
              ],
            },
          },
        },
      ]);

      expect(base.compose(change)).toEqual(
        new Delta([
          {
            insert: {
              'table-embed': {
                rows: [
                  { insert: { id: '55555555' } },
                  { insert: { id: '66666666' } },
                  { insert: { id: '11111111' }, attributes: { height: 20 } },
                ],
                columns: [
                  { insert: { id: '22222222' } },
                  { insert: { id: '33333333' }, attributes: { width: 30 } },
                  { insert: { id: '44444444' } },
                ],
                cells: {
                  '3:2': {
                    content: [{ insert: 'Hello' }],
                    attributes: { align: 'center' },
                  },
                },
              },
            },
          },
        ]),
      );
    });

    test('adds a row and changes cell content', () => {
      const base = new Delta([
        {
          insert: {
            'table-embed': {
              rows: [
                { insert: { id: '11111111' } },
                { insert: { id: '22222222' }, attributes: { height: 20 } },
              ],
              columns: [
                { insert: { id: '33333333' } },
                { insert: { id: '44444444' }, attributes: { width: 30 } },
                { insert: { id: '55555555' } },
              ],
              cells: {
                '2:2': { content: [{ insert: 'Hello' }] },
                '2:3': { content: [{ insert: 'World' }] },
              },
            },
          },
        },
      ]);

      const change = new Delta([
        {
          retain: {
            'table-embed': {
              rows: [{ insert: { id: '66666666' } }],
              cells: {
                '3:2': { attributes: { align: 'right' } },
                '3:3': { content: [{ insert: 'Hello ' }] },
              },
            },
          },
        },
      ]);

      expect(base.compose(change)).toEqual(
        new Delta([
          {
            insert: {
              'table-embed': {
                rows: [
                  { insert: { id: '66666666' } },
                  { insert: { id: '11111111' } },
                  { insert: { id: '22222222' }, attributes: { height: 20 } },
                ],
                columns: [
                  { insert: { id: '33333333' } },
                  { insert: { id: '44444444' }, attributes: { width: 30 } },
                  { insert: { id: '55555555' } },
                ],
                cells: {
                  '3:2': {
                    content: [{ insert: 'Hello' }],
                    attributes: { align: 'right' },
                  },
                  '3:3': { content: [{ insert: 'Hello World' }] },
                },
              },
            },
          },
        ]),
      );
    });

    test('deletes a column', () => {
      const base = new Delta([
        {
          insert: {
            'table-embed': {
              rows: [
                { insert: { id: '11111111' }, attributes: { height: 20 } },
              ],
              columns: [
                { insert: { id: '22222222' } },
                { insert: { id: '33333333' }, attributes: { width: 30 } },
                { insert: { id: '44444444' } },
              ],
              cells: {
                '1:2': {
                  content: [{ insert: 'Hello' }],
                  attributes: { align: 'center' },
                },
              },
            },
          },
        },
      ]);

      const change = new Delta([
        {
          retain: {
            'table-embed': {
              columns: [{ retain: 1 }, { delete: 1 }],
            },
          },
        },
      ]);

      expect(base.compose(change)).toEqual(
        new Delta([
          {
            insert: {
              'table-embed': {
                rows: [
                  { insert: { id: '11111111' }, attributes: { height: 20 } },
                ],
                columns: [
                  { insert: { id: '22222222' } },
                  { insert: { id: '44444444' } },
                ],
              },
            },
          },
        ]),
      );
    });

    test('removes a cell attributes', () => {
      const base = new Delta([
        {
          insert: {
            'table-embed': {
              cells: { '1:2': { attributes: { align: 'center' } } },
            },
          },
        },
      ]);

      const change = new Delta([
        {
          retain: {
            'table-embed': {
              cells: { '1:2': { attributes: { align: null } } },
            },
          },
        },
      ]);

      expect(base.compose(change)).toEqual(
        new Delta([{ insert: { 'table-embed': {} } }]),
      );
    });

    test('removes all rows', () => {
      const base = new Delta([
        {
          insert: { 'table-embed': { rows: [{ insert: { id: '11111111' } }] } },
        },
      ]);

      const change = new Delta([
        { retain: { 'table-embed': { rows: [{ delete: 1 }] } } },
      ]);

      expect(base.compose(change)).toEqual(
        new Delta([{ insert: { 'table-embed': {} } }]),
      );
    });
  });

  describe('transform', () => {
    test('transform rows and columns', () => {
      const change1 = new Delta([
        {
          retain: {
            'table-embed': {
              rows: [
                { insert: { id: '11111111' } },
                { insert: { id: '22222222' } },
                { insert: { id: '33333333' }, attributes: { height: 100 } },
              ],
              columns: [
                { insert: { id: '44444444' }, attributes: { width: 100 } },
                { insert: { id: '55555555' } },
                { insert: { id: '66666666' } },
              ],
            },
          },
        },
      ]);

      const change2 = new Delta([
        {
          retain: {
            'table-embed': {
              rows: [{ delete: 1 }, { retain: 1, attributes: { height: 50 } }],
              columns: [
                { delete: 1 },
                { retain: 2, attributes: { width: 40 } },
              ],
            },
          },
        },
      ]);

      expect(change1.transform(change2)).toEqual(
        new Delta([
          {
            retain: {
              'table-embed': {
                rows: [
                  { retain: 3 },
                  { delete: 1 },
                  { retain: 1, attributes: { height: 50 } },
                ],
                columns: [
                  { retain: 3 },
                  { delete: 1 },
                  { retain: 2, attributes: { width: 40 } },
                ],
              },
            },
          },
        ]),
      );
    });

    test('transform cells', () => {
      const change1 = new Delta([
        {
          retain: {
            'table-embed': {
              rows: [{ insert: { id: '22222222' } }],
              cells: {
                '8:1': {
                  content: [{ insert: 'Hello 8:1!' }],
                },
                '21:2': {
                  content: [{ insert: 'Hello 21:2!' }],
                },
              },
            },
          },
        },
      ]);

      const change2 = new Delta([
        {
          retain: {
            'table-embed': {
              rows: [{ delete: 1 }],
              cells: {
                '6:1': {
                  content: [{ insert: 'Hello 6:1!' }],
                },
                '52:8': {
                  content: [{ insert: 'Hello 52:8!' }],
                },
              },
            },
          },
        },
      ]);

      expect(change1.transform(change2)).toEqual(
        new Delta([
          {
            retain: {
              'table-embed': {
                rows: [{ retain: 1 }, { delete: 1 }],
                cells: {
                  '7:1': {
                    content: [{ insert: 'Hello 6:1!' }],
                  },
                  '53:8': {
                    content: [{ insert: 'Hello 52:8!' }],
                  },
                },
              },
            },
          },
        ]),
      );
    });

    test('transform cell attributes', () => {
      const change1 = new Delta([
        {
          retain: {
            'table-embed': {
              cells: { '8:1': { attributes: { align: 'right' } } },
            },
          },
        },
      ]);

      const change2 = new Delta([
        {
          retain: {
            'table-embed': {
              cells: { '8:1': { attributes: { align: 'left' } } },
            },
          },
        },
      ]);

      expect(change1.transform(change2)).toEqual(
        new Delta([
          {
            retain: {
              'table-embed': {
                cells: { '8:1': { attributes: { align: 'left' } } },
              },
            },
          },
        ]),
      );

      expect(change1.transform(change2, true)).toEqual(
        new Delta([{ retain: { 'table-embed': {} } }]),
      );
    });
  });

  describe('invert', () => {
    test('reverts rows and columns', () => {
      const base = new Delta([
        {
          insert: {
            'table-embed': {
              rows: [
                { insert: { id: '11111111' } },
                { insert: { id: '22222222' } },
              ],
              columns: [
                { insert: { id: '33333333' } },
                { insert: { id: '44444444' }, attributes: { width: 100 } },
              ],
            },
          },
        },
      ]);

      const change = new Delta([
        {
          retain: {
            'table-embed': {
              rows: [{ delete: 1 }],
              columns: [{ retain: 1 }, { delete: 1 }],
            },
          },
        },
      ]);

      expect(change.invert(base)).toEqual(
        new Delta([
          {
            retain: {
              'table-embed': {
                rows: [{ insert: { id: '11111111' } }],
                columns: [
                  { retain: 1 },
                  { insert: { id: '44444444' }, attributes: { width: 100 } },
                ],
              },
            },
          },
        ]),
      );
    });

    test('inverts cell content', () => {
      const base = new Delta([
        {
          insert: {
            'table-embed': {
              rows: [
                { insert: { id: '11111111' } },
                { insert: { id: '22222222' } },
              ],
              columns: [
                { insert: { id: '33333333' } },
                { insert: { id: '44444444' } },
              ],
              cells: {
                '1:2': {
                  content: [{ insert: 'Hello 1:2' }],
                  attributes: { align: 'center' },
                },
              },
            },
          },
        },
      ]);
      const change = new Delta([
        {
          retain: {
            'table-embed': {
              rows: [{ insert: { id: '55555555' } }],
              cells: {
                '2:2': {
                  content: [{ retain: 6 }, { insert: '2' }, { delete: 1 }],
                },
              },
            },
          },
        },
      ]);
      expect(change.invert(base)).toEqual(
        new Delta([
          {
            retain: {
              'table-embed': {
                rows: [{ delete: 1 }],
                cells: {
                  '1:2': {
                    content: [{ retain: 6 }, { insert: '1' }, { delete: 1 }],
                  },
                },
              },
            },
          },
        ]),
      );
    });

    test('inverts cells removed by row/column delta', () => {
      const base = new Delta([
        {
          insert: {
            'table-embed': {
              rows: [
                { insert: { id: '11111111' } },
                { insert: { id: '22222222' } },
              ],
              columns: [
                { insert: { id: '33333333' } },
                { insert: { id: '44444444' } },
              ],
              cells: {
                '1:2': {
                  content: [{ insert: 'content' }],
                  attributes: { align: 'center' },
                },
              },
            },
          },
        },
      ]);
      const change = new Delta([
        {
          retain: {
            'table-embed': {
              columns: [{ retain: 1 }, { delete: 1 }],
            },
          },
        },
      ]);
      expect(change.invert(base)).toEqual(
        new Delta([
          {
            retain: {
              'table-embed': {
                columns: [{ retain: 1 }, { insert: { id: '44444444' } }],
                cells: {
                  '1:2': {
                    content: [{ insert: 'content' }],
                    attributes: { align: 'center' },
                  },
                },
              },
            },
          },
        ]),
      );
    });
  });
});
