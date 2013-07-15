require "selenium-webdriver"
module ScribeDriver
  #############################################################################
  # JS Helpers
  #############################################################################
  def self.execute_js(driver, src, args = nil)
    driver.switch_to.default_content
    result = driver.execute_script(src, *args)
    driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
    return result
  end

  def self.make_insert_delta(driver, startLength, index, value, attributes)
    return self.execute_js driver,
      "return window.Fuzzer.autoFormatDelta(window.Tandem.Delta.makeInsertDelta(#{startLength}, #{index}, '#{value}', #{attributes}));"
  end

  def self.js_set_scribe_delta(driver, delta)
    self.execute_js driver, "window.editor.setDelta(window.Fuzzer.createDelta(#{delta.to_json}));"
  end

  def self.js_set_doc_delta(driver, delta = nil)
    if not delta.nil?
      self.execute_js driver, "window.Fuzzer.docDelta = window.Fuzzer.createDelta(#{delta.to_json});"
    else
      self.execute_js driver, "window.Fuzzer.docDelta = window.Fuzzer.cleanup(editor.getDelta());"
    end
  end

  def self.js_get_doc_length(driver)
    return self.execute_js driver, "return window.editor.getLength();"
  end

  def self.js_check_consistency(driver)
    return self.execute_js driver, "return window.Fuzzer.checkConsistency();"
  end

  def self.js_set_random_delta(driver, delta)
    return self.execute_js driver, "window.Fuzzer.randomDelta = window.Fuzzer.createDelta(#{delta.to_json})"
  end

  #############################################################################
  # WebDriver helpers
  #############################################################################
  def self.create_scribe_driver(browser, url)
    if browser == :firefox
      profile = Selenium::WebDriver::Firefox::Profile.new
      profile.native_events = true
      driver = Selenium::WebDriver.for browser, :profile => profile
    elsif browser== :chrome
      log_path = FileUtils.mkpath(File.join(File.dirname(File.expand_path(__FILE__)), "fuzzer_output"))
      log_path = log_path.first
      driver = Selenium::WebDriver.for browser, :service_log_path => log_path
    else
      driver = Selenium::WebDriver.for browser
    end
    driver.manage.timeouts.implicit_wait = 10
    driver.get url
    driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
    return driver
  end
end
