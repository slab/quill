import { describe, expect, test } from 'vitest';
import normalize from '../../../../../src/modules/normalizeExternalHTML/normalizers/googleDocs';

describe('Google Docs', () => {
  test('remove unnecessary b tags', () => {
    const html = `
      <b
        style="font-weight: normal;"
        id="docs-internal-guid-9f51ddb9-7fff-7da1-2cd6-e966f9297902"
      >
        <span>Item 1</span><b>Item 2</b>
      </b>
      <b
        style="font-weight: bold;"
      >Item 3</b>
      `;

    const doc = new DOMParser().parseFromString(html, 'text/html');
    normalize(doc);
    expect(doc.body.children).toMatchInlineSnapshot(`
      HTMLCollection [
        <span>
          Item 1
        </span>,
        <b>
          Item 2
        </b>,
        <b
          style="font-weight: bold;"
        >
          Item 3
        </b>,
      ]
    `);
  });
});
