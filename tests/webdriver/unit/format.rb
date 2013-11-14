require_relative '../lib/scribe_driver'

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

  describe 'Toolbar' do
    it "should bold highlighted text" do
      initial = { "startLength" => 0,
                  "endLength" => 4,
                  "ops" => [{ "value" => "abc\n"}]
      }

      delta = { "startLength" => 4,
                "endLength" => 4,
                "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "bold" => true }},
                          { "start" => 3, "end" => 4 }]
      }

      reset_scribe initial
      apply_delta delta, "Failed adding bold at index 0, length 3", true
    end

    it "should unbold highlighted text" do
      initial = { "startLength" => 0,
                  "endLength" => 4,
                  "ops" => [{ "value" => "abc", "attributes" => {"bold" => true} },
                            { "value" => "\n"}]
      }

      delta = { "startLength" => 4,
                "endLength" => 4,
                "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "bold" => nil }},
                          { "start" => 3, "end" => 4 }]
      }

      reset_scribe initial
      apply_delta delta, "Failed adding bold at index 0, length 3", true
    end

    it "should bold and italicize highlighted text" do
      initial = { "startLength" => 0,
                  "endLength" => 4,
                  "ops" => [{ "value" => "abc\n"}]
      }

      delta = { "startLength" => 4,
                "endLength" => 4,
                "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "bold" => true, "italic" => true }},
                          { "start" => 3, "end" => 4 }]
      }

      reset_scribe initial
      apply_delta delta, "Failed adding bold at index 0, length 3", true
    end

    it "should bold, then unbold second word of a line" do
      initial = { "startLength" => 0,
                  "endLength" => 8,
                  "ops" => [{ "value" => "abc def\n"}]
      }
      reset_scribe initial

      delta = { "startLength" => 8,
                "endLength" => 8,
                "ops" => [{ "start" => 4, "end" => 7, "attributes" => { "bold" => true }},
                          { "start" => 7, "end" => 8 }]
      }
      apply_delta delta, "Failed adding bold at index 4, length 3", true

      delta = { "startLength" => 8,
                "endLength" => 8,
                "ops" => [{ "start" => 4, "end" => 7, "attributes" => { "bold" => nil }},
                          { "start" => 7, "end" => 8 }]
      }
      apply_delta delta, "Failed removing bold at index 4, length 3", true
    end

    it "should type bolded text with preemptive bold" do
      initial = { "startLength" => 0,
                  "endLength" => 1,
                  "ops" => [{ "value" => "\n", "attributes" => {}}]
      }

      delta = { "startLength" => 1,
                "endLength" => 4,
                "ops" => [{ "value" => "zzz", "attributes" => { "bold" => true } },
                          { "start" => 0, "end" => 1 }]}

      reset_scribe initial
      apply_delta delta, "Text was not bold", true
    end

    it "should apply a font-name format"
      initial = { "startLength" => 0,
                  "endLength" => 4,
                  "ops" => [{ "value" => "abc\n"}]
      }

     delta = { "startLength" => 4,
                "endLength" => 4,
                "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "font-name" => "monospace" }},
                          { "start" => 3, "end" => 4 }]
      }

      reset_scribe initial
      apply_delta delta, "Failed to apply monospace", true
    end

    it "should apply a font-size format"
      initial = { "startLength" => 0,
                  "endLength" => 4,
                  "ops" => [{ "value" => "abc\n"}]
      }

      delta = { "startLength" => 4,
                "endLength" => 4,
                "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "font-size" => "huge" }},
                          { "start" => 3, "end" => 4 }]
      }

      reset_scribe initial
      apply_delta delta, "Failed to apply huge font-size", true
    end

    it "should apply a fore-color"
      initial = { "startLength" => 0,
                  "endLength" => 4,
                  "ops" => [{ "value" => "abc\n"}]
      }

      delta = { "startLength" => 4,
                "endLength" => 4,
                "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "fore-color" => "white" }},
                          { "start" => 3, "end" => 4 }]
      }

      reset_scribe initial
      apply_delta delta, "Failed to apply white fore-color", true
    end

    it "should apply a back-color"
      initial = { "startLength" => 0,
                  "endLength" => 4,
                  "ops" => [{ "value" => "abc\n"}]
      }

      delta = { "startLength" => 4,
                "endLength" => 4,
                "ops" => [{ "start" => 0, "end" => 3, "attributes" => { "back-color" => "black" }},
                          { "start" => 3, "end" => 4 }]
      }

      reset_scribe initial
      apply_delta delta, "Failed to apply black back-color", true
    end
  end
end