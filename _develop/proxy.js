const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const ports = {
  proxy: parseInt(process.env.npm_package_config_ports_proxy, 10),
  jekyll: parseInt(process.env.npm_package_config_ports_gatsby, 10),
  webpack: parseInt(process.env.npm_package_config_ports_webpack, 10),
};

const server = http.createServer((req, res) => {
  if (/\/\d+\.\d+\.\d+/.test(req.url)) {
    const target = `http://localhost:${ports.webpack}/${req.url
      .split('/')
      .pop()}`;
    proxy.web(req, res, {
      ignorePath: true,
      target,
    });
  } else {
    proxy.web(req, res, { ignorePath: false, target: { port: ports.jekyll } });
  }
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

proxy.on('error', e => {
  console.error(e);
});

console.log('Proxy listening on ' + ports.proxy);
server.listen(ports.proxy);
