# From canonical document, run every possible legal operation
#
# Insert: O(n * (k+2))
#   - At every location: 
#     - insert letter
#     - insert letter of every format
#     - insert newline
# Delete: O(n^2)
#   - Delete at every possible index, length combination 
# Format: O(n^2 * k)
#   - Format at every possible index, length, attribute, combination 
# Apply delta: O(n^2 * k)
#   - for each above, generate and apply delta 
#
# n - document length
# k - number of formats


expandOps = (ops) ->
  return _.reduce(ops, (expandedOps, op) ->
    return expandedOps.concat(_.map(op.value.split(''), (value) ->
      return new Tandem.InsertOp(value, op.attributes)
    ))
  , [])


describe('Editor', ->
  emptyTemplate = ''
  template = Scribe.Utils.cleanHtml('
    <div><b>Bold</b></div>
    <div><span class="color-red">Red</span></div>
  ', true)
  $('#test-container').html(template)
  editor = new Scribe.Editor('test-container')
  delta = editor.getDelta()
  docLength = editor.getLength()

  describe('insertAt', ->
    editorTest = new Scribe.Test.EditorTest({ initial: template })
    _.each([0..(docLength - 1)], (index) ->
      tests = {
        "insert A":
          value: 'A'
          attributes: {}
        "insert bold A":
          value: 'A'
          attributes: { bold: true }
        "insert red A":
          value: 'A'
          attributes: { color: 'red' }
        "insert newline":
          value: '\n'
          attributes: {}
      }
      _.each(tests, (test, name) ->
        expandedOps = expandOps(delta.ops)
        insertOp = new Tandem.InsertOp(test.value, test.attributes)
        expandedOps.splice(index, 0, insertOp)
        expected = new Tandem.Delta(0, expandedOps)
        editorTest.run("#{name} at #{index}",
          expected: expected
          fn: (testEditor, expectedEditor) ->
            testEditor.insertAt(index, test.value, test.attributes)
        )
      )
    )
  )

  describe('deleteAt', ->
    editorTest = new Scribe.Test.EditorTest({ initial: template })
    _.each([0..(docLength - 2)], (index) ->
      _.each([1..(docLength-index-1)], (length) ->
        deleteDelta = Tandem.Delta.makeDeleteDelta(docLength, index, length)
        expected = delta.compose(deleteDelta)
        editorTest.run("Delete #{length} characters at #{index}",
          expected: expected
          fn: (testEditor, expectedEditor) ->
            testEditor.deleteAt(index, length)
        )
      )
    )
  )

  describe('formatAt', ->
    editorTest = new Scribe.Test.EditorTest({ initial: template })
    _.each([0..(docLength - 2)], (index) ->
      _.each([1..(docLength-index-1)], (length) ->
        formats =
          color: ['red', null]
          bold: [true, false]
        _.each(formats, (values, format) ->
          _.each(values, (value) ->
            attributes = {}
            attributes[format] = value
            retainDelta = Tandem.Delta.makeRetainDelta(docLength, index, length, attributes)
            expected = delta.compose(retainDelta)
            editorTest.run("Applied #{format} #{value} to #{length} characters at #{index}",
              expected: expected
              fn: (testEditor, expectedEditor) ->
                testEditor.formatAt(index, length, format, value)
            )
          )
        )
      )
    )
  )
)
