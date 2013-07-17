gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test Insert" do
  before do
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver/webdriver.html')}"
    @driver = ScribeDriver.create_scribe_driver(:firefox, editor_url)
    ScribeDriver::JS.execute_js("window.ScribeDriver.resetScribe()")
    @editor = @driver.find_element(:class, "editor")
    @adapter = WebdriverAdapter.new @driver, @editor
    @adapter.focus()
    ScribeDriver::JS.set_doc_delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
  end

  after do
    @driver.quit
  end

  def apply_delta(delta, err_msg)
    ScribeDriver::JS.set_current_delta(delta)
    @adapter.apply_delta(delta)
    success = ScribeDriver::JS.check_consistency
    success.must_equal true, err_msg
  end

  def reset_to(delta)
    ScribeDriver::JS.set_doc_delta delta
    ScribeDriver::JS.set_scribe_delta delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
  end

  # Test autoformatting: Inserting a character into any tiype
  # Test newlines
  # Single character insertion at every position
  it "should insert a single character at every position" do
    doc_length = ScribeDriver::JS.get_doc_length
    (0...doc_length).each do |insert_at|
      delta = ScribeDriver::JS.make_insert_delta(doc_length, insert_at, 'a', {})
      apply_delta(delta, "Failed inserting 'a' at index #{insert_at}")
      # Reset state for next iteration
      ScribeDriver::JS.execute_js("window.ScribeDriver.resetScribe()")
      @editor = @driver.find_element(:class, "editor")
      @adapter = WebdriverAdapter.new @driver, @editor
      ScribeDriver::JS.set_doc_delta
      @adapter.doc_length = ScribeDriver::JS.get_doc_length
    end
  end

  it "should insert a newline in the empty document" do
    start_delta = { "startLength" => 0,
                    "endLength" => 1,
                    "ops" => [{ "value" => "\n", "attributes" => {}}]}
    reset_to start_delta
    current_delta = { "startLength" => 1,
                      "endLength" => 2,
                      "ops" => [{ "value" => "\n", "attributes" => {} },
                                { "start" => 0, "end" => 1}]}
    apply_delta current_delta, "Inserting \n at start of empty document fails."
  end

  it "should insert a newline at end of document" do
    start_delta = { "startLength" => 0,
                    "endLength" => 4,
                    "ops" => [{ "value" => "abc\n", "attributes" => {}}]}
    reset_to start_delta
    current_delta = { "startLength" => 4,
                      "endLength" => 5,
                      "ops" => [{ "start" => 0, "end" => 3, "attributes" => {} },
                                { "value" => "\n", "attributes" => {} },
                                { "start" => 3, "end" => 4, "attributes" => {} }]}
    apply_delta current_delta, "Inserting \n at start of empty document fails."
  end

  # Multiline insertion at every position
end
