cleanLines = (html) ->
  html = html.replace(/\ class\="line"/g, '')
  html = html.replace(/\ id\="line-\d+"/g, '')
  return html


describe('Editing text', ->
  browser.get('http://localhost:9000/test/fixtures/e2e.html')
  startRange = browser.findElement(By.id('start-range'))
  endRange = browser.findElement(By.id('end-range'))
  deltaOutput = browser.findElement(By.id('delta'))

  browser.switchTo().frame('quill-1')
  editor = browser.findElement(By.className('editor-container'))
  updateEditor = (switchBack = true) ->
    browser.switchTo().defaultContent()
    browser.executeScript('quill.editor.checkUpdate()')
    browser.switchTo().frame('quill-1') if switchBack

  beforeEach( ->
    browser.switchTo().defaultContent()
    browser.switchTo().frame('quill-1')
  )

  it('initial focus', ->
    editor.click()
    updateEditor(false)
    expect(startRange.getText()).toEqual('0')
    expect(endRange.getText()).toEqual('0')
  )

  it('simple characters', ->
    text = 'The Whale'
    editor.sendKeys(text)
    updateEditor()
    expect(editor.getInnerHtml().then(cleanLines)).toEqual("<div>#{text}</div>")
    expectedDelta = {
      startLength: 1,
      endLength: text.length + 1,
      ops: [
        { value: text, attributes: {} }
        { start: 0, end: 1, attributes: {} }
      ]
    }
    browser.switchTo().defaultContent()
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta))
    # Selection should not change due to typing
    expect(startRange.getText()).toEqual('0')
    expect(endRange.getText()).toEqual('0')
  )

  it('enter', ->
    text = 'Chapter 1. Loomings.'
    editor.sendKeys(protractor.Key.RETURN, protractor.Key.RETURN, text, protractor.Key.RETURN)
    updateEditor()
    expect(editor.getInnerHtml().then(cleanLines)).toEqual([
      '<div>The Whale</div>'
      '<div><br></div>'
      "<div>#{text}</div>"
      '<div><br></div>'
    ].join(''))
    browser.switchTo().defaultContent()
    expectedDelta = {
      startLength: 10
      endLength: text.length + 10 + 3
      ops: [
        { start: 0, end: 10, attributes: {} }
        { value: "\n#{text}\n\n", attributes: {} }
      ]
    }
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta))
  )

  it('tab', ->
    text1 = 'Call me Ishmael. Some years ago—never mind how long precisely-having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.'
    text2 = 'There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.'
    editor.sendKeys(protractor.Key.RETURN, protractor.Key.TAB, text1)
    editor.sendKeys(protractor.Key.RETURN, protractor.Key.RETURN, text2)
    updateEditor()
    expect(editor.getInnerHtml().then(cleanLines)).toEqual([
      '<div>The Whale</div>'
      '<div><br></div>'
      '<div>Chapter 1. Loomings.</div>'
      '<div><br></div>'
      "<div>\t#{text1}</div>"
      '<div><br></div>'
      "<div>#{text2}</div>"
    ].join(''))
  )

  it('move cursor', ->

  )

  it('backspace + delete', ->

  )

  it('preformat', ->

  )

  it('format', ->

  )

  it('line format', ->

  )

  it('copy + paste', ->

  )

  it('undo', ->

  )

  it('redo', ->

  )

  it('blur', ->

  )
)
