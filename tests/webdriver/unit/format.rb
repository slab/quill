require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test Formatting" do
  include ScribeDriver
  before do
    setup_test_suite
    # Custom setup
    delta = { "startLength" => 0,
              "endLength" => 4,
              "ops" => [{ "value" => "abc\n"}]
    }
    ScribeDriver::JS.set_doc_delta delta
    ScribeDriver::JS.set_scribe_delta delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
  end

  after do
    @driver.quit
  end

  def apply_delta(delta, err_msg)
    ScribeDriver::JS.set_current_delta(delta)
    @adapter.apply_delta(delta)
    success = ScribeDriver::JS.check_consistency
    success.must_equal true, err_msg
  end

  it "should format plain text" do
    delta = { "startLength" => 4,
              "endLength" => 4,
              "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "bold" => true }},
                        { "start" => 3, "end" => 4 }]}
    apply_delta(delta, "Failed adding bold at index 0, length 3")
  end

  it "should unformat already formatted text" do
    delta = { "startLength" => 0,
              "endLength" => 4,
              "ops" => [{ "value" => "abc", "attributes" => { "bold" => true }},
                        { "value" => "\n" }]
    }
    ScribeDriver::JS.set_doc_delta delta
    ScribeDriver::JS.set_scribe_delta delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
    delta = { "startLength" => 4,
              "endLength" => 4,
              "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "bold" => nil }},
                        { "start" => 3, "end" => 4 }]
    }
    apply_delta(delta, "Failed removing bold at index 0, length 3")
  end

  it "should add additional formatting to already formatted text" do
    delta = { "startLength" => 0,
              "endLength" => 4,
              "ops" => [{ "value" => "abc", "attributes" => { "bold" => true }},
                        { "value" => "\n" }]
    }
    ScribeDriver::JS.set_doc_delta delta
    ScribeDriver::JS.set_scribe_delta delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
    delta = { "startLength" => 4,
              "endLength" => 4,
              "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "italic" => true }},
                        { "start" => 3, "end" => 4 }]
    }
    apply_delta(delta, "Failed removing bold at index 0, length 3")
  end
end
