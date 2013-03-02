require 'debugger'
require 'selenium-webdriver'
require_relative 'selenium_adapter'

NUM_EDITS = 10

################################################################################
# Helpers for generating random edits
################################################################################
def js_get_random_edit(driver)
  return driver.execute_script "return parent.writer.getRandomOp();"
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
adapter = SeleniumAdapter.new driver, writer

################################################################################
# Fuzzer logic
################################################################################
edit = {'op' => 'insertAt', 'args' => [0, "abc"]}
adapter.op_to_selenium(edit)
edit = {'op' => 'insertAt', 'args' => [3, "def"]}
adapter.op_to_selenium(edit)
edit = {'op' => 'insertAt', 'args' => [0, "123"]}
adapter.op_to_selenium(edit)
edit = {'op' => 'deleteAt', 'args' => [0, 3]}
adapter.op_to_selenium(edit)

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
