const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const devProxy = {
  '/_api': {
    target: 'http://4pd2u3pa.dongtaiyuming.net',
    ws: true,
    changeOrigin: true,
    pathRewrite: {
      '^/_api': '/'
    },
  }
};

const port = 8999;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    if (dev && devProxy) {
      Object.keys(devProxy).forEach(function(context) {
        server.use(createProxyMiddleware(context, devProxy[context]));
      });
    }

    server.all('*', (req, res) => {
      handle(req, res);
    });

    server.listen(port, err => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });