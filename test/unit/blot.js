import Parchment from 'parchment';


describe('Blot', function() {
  describe('Block', function() {
    it('default break', function() {
      let block = Parchment.create('block');
      expect(block.children.length).toEqual(1);
      expect(block.children.head.statics.blotName).toEqual('break');
    });
  });
});
