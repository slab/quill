describe('Editing text', ->
  it('type hello world', ->
    browser.driver.get('http://localhost:9000/examples/index.html')
    browser.driver.switchTo().frame(browser.driver.findElement(By.tagName("iframe")))
    container = browser.driver.findElement(By.className('editor-container'))
    container.click()
    container.sendKeys('Hello World!')
    expect(container.getText()).toEqual('Hello World!')
  )
)
