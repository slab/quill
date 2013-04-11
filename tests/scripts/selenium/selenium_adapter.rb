################################################################################
# TODO's:
# - Improve error handling
# - Improve performance
# - Some of this code is not the Ruby way; fix that.
################################################################################
class SeleniumAdapter

  attr_accessor :doc_length

  def initialize(driver, editor)
    @cursor_pos = 0
    @driver = driver
    @editor = editor
    @doc_length = 0
  end

  # Assumes delta will contain only one document modifying op
  def apply_delta(delta)
    index = 0
    delta['ops'].each do |op|
      if op['value']
        puts "Inserting #{op['value']} at #{index}"
        move_cursor(index)
        type_text(op['value'])
        # Remove any prexisting formatting that Scribe applied
        move_cursor(index)
        runs = op['value'].split "\n"
        runs.each do |run|
          if run.length > 0
            highlight run.length
            remove_active_formatting
          end
          remove_highlighting
          move_cursor(index + run.length + 1) # +1 to account for \n
          index += run.length + 1
        end
        remove_highlighting
        break
      elsif op['start'] > index
        move_cursor(index)
        delete_length = op['start'] - index
        puts "Deleting #{delete_length} at #{index}"
        delete(delete_length)
        break
      elsif !op['attributes'].empty?
        length = op['end'] - op['start']
        puts "Formatting #{length} starting at #{index} with #{op['attributes']}"
        move_cursor(index)
        highlight(length)
        op['attributes'].each do |attr, val|
          format(attr, val)
        end
        remove_highlighting
        break
      else
        index += op['end'] - op['start']
      end
    end
  end

  # private

  def remove_highlighting
    # Kludge. The only xplatform way that I've found to guarantee removing
    # highlighted text in a content editable is to command the cursor to move to
    # the 0th position.
    move_cursor 0
  end

  def remove_active_formatting
    @driver.switch_to.default_content
    active_formats = @driver.execute_script("return window.Fuzzer.getActiveFormats()")
    @driver.switch_to.frame(@driver.find_element(:tag_name, "iframe"))
    active_formats.each do |format|
      click_button_from_toolbar(format)
    end
    select_from_dropdown('size', 'normal')
    select_from_dropdown('family', 'san-serif')
    select_from_dropdown('color', 'black')
    select_from_dropdown('background', 'white')
  end

  def move_cursor(dest_index)
    distance = (@cursor_pos - dest_index).abs
    if @cursor_pos > dest_index
      distance.times do @editor.send_keys(:arrow_left) end
    else
      distance.times do @editor.send_keys(:arrow_right) end
    end
    @cursor_pos = dest_index
  end

  def highlight(length)
    keys = (0...length).to_a.map! { :arrow_right }
    @cursor_pos += length
    @driver.action.key_down(:shift).send_keys(keys).key_up(:shift).perform
  end

  def delete(length)
    highlight(length)
    @editor.send_keys(:delete)
    @doc_length -= length
    @cursor_pos -= length
  end

  def type_text(text)
    keys = []
    cur = ""
    text.each_char { |c|
      if c == "\n"
        keys << cur if cur.length > 0
        cur = ""
        keys << :enter
      elsif c == " "
        keys << cur if cur.length > 0
        cur = ""
        keys << :space
      else
        cur << c
      end
    }
    keys << cur if cur.length > 0
    if @cursor_pos == @doc_length && @driver.browser == :firefox
      # Hack to workaround inexplicable firefox behavior in which it appends a
      # newline if you append to the end of the document.
      @editor.send_keys(keys, :arrow_down, :delete)
    else
      keys.each do |key|
        index = @cursor_pos
        move_cursor 0
        move_cursor index
        @editor.send_keys(key)
        len = key.is_a?(String) ? key.length : 1
        @cursor_pos += len
        @doc_length += len
      end
    end
  end

  def click_button_from_toolbar(button_class)
      @driver.switch_to.default_content
      button = @driver.execute_script("return $('#editor-toolbar-writer > .#{button_class}')[0]")
      button.click()
      @driver.switch_to.frame(@driver.find_element(:tag_name, "iframe"))
  end

  def select_from_dropdown(dropdown_class, value)
    @driver.switch_to.default_content
    dropdown = @driver.execute_script("return $('#editor-toolbar-writer > .#{dropdown_class}')[0]")
    Selenium::WebDriver::Support::Select.new(dropdown).select_by(:value, value)
    @driver.switch_to.frame(@driver.find_element(:tag_name, "iframe"))
  end

  def format(format, value)
    case format
    when /bold|italic|underline/
      if Random.rand() < 0.5
        @driver.action.key_down(@@cmd_modifier).send_keys(format[0]).key_up(@@cmd_modifier).perform
      else
        click_button_from_toolbar(format)
      end
    when /link|strike/
      click_button_from_toolbar(format)
    when /family|size|background|color/
      select_from_dropdown(format, value)
    else
      raise "Unknown formatting op: #{format}"
    end
    @editor.send_keys("") # Need to reset focus to the editor after clicking toolbar
  end

  def self.os
    host_os = RbConfig::CONFIG['host_os']
    case host_os
    when /mswin|msys|mingw|cygwin|bccwin|wince|emc/
      return :windows
    when /darwin|mac os/
      return :macosx
    when /linux/
      return :linux
    when /solaris|bsd/
      return :unix
    else
      raise Error::WebDriverError, "unknown os: #{host_os.inspect}"
    end
  end

  def self.os_to_modifier()
    case self.os()
    when :windows
      return :control
    when :linux
      return :control
    when :macosx
      return :command
    end
  end
  @@cmd_modifier = SeleniumAdapter.os_to_modifier()
end
