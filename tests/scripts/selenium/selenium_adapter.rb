################################################################################
# TODO's:
# - Improve error handling
# - Improve performance
# - Add logic so that if a test fails, it's easy to reproduce the failing
# - behavior
# - Some of this code is not the Ruby way; fix that.
################################################################################
class SeleniumAdapter
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
        move_cursor(index)
        type_text(op['value'])
        break
      else
        if op['start'] > index
          move_cursor(index)
          delete_length = op['start'] - index
          delete(delete_length)
          break
        elsif !op['attributes'].empty?
          length = op['end'] - op['start']
          move_cursor(index)
          highlight(length)
          op['attributes'].each do |attr, val|
            format(attr, val)
          end
          break
        else
          index += op['end'] - op['start']
        end
      end
    end
  end

  private

  def move_cursor(to_index)
    # TODO: Deal w/ newlines that firefox adds.
    distance = (@cursor_pos - to_index).abs
    if @cursor_pos > to_index
      distance.times do @editor.send_keys(:arrow_left) end
    else
      distance.times do @editor.send_keys(:arrow_right) end
    end
    @cursor_pos = to_index
  end

  def highlight(length)
    # TODO: Figure out how to support highlighting with mouse.
    keys = (0...length).to_a.map! { :arrow_right }
    @cursor_pos += length
    @driver.action.key_down(:shift).send_keys(keys).key_up(:shift).perform
  end

  def delete(length)
    highlight(length)
    @editor.send_keys(:delete)
    @doc_length -= length
  end

  def type_text(text)
    if @cursor_pos == @doc_length && @driver.browser == :firefox
      # Hack to workaround inexplicable firefox behavior in which it appends a
      # newline if you append to the end of the document.
      @editor.send_keys(text, :arrow_down, :delete)
    else
      @editor.send_keys(text)
    end
    @cursor_pos += text.length
    @doc_length += text.length
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
