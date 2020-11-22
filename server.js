const config = require('config');
const http = require(config.get('App.webServer.protocol'));
const app = require('./app');

const port = config.get('App.webServer.port');

const server = http.createServer(app);

server.listen(port);