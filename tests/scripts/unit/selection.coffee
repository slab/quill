describe('Selection', ->
  findIndexes = (html) ->
    $('#editor-container').html(html)
    editor = new Scribe.Editor('editor-container')
    lines = editor.doc.lines.toArray()
    lineIndex = 0
    ret = _.reduce(lines, (indexes, line) ->
      offset = 0
      while line.node.textContent.indexOf("|", offset) > -1
        index = line.node.textContent.indexOf("|", offset)
        indexes.push(lineIndex + index - indexes.length)
        offset = index + 1
      lineIndex += line.length + 1
      return indexes
    , [])
    editor.destroy()
    return ret

  describe('findIndexes', (html) ->
    it('should find simple indexes', ->
      indexes = findIndexes('<div><span>01|23|4</span></div>')
      expect(indexes).to.deep.equal([2,4])
    )
    it('should find multiline indexes', ->
      indexes = findIndexes('<div><span>01|234</span></div><div><span>67|89</span></div>')
      expect(indexes).to.deep.equal([2,8])
    )
    it('should find collapsed indexes', ->
      indexes = findIndexes('<div><span>012||34</span></div>')
      expect(indexes).to.deep.equal([3,3])
    )
  )
  
  describe('preserve', ->
    tests = 
      'basic preservation':
        'inside a node':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(0, '')
          expected: [0]
        'entire node':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(0, '')
          expected: [0]
        'multiple nodes':
          lines: ['<div><b>0123|4</b><i>5|6789</i></div>']
          fn: (editor) -> editor.insertAt(0, '')
          expected: [0]
        'multiple lines':
          lines: ['<div><span>0123|4</span></div>', '<div><span>5|6789</span></div>']
          fn: (editor) -> editor.insertAt(0, '')
          expected: [0, 1]
        'entire line':
          lines: ['<div><span>0123</span></div>', '<div><span>|45|</span></div>', '<div><span>6789</span></div>']
          fn: (editor) -> editor.insertAt(0, '')
          expected: [0, 1, 2]
        'entire document':
          lines: ['<div><span>|01|</span></div>']
          fn: (editor) -> editor.insertAt(0, '')
          expected: [0]
        'empty document before':
          lines: ['<div>||<br></div>']
          fn: (editor) -> editor.insertAt(0, '')
          expected: [0]
        'empty document after':
          lines: ['<div><br>||</div>']
          fn: (editor) -> editor.insertAt(0, '')
          expected: [0]

      'insert tests':
        'insert before':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(1, "A")
          expected: ['<div><span>0A123|45|6789</span></div>']
        'insert after':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(7, "A")
          expected: ['<div><span>0123|45|6A789</span></div>']
        'insert at beginning of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(4, "A")
          expected: ['<div><span>0123|A45|6789</span></div>']
        'insert at end of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(6, "A")
          expected: ['<div><span>0123|45|A6789</span></div>']
        'insert in middle of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(5, "A")
          expected: ['<div><span>0123|4A5|6789</span></div>']
        'insert newline at beginning of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(4, "\n")
          expected: ['<div><span>0123|</span></div>', '<div><span>45|6789</span></div>']
        'insert newline at end of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(6, "\n")
          expected: ['<div><span>0123|45|</span></div>', '<div><span>6789</span></div>']
        'insert newline at middle of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(5, "\n")
          expected: ['<div><span>0123|4</span></div>', '<div><span>5|6789</span></div>']
        'insert newline to previous line attribute':
          lines: ['<ol><li><span>0123456789</span></li></ol>', '<span>0123|45|6789</span></div>']
          fn: (editor) -> editor.insertAt(10, "\n")
          expected: [0, '<ol><li><span><br></span></li></ol>', 1]
          
      'delete tests':
        'delete before':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(1, 2)
          expected: ['<div><span>03|45|6789</span></div>']
        'delete after':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(7, 2)
          expected: ['<div><span>0123|45|69</span></div>']
        'delete at beginning of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(2, 2)
          expected: ['<div><span>01|45|6789</span></div>']
        'delete at end of selection':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(6, 2)
          expected: ['<div><span>0123|45|89</span></div>']
        'delete middle of selection':
          lines: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.deleteAt(4, 2)
          expected: ['<div><span>012|36|789</span></div>']
        'delete selection':
          lines: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.deleteAt(3, 4)
          expected: ['<div><span>012||789</span></div>']
        'delete containing selection': 
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.deleteAt(3, 4)
          expected: ['<div><span>012||789</span></div>']
        'delete beginning of leaf':
          lines: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteAt(1, 2)
          expected: ['<div><span>0</span><b>3|45|67</b><span>89</span></div>']
        'delete end of leaf':
          lines: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteAt(7, 2)
          expected: ['<div><span>01</span><b>23|45|6</b><span>9</span></div>']
        'delete entire leaf':
          lines: ['<div><span>01</span><b>23|45|67</b><span>89</span></div>']
          fn: (editor) -> editor.deleteAt(2, 6)
          expected: ['<div><span>01||89</span></div>']

      'apply attribute tests':
        'apply leaf attribute before': 
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(1, 2, 'bold', true)
          expected: ['<div><span>0</span><b>12</b><span>3|45|6789</span></div>']
        'apply leaf attribute after':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(7, 2, 'bold', true)
          expected: ['<div><span>0123|45|6</span><b>78</b><span>9</span></div>']
        'apply leaf attribute in middle':
          lines: ['<div><span>012|3456|789</span></div>']
          fn: (editor) -> editor.applyAttribute(4, 2, 'bold', true)
          expected: ['<div><span>012|3</span><b>45</b><span>6|789</span></div>']
        'apply leaf attribute overlapping beginning':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(3, 2, 'bold', true)
          expected: ['<div><span>012</span><b>3|4</b><span>5|6789</span></div>']
        'apply leaf attribute overlapping end':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(5, 2, 'bold', true)
          expected: ['<div><span>0123|4</span><b>5|6</b><span>789</span></div>']
        'apply leaf attribute overlapping beginning and end':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(3, 4, 'bold', true)
          expected: ['<div><span>012</span><b>3|45|6</b><span>789</span></div>']
        'apply leaf attribute to entire node':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'bold', true)
          expected: ['<div><b>0123|45|6789</b></div>']
        'apply leaf attribute to entire node 2':
          lines: ['<div><b>0123|45|6789</b></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'italic', true)
          expected: ['<div><i><b>0123|45|6789</b></i></div>']
        'apply line attribute':
          lines: ['<div><span>0123|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(1, 2, 'list', 1)
          expected: ['<ol><li><span>0123|45|6789</span></li></ol>']

      'remove attribute tests':
        'remove leaf attribute before': 
          lines: ['<div><span>0</span><b>12</b><span>3|45|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(1, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf attribute after':
          lines: ['<div><span>0123|45|6</span><b>78</b><span>9</span></div>']
          fn: (editor) -> editor.applyAttribute(7, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf attribute in middle':
          lines: ['<div><span>012|3</span><b>45</b><span>6|789</span></div>']
          fn: (editor) -> editor.applyAttribute(4, 2, 'bold', false)
          expected: ['<div><span>012|3456|789</span></div>']
        'remove leaf attribute overlapping beginning':
          lines: ['<div><span>012</span><b>3|4</b><span>5|6789</span></div>']
          fn: (editor) -> editor.applyAttribute(3, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf attribute overlapping end':
          lines: ['<div><span>0123|4</span><b>5|6</b><span>789</span></div>']
          fn: (editor) -> editor.applyAttribute(5, 2, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf attribute overlapping beginning and end':
          lines: ['<div><span>012</span><b>3|45|6</b><span>789</span></div>']
          fn: (editor) -> editor.applyAttribute(3, 4, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf attribute from entire node':
          lines: ['<div><b>0123|45|6789</b></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'bold', false)
          expected: ['<div><span>0123|45|6789</span></div>']
        'remove leaf attribute from entire node 2':
          lines: ['<div><i><b>0123|45|6789</b></i></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'bold', false)
          expected: ['<div><i>0123|45|6789</i></div>']
        'remove leaf attribute from entire node 3':
          lines: ['<div><i><b>0123|45|6789</b></i></div>']
          fn: (editor) -> editor.applyAttribute(0, 10, 'italic', false)
          expected: ['<div><b>0123|45|6789</b></div>']
        'remove line attribute':
          lines: ['<ol><li><span>0123|45|6789</span></li></ol>']
          fn: (editor) -> editor.applyAttribute(1, 2, 'list', false)
          expected: ['<div><span>0123|45|6789</span></div>']

    _.each(tests, (testGroup, groupName) ->
      describe(groupName, ->
        _.each(testGroup, (test, name) ->
          it(name, ->
            html = Scribe.Utils.cleanHtml(test.lines.join(''))
            expectedHtml = _.map(test.expected, (line) ->
              return if _.isNumber(line) then test.lines[line] else line
            ).join('')
            [start, end] = findIndexes(html)
            expectedIndexes = findIndexes(expectedHtml)
            html = html.replace(/\|/g, '')
            expectedHtml = expectedHtml.replace(/\|/g, '')
            $('#editor-container').html(html)
            editor = new Scribe.Editor('editor-container')
            editor.setSelection(new Scribe.Range(editor, start, end))
            sel = editor.getSelection()
            expect([sel.start.getIndex(), sel.end.getIndex()]).to.deep.equal([start, end])
            test.fn(editor)
            sel = editor.getSelection()
            editor.destroy()
            expect(sel).to.exist
            expect([sel.start.getIndex(), sel.end.getIndex()]).to.deep.equal(expectedIndexes)
          )
        )
      )
    )
  )
)
