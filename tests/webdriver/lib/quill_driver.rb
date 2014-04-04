require "selenium-webdriver"
require 'colorize'
require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/minitest/focus'
require_relative '../lib/webdriver_adapter'
require_relative '../lib/minitest/focus'
module QuillDriver
  module JS
    def self.execute_js(src, args = nil)
      QuillDriver.driver.switch_to.default_content
      result = QuillDriver.driver.execute_script(src, *args)
      QuillDriver.driver.switch_to.frame(QuillDriver.driver.find_element(:tag_name, "iframe"))
      return result
    end

    def self.get_cursor_position
      return self.execute_js "return window.editor.getSelection().start.index"
    end

    def self.get_as_str(ref)
      return self.execute_js "return JSON.stringify(window.QuillDriver['#{ref}'])"
    end

    def self.get_expected_as_str
      src = "return JSON.stringify(window.QuillDriver.docDelta.compose(window.QuillDriver.currentDelta));"
      return self.execute_js src
    end

    def self.get_cur_doc_delta_as_str
      return execute_js "return JSON.stringify(editor.getContents());"
    end

    def self.set_quill_delta(driver)
      return execute_js "window.QuillDriver.initializeQuill()"
    end

    def self.editor_delta_equals(delta)
      return self.execute_js "return window.QuillDriver.createDelta(#{delta.to_json}).isEqual(window.editor.getContents())"
    end

    def self.make_insert_delta(startLength, index, value, attributes)
      return self.execute_js "return window.QuillDriver.autoFormatDelta(window.Tandem.Delta.makeInsertDelta(#{startLength}, #{index}, '#{value}', #{attributes}));"
    end

    def self.set_quill_delta(delta)
      self.execute_js "window.editor.setContents(window.QuillDriver.createDelta(#{delta.to_json}));"
    end

    def self.set_doc_delta(delta = nil)
      if not delta.nil?
        self.execute_js "window.QuillDriver.docDelta = window.QuillDriver.createDelta(#{delta.to_json});"
      else
        self.execute_js "window.QuillDriver.docDelta = window.QuillDriver.cleanup(editor.getContents());"
      end
    end

    def self.get_doc_length
      return self.execute_js "return window.editor.getLength();"
    end

    def self.check_consistency
      return self.execute_js "return window.QuillDriver.checkConsistency();"
    end

    def self.set_current_delta(delta)
      return self.execute_js "window.QuillDriver.currentDelta = window.QuillDriver.createDelta(#{delta.to_json})"
    end
  end

  def self.driver
    @@driver
  end

  #############################################################################
  # WebDriver helpers
  #############################################################################
  def setup_test_suite
    browser = :chrome
    browser = ARGV[0].to_sym if ARGV.length >= 1
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver/webdriver.html')}"
    @driver = QuillDriver.create_quill_driver(browser, editor_url)
    @editor = @driver.find_element(:class, "editor")
    @adapter = WebdriverAdapter.new @driver, @editor
    @adapter.focus()
  end

  def reset_quill(delta)
    QuillDriver::JS.set_doc_delta delta
    QuillDriver::JS.set_quill_delta delta
    @adapter.doc_length = QuillDriver::JS.get_doc_length
  end

  def apply_delta(delta, err_msg, toolbar_only = false)
    QuillDriver::JS.set_current_delta(delta)
    @adapter.apply_delta(delta, toolbar_only)
    actual_delta, success = QuillDriver::JS.check_consistency().values_at("actual_delta", "success")
    success.must_equal true, err_msg
  end

  # Credit: http://jkotests.wordpress.com/2013/06/26/silencing-diagnostic-output-when-starting-webdrivers/
  class Selenium::WebDriver::Chrome::Service
    old_initialize = instance_method(:initialize)
    define_method(:initialize) do |executable_path, port, *extra_args|
      old_initialize.bind(self).call(executable_path, port, '--silent', *extra_args)
    end
  end

  class Selenium::WebDriver::IE::Server
    old_server_args = instance_method(:server_args)
    define_method(:server_args) do
      old_server_args.bind(self).() << "--silent"
    end
  end

  def self.create_quill_driver(browser, url)
    if browser == :firefox
      profile = Selenium::WebDriver::Firefox::Profile.new
      profile.native_events = true
      @@driver = Selenium::WebDriver.for browser, :profile => profile
    elsif browser == :chrome
      log_path = FileUtils.mkpath(File.join(File.dirname(File.dirname(File.expand_path(__FILE__))), "logs", "driver"))
      log_path = File.join log_path.first, "chromedriver_#{Time.now.to_i.to_s}.log"
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
