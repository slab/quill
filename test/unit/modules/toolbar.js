import Toolbar, { addControls } from '../../../modules/toolbar';


describe('Toolbar', function() {
  describe('add controls', function() {
    it('single level', function() {
      addControls(this.container, ['bold', 'italic']);
      expect(this.container).toEqualHTML(`
        <span class="ql-formats">
          <button class='ql-bold'></button>
          <button class='ql-italic'></button>
        </span>
      `);
    });

    it('nested group', function() {
      addControls(this.container, [['bold', 'italic'], ['underline', 'strike']]);
      expect(this.container).toEqualHTML(`
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
        </span>
      `);
    });

    it('button value', function() {
      addControls(this.container, ['bold', { header: '2' }]);
      expect(this.container).toEqualHTML(`
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-header" value="2"></button>
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
        [{ font: [false, 'sans-serif', 'monospace']}, { size: ['10px', false, '18px', '32px'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }, { align: [false, 'center', 'right', 'justify'] }],
        ['link', 'image']
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
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
          <select class="ql-align">
            <option selected="selected"></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
        </span>
      `);
    });
  });
});
