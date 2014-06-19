(function() {
  describe('ColorPicker', function() {
    return it('constructor', function() {
      var container, picker, select;
      container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('<select title="Text Color" class="ql-color"> <option value="rgb(0, 0, 0)" selected></option> <option value="rgb(230, 0, 0)"></option> <option value="rgb(255, 153, 0)"></option> <option value="rgb(255, 255, 0)"></option> <option value="rgb(0, 138, 0)"></option> <option value="rgb(0, 102, 204)"></option> </select>')).get(0);
      select = container.querySelector('select');
      picker = new Quill.Lib.ColorPicker(select);
      return expect(container.querySelector('.ql-color-picker').outerHTML).toEqualHTML('<span title="Text Color" class="ql-color ql-picker ql-color-picker"> <span data-value="rgb(0, 0, 0)" class="ql-picker-label"></span> <span class="ql-picker-options"> <span data-value="rgb(0, 0, 0)" class="ql-picker-item ql-selected" style="background-color: rgb(0, 0, 0);"></span> <span data-value="rgb(230, 0, 0)" class="ql-picker-item" style="background-color: rgb(230, 0, 0);"></span> <span data-value="rgb(255, 153, 0)" class="ql-picker-item" style="background-color: rgb(255, 153, 0);"></span> <span data-value="rgb(255, 255, 0)" class="ql-picker-item" style="background-color: rgb(255, 255, 0);"></span> <span data-value="rgb(0, 138, 0)" class="ql-picker-item" style="background-color: rgb(0, 138, 0);"></span> <span data-value="rgb(0, 102, 204)" class="ql-picker-item" style="background-color: rgb(0, 102, 204);"></span> </span> </span>');
    });
  });

}).call(this);
