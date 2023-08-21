const fetch = require('node-fetch');

const maxRetries = 5;
let retries = 0;

const postData = (client) => {
    fetch("https://api-try-mf32.onrender.com", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            server: `${client.guilds.cache.size.toLocaleString()} `,
            user: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
            channel: `${client.channels.cache.size.toLocaleString()}`,
            command: `${client.commands.size}`
        }),
    }).catch((error) => {
        console.log(`An error occured while trying to update bot stats:\n${error}`)
    });
};

module.exports = {
    execute: function(client) {
        postData(client);
    }
};
