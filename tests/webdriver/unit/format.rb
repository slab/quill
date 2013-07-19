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
  end

  after do
    @driver.quit
  end

  def run_format_test(initial, format_delta, err_msg)
    reset_scribe initial
    apply_delta format_delta, err_msg
  end

  it "should format plain text" do
    initial = { "startLength" => 0,
                "endLength" => 4,
                "ops" => [{ "value" => "abc\n"}]
    }

    delta = { "startLength" => 4,
              "endLength" => 4,
              "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "bold" => true }},
                        { "start" => 3, "end" => 4 }]
    }

    run_format_test initial, delta, "Failed adding bold at index 0, length 3"
  end

  it "should unformat already formatted text" do
    initial = { "startLength" => 0,
                "endLength" => 4,
                "ops" => [{ "value" => "abc", "attributes" => { "bold" => true }},
                          { "value" => "\n" }]
    }

    delta = { "startLength" => 4,
              "endLength" => 4,
              "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "bold" => nil }},
                        { "start" => 3, "end" => 4 }]
    }

    run_format_test initial, delta, "Failed removing bold at index 0, length 3"
  end

  it "should add additional formatting to already formatted text" do
    initial = { "startLength" => 0,
               "endLength" => 4,
               "ops" => [{ "value" => "abc", "attributes" => { "bold" => true }},
                         { "value" => "\n" }]
    }

    delta = { "startLength" => 4,
              "endLength" => 4,
              "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "italic" => true }},
                        { "start" => 3, "end" => 4 }]
    }

    run_format_test initial, delta, "Failed removing bold at index 0, length 3"
  end
end
