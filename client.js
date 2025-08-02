const express = require('express')
const app = express()
const port = 50000;

const keep_alive = require('./keep_alive.js')
const Bot = require('./src/bot.js');
const client = new Bot();
client.start()

// Call the execute function every 15 seconds
const api = require("./src/api.js");
setInterval(() => api.execute(client, process.env.FETCH_API_KEY), 15000)
