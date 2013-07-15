require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test undo redo" do
  before do
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver.html')}"
    @driver = ScribeDriver.create_scribe_driver(:chrome, editor_url)
    @editor = @driver.find_element(:class, "editor")
    @adapter = WebdriverAdapter.new @driver, @editor
    @adapter.focus()
    ScribeDriver::JS.set_doc_delta(@driver)
  end

  after do
    @driver.quit
  end

  it "should undo/redo typing" do
    start_delta = { "startLength" => 0,
      "endLength" => 1, "ops" => [{ "value" => "\n" }] }
    end_delta = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "abc\n" }] }
    @adapter.type_text "abc"
    @adapter.undo
    assert ScribeDriver::JS.editor_delta_equals start_delta
    @adapter.redo
    assert ScribeDriver::JS.editor_delta_equals end_delta
  end

  # it "should undo redo deletes" do
  #   skip "Implement me"
  # end

  # it "should undo redo formatting" do
  #   skip "Implement me"
  # end

  # it "should undo redo a chain of edits" do
  #   skip "Implement me"
  # end

end
