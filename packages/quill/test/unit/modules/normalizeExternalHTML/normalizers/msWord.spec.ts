import { describe, expect, test } from 'vitest';
import normalize from '../../../../../src/modules/normalizeExternalHTML/normalizers/msWord';

describe('Microsoft Word', () => {
  test('keep the list style', () => {
    const html = `
      <html xmlns:w="urn:schemas-microsoft-com:office:word">
        <style>
          @list l0:level3 { mso-level-number-format:bullet; }
          @list l2:level1 { mso-level-number-format:alpha; }
        </style>
        <body>
          <p style="mso-list: l0 level1 lfo1"><span style="mso-list: Ignore;">1. </span>item 1</p>
          <p style="mso-list: l0 level3 lfo1">item 2</p>
          <p style="mso-list: l1 level4 lfo1">item 3 in another list</p>
          <p>Plain paragraph</p>
          <p style="mso-list: l2 level1 lfo1">the last item</p>
        </body>
      </html>
      `;

    const doc = new DOMParser().parseFromString(html, 'text/html');
    normalize(doc);
    expect(doc.body.children).toMatchInlineSnapshot(`
      HTMLCollection [
        <ul>
          <li
            data-list="ordered"
          >
            item 1
          </li>
          <li
            class="ql-indent-2"
            data-list="bullet"
          >
            item 2
          </li>
        </ul>,
        <ul>
          <li
            class="ql-indent-3"
            data-list="ordered"
          >
            item 3 in another list
          </li>
        </ul>,
        <p>
          Plain paragraph
        </p>,
        <ul>
          <li
            data-list="ordered"
          >
            the last item
          </li>
        </ul>,
      ]
    `);
  });
});
