require "minitest/autorun"
require "minitest/pride"
require "minitest/reporters"
MiniTest::Reporters.use!


describe "Test Insert" do
  before do
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver.html')}"
    @driver = ScribeDriver.create_scribe_driver(:chrome, editor_url)
    @editor = @driver.find_element(:class, "editor")
    @adapter = WebdriverAdapter.new @driver, @editor
    @adapter.focus()
    ScribeDriver.js_set_doc_delta(@driver)
  end

  it "should prepend to document" do
    doc_length = ScribeDriver.js_get_doc_length(@driver)
    delta = { 'startLength' => doc_length,
              'endLength' => doc_length + 1,
              'ops' => [{ 'value' => "0"}, {'start' => 0, 'end' => doc_length }]}
    ScribeDriver.js_create_delta(@driver, delta)
    @adapter.apply_delta(delta)
    success = ScribeDriver.js_check_consistency(@driver)
    success.must_equal true
  end
end
