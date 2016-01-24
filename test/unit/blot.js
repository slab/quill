import Parchment from 'parchment';


describe('Blot', function() {
  describe('Block', function() {
    it('default break', function() {
      let block = Parchment.create('block');
      expect(block.children.length).toEqual(1);
      expect(block.children.head.statics.blotName).toEqual('break');
    });

    it('findNode on empty line', function() {
      let block = Parchment.create('block');
      let [node, offset] = block.findNode(0);
      expect(node).toBeTruthy();
      expect(node.tagName).toEqual('BR');
      expect(offset).toEqual(0);
    });

    it('findNode last of line', function() {
      let blockNode = document.createElement('p');
      blockNode.innerHTML = '<strong>01</strong><em><strong>23</strong></em>';
      let block = Parchment.create(blockNode);
      let [node, offset] = block.findNode(4);
      expect(node).toBeTruthy();
      expect(node instanceof Text).toBe(true);
      expect(node.data).toEqual('23');
      expect(offset).toEqual(2);
    });
  });
});
