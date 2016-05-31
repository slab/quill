describe('describe', function() {
  it('it', function() {
    browser.url('http://webdriver.io');
    var title = browser.getTitle();
    expect(title).toEqual('WebdriverIO - Selenium 2.0 javascript bindings for nodejs');
    console.log('hey!');
  });
});
