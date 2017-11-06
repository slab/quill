import Quill from '../../../core/quill';
import { addControls } from '../../../modules/toolbar';

describe('Toolbar', function() {
  describe('add controls', function() {
    it('single level', function() {
      addControls(this.container, ['bold', 'italic']);
      expect(this.container).toEqualHTML(`
        <span class="ql-formats">
          <button type="button" class="ql-bold"></button>
          <button type="button" class="ql-italic"></button>
        </span>
      `);
    });

    it('nested group', function() {
      addControls(this.container, [
        ['bold', 'italic'],
        ['underline', 'strike'],
      ]);
      expect(this.container).toEqualHTML(`
        <span class="ql-formats">
          <button type="button" class="ql-bold"></button>
          <button type="button" class="ql-italic"></button>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-underline"></button>
          <button type="button" class="ql-strike"></button>
        </span>
      `);
    });

    it('button value', function() {
      addControls(this.container, ['bold', { header: '2' }]);
      expect(this.container).toEqualHTML(`
        <span class="ql-formats">
          <button type="button" class="ql-bold"></button>
          <button type="button" class="ql-header" value="2"></button>
        </span>
      `);
    });

    it('select', function() {
      addControls(this.container, [{ size: ['10px', false, '18px', '32px'] }]);
      expect(this.container).toEqualHTML(`
        <span class="ql-formats">
          <select class="ql-size">
            <option value="10px"></option>
            <option selected="selected"></option>
            <option value="18px"></option>
            <option value="32px"></option>
          </select>
        </span>
      `);
    });

    it('everything', function() {
      addControls(this.container, [
        [
          { font: [false, 'sans-serif', 'monospace'] },
          { size: ['10px', false, '18px', '32px'] },
        ],
        ['bold', 'italic', 'underline', 'strike'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { align: [false, 'center', 'right', 'justify'] },
        ],
        ['link', 'image'],
      ]);
      expect(this.container).toEqualHTML(`
        <span class="ql-formats">
          <select class="ql-font">
            <option selected="selected"></option>
            <option value="sans-serif"></option>
            <option value="monospace"></option>
          </select>
          <select class="ql-size">
            <option value="10px"></option>
            <option selected="selected"></option>
            <option value="18px"></option>
            <option value="32px"></option>
          </select>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-bold"></button>
          <button type="button" class="ql-italic"></button>
          <button type="button" class="ql-underline"></button>
          <button type="button" class="ql-strike"></button>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-list" value="ordered"></button>
          <button type="button" class="ql-list" value="bullet"></button>
          <select class="ql-align">
            <option selected="selected"></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-link"></button>
          <button type="button" class="ql-image"></button>
        </span>
      `);
    });
  });

  describe('active', function() {
    beforeEach(function() {
      const container = this.initialize(
        HTMLElement,
        `
        <p>0123</p>
        <p><strong>5678</strong></p>
        <p><a href="http://quilljs.com/">0123</a></p>
        <p class="ql-align-center">5678</p>
        <p><span class="ql-size-small">01</span><span class="ql-size-large">23</span></p>
      `,
      );
      this.quill = new Quill(container, {
        modules: {
          toolbar: [
            ['bold', 'link'],
            [{ size: ['small', false, 'large'] }],
            [{ align: '' }, { align: 'center' }],
          ],
        },
        theme: 'snow',
      });
    });

    it('toggle button', function() {
      const boldButton = this.container.parentNode.querySelector(
        'button.ql-bold',
      );
      this.quill.setSelection(7);
      expect(boldButton.classList.contains('ql-active')).toBe(true);
      this.quill.setSelection(2);
      expect(boldButton.classList.contains('ql-active')).toBe(false);
    });

    it('link', function() {
      const linkButton = this.container.parentNode.querySelector(
        'button.ql-link',
      );
      this.quill.setSelection(12);
      expect(linkButton.classList.contains('ql-active')).toBe(true);
      this.quill.setSelection(2);
      expect(linkButton.classList.contains('ql-active')).toBe(false);
    });

    it('dropdown', function() {
      const sizeSelect = this.container.parentNode.querySelector(
        'select.ql-size',
      );
      this.quill.setSelection(21);
      expect(sizeSelect.selectedIndex).toEqual(0);
      this.quill.setSelection(23);
      expect(sizeSelect.selectedIndex).toEqual(2);
      this.quill.setSelection(21, 2);
      expect(sizeSelect.selectedIndex).toBeLessThan(0);
      this.quill.setSelection(2);
      expect(sizeSelect.selectedIndex).toEqual(1);
    });

    it('custom button', function() {
      const centerButton = this.container.parentNode.querySelector(
        'button.ql-align[value="center"]',
      );
      const leftButton = this.container.parentNode.querySelector(
        'button.ql-align[value]',
      );
      this.quill.setSelection(17);
      expect(centerButton.classList.contains('ql-active')).toBe(true);
      expect(leftButton.classList.contains('ql-active')).toBe(false);
      this.quill.setSelection(2);
      expect(centerButton.classList.contains('ql-active')).toBe(false);
      expect(leftButton.classList.contains('ql-active')).toBe(true);
      this.quill.blur();
      expect(centerButton.classList.contains('ql-active')).toBe(false);
      expect(leftButton.classList.contains('ql-active')).toBe(false);
    });
  });
});
