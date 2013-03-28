require 'debugger'
require 'selenium-webdriver'
require_relative 'selenium_adapter'

NUM_EDITS = 500
ALPHABET = "abcdefghijklmnopqrstuvwxyz"


################################################################################
# Helpers
################################################################################
def execute_js(driver, src, args = nil)
  driver.switch_to.default_content
  result = driver.execute_script(src, *args)
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
  return result
end

def js_get_random_delta(driver)
  return execute_js driver, "return window.randomDelta"
end

def js_set_random_delta(driver)
  src = "window.randomDelta = window.Tandem.DeltaGen.getRandomDelta(window.docDelta, arguments[0], arguments[1]);"
  execute_js driver, src, [ALPHABET, 1]
end

def js_get_doc_delta(driver)
  return execute_js driver, "return window.docDelta"
end

def js_set_doc_delta(driver)
  execute_js driver, "window.docDelta = writer.getDelta()"
end

def check_consistency(driver)
  driver.switch_to.default_content
  success = driver.execute_script "return window.docDelta.compose(window.randomDelta).isEqual(writer.getDelta())"
  raise "FAIL" unless success
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
writer = driver.find_element(:class, "editor-container")
driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
writer = driver.find_element(:class, "editor")
adapter = SeleniumAdapter.new driver, writer

################################################################################
# Fuzzer logic
################################################################################
js_set_doc_delta(driver)
NUM_EDITS.times do |i|
   js_set_random_delta(driver)
   random_delta = js_get_random_delta(driver)
   puts i if i % 10 == 0
   adapter.apply_delta(random_delta)
   check_consistency(driver)
   js_set_doc_delta(driver)
end
