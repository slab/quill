#= require mocha
#= require chai
#= require document
#= require jquery


describe('Document', ->
  describe('.normalize()', ->
    it('should initialize empty document', ->
      editor = new Tandem.Editor('editor-container')
      doc = new Tandem.Document(editor)
      expected = $('<div>').attr('id', Tandem.Line.ID_PREFIX + '1').addClass(Tandem.Line.CLASS_NAME).append($('<br>'))
      expect(editor.iframeDoc.body.innerHTML).to.equal(expected.get(0).outerHTML)
      $('#editor-container').empty()
    )

    it('should tranform equivalent styles empty document', ->
      line = $('<div>').attr('id', Tandem.Line.ID_PREFIX + '1').append($('<strong>').text('Strong'))
                                                               .append($('<em>').text('Emphasis'))
                                                               .append($('<del>').text('Deleted'))
                                                               .append($('<strke>').text('Strike'))
                                                               .append($('<b>').text('Bold'))
                                                               .append($('<i>').text('Italic'))
                                                               .append($('<u>').text('Underline'))
                                                               .append($('<s>').text('Strikethrough'))
      $('#editor-container').empty().append(line)
      editor = new Tandem.Editor('editor-container')
      doc = new Tandem.Document(editor)
      expected = $('<div>').attr('id', Tandem.Line.ID_PREFIX + '1').addClass(Tandem.Line.CLASS_NAME)
                                                                   .append($('<b>').text('Strong'))
                                                                   .append($('<i>').text('Emphasis'))
                                                                   .append($('<s>').text('Deleted'))
                                                                   .append($('<s>').text('Strike'))
                                                                   .append($('<b>').text('Bold'))
                                                                   .append($('<i>').text('Italic'))
                                                                   .append($('<u>').text('Underline'))
                                                                   .append($('<s>').text('Strikethrough'))
      expect(editor.iframeDoc.body.innerHTML).to.equal(expected.get(0).outerHTML)
      $('#editor-container').empty()
    )
  )
)
