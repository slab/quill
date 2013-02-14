var fs = require('fs');
var path = require('path');
var jade = require('jade');
var reporter = require.resolve('mocha/lib/reporters/html-cov');
var file = path.join(path.dirname(reporter), 'templates/coverage.jade');
var fn = jade.compile(fs.readFileSync(file, 'utf-8'), {filename: file});

var data = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
  data += chunk;
});

process.stdin.on('end', function () {
  // remove unuse log
  data = data.replace(/^[\s\S]*?({)/, '$1');
  process.stdout.write(fn({
    cov: JSON.parse(data),
    coverageClass: coverageClass
  }));
});



function coverageClass(n) {
  if (n >= 75) return 'high';
  if (n >= 50) return 'medium';
  if (n >= 25) return 'low';
  return 'terrible';
}