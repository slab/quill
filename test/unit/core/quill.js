import Quill from 'quill/quill';


describe('Quill', function() {
  describe('setContents()', function() {
    it('empty', function() {
      let quill = this.initialize(Quill, '');
      let state = this.initialStates['empty'];
      quill.setContents(state.delta);
      expect(quill.getContents()).toEqual(state.delta);
      expect(quill.root.innerHTML).toEqual(state.html);
    });

    it('single line', function() {
      let quill = this.initialize(Quill, '');
      let state = this.initialStates['single line'];
      quill.setContents(state.delta);
      expect(quill.getContents()).toEqual(state.delta);
      expect(quill.root.innerHTML).toEqual(state.html);
    });

    it('multiple lines', function() {
      let quill = this.initialize(Quill, '');
      let state = this.initialStates['multiple lines'];
      quill.setContents(state.delta);
      expect(quill.getContents()).toEqual(state.delta);
      expect(quill.root.innerHTML).toEqual(state.html);
    });

    it('basic formats', function() {
      let quill = this.initialize(Quill, '');
      let state = this.initialStates['basic formats'];
      quill.setContents(state.delta);
      expect(quill.getContents()).toEqual(state.delta);
      expect(quill.root.innerHTML).toEqual(state.html);
    });
  });
});
