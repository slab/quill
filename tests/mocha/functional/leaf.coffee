describe('Leaf', ->
  it('Leaf Iterator', ->
    lines = [
      '<div><br></div>'
      '<div><span>12</span></div>'
      '<div><b>45</b></div>'
      '<div><br></div>'
      '<div><br></div>'
      '<div><span>78</span></div>'
      '<div><br></div>']
    $('#test-container').html(lines.join(''))
    editor = new Quill('#test-container')
    lines = editor.editor.doc.lines.toArray()
    leaves = _.reduce(lines, (leaves, line) ->
      leaves.push(_.map(line.leaves.toArray(), (leaf) ->
        return leaf.id
      ))
      return leaves
    , [])
    leaves = _.flatten(leaves)
    leafIterator = new Quill.LeafIterator(lines[0].leaves.first, lines[lines.length-1].leaves.last)
    arr = _.map(leafIterator.toArray(), (leaf) ->
      return leaf.id
    )
    expect(_.isEqual(arr, leaves)).to.be(true)
  )
)
