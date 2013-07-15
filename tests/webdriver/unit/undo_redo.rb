require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test undo redo" do
  # Amount of time to sleep between edits to prevent the undo manager coalescing edits
  COALESCE_WINDOW = 2

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

  def without_coalescing(edit)
    edit.call
    sleep COALESCE_WINDOW
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

  it "should undo redo deletes" do
    text = "abc"
    undone_doc = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "abc\n" }] }
    redone_doc = { "startLength" => 0,
      "endLength" => 1, "ops" => [{ "value" => "\n" }] }
    without_coalescing Proc.new { @adapter.type_text text }
    @adapter.delete_at 0, text.length
    @adapter.undo
    assert ScribeDriver::JS.editor_delta_equals undone_doc
    @adapter.redo
    assert ScribeDriver::JS.editor_delta_equals redone_doc
  end

  it "should undo redo formatting" do
    text = "abc"
    undone_doc = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "abc\n" }] }
    redone_doc = { "startLength" => 0,
      "endLength" => 4, "ops" => [{"value" => "abc", "attributes" => {"bold" => true}}, { "value" => "\n" }] }
    without_coalescing Proc.new { @adapter.type_text text }
    @adapter.format_at 0, 3, {:bold => true}
    @adapter.undo
    assert ScribeDriver::JS.editor_delta_equals undone_doc
    @adapter.redo
    assert ScribeDriver::JS.editor_delta_equals redone_doc
  end


  it "should undo redo a chain of edits" do
    text = "abc"
    edits = [ Proc.new { @adapter.type_text text },
              Proc.new { @adapter.format_at 0, 3, {:bold => true} },
              Proc.new { @adapter.format_at 0, 3, {:italic => true} }]
    edits.each do |edit|
      without_coalescing edit
    end

    @adapter.undo
    expected = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "abc", "attributes" => {"bold" => true}}, {"value" => "\n" }] }
    assert ScribeDriver::JS.editor_delta_equals expected

    @adapter.undo
    expected = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "abc\n" }] }
    assert ScribeDriver::JS.editor_delta_equals expected

    @adapter.undo
    expected = { "startLength" => 0,
      "endLength" => 1, "ops" => [{"value" => "\n" }] }
    assert ScribeDriver::JS.editor_delta_equals expected

    @adapter.redo
    expected = { "startLength" => 0,
      "endLength" => 4, "ops" => [{"value" => "abc\n" }] }
    assert ScribeDriver::JS.editor_delta_equals expected

    @adapter.redo
    expected = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "abc", "attributes" => {"bold" => true}}, {"value" => "\n" }] }
    assert ScribeDriver::JS.editor_delta_equals expected

    @adapter.redo
    expected = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "abc", "attributes" => {"bold" => true, "italic" => true}}, {"value" => "\n" }] }
    assert ScribeDriver::JS.editor_delta_equals expected

  end
end
