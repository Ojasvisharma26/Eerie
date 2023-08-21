const express = require('express');
const app = express();
const port = 50000;

// Serve static files from the "dashboard" directory
app.use(express.static(__dirname + '/dashboard'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dashboard/index.html');
});

app.listen(port, () => {
  console.log(
    client.chalk.red(`Eerie listening at http://localhost:${port}`)
  );
});

const Bot = require('./src/bot.js');
const client = new Bot();
client.start()

// Call the execute function every 15 seconds
const api = require("./src/api.js");
setInterval(() => api.execute(client, process.env.FETCH_API_KEY), 15000)