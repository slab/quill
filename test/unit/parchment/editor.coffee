Delta = require('rich-text/lib/delta')
Editor = require('../../../src/editor')

describe('Editor', ->
  describe('toDelta()', ->
    it('empty', ->
      @container.innerHTML = ''
      editor = new Editor(@container)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><br></p>')
    )

    it('empty line', ->
      @container.innerHTML = '<p><br></p>'
      editor = new Editor(@container)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><br></p>')
    )

    it('empty line no break', ->
      @container.innerHTML = '<p></p>'
      editor = new Editor(@container)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><br></p>')
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
          <img src="http://quilljs.com/images/quill-photo.jpg">\
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
      expect(@container.innerHTML).toEqualHTML(html)
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
      expect(@container.innerHTML).toEqualHTML('<p><strong>01!!23</strong></p>')
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
      expect(@container.innerHTML).toEqualHTML(
        '<p><strong>01<img src="http://quilljs.com/images/cloud.png">23</strong></p>'
      )
    )

    it('on empty line', ->
      @container.innerHTML = '<p>0</p><p><br></p><p>3</p>'
      editor = new Editor(@container)
      editor.insertAt(2, '!')
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('0\n!\n3\n'))
      expect(@container.innerHTML).toEqualHTML('<p>0</p><p>!</p><p>3</p>')
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
      expect(@container.innerHTML).toEqualHTML('\
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
      expect(@container.innerHTML).toEqualHTML('\
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
      expect(@container.innerHTML).toEqualHTML('\
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
      expect(@container.innerHTML).toEqualHTML('\
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
      expect(@container.innerHTML).toEqualHTML('\
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
      expect(@container.innerHTML).toEqualHTML('\
        <p><strong>01</strong></p>\
        <p><strong><br></strong></p>\
        <p><strong>23</strong></p>\
      ')
    )
  )

  describe('deleteAt()', ->
    it('inner node', ->
      @container.innerHTML = '<p><em><strong>0123</strong></em></p>'
      editor = new Editor(@container)
      editor.deleteAt(1, 2)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('03', { bold: true, italic: true }).insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><em><strong>03</strong></em></p>')
    )

    it('parts of multiple lines', ->
      @container.innerHTML = '\
        <p><em>0123</em></p>\
        <p><em>5678</em></p>\
      '
      editor = new Editor(@container)
      editor.deleteAt(2, 5)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('0178', { italic: true }).insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><em>0178</em></p>')
    )

    it('entire line keeping newline', ->
      @container.innerHTML = '<p><em><strong>0123</strong></em></p>'
      editor = new Editor(@container)
      editor.deleteAt(0, 4)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><br></p>')
    )

    it('newline', ->
      @container.innerHTML = '\
        <p><em>0123</em></p>\
        <p><em>5678</em></p>\
      '
      editor = new Editor(@container)
      editor.deleteAt(4, 1)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('01235678', { italic: true }).insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><em>01235678</em></p>')
    )

    it('entire document', ->
      @container.innerHTML = '<p><em><strong>0123</strong></em></p>'
      editor = new Editor(@container)
      editor.deleteAt(0, 5)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><br></p>')
    )

    it('multiple lines', ->
      @container.innerHTML = '\
        <p><em>012</em></p>\
        <p><em>456</em></p>\
        <p><em>890</em></p>\
      '
      editor = new Editor(@container)
      editor.deleteAt(0, 7)
      expect(editor.getDelta()).toEqualDelta(new Delta().insert('890', { italic: true }).insert('\n'))
      expect(@container.innerHTML).toEqualHTML('<p><em>890</em></p>')
    )
  )
)
