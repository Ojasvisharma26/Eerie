const wait = require("node:timers/promises").setTimeout;

module.exports = {
  name: "ready",
  /**
   * 
   * @param {import('discord.js').Client} client 
   */
  async execute(client) {
    console.log(
      client.chalk.yellowBright(`[CLIENT] - Logging into Discord.....`)
    );
    await wait(3000)
    console.log(
      client.chalk.red(client.chalk.bold(`[CLIENT]`)), client.chalk.gray(`>>`), client.chalk.magenta(`${client.user.tag}`), client.chalk.cyan(`has logged into Discord!`)
    );
    await wait(1000)
    console.log(
      client.chalk.red(client.chalk.bold(`[CLIENT]`)), client.chalk.gray(`>>`), client.chalk.magenta(`${client.user.tag}`), client.chalk.cyan(`Has reached to:`), client.chalk.blueBright(`${client.guilds.cache.size}`), client.chalk.redBright(`servers!`)
    );
    setInterval(client.pickPresence, 8000);
  }
};
