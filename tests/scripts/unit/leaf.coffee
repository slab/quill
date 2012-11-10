describe('Leaf', ->
  it('Leaf Iterator', ->
    lines = ['<div><br></div>', '<div><span>12</span></div>', '<div><b>45</b></div>', '<div><br></div>', '<div><br></div>', '<ul><li><span>78</span></li></ul>', '<ul><li><br></li></ul>']
    $('#editor-container').html(lines.join(''))
    editor = new Tandem.Editor('editor-container')
    lines = editor.doc.lines.toArray()
    leaves = _.reduce(lines, (leaves, line) ->
      leaves.push(_.map(line.leaves.toArray(), (leaf) ->
        return leaf.id
      ))
      return leaves
    , [])
    leaves = _.flatten(leaves)
    leafIterator = new Tandem.LeafIterator(lines[0].leaves.first, lines[lines.length-1].leaves.last)
    arr = _.map(leafIterator.toArray(), (leaf) ->
      return leaf.id
    )
    editor.destroy()
    expect(arr).to.deep.equal(leaves)
  )
)
