import Parchment from 'parchment';


fdescribe('blocks', function() {
  it('add break to initial empty line', function() {
    let block = Parchment.create('block');
    expect(block.children.length).toEqual(1);
    expect(block.children.head.statics.blotName).toEqual('break');
  });

  it('do nothing on empty line with break', function() {
    let blockNode = document.createElement('p');
    let breakNode = document.createElement('br');
    blockNode.appendChild(breakNode);
    let html = blockNode.innerHTML;
    let block = Parchment.create(blockNode);
    expect(block.children.length).toEqual(1);
    expect(block.domNode.innerHTML).toEqual(html);
  });

  it('do nothing on addition to non-empty line', function() {

  });

  it('remove break on dom addition to empty line', function() {

  });

  it('remove break on api addition to empty line', function() {

  });

  it('add break to line that becomes empty', function() {

  });
});
