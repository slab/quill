class SeleniumAdapter
  def initialize(editor)
    @editor = editor
    @cursor_pos = 0
  end

  def op_to_selenium(op)
    case op['op']
    when 'insertAt'
      to_index, text = op['args']
      move_cursor(to_index)
      type_text(text)
    when 'deleteAt'
      puts "Ain't nobody got time for dat"
    when 'formatAt'
      puts "Ain't nobody got time for dat"
    else
      raise "Invalid op type: #{op}"
    end
  end

  private

  def move_cursor(to_index)
    (@cursor_pos - to_index).abs.times do @editor.send_keys(:arrow_left) end
    @cursor_pos = to_index
  end

  def type_text(text)
    @editor.send_keys(text)
    @cursor_pos += text.length
  end
end
