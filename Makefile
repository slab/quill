REPORTER = list

coverage:
	grunt
	rm -rf tmp
	mkdir tmp
	mv bin/src/* tmp/
	jscoverage tmp/ bin/src/
	./node_modules/.bin/mocha-phantomjs bin/tests/unit.html --reporter json-cov > coverage.json
	echo "HEY"
	rm bin/src/*
	mv tmp/* bin/src/
	rm -rf tmp
	echo "HEY"

test: unit

unit:
	@./node_modules/.bin/mocha-phantomjs bin/tests/unit.html --reporter $(REPORTER)
	

.PHONY: test
