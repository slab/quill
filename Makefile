replay_file=$(shell find tests/selenium/fuzzer_output/fails -type f -exec stat -f "%m %N" {} \; | sort -n | tail -1 | cut -f2- -d" ")

coverage:
	@echo "Initial setup"
	@grunt > /dev/null
	@rm -rf tmp
	@mkdir tmp
	@mkdir tmp/coverage
	@mkdir tmp/backup
	@mv build/src/* tmp/backup/
	@rm tmp/backup/ext/header.js tmp/backup/ext/footer.js
	@echo "Coverting to jscoverage"
	@jscoverage tmp/backup/ tmp/coverage/
	@mv tmp/coverage/* build/src/
	@echo "Running tests"
	@./node_modules/.bin/mocha-phantomjs build/tests/unit.html --reporter json-cov | node scripts/jsoncovtohtmlcov > coverage.html
	@echo "Cleaning up"
	@rm -rf build/src/*
	@mv tmp/backup/* build/src/
	@rm -rf tmp
	@grunt > /dev/null

fuzzer-chrome:
	@ruby tests/webdriver/fuzzer.rb chrome

fuzzer-firefox:
	@ruby tests/webdriver/fuzzer.rb firefox

fuzzer-chrome-replay:
	@ruby tests/webdriver/fuzzer.rb chrome $(replay_file)

fuzzer-firefox-replay:
	@ruby tests/webdriver/fuzzer.rb firefox $(replay_file)

webdriver-unit:
	@ruby tests/webdriver/unit/unit_runner.rb

test:
	@./node_modules/.bin/mocha-phantomjs build/tests/unit.html

test-editor: 
	@mocha-phantomjs build/tests/editor.html

test-all:
	@./node_modules/.bin/mocha-phantomjs build/tests/test.html

testem:
	@./node_modules/.bin/testem -f tests/testem/local.json ci -P 4

testem-remote:
	@./node_modules/.bin/testem -f tests/testem/remote.json ci -P 4
