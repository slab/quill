require 'colorize'
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

def js_get_random_delta_as_str(driver)
  return execute_js driver, "return JSON.stringify(window.randomDelta);"
end

def js_get_random_delta(driver)
  return execute_js driver, "return window.randomDelta;"
end

def js_set_scribe_delta(driver)
  return execute_js driver, "window.writer.setDelta(window.docDelta)"
end

def js_set_delta_replay(driver, delta, delta_ref)
  src = "return (function(docDelta, deltaRef) {var d = JSON.parse(docDelta); window[deltaRef] = new window.Tandem.Delta(d.startLength, d.endLength, d.ops);})(arguments[0], arguments[1])"
  execute_js driver, src, [delta, delta_ref]
end

def js_set_random_delta(driver)
  src = "window.randomDelta = window.Tandem.DeltaGen.getRandomDelta(window.docDelta, arguments[0]);"
  execute_js driver, src, [1]
end

def js_get_cur_doc_delta_as_str(driver)
  return execute_js driver, "return JSON.stringify(writer.getDelta());"
end

def js_get_doc_delta_as_str(driver)
  return execute_js driver, "return JSON.stringify(window.docDelta);"
end

def js_get_doc_delta(driver)
  return execute_js driver, "return window.docDelta;"
end

def js_set_doc_delta(driver)
  execute_js driver, "window.docDelta = writer.getDelta();"
end

def read_deltas_from_file(file)
  deltas = []
  begin
    File.open("fails/#{file}") do |f|
      f.readlines.each do |line|
        deltas << line.chomp!
      end
    end
    return deltas
  rescue
    raise "Please provide a valid file name to replay a fuzzer run.".colorize(:red)
  end
end

def write_deltas_to_file(doc_delta, rand_delta)
  FileUtils.mkpath('./fails') unless File.directory?('./fails')
  file_path = "./fails/#{Time.now.to_i.to_s}"
  File.open(file_path, 'w+') do |f|
    f.puts doc_delta
    f.puts rand_delta
  end
  puts "Fuzzer failed. Writing state to #{file_path} for replays.".colorize(:red)
end

def check_consistency(driver, replaying)
  driver.switch_to.default_content
  src = "return window.docDelta.compose(window.randomDelta).isEqual(writer.getDelta());"
  success = driver.execute_script src
  if not success
    doc_delta = js_get_doc_delta_as_str(driver)
    rand_delta = js_get_random_delta_as_str(driver)
    after_delta = js_get_cur_doc_delta_as_str(driver)
    write_deltas_to_file(doc_delta, rand_delta) unless replaying
    raise "doc_delta: #{doc_delta}, rand_delta: #{rand_delta}, actual: #{after_delta}"
  end
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
end

################################################################################
# WebDriver setup
################################################################################
unless ARGV.length == 2 or ARGV.length == 3
  puts "Usage: ruby _browserdriver_ _editor_url_ _fuzzer_file_".colorize(:blue)
end
browserdriver = ARGV[0].to_sym
editor_url = ARGV[1]
replay = ARGV[2]
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
if replay
  doc_delta, rand_delta = read_deltas_from_file(replay)
  js_set_delta_replay(driver, doc_delta, 'docDelta')
  js_set_delta_replay(driver, rand_delta, 'randomDelta')
  doc_delta = js_get_doc_delta(driver)
  js_set_scribe_delta(driver)
  adapter.doc_length = doc_delta['endLength']
  random_delta = js_get_random_delta(driver)
  random_delta_str = js_get_random_delta_as_str(driver)
  adapter.apply_delta(random_delta)
  check_consistency(driver, replay)
else
  js_set_doc_delta(driver)
  NUM_EDITS.times do |i|
     js_set_random_delta(driver)
     random_delta = js_get_random_delta(driver)
     puts i.to_s.colorize(:green) if i % 10 == 0
     adapter.apply_delta(random_delta)
     check_consistency(driver, replay)
     js_set_doc_delta(driver)
  end
end
