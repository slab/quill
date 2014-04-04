require_relative '../lib/quill_driver'

describe "Test Copy Paste" do
  include QuillDriver
  before do
    setup_test_suite
    start_delta = { "startLength" => 0,
                    "endLength" => 1,
                    "ops" => [{ "value" => "\n", "attributes" => {}}]}
    reset_quill start_delta
  end

  after do
    @driver.quit
  end

  it "should copy and paste plain text" do
    @adapter.type_text "abc"
    @adapter.copy(0, 3)
    # XXX: Adapter's paste doesn't work yet
    @adapter.paste(3)
  end

  # it "should copy and paste newlines" do
  # end

  # it "should copy and paste formatted text" do
  # end
end
