var _ = require('lodash');
var coffeeify = require('coffeeify');
var connect = require('connect');
var harp = require('harp');
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
app.use(harp.mount(__dirname + '/..'));

app.listen(9000);
console.info('Quill development server listening on port 9000');
