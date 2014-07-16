afterEach((done) ->
  return done() unless protractor.collector?
  browser.driver.switchTo().defaultContent();
  browser.driver.executeScript('return window.__coverage__').then((coverage) ->
    protractor.collector.add(coverage)
    done()
  )
)
