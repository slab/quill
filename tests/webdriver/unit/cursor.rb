require 'colorize'
require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'
require_relative '../lib/minitest/focus'

describe "Cursor" do
  include ScribeDriver

  before do
    setup_test_suite
  end

  after do
    @driver.quit
  end

  it "should advance after inserting newline to empty document" do
    start_delta = { "startLength" => 0,
                    "endLength" => 1,
                    "ops" => [{ "value" => "\n", "attributes" => {}}]}
    reset_scribe start_delta
    @adapter.type_text "\n"
    expected_cursor_pos = 1
    actual_cursor_pos = ScribeDriver::JS.get_cursor_position
    assert expected_cursor_pos == actual_cursor_pos,
      "Expected cursor to be at #{expected_cursor_pos} but actually at #{actual_cursor_pos}"
  end

  it "should maintain index after deleting formatted middle chars" do
    start_delta = { "startLength" => 0,
                    "endLength" => 1,
                    "ops" => [{ "value" => "\n", "attributes" => {}}]}
    reset_scribe start_delta
    @adapter.type_text "abc"
    @adapter.format_at 1, 1, { "bold" => true }
    @adapter.delete_at 1, 1
    expected_cursor_pos = 1
    actual_cursor_pos = ScribeDriver::JS.get_cursor_position
    assert expected_cursor_pos == actual_cursor_pos,
      "Expected cursor to be at #{expected_cursor_pos} but actually at #{actual_cursor_pos}"
  end
end
