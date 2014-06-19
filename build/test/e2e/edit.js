(function() {
  var switchToEditorFrame;

  switchToEditorFrame = function() {
    return browser.driver.switchTo().frame(browser.driver.findElement(By.tagName("iframe")));
  };

  describe('Editing text', function() {
    browser.driver.get('http://localhost:9000/build/demo/index.html');
    it('click into editor', function() {
      return browser.driver.findElement(By.id('editor-container')).click();
    });
    return it('type hello world', function() {
      switchToEditorFrame();
      return browser.driver.findElement(By.className('editor-container')).sendKeys('Hello World!');
    });
  });

}).call(this);
