#= require mocha
#= require chai
#= require document
#= require jquery


describe('Document', ->
  describe('.normalize()', ->
    it('should initialize empty document', ->
      input = $('#editor-container').empty()
      doc = new Tandem.Document(input.get(0))
      expected = $('<div>').addClass('line').attr('id', 'tandem-0').append($('<br>'))
      expect(input.html()).to.equal(expected.get(0).outerHTML)
      $('#editor-container').empty()
    )

    it('should tranform equivalent styles empty document', ->
      input = $('#editor-container').empty().append($('<strong>').text('Strong'))
                                            .append($('<em>').text('Emphasis'))
                                            .append($('<del>').text('Deleted'))
                                            .append($('<strke>').text('Strike'))
                                            .append($('<b>').text('Bold'))
                                            .append($('<i>').text('Italic'))
                                            .append($('<u>').text('Underline'))
                                            .append($('<s>').text('Strikethrough'))
      doc = new Tandem.Document(input.get(0))
      expected = $('<div>').addClass('line').attr('id', 'tandem-0')
                                            .append($('<b>').text('Strong'))
                                            .append($('<i>').text('Emphasis'))
                                            .append($('<s>').text('Deleted'))
                                            .append($('<s>').text('Strike'))
                                            .append($('<b>').text('Bold'))
                                            .append($('<i>').text('Italic'))
                                            .append($('<u>').text('Underline'))
                                            .append($('<s>').text('Strikethrough'))
      expect(input.html()).to.equal(expected.get(0).outerHTML)
      $('#editor-container').empty()
    )
  )
)
