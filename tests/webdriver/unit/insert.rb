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
    @editor = @driver.find_element(:class, "editor")
    @adapter = WebdriverAdapter.new @driver, @editor
    @adapter.focus()
    delta = { 'startLength' => 0,
              'endLength' => 4,
              'ops' => [{ 'value' => "abc\n"}]}
    ScribeDriver.js_set_doc_delta(@driver, delta)
    ScribeDriver.js_set_scribe_delta(@driver, delta)
    @adapter.doc_length = 4
  end

  it "should prepend to document" do
    doc_length = ScribeDriver.js_get_doc_length(@driver)
    delta = { 'startLength' => doc_length,
              'endLength' => doc_length + 1,
              'ops' => [{ 'value' => "0"}, {'start' => 0, 'end' => doc_length }]}
    ScribeDriver.js_set_random_delta(@driver, delta)
    @adapter.apply_delta(delta)
    success = ScribeDriver.js_check_consistency(@driver)
    success.must_equal true
  end

  it "should append to document" do
    doc_length = ScribeDriver.js_get_doc_length(@driver)
    delta = { 'startLength' => doc_length,
              'endLength' => doc_length + 1,
              'ops' => [ {'start' => 0, 'end' => doc_length - 1, 'attributes' => {} }, { 'value' => "0"}, {'start' => doc_length - 1, 'end' => doc_length }]}
    ScribeDriver.js_set_random_delta(@driver, delta)
    @adapter.apply_delta(delta)
    success = ScribeDriver.js_check_consistency(@driver)
    success.must_equal true
  end
end
