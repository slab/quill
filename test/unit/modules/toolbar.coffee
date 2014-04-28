ddescribe('Toolbar', ->
  beforeEach( ->
    @editorContainer = $('#editor-container').html('
      <div></div>
    ').get(0)
    @toolbarContainer = $('#toolbar-container').get(0)
    @toolbarContainer.innerHTML = @toolbarContainer.innerHTML   # Remove child listeners
    @quill = new Quill(@editorContainer.firstChild)
    @toolbar = @quill.addModule('toolbar', { container: @toolbarContainer })
  )

  describe('_interesctFormats()', ->
    tests =
      'preserve common format':
        initial:  [{ bold: true }, { bold: true }]
        expected: { bold: true }
      'remove uncommon format':
        initial:  [{ bold: true }, { italic: true }]
        expected: {}
      'combine select format':
        initial:  [{ size: 'large' }, { size: 'small' }]
        expected: { size: ['large', 'small'] }
      'preserve select format':
        initial:  [{ size: 'large' }, { bold: true }]
        expected: { size: ['large'] }
      'combination of all cases':
        initial:  [{ bold: true, size: 'small' }, { bold: true, italic: true }, { bold: true, size: 'large' }]
        expected: { bold: true, size: ['small', 'large'] }

    _.each(tests, (test, name) ->
      it(name, ->
        formats = @toolbar._intersectFormats(test.initial)
        expect(formats).toEqual(test.expected)
      )
    )
  )
)

###

format
  similar to keyboard tests
  do selection changes similar to keyboard tests

setActive
  set bold to true
  set bold to false
  reset select
  set select to something else
  set select to ''

_getActive
  - Set cursor behind bold, should be true
  - Set cursor in front of bold, should be false

_interesctFormats
  { bold: true }, { bold: true } => { bold: true }
  { bold: true }, { italic: true } => {}
  { size: 'large' }, { size: 'small' } => { size: ['large', 'small'] }
  { size: 'large' }, { } => { size: ['large'] }
  { bold: true, size: 'small' }, { bold: true, italic: true }, { bold: true, size: 'large' } => { bold: true, size: ['small', 'large']

###
