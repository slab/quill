ScribeEditorTest = require('../lib/editor-test')


describe('Selection', ->
  findIndexes = (html) ->
    $('#test-container').html(html)
    doc = new Scribe.Document($('#test-container').get(0))
    lines = doc.lines.toArray()
    lineIndex = 0
    ret = _.reduce(lines, (indexes, line) ->
      offset = 0
      while Scribe.DOM.getText(line.node).indexOf("|", offset) > -1
        index = Scribe.DOM.getText(line.node).indexOf("|", offset)
        indexes.push(lineIndex + index - indexes.length)
        offset = index + 1
      lineIndex += line.length + 1
      return indexes
    , [])
    return ret

  describe('findIndexes', (html) ->
    it('should find simple indexes', ->
      indexes = findIndexes('<div><span>01|23|4</span></div>')
      expect(indexes[0]).to.equal(2)
      expect(indexes[1]).to.equal(4)
    )
    it('should find multiline indexes', ->
      indexes = findIndexes('<div><span>01|234</span></div><div><span>67|89</span></div>')
      expect(indexes[0]).to.equal(2)
      expect(indexes[1]).to.equal(8)
    )
    it('should find collapsed indexes', ->
      indexes = findIndexes('<div><span>012||34</span></div>')
      expect(indexes[0]).to.equal(3)
      expect(indexes[1]).to.equal(3)
    )
  )

  describe('preserve', ->
    tests =
      'basic preservation':
        'inside a node':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(0, '')
          expected: [0]
        'entire node':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(0, '')
          expected: [0]
        'multiple nodes':
          initial: ['<div><b>0123|4</b><i>5|6789</i></div>']
          fn: (editor) -> editor.insertText(0, '')
          expected: [0]
        'multiple lines':
          initial: ['<div><span>0123|4</span></div>', '<div><span>5|6789</span></div>']
          fn: (editor) -> editor.insertText(0, '')
          expected: [0, 1]
        'entire line':
          initial: ['<div><span>0123</span></div>', '<div><span>|45|</span></div>', '<div><span>6789</span></div>']
          fn: (editor) -> editor.insertText(0, '')
          expected: [0, 1, 2]
        'entire document':
          initial: ['<div><span>|01|</span></div>']
          fn: (editor) -> editor.insertText(0, '')
          expected: [0]
        'empty document':
          initial: ['<div>||<br></div>']
          fn: (editor) -> editor.insertText(0, '')
          expected: [0]
      'insert tests':
        'insert before':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(1, "A")
          expected: ['<div><span>0A123|45|6789</span></div>']
        'insert after':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(7, "A")
          expected: ['<div><span>0123|45|6A789</span></div>']
        'insert at beginning of selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(4, "A")
          expected: ['<div><span>0123|A45|6789</span></div>']
        'insert at end of selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(6, "A")
          expected: ['<div><span>0123|45|A6789</span></div>']
        'insert in middle of selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(5, "A")
          expected: ['<div><span>0123|4A5|6789</span></div>']
        'insert newline at beginning of selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(4, "\n")
          expected: ['<div><span>0123|</span></div>', '<div><span>45|6789</span></div>']
        'initial newline at end of selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(6, "\n")
          expected: ['<div><span>0123|45|</span></div>', '<div><span>6789</span></div>']
        'initial newline at middle of selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(5, "\n")
          expected: ['<div><span>0123|4</span></div>', '<div><span>5|6789</span></div>']
        'initial newline to previous line format':
          initial: ['<div><span>0123456789</span></div>', '<span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertText(10, "\n")
          expected: [0, '<div><br></div>', 1]

      'delete tests':
        'delete before':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteText(1, 2)
          expected: ['<div><span>03|45|6789</span></div>']
        'delete after':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteText(7, 2)
          expected: ['<div><span>0123|45|69</span></div>']
        'delete at beginning of selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteText(2, 2)
          expected: ['<div><span>01|45|6789</span></div>']
        'delete at end of selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteText(6, 2)
          expected: ['<div><span>0123|45|89</span></div>']
        'delete middle of selection':
          initial: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.deleteText(4, 2)
          expected: ['<div><span>012|36|789</span></div>']
        'delete selection':
          initial: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.deleteText(3, 4)
          expected: ['<div><span>012||789</span></div>']
        'delete containing selection':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteText(3, 4)
          expected: ['<div><span>012||789</span></div>']
        'delete beginning of leaf':
          initial: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteText(1, 2)
          expected: ['<div><span>0</span><b>3|45|67</b><span>89</span></div>']
        'delete end of leaf':
          initial: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteText(7, 2)
          expected: ['<div><span>01</span><b>23|45|6</b><span>9</span></div>']
        'delete entire leaf':
          initial: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteText(2, 6)
          expected: ['<div><span>01||89</span></div>']

      'format tests':
        'apply leaf format before':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.formatText(1, 2, 'bold', true)
          expected: ['<div><span>0</span><b>12</b><span>3|45|6789</span></div>']
        'apply leaf format after':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.formatText(7, 2, 'bold', true)
          expected: ['<div><span>0123|45|6</span><b>78</b><span>9</span></div>']
        'apply leaf format in middle':
          initial: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.formatText(4, 2, 'bold', true)
          expected: ['<div><span>012|3</span><b>45</b><span>6|789</span></div>']
        'apply leaf format overlapping beginning':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.formatText(3, 2, 'bold', true)
          expected: ['<div><span>012</span><b>3|4</b><span>5|6789</span></div>']
        'apply leaf format overlapping end':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.formatText(5, 2, 'bold', true)
          expected: ['<div><span>0123|4</span><b>5|6</b><span>789</span></div>']
        'apply leaf format overlapping beginning and end':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.formatText(3, 4, 'bold', true)
          expected: ['<div><span>012</span><b>3|45|6</b><span>789</span></div>']
        'apply leaf format to entire node':
          initial: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.formatText(0, 10, 'bold', true)
          expected: ['<div><b>0123|45|6789</b></div>']
        'apply leaf format to entire node 2':
          initial: ['<div><b>0123|45|6789</b></div>']
          fn: (editor) -> editor.formatText(0, 10, 'italic', true)
          expected: ['<div><i><b>0123|45|6789</b></i></div>']

      'remove format tests':
        'remove leaf format before':
          initial: ['<div><span>0</span><b>12</b><span>3|45|6789</span></div>']
          fn: (editor) -> editor.formatText(1, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf format after':
          initial: ['<div><span>0123|45|6</span><b>78</b><span>9</span></div>']
          fn: (editor) -> editor.formatText(7, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf format in middle':
          initial: ['<div><span>012|3</span><b>45</b><span>6|789</span></div>']
          fn: (editor) -> editor.formatText(4, 2, 'bold', false)
          expected: ['<div><span>012|3456|789</span></div>']
        'remove leaf format overlapping beginning':
          initial: ['<div><span>012</span><b>3|4</b><span>5|6789</span></div>']
          fn: (editor) -> editor.formatText(3, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf format overlapping end':
          initial: ['<div><span>0123|4</span><b>5|6</b><span>789</span></div>']
          fn: (editor) -> editor.formatText(5, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf format overlapping beginning and end':
          initial: ['<div><span>012</span><b>3|45|6</b><span>789</span></div>']
          fn: (editor) -> editor.formatText(3, 4, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf format from entire node':
          initial: ['<div><b>0123|45|6789</b></div>']
          fn: (editor) -> editor.formatText(0, 10, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf format from entire node 2':
          initial: ['<div><i><b>0123|45|6789</b></i></div>']
          fn: (editor) -> editor.formatText(0, 10, 'bold', false)
          expected: ['<div><i>0123|45|6789</i></div>']
        'remove leaf format from entire node 3':
          initial: ['<div><i><b>0123|45|6789</b></i></div>']
          fn: (editor) -> editor.formatText(0, 10, 'italic', false)
          expected: ['<div><b>0123|45|6789</b></div>']

    checker = (testEditor, expectedEditor, testStart, testEnd, expectedStart, expectedEnd) ->
      expect(testEditor.editor.renderer.checkFocus()).to.be(true)
      selection = testEditor.getSelection()
      expect(selection).not.to.be(null)
      expect(selection.start.index).to.equal(expectedStart)
      expect(selection.end.index).to.equal(expectedEnd)

    pre = (testContainer, expectedContainer) ->
      testIndexes = findIndexes(testContainer.innerHTML)
      expectedIndexes = findIndexes(expectedContainer.innerHTML)
      testContainer.innerHTML = testContainer.innerHTML.replace(/\|/g, '')
      expectedContainer.innerHTML = expectedContainer.innerHTML.replace(/\|/g, '')
      return testIndexes.concat(expectedIndexes)

    _.each(tests, (testGroup, groupName) ->
      describe(groupName, ->
        selectionTests = new ScribeEditorTest(
          checker: checker
          ignoreExpect: true
          pre: pre
        )
        _.each(testGroup, (test, name) ->
          selectionTests.run(name,
            initial: test.initial
            expected: test.expected
            fn: (testEditor, expectedEditor, testStart, testEnd, expectedStart, expectedEnd) ->
              testEditor.focus()
              testEditor.setSelection(new Scribe.Range(testEditor.editor, testStart, testEnd))
              test.fn.call(null, testEditor)
          )
        )
      )
    )
  )
)
