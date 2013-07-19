require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test undo redo" do
  include ScribeDriver

  # Amount of time to sleep between edits to prevent the undo manager coalescing edits
  COALESCE_WINDOW = 1

  before do
    setup_test_suite
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

    expected_deltas = [{ "startLength" => 0,
                         "endLength" => 4,
                         "ops" => [{ "value" => "abc", "attributes" => {"bold" => true}},
                                   {"value" => "\n" }] },
                       { "startLength" => 0,
                         "endLength" => 4,
                         "ops" => [{ "value" => "abc\n" }] },
                       { "startLength" => 0,
                         "endLength" => 1,
                         "ops" => [{"value" => "\n" }] }
    ]

    expected_deltas.each do |expected|
      @adapter.undo
      assert ScribeDriver::JS.editor_delta_equals expected
    end

    expected_deltas = [{ "startLength" => 0,
                         "endLength" => 4,
                         "ops" => [{"value" => "abc\n" }] },
                       { "startLength" => 0,
                         "endLength" => 4,
                         "ops" => [{ "value" => "abc", "attributes" => {"bold" => true}},
                                     {"value" => "\n" }] },
                       { "startLength" => 0,
                         "endLength" => 4,
                         "ops" => [{ "value" => "abc", "attributes" => {"bold" => true, "italic" => true}},
                                   {"value" => "\n" }] }
    ]

    expected_deltas.each do |expected|
      @adapter.redo
      assert ScribeDriver::JS.editor_delta_equals expected
    end
  end

  it "should undo redo replaced text" do
    text = "abc"
    new_text = "zzz"

    start_delta = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "abc\n" }] }
    end_delta = { "startLength" => 0,
      "endLength" => 4, "ops" => [{ "value" => "zzz\n" }] }

    edits = [ Proc.new { @adapter.type_text text },
             Proc.new { @adapter.move_cursor 0 },
             Proc.new { @adapter.highlight 3 } ]
    edits.each do |edit|
      without_coalescing edit
    end

    @adapter.type_text new_text
    @adapter.undo
    assert ScribeDriver::JS.editor_delta_equals start_delta
    @adapter.redo
    assert ScribeDriver::JS.editor_delta_equals end_delta
  end
end
