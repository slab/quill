require_relative '../lib/scribe_driver'

describe "Test Delete" do
  include ScribeDriver

  before do
    setup_test_suite
  end

  after do
    @driver.quit
  end

  def run_delete_test(initial, delete_delta, err_msg)
    reset_scribe initial
    apply_delta delete_delta, err_msg
  end

  it "should delete plain text" do
    initial = { "startLength" => 0,
                "endLength" => 4,
                "ops" => [{ "value" => "abc\n"}]
    }

    delta = { "startLength" => 4,
              "endLength" => 3,
              "ops" => [{ "start" => 0, "end" => 2, "attributes" => {}},
                        { "start" => 3, "end" => 4, "attributes" => {}}]
    }

    run_delete_test initial, delta, "Failed deleting plain text at index 3"
  end

  it "should delete formatted text" do
    initial = { "startLength" => 0,
              "endLength" => 4,
              "ops" => [{ "value" => "abc", "attributes" => {"fore-color" => "red"}},
                        { "value" => "\n" }]
    }

    delta = { "startLength" => 4,
              "endLength" => 3,
              "ops" => [{ "start" => 0, "end" => 2, "attributes" => {}},
                        { "start" => 3, "end" => 4, "attributes" => {}}]
    }

    run_delete_test initial, delta, "Failed deleting formatted text at index 3"
  end

  it "should delete newline and retain formatting" do
    initial = { "startLength" => 0,
              "endLength" => 8,
              "ops" => [{ "value" => "abc", "attributes" => {"fore-color" => "red"} },
                        { "value" => "\n", "attributes" => {} },
                        { "value" => "def", "attributes" => {"fore-color" => "red"} },
                        { "value" => "\n" }]
    }

    delta = { "startLength" => 8,
              "endLength" => 5,
              "ops" => [{ "start" => 0, "end" => 2, "attributes" => {} },
                        { "start" => 5, "end" => 8, "attributes" => {} }]
    }
    run_delete_test initial, delta, "Failed deleting formatted, newlined text."
  end

  it "should delete newline from empty document" do
    initial = { "startLength" => 0,
                "endLength" => 1,
                "ops" => [{ "value" => "\n"}]
    }

    reset_scribe initial
    @editor.send_keys :enter
    @editor.send_keys :backspace
    @editor.send_keys "a"
    expected = { "startLength" => 0,
                 "endLength" => 2,
                 "ops" => [{ "value" => "a\n", "attributes" => {} }]
    }
    assert ScribeDriver::JS.editor_delta_equals(expected),
      "Deleting a newline and then inserting into the empty document fails."

  end

  it "should pull formatting onto previous line when newline is deleted" do
    initial = { "startLength" => 0,
              "endLength" => 10,
              "ops" => [{ "value" => "ab", "attributes" => {} },
                        { "value" => "cd", "attributes" => { "fore-color" => "red" }},
                        { "value" => "\n", "attributes" => {} },
                        { "value" => "ef", "attributes" => {} },
                        { "value" => "gh", "attributes" => {"fore-color" => "red"}},
                        { "value" => "\n" }]
    }

    delta = { "startLength" => 10,
              "endLength" => 9,
              "ops" => [{ "start" => 0, "end" => 4, "attributes" => {} },
                        { "start" => 5, "end" => 10, "attributes" => {} }]
    }

    run_delete_test initial, delta, "Failed deleting newline that precedes formatting."
  end

  it "should delete plain and formatted text" do
    initial = { "startLength" => 0,
                "endLength" => 8,
                "ops" => [{ "value" => "abc", "attributes" => {} },
                          { "value" => "\n", "attributes" => {} },
                          { "value" => "def", "attributes" => {"fore-color" => "red"} },
                          { "value" => "\n" }]
    }

    delta = { "startLength" => 8,
              "endLength" => 5,
              "ops" => [{ "start" => 0, "end" => 2, "attributes" => {} },
                        { "start" => 5, "end" => 8, "attributes" => {} }]
    }
    run_delete_test initial, delta, "Failed deleting plain and formatted, newlined text."
  end
end
