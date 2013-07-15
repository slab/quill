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
    ScribeDriver.js_set_doc_delta(@driver)
  end

  after do
    @driver.quit
  end

  # 1. Need a better utility for checking before/after state
  # 2. Current delta_equals_editor is incorrect
  it "should undo/redo typing" do
    start_delta = { "startLength" => 0,
      "endLength" => 1, "ops" => [{ "value" => "\n" }] }
    delta = { "startLength" => 1,
      "endLength" => 4, "ops" => [{ "value" => "abc" }, {"start" => 0, "end" => 1}] }
    @adapter.apply_delta delta
    @adapter.undo
    assert ScribeDriver.delta_equals_editor(@driver, start_delta)
    @adapter.redo
    # assert ScribeDriver.delta_equals_editor(@driver, delta)
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
