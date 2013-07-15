require "selenium-webdriver"
module ScribeDriver
  module JS
    def self.execute_js(src, args = nil)
      ScribeDriver.driver.switch_to.default_content
      result = ScribeDriver.driver.execute_script(src, *args)
      ScribeDriver.driver.switch_to.frame(ScribeDriver.driver.find_element(:tag_name, "iframe"))
      return result
    end

    def self.editor_delta_equals(delta)
      return self.execute_js "return window.Fuzzer.createDelta(#{delta.to_json}).isEqual(window.editor.getDelta())"
    end

    def self.make_insert_delta(startLength, index, value, attributes)
      return self.execute_js "return window.Fuzzer.autoFormatDelta(window.Tandem.Delta.makeInsertDelta(#{startLength}, #{index}, '#{value}', #{attributes}));"
    end

    def self.set_scribe_delta(delta)
      self.execute_js "window.editor.setDelta(window.Fuzzer.createDelta(#{delta.to_json}));"
    end

    def self.set_doc_delta(delta = nil)
      if not delta.nil?
        self.execute_js "window.Fuzzer.docDelta = window.Fuzzer.createDelta(#{delta.to_json});"
      else
        self.execute_js "window.Fuzzer.docDelta = window.Fuzzer.cleanup(editor.getDelta());"
      end
    end

    def self.get_doc_length
      return self.execute_js "return window.editor.getLength();"
    end

    def self.check_consistency
      return self.execute_js "return window.Fuzzer.checkConsistency();"
    end

    def self.set_random_delta(delta)
      return self.execute_js "window.Fuzzer.randomDelta = window.Fuzzer.createDelta(#{delta.to_json})"
    end
  end

  def self.driver
    @@driver
  end

  #############################################################################
  # WebDriver helpers
  #############################################################################
  def self.create_scribe_driver(browser, url)
    if browser == :firefox
      profile = Selenium::WebDriver::Firefox::Profile.new
      profile.native_events = true
      @@driver = Selenium::WebDriver.for browser, :profile => profile
    elsif browser== :chrome
      log_path = FileUtils.mkpath(File.join(File.dirname(File.expand_path(__FILE__)), "fuzzer_output"))
      log_path = log_path.first
      @@driver = Selenium::WebDriver.for browser, :service_log_path => log_path
    else
      @@driver = Selenium::WebDriver.for browser
    end
    @@driver.manage.timeouts.implicit_wait = 10
    @@driver.get url
    @@driver.switch_to.frame(@@driver.find_element(:tag_name, "iframe"))
    return @@driver
  end
end
