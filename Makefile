coverage:
	@rm -rf tmp
	@mkdir tmp
	@mkdir tmp/coverage
	@mkdir tmp/backup
	@mv build/src/* tmp/backup/
	@jscoverage tmp/backup/ tmp/coverage/
	@mv tmp/coverage/* build/src/
	@mocha-phantomjs build/tests/unit.html --reporter json-cov | node scripts/jsoncovtohtmlcov > coverage.html
	@rm -rf build/src/*
	@mv tmp/backup/* build/src/
	@rm -rf tmp

editor-test: 
	@mocha-phantomjs build/tests/editor.html

test:
	@mocha-phantomjs build/tests/test.html

unit:
	@mocha-phantomjs build/tests/unit.html
