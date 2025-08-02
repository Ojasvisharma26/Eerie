const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { RichEmbed } = require('discord.js');

function padWithZeros(num) {
  return num.toString().padStart(2, '0');
}

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("poketime")
    .setDescription("Check the current in-game time of PRO!"),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const offset = 172909;
    const now = new Date();
    const hh = now.getUTCHours() * 3600;
    const mm = now.getUTCMinutes() * 60;
    const ss = now.getUTCSeconds();
    const totalSeconds = hh + mm + ss;
    const pokeSeconds = totalSeconds * 4;
    const totalGameSeconds = offset + pokeSeconds;
    const gameTime = new Date(now.getTime() + (totalGameSeconds * 1000));
    const gameHour = gameTime.getHours();
    const gameMin = gameTime.getMinutes();


    let period = '';
    let timerHour = gameHour;
    if (timerHour >= 12) {
      period = 'PM';
      timerHour -= 12;
    } else {
      period = 'AM';
    }
    if (timerHour === 0) {
      timerHour = 12;
    }

    const timer24 = `${padWithZeros(gameHour)}:${padWithZeros(gameMin)} ${gameHour >= 12 ? 'PM' : 'AM'}`;
    const timer12 = `${padWithZeros(timerHour)}:${padWithZeros(gameMin)} ${period}`;
    let timer = '';
    if (4 <= gameHour && gameHour < 12) {
      timer = '🌅 **__Morning__**\n' + '24-hour - ' + timer24 + '\n' + ' 12-hour - ' + timer12;
    } else if (12 <= gameHour && gameHour < 20) {
      timer = '☀️ **__Day__**\n' + '24-hour - ' + timer24 + '\n' + ' 12-hour - ' + timer12;
    } else {
      timer = '🌕 **__Night__**\n' + '24-hour - ' + timer24 + '\n' + ' 12-hour - ' + timer12;
    }

    return interaction.reply({
      embeds: [
        {
          title: `Current In-Game Time`,
          description: timer,
          color: 0x8711ca,
          footer: {
            text: "PokeTime by Eerie"
          },
          timestamp: new Date(),
          thumbnail: {
            url: `https://media.discordapp.net/attachments/969481658451517440/1075409228279324812/icon_clock.png`
          }
        }
      ]
    });
  }
};
