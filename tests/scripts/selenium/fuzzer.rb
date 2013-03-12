require 'debugger'
require 'selenium-webdriver'
require_relative 'selenium_adapter'

NUM_EDITS = 500

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
  writer_delta = driver.execute_script "return parent.writer.getDelta().toString();"
  reader_delta = driver.execute_script "return parent.reader.getDelta().toString();"
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
NUM_EDITS.times do |i|
   puts i if i % 10 == 0
   random_edit = js_get_random_edit(driver)
   adapter.op_to_selenium(random_edit)
   check_consistency(driver)
end
