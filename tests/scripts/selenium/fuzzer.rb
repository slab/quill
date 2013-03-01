require 'debugger'
require 'selenium-webdriver'

ALPHABET = "abcdefghijklmnopqrstuvwxyz"
NUM_EDITS = 10

################################################################################
# Helpers for generating random edits
# XXX: Should we just call into the editor and use the existing js for this?
################################################################################
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

################################################################################
# Helpers
################################################################################
def check_consistency(driver)
  driver.switch_to.default_content
  writer_delta = driver.execute_script "return writer.getDelta();"
  reader_delta = driver.execute_script "return reader.getDelta();"
  raise "Writer: #{writer_delta}\nReader: #{reader_delta}" unless writer_delta == reader_delta
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
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
puts "Writer is: #{writer}"

################################################################################
# Fuzzer logic
################################################################################
NUM_EDITS.times do
  random_edit = get_random_edit()
  puts "RandomEdit is: #{random_edit}"
  writer.send_keys random_edit
  check_consistency(driver)
end

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

