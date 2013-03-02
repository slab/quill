class SeleniumAdapter
  def initialize(driver, editor)
    @cursor_pos = 0
    @driver = driver
    @editor = editor
    # TODO: Based on os, set appropriate modifier keys (i.e., command vs control
    # on mac/windoze)
  end

  def op_to_selenium(op)
    case op['op']
    when 'insertAt'
      to_index, text = op['args']
      move_cursor(to_index)
      type_text(text)
    when 'deleteAt'
      to_index, length = op['args']
      move_cursor(to_index)
      delete(length)
    when 'formatAt'
      to_index, length, format, value = op['args']
      move_cursor(to_index)
      highlight(length)
      format(format, value)
    else
      raise "Invalid op type: #{op}"
    end
  end

  private

  def move_cursor(to_index)
    (@cursor_pos - to_index).abs.times do @editor.send_keys(:arrow_left) end
    @cursor_pos = to_index
  end

  def highlight(length)
    # TODO: Figure out how to support highlighting with mouse.
    keys = (0...length).to_a.map! { :arrow_right }
    @driver.action.key_down(:shift).send_keys(keys).key_up(:shift).perform
  end

  def delete(length)
    highlight(length)
    @editor.send_keys(:delete)
  end

  def type_text(text)
    @editor.send_keys(text)
    @cursor_pos += text.length
  end

  def format(format, value)
    case format
    when 'bold'
      @driver.action.key_down(:command).send_keys('b').key_up(:command).perform
    when 'italic'
      @driver.action.key_down(:command).send_keys('i').key_up(:command).perform
    when 'link'
      @driver.switch_to.default_content
      link_button = @driver.execute_script("return $('#editor-toolbar-writer > .link')[0]")
      link_button.click()
      @driver.switch_to.frame(@driver.find_element(:tag_name, "iframe"))
    when 'strike'
      @driver.switch_to.default_content
      strike_button = @driver.execute_script("return $('#editor-toolbar-writer > .strike')[0]")
      strike_button.click()
      @driver.switch_to.frame(@driver.find_element(:tag_name, "iframe"))
    when 'underline'
      @driver.action.key_down(:command).send_keys('u').key_up(:command).perform
    end
  end
end
