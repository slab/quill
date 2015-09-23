var browserify = require('./browserify');
var http = require('http');
var karmaConfig = require('./karma.js');
var proxy = require('http-proxy');
var connect = require('gulp-connect');
var gulp = require('gulp');
var gutil = require('gulp-util');


var FAVICON = new Buffer('iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACf0lEQVR42r2XS2gTURSG04K2VReilorEECVKiJk8EYuurIgPEFddKW4El1J3FbRUEOzKKuhKdy4Uql0H0UVxoYIKkoWCrxaKz1qKTayNYv0O3IEhzNzecSYz8HNnJpPz3XPm3HPuxGIRHNlstqdQKBwul8tDpVLpDprg/BV63hJgPB7vAngU0HX0BtCSh76FCs7n89sBjqJZDfS343whFHCxWNyEsZvojwb8jok9YKw77tUDwzF6CtW8wPw2zwQvMN51+f3jf4MzmcwaDIxpPBb4S8Zd6JHHM9UgIa/q4OgqObFDQq+Z4G3fcLJ77TLwBSZ4gueSACaXmeRZv2FfidGHGo9+MO7N5XJbDOBLRKjoN+Eu69Y0Xu80haO3mGzzAz+I/np4Pk3YMwLnesoALv8ZMIYnk8lOTTLNCNyyrK2mcPQerTKeAA8PenhRQ70+4T95Vbv9rvcZF0MNPD/EmNDBmeB3qYDSF7geAb7fb+KdcTMM/CTjBtXVnMAv6BY6ThfcHLjUYvS1i1ejKjJPm+7PomP8rT2UJiPvygVekXbL+X3Ne37BcwfCaDRXmuCT6XR6vWwqDJdaRVZQkAl8cPZxIrKHe9cM4Z9RX5DwF5qMnlcygY+TpN1Bwz/sMPpEst6rEjqTUBpRKAmIscfK6C/G07LuNfCG5AsrY10ocGr6ahsoPZtxzsPjRcYbUglD3VwSxn12b0efXMBfVWdMtGRbLXs4j7o/Ltttrle07CNCdT57xyNldkSWUyqV6ojiI6YN2D17wyi5EIvyIPTnFHyOUG+LFA60X9a50pGo4ZZ8QCjvL0Ud9m675kvzCK2V+qh4F9Ez+Xqhkm2MRXz8AzAAXszjgRshAAAAAElFTkSuQmCC', 'base64');

var karmaProxy = proxy.createProxyServer({
  target: "http://localhost:" + karmaConfig.port
});

var testWatcher = browserify('./test/quill.js');
testWatcher.on('update', testWatcher.bundle);


gulp.task('server', ['watch', 'source:watch'], function(callback) {
  connect.server({
    debug: true,
    livereload: true,
    middleware: function(connect, opt) {
      return [serve];
    },
    port: 9000,
    root: '.build/quill/'
  });
});

gulp.task('watch', function() {
  gulp.watch('examples/*.jade', ['examples:html']);
  gulp.watch('examples/styles/*.styl', ['examples:styles']);
  gulp.watch('examples/scripts/*.js', ['examples:scripts']);

  gulp.watch('src/**/*.styl', ['theme']);
});


function serve(req, res, next) {
  gutil.log('[connect]', req.url);
  if (req.url.indexOf('/karma') === 0 || req.url.indexOf('/base') === 0) {
    return karmaProxy.web(req, res);
  }
  var url = req.url.indexOf('/develop') === 0 ? req.url.slice('/develop'.length) : req.url;
  switch (url) {
    case '/test/quill.js':
      res.setHeader('Content-Type', 'application/javascript');
      bundle(testWatcher).pipe(res);
      break;
    case '/quill.snow.css':
    case '/quill.base.css':
      var theme = url.slice(7, 11);
      res.setHeader('Content-Type', 'text/css');
      fs.readFile("./src/themes/" + theme + "/" + theme + ".styl", function(err, data) {
        var s = stylus(data.toString());
        s.include("./src/themes/" + theme);
        s.define('url', stylus.url());
        s.render(function(err, css) {
          if (err != null) console.error(err.name, err.message);
          res.end(css);
        });
      });
      break;
    case '/favicon.ico':
    case '/favicon.png':
      res.setHeader('Content-Type', 'image/png');
      res.end(FAVICON);
      break;
    default:
      next();
  }
}
