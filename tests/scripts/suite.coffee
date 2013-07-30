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

class ScribeTestSuite
  constructor: (@options) ->
    @options.initial = Scribe.Test.HtmlTest.cleanHtml(@options.initial, true)
    $('#test-container').html(options.initial)
    doc = new Scribe.Document($('#test-container').get(0))
    @delta = doc.toDelta()
    @docLength = @delta.endLength
    @editorTest = new Scribe.Test.EditorTest(@options)


class ScribeInsertTestSuite extends ScribeTestSuite
  constructor: (options) ->
    super

  run: ->
    _.each([0..(@docLength - 1)], (index) =>
      return unless index >= 0
      tests = {
        "insert nothing":
          value: ''
          attributes: {}
        "insert A":
          value: 'A'
          attributes: {}
        "insert bold A":
          value: 'A'
          attributes: { bold: true }
        "insert red A":
          value: 'A'
          attributes: { color: '#f00' }
        "insert newline":
          value: '\n'
          attributes: {}
        "insert multiline text":
          value: 'A\nB'
          attributes: {}
        "insert triple line text":
          value: 'A\nB\nC'
          attributes: {}
      }
      _.each(tests, (test, name) =>
        insertDelta = Tandem.Delta.makeInsertDelta(@docLength, index, test.value, test.attributes)
        expected = @delta.compose(insertDelta)
        @editorTest.run("#{name} at #{index}",
          expected: expected
          fn: (testEditor, expectedEditor) ->
            testEditor.insertAt(index, test.value, test.attributes)
        )
      )
    )


class ScribeDeleteTestSuite extends ScribeTestSuite
  constructor: (options) ->
    super

  run: ->
    _.each([0..(@docLength - 2)], (index) =>
      return unless index >= 0
      _.each([0..(@docLength-index-1)], (length) =>
        deleteDelta = Tandem.Delta.makeDeleteDelta(@docLength, index, length)
        expected = @delta.compose(deleteDelta)
        @editorTest.run("Delete #{length} characters at #{index}",
          expected: expected
          fn: (testEditor, expectedEditor) ->
            testEditor.deleteAt(index, length)
        )
      )
    )


class ScribeFormatTestSuite extends ScribeTestSuite
  constructor: (options) ->
    super

  run: ->
    _.each([0..(@docLength - 2)], (index) =>
      return unless index >= 0
      _.each([0..(@docLength-index-1)], (length) =>
        formats =
          color: ['red', null]
          bold: [true, false]
        _.each(formats, (values, format) =>
          _.each(values, (value) =>
            attributes = {}
            attributes[format] = value
            retainDelta = Tandem.Delta.makeRetainDelta(@docLength, index, length, attributes)
            expected = @delta.compose(retainDelta)
            @editorTest.run("Apply #{format} #{value} to #{length} characters at #{index}",
              expected: expected
              fn: (testEditor, expectedEditor) ->
                testEditor.formatAt(index, length, format, value)
            )
          )
        )
      )
    )
    

window.Scribe.Test.InsertTestSuite = ScribeInsertTestSuite
window.Scribe.Test.DeleteTestSuite = ScribeDeleteTestSuite
window.Scribe.Test.FormatTestSuite = ScribeFormatTestSuite
