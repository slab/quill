replay_file=$(shell find tests/webdriver/fuzzer_output/fails -type f -exec stat -f "%m %N" {} \; | sort -n | tail -1 | cut -f2- -d" ")

coverage:
	@echo "Initial setup"
	@grunt > /dev/null
	@rm -rf tmp
	@mkdir tmp
	@mkdir tmp/coverage
	@mkdir tmp/backup
	@mv build/scribe-exposed.js tmp/backup/scribe-exposed.js
	@echo "Coverting to jscoverage"
	@jscoverage tmp/backup tmp/coverage
	@mv tmp/coverage/scribe-exposed.js build/scribe-exposed.js
	@echo "Running tests"
	@./node_modules/.bin/mocha-phantomjs build/tests/unit.html --reporter json-cov | node scripts/jsoncovtohtmlcov > coverage.html
	@echo "Cleaning up"
	@mv tmp/backup/scribe-exposed.js build/scribe-exposed.js
	@rm -rf tmp
	@grunt > /dev/null

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
