describe('Keyboard', ->
  beforeEach( ->
    @container = $('#editor-container').get(0)
    @container.innerHTML = '
      <div>
        <div><s>01</s><b>23</b><span>45</span></div>
      </div>'
    @quill = new Quill(@container.firstChild)
    @keyboard = @quill.getModule('keyboard')
  )

  describe('toggleFormat()', ->
    it('set if all unset', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(3, 6), 'strike')
      expect(@quill.editor.root.firstChild).toEqualHTML('<s>01</s><b>2</b><s><b>3</b><span>45</span></s>')
    )

    it('unset if all set', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(2, 4), 'bold')
      expect(@quill.editor.root.firstChild).toEqualHTML('<s>01</s><span>2345</span>')
    )

    it('set if partially set', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(3, 5), 'bold')
      expect(@quill.editor.root.firstChild).toEqualHTML('<s>01</s><b>234</b><span>5</span>')
    )
  )
)

###

_initDelete
  - Prevent delete
  - Prevent backspace

tab
  - insert tab

listeners / hotkeys
  - test bold, italic, underline
  - add a hotkey that prevents

###
