const { Client, SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  developer: false,
  category: "util",
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Reminds You on Specific Reason.")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Enter Your Time!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Enter Your Reason!")
        .setRequired(true)
    ),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    const timeuser = interaction.options.getString("time");
    const reason = interaction.options.getString("reason");

    if (!timeuser) return interaction.reply(":x: You should enter time 10m 10s 10d");
    if (!reason) return interaction.reply(":x: You should enter reason");

    const reminderTimestamp = Date.now() + ms(timeuser);
    interaction.reply(`**REMINDER SET ** :alarm_clock:\nAlright, I will remind you about **${reason}** in **${timeuser}**`);

    const interval = setInterval(function() {
      if (Date.now() > reminderTimestamp) {
        interaction.user.send(`:alarm_clock: **Reminder: **${reason}`)
          .catch(e => console.log(e));
        clearInterval(interval);
      }
    }, 1000);
  },
};
