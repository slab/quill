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
    assert ScribeDriver::JS.get_cursor_position == 1
  end
end
