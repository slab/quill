require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test Delete" do
  before do
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver/webdriver.html')}"
    @driver = ScribeDriver.create_scribe_driver(:chrome, editor_url)
    @editor = @driver.find_element(:class, "editor")
    @adapter = WebdriverAdapter.new @driver, @editor
    @adapter.focus()
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

  it "should delete plain text" do
    delta = { "startLength" => 4,
              "endLength" => 3,
              "ops" => [{ "start" => 0, "end" => 2, "attributes" => {}},
                        { "start" => 3, "end" => 4, "attributes" => {}}]
    }
    apply_delta(delta, "Failed deleting plain text at index 3")
  end

  it "should delete formatted text" do
    delta = { "startLength" => 0,
              "endLength" => 4,
              "ops" => [{ "value" => "abc", "attributes" => {"color" => "red"}},
                        { "value" => "\n" }]
    }
    ScribeDriver::JS.set_doc_delta delta
    ScribeDriver::JS.set_scribe_delta delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
    delta = { "startLength" => 4,
              "endLength" => 3,
              "ops" => [{ "start" => 0, "end" => 2, "attributes" => {}},
                        { "start" => 3, "end" => 4, "attributes" => {}}]
    }
    apply_delta delta, "Failed deleting formatted text at index 3"
  end

  it "should delete \n and retain formatting" do
    delta = { "startLength" => 0,
              "endLength" => 8,
              "ops" => [{ "value" => "abc", "attributes" => {"color" => "red"} },
                        { "value" => "\n", "attributes" => {} },
                        { "value" => "def", "attributes" => {"color" => "red"} },
                        { "value" => "\n" }]
    }
    ScribeDriver::JS.set_doc_delta delta
    ScribeDriver::JS.set_scribe_delta delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
    delta = { "startLength" => 8,
              "endLength" => 5,
              "ops" => [{ "start" => 0, "end" => 2, "attributes" => {} },
                        { "start" => 5, "end" => 8, "attributes" => {} }]
    }
    apply_delta delta, "Failed deleting formatted, newlined text."
  end

  it "should delete plain and formatted text" do
    delta = { "startLength" => 0,
              "endLength" => 8,
              "ops" => [{ "value" => "abc", "attributes" => {} },
                        { "value" => "\n", "attributes" => {} },
                        { "value" => "def", "attributes" => {"color" => "red"} },
                        { "value" => "\n" }]
    }
    ScribeDriver::JS.set_doc_delta delta
    ScribeDriver::JS.set_scribe_delta delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
    delta = { "startLength" => 8,
              "endLength" => 5,
              "ops" => [{ "start" => 0, "end" => 2, "attributes" => {} },
                        { "start" => 5, "end" => 8, "attributes" => {} }]
    }
    apply_delta delta, "Failed deleting plain and formatted, newlined text."
  end
end
