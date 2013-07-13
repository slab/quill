gem "minitest"
require 'minitest/autorun'
require 'minitest/pride'
require_relative '../lib/scribe_driver'
require_relative '../lib/webdriver_adapter'

describe "Test Insert" do
  before do
    editor_url = "file://#{File.join(File.expand_path(__FILE__),
      '../../../..', 'build/tests/webdriver.html')}"
    @driver = ScribeDriver.create_scribe_driver(:chrome, editor_url)
    @editor = @driver.find_element(:class, "editor")
    @adapter = WebdriverAdapter.new @driver, @editor
    @adapter.focus()
    @start_delta = { 'startLength' => 0,
                     'endLength' => 4,
                     'ops' => [{ 'value' => "abc\n"}]}
    ScribeDriver.js_set_doc_delta(@driver, @start_delta)
    ScribeDriver.js_set_scribe_delta(@driver, @start_delta)
    @adapter.doc_length = @start_delta['endLength']
  end

  after do
    @driver.quit
  end

  def apply_delta(delta)
    ScribeDriver.js_set_random_delta(@driver, delta)
    @adapter.apply_delta(delta)
    success = ScribeDriver.js_check_consistency(@driver)
    success.must_equal true
  end

  # Single character insertion at every position
  it "should correctly insert a single character at every position" do
    doc_length = ScribeDriver.js_get_doc_length(@driver)
    (0...doc_length).each do |insert_at|
      insert_at = 1
      puts "Inserting at: #{insert_at}"
      delta = ScribeDriver.make_insert_delta(@driver, doc_length, insert_at, 'a', {})
      apply_delta(delta)
      # Reset state for next iteration
      ScribeDriver.js_set_doc_delta(@driver, @start_delta)
      ScribeDriver.js_set_scribe_delta(@driver, @start_delta)
      @adapter.cursor_pos = 0
      @adapter.doc_length = @start_delta["endLength"]
    end
  end

  # it "should append to document" do
  #   doc_length = ScribeDriver.js_get_doc_length(@driver)
  #   delta = { 'startLength' => doc_length,
  #             'endLength' => doc_length + 1,
  #             'ops' => [ {'start' => 0, 'end' => doc_length - 1, 'attributes' => {} }, { 'value' => "0"}, {'start' => doc_length - 1, 'end' => doc_length }]}
  #   apply_delta(delta)
  # end

  # Multiline insertion at every position
end
