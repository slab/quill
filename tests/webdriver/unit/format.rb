require 'debugger'
gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test Formatting" do
  before do
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver.html')}"
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
    ScribeDriver::JS.set_random_delta(delta)
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
              "ops" => [{ "value" => "abc", "attributes" => {"bold" => true}}, {"value" => "\n"}]
    }
    ScribeDriver::JS.set_doc_delta delta
    ScribeDriver::JS.set_scribe_delta delta
    @adapter.doc_length = ScribeDriver::JS.get_doc_length
    delta = { "startLength" => 4,
              "endLength" => 4,
              "ops" => [{ "start" => 0, "end" => 3, "attributes" => {"bold" => nil}}, {"start" => 3, "end" => 4}]
    }
    apply_delta(delta, "Failed removing bold at index 0, length 3")
  end
end
