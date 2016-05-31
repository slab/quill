describe('compose an epic', function(done) {
  it('load', function() {
    browser.url('/standalone/snow/');
    expect(browser.getTitle()).toEqual('Snow Theme - Quill');
  });

  it('focus', function() {
    browser.click('.ql-editor').keys('The Whale');
    expect(browser.getHTML('.ql-editor', false)).toEqual('<p>The Whale</p>');
  });
});
