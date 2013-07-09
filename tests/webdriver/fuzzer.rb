require 'debugger'
require 'colorize'
require 'highline'
require 'selenium-webdriver'
require 'json'
require_relative 'selenium_adapter'

NUM_EDITS = 500

################################################################################
# JS Helpers
################################################################################
def execute_js(driver, src, args = nil)
  driver.switch_to.default_content
  result = driver.execute_script(src, *args)
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
  return result
end

def js_get_as_str(driver, ref)
  return execute_js driver, "return JSON.stringify(window.Fuzzer['#{ref}'])"
end

def js_get(driver, ref)
  return execute_js driver, "return window.Fuzzer['#{ref}']"
end

def js_set_scribe_delta(driver)
  return execute_js driver, "window.Fuzzer.initializeScribe()"
end

def js_set_delta_replay(driver, delta, delta_ref)
  src = "return window.Fuzzer.setDeltaReplay(arguments[0], arguments[1])"
  execute_js driver, src, [delta, delta_ref]
end

def js_set_random_delta(driver)
  src = "window.Fuzzer.randomDelta = window.Fuzzer.createRandomDelta()"
  execute_js driver, src
end

def js_get_cur_doc_delta_as_str(driver)
  return execute_js driver, "return JSON.stringify(editor.getDelta());"
end

def js_get_doc_delta_as_str(driver)
  return execute_js driver, "return JSON.stringify(window.Fuzzer.docDelta);"
end

def js_get_expected_as_str(driver)
  return execute_js driver, "return JSON.stringify(window.Fuzzer.docDelta.compose(window.Fuzzer.randomDelta));"
end

def js_set_doc_delta(driver)
  execute_js driver, "window.Fuzzer.docDelta = window.Fuzzer.cleanup(editor.getDelta());"
end


################################################################################
# Replay file helpers
################################################################################
def read_deltas_from_file(file)
  deltas = []
  begin
    File.open(file) do |f|
      f.readlines.each do |line|
        deltas << line.chomp!
      end
    end
    return deltas
  rescue
    puts "Please provide a valid file name to replay a fuzzer run.".colorize(:red)
    abort
  end
end

def write_deltas_to_file(doc_delta, rand_delta)
  file_path = FileUtils.mkpath(File.join(File.dirname(File.expand_path(__FILE__)), "fuzzer_output", "fails"))
  file_path = File.join file_path.first, "#{Time.now.to_i.to_s}"
  File.open(file_path, 'w+') do |f|
    f.puts doc_delta
    f.puts rand_delta
  end
  puts "Fuzzer failed. Writing state to #{file_path} for replays.".colorize(:red)
end

def delete_fail_file(file)
  begin
    FileUtils.rm(file)
  rescue
    puts "Failed deleting file #{file}. Please ensure the path is valid.".colorize(:red)
    abort
  end
end

def initialize_scribe_from_replay_file(replay_file, driver, adapter, editor)
  doc_delta, rand_delta = read_deltas_from_file(replay_file)
  js_set_delta_replay(driver, doc_delta, 'docDelta')
  js_set_delta_replay(driver, rand_delta, 'randomDelta')
  doc_delta = js_get(driver, "docDelta")
  js_set_scribe_delta(driver)

  # Remove inexplicable highlighting that gets applied when setting delta and
  # reset cursor to 0th position
  editor.click()
  adapter.cursor_pos = doc_delta['endLength']
  adapter.move_cursor 0

  adapter.doc_length = doc_delta['endLength']
end

################################################################################
# WebDriver setup
################################################################################
unless ARGV.length == 1 or ARGV.length == 2
  puts "Usage: ruby _browserdriver_ _replay_file_".colorize(:blue)
end
browserdriver = ARGV[0].to_sym
replay_file = ARGV[1]
editor_url = "file://#{File.join(File.expand_path(__FILE__), '../../..', 'build/tests/webdriver.html')}"
if browserdriver == :firefox
  profile = Selenium::WebDriver::Firefox::Profile.new
  profile.native_events = true
  driver = Selenium::WebDriver.for browserdriver, :profile => profile
elsif browserdriver == :chrome
  log_path = FileUtils.mkpath(File.join(File.dirname(File.expand_path(__FILE__)), "fuzzer_output"))
  log_path = log_path.first
  driver = Selenium::WebDriver.for browserdriver, :service_log_path => log_path
else
  driver = Selenium::WebDriver.for browserdriver
end
driver.manage.timeouts.implicit_wait = 10
driver.get editor_url
driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
editor = driver.find_element(:class, "editor")
adapter = SeleniumAdapter.new driver, editor
adapter.focus()

################################################################################
# Fuzzer logic
################################################################################
def check_consistency(driver, replay_file)
  driver.switch_to.default_content
  success = driver.execute_script "return window.Fuzzer.checkConsistency();"
  if not success
    doc_delta = js_get_as_str(driver, "docDelta")
    rand_delta = js_get_as_str(driver, "randomDelta")
    expected_delta = js_get_expected_as_str(driver)
    actual_delta = js_get_cur_doc_delta_as_str(driver)
    write_deltas_to_file(doc_delta, rand_delta) unless replay_file
    doc_delta = JSON.pretty_generate(JSON.parse(doc_delta))
    rand_delta = JSON.pretty_generate(JSON.parse(rand_delta))
    expected_delta = JSON.pretty_generate(JSON.parse(expected_delta))
    puts "Inconsistent deltas:".red
    puts "#{'doc_delta: '.light_cyan + doc_delta},"
    puts "#{'rand_delta: '.light_cyan + rand_delta},"
    puts "#{'expected_delta: '.light_cyan + expected_delta},"
    puts "#{'actual: '.light_cyan + actual_delta}"
    abort
  elsif replay_file
    highline = HighLine.new
    delete = highline.agree "Congrats, it passed! Would you like to delete the fail file? (y/n)".colorize(:green)
    delete_fail_file(replay_file) if delete
  end
  driver.switch_to.frame(driver.find_element(:tag_name, "iframe"))
end

if replay_file
  initialize_scribe_from_replay_file(replay_file, driver, adapter, editor)
  random_delta = js_get(driver, "randomDelta")
  adapter.apply_delta(random_delta)
  check_consistency(driver, replay_file)
else
  js_set_doc_delta(driver)
  NUM_EDITS.times do |i|
    js_set_random_delta(driver)
    random_delta = js_get(driver, "randomDelta")
    puts i.to_s.colorize(:green) if i % 10 == 0
    adapter.apply_delta(random_delta)
    check_consistency(driver, nil)
    js_set_doc_delta(driver)
  end
end
