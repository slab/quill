REPORTER = list

coverage:
	@rm -rf src-js src-js-cov
	@./node_modules/.bin/coffee -c -o src-js src
	@jscoverage src-js src-js-cov
	@TANDEM_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@rm -rf src-js src-js-cov

test: unit

unit:
	@./node_modules/.bin/mocha-phantomjs bin/tests/unit.html --reporter $(REPORTER)
	

.PHONY: test
