var _ = require('lodash');
var coffeeify = require('coffeeify');
var connect = require('connect');
var fs = require('fs');
var harp = require('harp');
var stylus = require('stylus');
var watchify = require('watchify');

var opts = { extensions: ['.js', '.coffee'] };
var bundle = function(w) {
  return w.bundle({ standalone: 'Quill' });
};
var watchers = {
  'main': watchify('./src/quill.coffee', opts),
  'test': watchify('./test/quill.coffee', opts)
};
_.each(watchers, function(w) {
  w.require('./.build/lodash.js', { expose: 'lodash' });
  w.transform(coffeeify);
  w.on('update', bundle.bind(this, w));
  bundle(w);
});

var app = connect();
var respond = function(type, req, res, next) {
  res.setHeader('Content-Type', 'application/javascript');
  bundle(watchers[type]).pipe(res);
};

app.use('/quill.js', respond.bind(this, 'main'));
app.use('/test/quill.js', respond.bind(this, 'test'));
app.use('/quill.snow.css', function(req, res, next) {
  res.setHeader('Content-Type', 'text/css');
  fs.readFile('./src/themes/snow/snow.styl', function(err, data) {
    var s = stylus(data.toString());
    s.include('./src/themes/snow');
    s.define('url', stylus.url());
    s.render(function(err, css) {
      res.write(css);
      res.end();
    })
  });
});
app.use(harp.mount(__dirname + '/..'));

app.listen(9000);
console.info('Quill development server listening on port 9000');
