replay_file=$(shell find tests/webdriver/fuzzer_output/fails -type f -exec stat -f "%m %N" {} \; | sort -n | tail -1 | cut -f2- -d" ")

coverage:
	@./node_modules/.bin/karma start tests/karma/unit.conf.coffee --browsers Chrome --reporters coverage

test:
	@./node_modules/.bin/karma start tests/karma/unit.conf.coffee --browsers PhantomJS

test-all:
	@./node_modules/.bin/karma start tests/karma/all.conf.coffee

test-karma:
	@./node_modules/.bin/karma start tests/karma/unit.conf.coffee --browsers PhantomJS --no-single-run

test-remote:
	@./node_modules/.bin/karma start tests/karma/browserstack.conf.coffee

test-unit:
	@./node_modules/.bin/karma start tests/karma/unit.conf.coffee

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
