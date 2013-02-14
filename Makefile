coverage:
	@rm -rf tmp
	@mkdir tmp
	@mv bin/src/* tmp/
	@jscoverage tmp/ bin/src/
	@./node_modules/.bin/mocha-phantomjs bin/tests/unit.html --reporter json-cov | node scripts/jsoncovtohtmlcov > coverage.html
	@rm bin/src/*
	@mv tmp/* bin/src/
	@rm -rf tmp

test: unit

unit:
	@./node_modules/.bin/mocha-phantomjs bin/tests/unit.html
	

.PHONY: test
