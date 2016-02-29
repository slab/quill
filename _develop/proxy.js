var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
  if (/\/\d+\.\d+\.\d+/.test(req.url) || req.url.startsWith('/karma/base/dist')) {
    proxy.web(req, res, {
      ignorePath: true,
      target: 'http://localhost:9080/' + req.url.split('/').pop()
    });
  } else if (req.url.startsWith('/karma') || req.url === '/assets/favicon.png') {
    proxy.web(req, res, { ignorePath: false, target: { port: 9876 } });
  } else {
    proxy.web(req, res, { ignorePath: false, target: { port: 4000 } });
  }
});

server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

proxy.on('error', function(e) {
  console.error(e);
});

console.log('Proxy listening on 9000');
server.listen(9000);
