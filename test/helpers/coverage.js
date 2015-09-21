afterEach(function(done) {
  if (protractor.collector == null) return done();
  browser.driver.switchTo().defaultContent();
  browser.driver.executeScript('return window.__coverage__').then(function(coverage) {
    protractor.collector.add(coverage);
    done();
  });
});
