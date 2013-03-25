require 'debugger'
require 'selenium-webdriver'
require_relative 'selenium_adapter'

NUM_EDITS = 500
ALPHABET = "abcdefghijklmnopqrstuvwxyz"

################################################################################
# Helpers for generating random edits
################################################################################
def js_get_random_delta(driver, doc_delta)
  driver.switch_to.default_content
  return driver.execute_script("return window.DeltaGen.getRandomDelta.apply(window.DeltaGen, arguments)",
    doc_delta,
    ALPHABET,
    1)
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
end

################################################################################
# Helpers
################################################################################
def check_consistency(driver)
  writer_delta = driver.execute_script "return parent.writer.getDelta().toString();"
  reader_delta = driver.execute_script "return parent.reader.getDelta().toString();"
  raise "Writer: #{writer_delta}\nReader: #{reader_delta}" unless writer_delta == reader_delta
end

def js_get_doc_delta(driver)
  doc_delta = driver.execute_script "return parent.writer.getDelta()"
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
doc_delta = js_get_doc_delta(driver)
NUM_EDITS.times do |i|
   delta = js_get_random_delta(driver, doc_delta)
   puts i if i % 10 == 0
   adapter.op_to_selenium(random_delta)
   check_consistency(driver)
end
