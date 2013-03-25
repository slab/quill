coverage:
	@rm -rf tmp
	@mkdir tmp
	@mkdir tmp/coverage
	@mkdir tmp/backup
	@mv build/*.js tmp/backup/
	@jscoverage tmp/backup/ tmp/coverage/
	@mv tmp/coverage/*.js build/
	@./node_modules/.bin/mocha-phantomjs build/tests/unit.html --reporter json-cov | node scripts/jsoncovtohtmlcov > coverage.html
	@rm build/*.js
	@mv tmp/backup/*.js build/
	@rm -rf tmp

test: unit

unit:
	@./node_modules/.bin/mocha-phantomjs build/tests/unit.html
