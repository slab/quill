switchToEditorFrame = ->
  browser.driver.switchTo().frame(browser.driver.findElement(By.tagName("iframe")))

describe('Editing text', ->
  browser.driver.get('http://localhost:9000/build/demo/index.html')

  it('click into editor', ->
    browser.driver.findElement(By.id('editor-container')).click()
  )

  it('type hello world', ->
    switchToEditorFrame()
    browser.driver.findElement(By.className('editor-container')).sendKeys('Hello World!')
  )
)
