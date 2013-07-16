gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test Insert" do
  before do
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver.html')}"
    @driver = ScribeDriver.create_scribe_driver(:chrome, editor_url)
    ScribeDriver.execute_js("window.Fuzzer.resetScribe()")
    @editor = @driver.find_element(:class, "editor")
    @adapter = WebdriverAdapter.new @driver, @editor
    @adapter.focus()
    ScribeDriver.js_set_doc_delta
    @adapter.doc_length = ScribeDriver.js_get_doc_length
  end

  after do
    @driver.quit
  end

  def apply_delta(delta, err_msg)
    ScribeDriver.js_set_random_delta(delta)
    @adapter.apply_delta(delta)
    success = ScribeDriver.js_check_consistency
    success.must_equal true, err_msg
  end

  # Single character insertion at every position
  it "should insert a single character at every position" do
    doc_length = ScribeDriver.js_get_doc_length
    (0...doc_length).each do |insert_at|
      delta = ScribeDriver.make_insert_delta(doc_length, insert_at, 'a', {})
      apply_delta(delta, "Failed inserting 'a' at index #{insert_at}")
      # Reset state for next iteration
      ScribeDriver.execute_js("window.Fuzzer.resetScribe()")
      @editor = @driver.find_element(:class, "editor")
      @adapter = WebdriverAdapter.new @driver, @editor
      ScribeDriver.js_set_doc_delta
      @adapter.doc_length = ScribeDriver.js_get_doc_length
    end
  end

  # Multiline insertion at every position
end
