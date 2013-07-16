require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test Copy Paste" do
  before do
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver.html')}"
    @driver = ScribeDriver.create_scribe_driver(:chrome, editor_url)
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

  it "should copy and paste plain text" do
    @adapter.type_text "abc"
    @adapter.copy(0, 3)
    # XXX: Adapter's paste doesn't work yet
    @adapter.paste(3)
  end

  # it "should copy and paste newlines" do
  # end

  # it "should copy and paste formatted text" do
  # end
end
