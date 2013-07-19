require 'colorize'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Insert" do
  include ScribeDriver

  before do
    setup_test_suite
    # Custom setup
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

  def apply_delta(delta, err_msg)
    ScribeDriver::JS.set_current_delta(delta)
    @adapter.apply_delta(delta)
    success = ScribeDriver::JS.check_consistency
    unless success
      doc_delta = ScribeDriver::JS.get_as_str("docDelta")
      cur_delta = ScribeDriver::JS.get_as_str("currentDelta")
      expected_delta = ScribeDriver::JS.get_expected_as_str
      actual_delta = ScribeDriver::JS.get_cur_doc_delta_as_str
      doc_delta = JSON.pretty_generate(JSON.parse(doc_delta))
      cur_delta = JSON.pretty_generate(JSON.parse(cur_delta))
      expected_delta = JSON.pretty_generate(JSON.parse(expected_delta))
      actual_delta = JSON.pretty_generate(JSON.parse(actual_delta))
      puts "#{'doc_delta: '.light_cyan + doc_delta},"
      puts "#{'cur_delta: '.light_cyan + cur_delta},"
      puts "#{'expected_delta: '.light_cyan + expected_delta},"
      puts "#{'actual: '.light_cyan + actual_delta}"
    end
    success.must_equal true, err_msg
  end

  def insert_at_every_position(text)
    doc_length = ScribeDriver::JS.get_doc_length - 1 # - 1 accounts for phantom newline
    (0...doc_length).each do |insert_at|
      cur_length = ScribeDriver::JS.get_doc_length
      delta = ScribeDriver::JS.make_insert_delta(cur_length, @adapter.cursor_pos + 1, text, {})
      apply_delta(delta, "Failed inserting #{text} at index #{insert_at}")
      ScribeDriver::JS.set_doc_delta
    end
  end

  def run_insert_test(initial, insert_delta, err_msg)
    reset_scribe initial
    apply_delta insert_delta, err_msg
  end

  it "should insert a single character at every position" do
    insert_at_every_position "a"
  end

  it "should insert multiple characters at every position" do
    insert_at_every_position "abc"
  end

  it "should insert multiline characters at every position" do
    insert_at_every_position "abc\\ndef\\nghi"
  end

  it "should insert a newline into the empty document" do
    start_delta = { "startLength" => 0,
                    "endLength" => 1,
                    "ops" => [{ "value" => "\n", "attributes" => {}}]}

    current_delta = { "startLength" => 1,
                      "endLength" => 2,
                      "ops" => [{ "value" => "\n", "attributes" => {} },
                                { "start" => 0, "end" => 1}]}
    run_insert_test start_delta, current_delta, "Inserting \n at start of empty document fails."
  end

  it "should append a newline to nonempty document" do
    start_delta = { "startLength" => 0,
                    "endLength" => 4,
                    "ops" => [{ "value" => "abc\n", "attributes" => {}}]}

    current_delta = { "startLength" => 4,
                      "endLength" => 5,
                      "ops" => [{ "start" => 0, "end" => 3, "attributes" => {} },
                                { "value" => "\n", "attributes" => {} },
                                { "start" => 3, "end" => 4, "attributes" => {} }]}

    run_insert_test start_delta, current_delta, "Inserting \n at start of empty document fails."
  end

  describe "tab" do
    it "should indent text when tab is prepended" do
      start_delta = { "startLength" => 0,
                      "endLength" => 4,
                      "ops" => [{ "value" => "abc\n", "attributes" => {}}]}

      current_delta = { "startLength" => 4,
                        "endLength" => 5,
                        "ops" => [{ "value" => "\t", "attributes" => {}},
                                  { "start" => 0, "end" => 4}]}
      run_insert_test start_delta, current_delta, "Failed inserting tab at 0th index."
    end

    it "should prepend a tab followed by more text" do
      start_delta = { "startLength" => 0,
                      "endLength" => 4,
                      "ops" => [{ "value" => "abc\n", "attributes" => {}}]}

      current_delta = { "startLength" => 4,
                        "endLength" => 8,
                        "ops" => [{ "value" => "\tabc", "attributes" => {}},
                                  { "start" => 0, "end" => 4}]}
      run_insert_test start_delta, current_delta, "Failed inserting tab + text at 0th index."
    end

    it "should append a tab" do
      start_delta = { "startLength" => 0,
                      "endLength" => 4,
                      "ops" => [{ "value" => "abc\n", "attributes" => {}}]}

      current_delta = { "startLength" => 4,
                        "endLength" => 5,
                        "ops" => [{ "start" => 0, "end" => 3, "attributes" => {}},
                                  { "value" => "\t", "attributes" => {}},
                                  { "start" => 3, "end" => 4}]}

      run_insert_test start_delta, current_delta, "Failed appending tab."
    end

    it "should append a tab followed by more text" do
      start_delta = { "startLength" => 0,
                      "endLength" => 4,
                      "ops" => [{ "value" => "abc\n", "attributes" => {}}]}

      current_delta = { "startLength" => 4,
                        "endLength" => 8,
                        "ops" => [{ "start" => 0, "end" => 3, "attributes" => {}},
                                  { "value" => "\tdef", "attributes" => {}},
                                  { "start" => 3, "end" => 4}]}

      run_insert_test start_delta, current_delta, "Failed appending tab."
    end
  end
end
