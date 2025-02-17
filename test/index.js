import config from './config.json' assert { type: 'json' };
import client from './client.js';
import proxy from './proxy.js';
import server from './server.js';

proxy(config);
client(config);
server(config);