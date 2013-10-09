replay_file=$(shell find tests/webdriver/fuzzer_output/fails -type f -exec stat -f "%m %N" {} \; | sort -n | tail -1 | cut -f2- -d" ")

coverage:
	@karma start tests/karma/config-unit.coffee --browsers Chrome --reporters coverage

test:
	@karma start tests/karma/config-unit.coffee --browsers Chrome

test-unit:
	@karma start tests/karma/config-unit.coffee

test-all:
	@karma start tests/karma-all.coffee

testem:
	@./node_modules/.bin/testem -f tests/testem/local.json ci -P 4

testem-remote:
	@./node_modules/.bin/testem -f tests/testem/remote.json ci -P 4

webdriver-fuzzer-chrome:
	@ruby tests/webdriver/fuzzer.rb chrome

webdriver-fuzzer-firefox:
	@ruby tests/webdriver/fuzzer.rb firefox

webdriver-fuzzer-chrome-replay:
	@ruby tests/webdriver/fuzzer.rb chrome $(replay_file)

webdriver-fuzzer-firefox-replay:
	@ruby tests/webdriver/fuzzer.rb firefox $(replay_file)

webdriver-unit-chrome:
	@ruby tests/webdriver/unit/unit_runner.rb chrome

webdriver-unit-firefox:
	@ruby tests/webdriver/unit/unit_runner.rb firefox
