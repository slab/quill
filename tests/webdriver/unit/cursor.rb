require_relative '../lib/quill_driver'

describe "Cursor" do
  include QuillDriver

  before do
    setup_test_suite
  end

  after do
    @driver.quit
  end

  def validate_cursor_position(expected, actual, err_msg)
    assert expected == actual, err_msg
  end

  it "should advance when right arrow key is pressed" do
    start_delta = { "startLength" => 0,
                    "endLength" => 1,
                    "ops" => [{ "value" => "\n", "attributes" => {}}]}
    reset_quill start_delta
    @adapter.type_text "a"
    expected_cursor_pos = 1
    actual_cursor_pos = QuillDriver::JS.get_cursor_position
    assert expected_cursor_pos == actual_cursor_pos,
      "Expected cursor to be at #{expected_cursor_pos} but actually at #{actual_cursor_pos}"
    # Move cursor to beginning, then to end
    @adapter.move_cursor 0
    @adapter.move_cursor 1
    expected_cursor_pos = 1
    actual_cursor_pos = QuillDriver::JS.get_cursor_position
    validate_cursor_position(expected_cursor_pos, actual_cursor_pos,
      "Expected cursor to be at #{expected_cursor_pos} but actually at #{actual_cursor_pos}")
  end

  it "should advance after inserting newline to empty document" do
    start_delta = { "startLength" => 0,
                    "endLength" => 1,
                    "ops" => [{ "value" => "\n", "attributes" => {}}]}
    reset_quill start_delta
    @adapter.type_text "\n"
    expected_cursor_pos = 1
    actual_cursor_pos = QuillDriver::JS.get_cursor_position
    validate_cursor_position(expected_cursor_pos, actual_cursor_pos,
      "Expected cursor to be at #{expected_cursor_pos} but actually at #{actual_cursor_pos}")
  end

  it "should maintain index after deleting formatted middle chars" do
    start_delta = { "startLength" => 0,
                    "endLength" => 1,
                    "ops" => [{ "value" => "\n", "attributes" => {}}]}
    reset_quill start_delta
    @adapter.type_text "abc"
    @adapter.format_at 1, 1, { "bold" => true }
    @adapter.delete_at 1, 1
    expected_cursor_pos = 1
    actual_cursor_pos = QuillDriver::JS.get_cursor_position
    validate_cursor_position(expected_cursor_pos, actual_cursor_pos,
      "Expected cursor to be at #{expected_cursor_pos} but actually at #{actual_cursor_pos}")
  end
end
