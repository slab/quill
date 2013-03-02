class SeleniumAdapter
  def initialize(driver, editor)
    @cursor_pos = 0
    @driver = driver
    @editor = editor
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
      puts "Ain't nobody got time for dat"
    else
      raise "Invalid op type: #{op}"
    end
  end

  private

  def highlight(length)
    # TODO: Figure out how to support highlighting with mouse.
    keys = (0...length).to_a.map! { :arrow_right }
    @driver.action.key_down(:shift).send_keys(keys).key_up(:shift).perform
  end

  def delete(length)
    highlight(length)
    @editor.send_keys(:delete)
  end

  def move_cursor(to_index)
    (@cursor_pos - to_index).abs.times do @editor.send_keys(:arrow_left) end
    @cursor_pos = to_index
  end

  def type_text(text)
    @editor.send_keys(text)
    @cursor_pos += text.length
  end
end
