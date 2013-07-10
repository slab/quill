replay_file=$(shell find tests/selenium/fuzzer_output/fails -type f -exec stat -f "%m %N" {} \; | sort -n | tail -1 | cut -f2- -d" ")

coverage:
	@rm -rf tmp
	@mkdir tmp
	@mkdir tmp/coverage
	@mkdir tmp/backup
	@mv build/src/* tmp/backup/
	@jscoverage tmp/backup/ tmp/coverage/
	@mv tmp/coverage/* build/src/
	@./node_modules/.bin/mocha-phantomjs build/tests/unit.html --reporter json-cov | node scripts/jsoncovtohtmlcov > coverage.html
	@rm -rf build/src/*
	@mv tmp/backup/* build/src/
	@rm -rf tmp

chrome:
	@ruby tests/selenium/fuzzer.rb chrome

firefox:
	@ruby tests/selenium/fuzzer.rb firefox

chrome-replay:
	@ruby tests/selenium/fuzzer.rb chrome $(replay_file)

firefox-replay:
	@ruby tests/selenium/fuzzer.rb firefox $(replay_file)

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
