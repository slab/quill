describe('Editing text', ->
  browser.get('http://localhost:9000/test/fixtures/e2e.html')
  browser.driver.switchTo().frame('quill-1')

  editor = browser.findElement(By.className('editor-container'))
  editor.click()

  it('typing', ->
    editor.sendKeys('Hello World!')
    expect(editor.getText()).toEqual('Hello World!')
  )
)
