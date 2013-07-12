module ScribeDriver
  #############################################################################
  # JS Helpers
  #############################################################################
  def execute_js(driver, src, args = nil)
    driver.switch_to.default_content
    result = driver.execute_script(src, *args)
    driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
    return result
  end

  def js_set_doc_delta(driver)
    execute_js driver, "window.Fuzzer.docDelta = window.Fuzzer.cleanup(editor.getDelta());"
  end

  def js_get_doc_length(driver)
    execute_js driver, "return window.editor.getLength()"
  end

  #############################################################################
  # WebDriver helpers
  #############################################################################
  def create_scribe_driver(browser, url)
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
    driver.get editor_url
    driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
    return driver
  end
end
