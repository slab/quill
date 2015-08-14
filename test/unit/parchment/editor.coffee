Delta = require('rich-text/lib/delta')
Editor = require('../../../src/editor')

describe('Editor', ->
  beforeEach( ->
    @container = jasmine.clearContainer()
  )

  describe('toDelta()', ->
    it('empty', ->
      @container.innerHTML = ''
      editor = new Editor(@container)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('\n'))
      expect(@container.innerHTML).toEqual('<p><br></p>')
    )

    it('empty line', ->
      @container.innerHTML = '<p><br></p>'
      editor = new Editor(@container)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('\n'))
      expect(@container.innerHTML).toEqual('<p><br></p>')
    )

    it('empty line no break', ->
      @container.innerHTML = '<p></p>'
      editor = new Editor(@container)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('\n'))
      expect(@container.innerHTML).toEqual('<p><br></p>')
    )

    it('full document', ->
      @container.innerHTML = html = '
        <p><span style="font-size: 18px;">Quill Rich Text Editor</span></p>\
        <p><br></p>\
        <p>Quill is a free, <a href="https://github.com/quilljs/quill/">open source</a> WYSIWYG editor built for the modern web.</p>\
        <p><br></p>\
        <ul>\
          <li>Fast and lightweight</li>\
          <li>Semantic markup</li>\
          <li>Standardized HTML between browsers</li>\
          <li>Cross browser support including Chrome, Firefox, Safari, and IE 9+</li>\
        </ul>\
        <p><br></p>\
        <p style="text-align: center;">\
          <img src="http://quilljs.com/images/quill-photo.jpg" alt="Quill Pen">\
        </p>\
        <p style="text-align: center;">\
          <a style="font-size: 32px;" href="https://github.com/quilljs/quill/releases/download/v0.20.0/quill.tar.gz">Download Quill</a>\
        </p>\
        <p><br></p>\
      '
      editor = new Editor(@container)
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('Quill Rich Text Editor', { size: '18px' })
        .insert('\n\nQuill is a free, ')
        .insert('open source', { link: 'https://github.com/quilljs/quill/' })
        .insert(' WYSIWYG editor built for the modern web.\n\nFast and lightweight')
        .insert('\n', { bullet: true })
        .insert('Semantic markup')
        .insert('\n', { bullet: true })
        .insert('Standardized HTML between browsers')
        .insert('\n', { bullet: true })
        .insert('Cross browser support including Chrome, Firefox, Safari, and IE 9+')
        .insert('\n', { bullet: true })
        .insert('\n')
        .insert(1, { image: 'http://quilljs.com/images/quill-photo.jpg' })
        .insert('\n', { align: 'center' })
        .insert('Download Quill', { size: '32px', link: 'https://github.com/quilljs/quill/releases/download/v0.20.0/quill.tar.gz' })
        .insert('\n', { align: 'center' })
        .insert('\n')
      )
      expect(@container.innerHTML).toEqual(html)
    )
  )

  describe('insertAt()', ->
    it('text', ->
      @container.innerHTML = '<p><strong>0123</strong></p>'
      editor = new Editor(@container)
      editor.insertAt(2, '!!')
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('01!!23', { bold: true })
        .insert('\n')
      )
      expect(@container.innerHTML).toEqual('<p><strong>01!!23</strong></p>')
    )

    it('embed', ->
      @container.innerHTML = '<p><strong>0123</strong></p>'
      editor = new Editor(@container)
      editor.insertAt(2, 'image', 'http://quilljs.com/images/cloud.png')
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('01', { bold: true })
        .insert(1, { image: 'http://quilljs.com/images/cloud.png', bold: true })
        .insert('23', { bold: true })
        .insert('\n')
      )
      expect(@container.innerHTML).toEqual(
        '<p><strong>01<img src="http://quilljs.com/images/cloud.png">23</strong></p>'
      )
    )

    it('newline splitting', ->
      @container.innerHTML = '<p><strong>0123</strong></p>'
      editor = new Editor(@container)
      editor.insertAt(2, '\n')
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('01', { bold: true })
        .insert('\n')
        .insert('23', { bold: true })
        .insert('\n')
      )
      expect(@container.innerHTML).toEqual('\
        <p><strong>01</strong></p>\
        <p><strong>23</strong></p>\
      ')
    )

    it('prepend newline', ->
      @container.innerHTML = '<p><strong>0123</strong></p>'
      editor = new Editor(@container)
      editor.insertAt(0, '\n')
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('\n')
        .insert('0123', { bold: true })
        .insert('\n')
      )
      expect(@container.innerHTML).toEqual('\
        <p><strong><br></strong></p>\
        <p><strong>0123</strong></p>\
      ')
    )

    xit('append newline', ->
      @container.innerHTML = '<p><strong>0123</strong></p>'
      editor = new Editor(@container)
      editor.insertAt(4, '\n')
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('\n')
        .insert('0123', { bold: true })
        .insert('\n\n')
      )
      expect(@container.innerHTML).toEqual('\
        <p><strong>0123</strong></p>\
        <p><strong><br></strong></p>\
      ')
    )

    xit('end of document', ->
      @container.innerHTML = '<p><strong>0123</strong></p>'
      editor = new Editor(@container)
      editor.insertAt(5, '\n')
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('\n')
        .insert('0123', { bold: true })
        .insert('\n\n')
      )
      expect(@container.innerHTML).toEqual('\
        <p><strong>0123</strong></p>\
        <p><br></p>\
      ')
    )

    it('multiline text', ->
      @container.innerHTML = '<p><strong>0123</strong></p>'
      editor = new Editor(@container)
      editor.insertAt(2, '\n!!\n!!\n')
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('01', { bold: true })
        .insert('\n')
        .insert('!!', { bold: true })
        .insert('\n')
        .insert('!!', { bold: true })
        .insert('\n')
        .insert('23', { bold: true })
        .insert('\n')
      )
      expect(@container.innerHTML).toEqual('\
        <p><strong>01</strong></p>\
        <p><strong>!!</strong></p>\
        <p><strong>!!</strong></p>\
        <p><strong>23</strong></p>\
      ')
    )

    it('multiple newlines', ->
      @container.innerHTML = '<p><strong>0123</strong></p>'
      editor = new Editor(@container)
      editor.insertAt(2, '\n\n')
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('01', { bold: true })
        .insert('\n\n')
        .insert('23', { bold: true })
        .insert('\n')
      )
      expect(@container.innerHTML).toEqual('\
        <p><strong>01</strong></p>\
        <p><strong><br></strong></p>\
        <p><strong>23</strong></p>\
      ')
    )
  )

  describe('deleteAt()', ->

  )

  describe('formatAt()', ->

  )
)
