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

  it "should append to document" do
    true #raise "Error!"
  end
end
