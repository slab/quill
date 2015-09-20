var _ = require('lodash');
var babelify = require('babelify');
var browserify = require('browserify');
var fs = require('fs');
var harp = require('harp');
var proxy = require('http-proxy');
var stylify = require('stylify');
var stylus = require('stylus');
var watchify = require('watchify');

var FAVICON = new Buffer('iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACf0lEQVR42r2XS2gTURSG04K2VReilorEECVKiJk8EYuurIgPEFddKW4El1J3FbRUEOzKKuhKdy4Uql0H0UVxoYIKkoWCrxaKz1qKTayNYv0O3IEhzNzecSYz8HNnJpPz3XPm3HPuxGIRHNlstqdQKBwul8tDpVLpDprg/BV63hJgPB7vAngU0HX0BtCSh76FCs7n89sBjqJZDfS343whFHCxWNyEsZvojwb8jok9YKw77tUDwzF6CtW8wPw2zwQvMN51+f3jf4MzmcwaDIxpPBb4S8Zd6JHHM9UgIa/q4OgqObFDQq+Z4G3fcLJ77TLwBSZ4gueSACaXmeRZv2FfidGHGo9+MO7N5XJbDOBLRKjoN+Eu69Y0Xu80haO3mGzzAz+I/np4Pk3YMwLnesoALv8ZMIYnk8lOTTLNCNyyrK2mcPQerTKeAA8PenhRQ70+4T95Vbv9rvcZF0MNPD/EmNDBmeB3qYDSF7geAb7fb+KdcTMM/CTjBtXVnMAv6BY6ThfcHLjUYvS1i1ejKjJPm+7PomP8rT2UJiPvygVekXbL+X3Ne37BcwfCaDRXmuCT6XR6vWwqDJdaRVZQkAl8cPZxIrKHe9cM4Z9RX5DwF5qMnlcygY+TpN1Bwz/sMPpEst6rEjqTUBpRKAmIscfK6C/G07LuNfCG5AsrY10ocGr6ahsoPZtxzsPjRcYbUglD3VwSxn12b0efXMBfVWdMtGRbLXs4j7o/Ltttrle07CNCdT57xyNldkSWUyqV6ojiI6YN2D17wyi5EIvyIPTnFHyOUG+LFA60X9a50pGo4ZZ8QCjvL0Ud9m675kvzCK2V+qh4F9Ez+Xqhkm2MRXz8AzAAXszjgRshAAAAAElFTkSuQmCC', 'base64');

var browserifyOps = {
  cache: {},
  fullPaths: true,
  noParse: ['./node_modules/clone/clone.js', './node_modules/deep-equal/index.js', './node_modules/eventemitter3/index.js', './node_modules/extend/index.js'],
  packageCache: {},
  standalone: 'Quill'
};

function bundle(watcher) {
  return watcher.bundle().on('error', function(err) {
    console.error(err.name, err.message);
  });
}

function serve(connect, req, res, next) {
  var watchers = connect.watchers;
  if (req.url.indexOf('/karma') === 0 || req.url.indexOf('/base') === 0) {
    return connect.karmaProxy.web(req, res);
  }
  var url = req.url.indexOf('/develop') === 0 ? req.url.slice('/develop'.length) : req.url;
  switch (url) {
    case '/quill.js':
      res.setHeader('Content-Type', 'application/javascript');
      bundle(watchers['src']).pipe(res);
      break;
    case '/test/quill.js':
      res.setHeader('Content-Type', 'application/javascript');
      bundle(watchers['test']).pipe(res);
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

module.exports = function(grunt) {
  grunt.config('connect', {
    options: {
      onCreateServer: function(server, connect, options) {
        connect.watchers = _.reduce(['src', 'test'], function(watchers, type) {
          var file = type === 'src' ? './src/index.js' : './test/quill.js';
          var b = browserify(file, browserifyOps);
          watchers[type] = watchify(b);
          watchers[type].transform(babelify);
          watchers[type].transform(stylify);
          watchers[type].on('update', _.bind(bundle, watchers[type], watchers[type]));
          bundle(watchers[type]);
          return watchers;
        }, {});
        return connect.karmaProxy = proxy.createProxyServer({
          target: "http://localhost:" + (grunt.config('karmaPort'))
        });
      },
      middleware: function(connect, options, middlewares) {
        middlewares.push(serve.bind(this, connect));
        middlewares.push(harp.mount(__dirname + '/../..'));
        return middlewares;
      },
      debug: true
    },
    server: {
      options: {
        port: grunt.config('port'),
        useAvailablePort: true
      }
    }
  });

  grunt.event.once('connect.server.listening', function(host, port) {
    grunt.config('port', port);
  });
};
