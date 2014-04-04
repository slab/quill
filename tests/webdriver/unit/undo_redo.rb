require_relative '../lib/quill_driver'

describe "Test undo redo" do
  include QuillDriver

  # Amount of time to sleep between edits to prevent the undo manager coalescing edits
  COALESCE_WINDOW = 1

  before do
    setup_test_suite
    QuillDriver::JS.set_doc_delta(@driver)
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
    assert QuillDriver::JS.editor_delta_equals(start_delta), "Failed undoing typing 'abc'."
    @adapter.redo
    assert QuillDriver::JS.editor_delta_equals(end_delta), "Failed redoing typing 'abc'."
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
    assert QuillDriver::JS.editor_delta_equals(undone_doc), "Failed undoing deletion of entire doc."
    @adapter.redo
    assert QuillDriver::JS.editor_delta_equals(redone_doc), "Failed redoing deletion of entire doc."
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
    assert QuillDriver::JS.editor_delta_equals(undone_doc), "Failed undoing bolding of text."
    @adapter.redo
    assert QuillDriver::JS.editor_delta_equals(redone_doc), "Failed redoing bolding of text."
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
      assert QuillDriver::JS.editor_delta_equals(expected), "Failed undoing edit."
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
      assert QuillDriver::JS.editor_delta_equals(expected), "Failed redoing edit."
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
    assert QuillDriver::JS.editor_delta_equals(start_delta), "Failed undoing overwriting of 'abc' with 'zzz'."
    @adapter.redo
    assert QuillDriver::JS.editor_delta_equals(end_delta), "Failed redoing overwriting of 'abc' with 'zzz'."
  end
end
