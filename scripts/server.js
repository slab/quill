var browserify = require('browserify');
var coffeeify = require('coffeeify');
var connect = require('connect');
var harp = require('harp');

var app = connect();
var respond = function(file, req, res, next) {
  res.setHeader('Content-Type', 'application/javascript');
  var b = browserify(file, { extensions: ['.js', '.coffee'] });
  b.transform(coffeeify).bundle({ standalone: 'Quill' }).pipe(res);
};

app.use('/quill.js', respond.bind(this, './src/quill.coffee'));
app.use('/test/quill.js', respond.bind(this, './test/quill.coffee'));
app.use(harp.mount(__dirname + '/..'));

app.listen(9000);
