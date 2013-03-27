require 'debugger'
require 'selenium-webdriver'
require_relative 'selenium_adapter'

NUM_EDITS = 500
ALPHABET = "abcdefghijklmnopqrstuvwxyz"

################################################################################
# Helpers for generating random edits
################################################################################
def js_get_random_delta(driver)
  driver.switch_to.default_content
  random_delta = driver.execute_script("window.randomDelta = window.Tandem.DeltaGen.getRandomDelta(window.docDelta, arguments[0], arguments[1]); return window.randomDelta;",
    ALPHABET,
    1)
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
  return random_delta
end

def js_get_test_delta(driver, src)
  driver.switch_to.default_content
  test_delta = driver.execute_script(src)
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
  return test_delta
end

################################################################################
# Helpers
################################################################################
def check_consistency(driver)
  driver.switch_to.default_content
  success = driver.execute_script "return window.docDelta.compose(window.randomDelta).isEqual(writer.getDelta())"
  raise "FAIL" unless success
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
end

def js_set_doc_delta(driver)
  driver.switch_to.default_content
  driver.execute_script("window.docDelta = writer.getDelta()")
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
writer = driver.find_element(:class, "editor")
adapter = SeleniumAdapter.new driver, writer

################################################################################
# Fuzzer logic
################################################################################
doc_delta = js_get_doc_delta(driver)
src = "return new window.Tandem.Delta(1, 2, [new window.Tandem.InsertOp('a'), new window.Tandem.RetainOp(0, 1)])"
first_delta = js_get_test_delta(driver, src)
adapter.apply_delta(first_delta)
src = "return new window.Tandem.Delta(2, 2, [new window.Tandem.RetainOp(0, 1, {bold: true}), new window.Tandem.RetainOp(1, 2)])"
second_delta = js_get_test_delta(driver, src)
adapter.apply_delta(second_delta)
src = "return new window.Tandem.Delta(2, 1, [new window.Tandem.RetainOp(1, 2)])"
third_delta = js_get_test_delta(driver, src)
debugger
adapter.apply_delta(third_delta)
# NUM_EDITS.times do |i|
#    random_delta = js_get_random_delta(driver, doc_delta)
#    puts i if i % 10 == 0
#    adapter.apply_delta(random_delta)
#    check_consistency(driver, doc_delta, random_delta)
# end
