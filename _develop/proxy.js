var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});
var ports = {
  proxy: parseInt(process.env.npm_package_config_ports_proxy),
  jekyll: parseInt(process.env.npm_package_config_ports_jekyll),
  karma: parseInt(process.env.npm_package_config_ports_karma),
  webpack: parseInt(process.env.npm_package_config_ports_webpack)
};

var server = http.createServer(function(req, res) {
  if (/\/\d+\.\d+\.\d+/.test(req.url) || req.url.startsWith('/karma/base/dist')) {
    proxy.web(req, res, {
      ignorePath: true,
      target: 'http://localhost:' + ports.webpack + '/' + req.url.split('/').pop()
    });
  } else if (req.url.startsWith('/karma') || req.url === '/assets/favicon.png') {
    proxy.web(req, res, { ignorePath: false, target: { port: ports.karma } });
  } else {
    proxy.web(req, res, { ignorePath: false, target: { port: ports.jekyll } });
  }
});

server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

proxy.on('error', function(e) {
  console.error(e);
});

console.log('Proxy listening on ' + ports.proxy);
server.listen(ports.proxy);
