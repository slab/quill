require 'debugger'
require 'selenium-webdriver'

NUM_EDITS = 10

################################################################################
# Helpers for generating random edits
# XXX: Should we just call into the editor and use the existing js for this?
################################################################################
ALPHABET = "abcdefghijklmnopqrstuvwxyz"

def get_random_string(alphabet, length)
  chars = (0...length).to_a.map! { alphabet[Random.rand(alphabet.length - 1)] }
  return chars.join ''
end

def get_random_length()
  rand = Random.rand()
  if rand < 0.1
    return 1
  elsif rand < 0.6
    return Random.rand((0..2))
  elsif rand < 0.8
    return Random.rand((3..4))
  elsif rand < 0.9
    return Random.rand((5..9))
  else
    return Random.rand((10..50))
  end
end

def get_random_edit
  length = get_random_length()
  opChance = Random.rand()
  if opChance < 1.0
    return get_random_string(ALPHABET, length)
  elsif opChance < 1.0 # TODO
    # delete somewhere
  end
end

def js_get_random_edit(driver)
  return driver.execute_script "return parent.writer.getRandomOp();"
end

$cursor_pos = 0 # XXX: Ghetto shit. Refactor this tom.

def move_cursor(index, editor)
  if index < $cursor_pos
    ($cursor_pos - index).times do editor.send_keys(:arrow_left) end
  elsif index > $cursor_pos
    ($cursor_pos - index).times do editor.send_keys(:arrow_right) end
  end
  $cursor_pos = index
end

def type_text(text, editor)
  editor.send_keys(text)
  $cursor_pos += text.length
end

def op_to_selenium(op, editor)
  case op['op']
  when 'insertAt'
    index, text = op['args']
    move_cursor(index, editor)
    type_text(text, editor)
  when 'deleteAt'
    puts "Ain't nobody got time for dat"
  when 'formatAt'
    puts "Ain't nobody got time for dat"
  else
    raise "Invalid op type: #{op}"
  end
end

################################################################################
# Helpers
################################################################################
def check_consistency(driver)
  writer_delta = driver.execute_script "return parent.writer.getDelta();"
  reader_delta = driver.execute_script "return parent.reader.getDelta();"
  raise "Writer: #{writer_delta}\nReader: #{reader_delta}" unless writer_delta == reader_delta
end

################################################################################
# WebDriver setup
################################################################################
puts "Usage: ruby _browserdriver_ _editor_url_" unless ARGV.length == 2
browserdriver = ARGV[0].to_sym
editor_url = ARGV[1]
driver = Selenium::WebDriver.for browserdriver
driver.manage.timeouts.implicit_wait = 10
driver.get editor_url
editors = driver.find_elements(:class, "editor-container")
writer, reader = editors
driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
writer = driver.find_element(:id, "scribe-container")

################################################################################
# Fuzzer logic
################################################################################
edit = {'op' => 'insertAt', 'args' => [0, "abc"]}
op_to_selenium(edit, writer)
edit = {'op' => 'insertAt', 'args' => [3, "def"]}
op_to_selenium(edit, writer)
edit = {'op' => 'insertAt', 'args' => [0, "123"]}
op_to_selenium(edit, writer)

# debugger
# writer.send_keys "abcd"
# writer.send_keys "abcd"
# writer.click()

# edit = js_get_random_edit(driver)
# puts edit
# NUM_EDITS.times do |i|
#   puts i if i % 100 == 0
#   random_edit = get_random_edit()
#   writer.send_keys random_edit
#   check_consistency(driver)
# end

################################################################################
# Scratch from experimenting with api
################################################################################
# font_size_button = driver.find_element(:class, "size")
# puts "Font button: #{font_size_button}"
# driver.action.move_to(font_size_button).click.perform
# driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
# editor = driver.find_element(:id, "scribe-container")
# 
# editor.click
# editor.send_keys "Hello, scribe."
# editor.send_keys " "
# editor.send_keys "My name is Byron."
# 10.times do editor.send_keys :arrow_left end
# line = driver.find_element(:id, "line-63")
# puts "Line: #{line}"
# driver.action.click(line).perform
# driver.action.move_to(line).click.perform
# editor.send_keys "test test test"
# driver.switch_to.default_content
# font_size_button = driver.find_element(:class, "size")
# puts "Font button: #{font_size_button}"
# driver.action.move_to(font_size_button).click.perform
# 
# driver.switch_to.default_content
# driver.action.move_by(10, 0).click.perform
# driver.quit

