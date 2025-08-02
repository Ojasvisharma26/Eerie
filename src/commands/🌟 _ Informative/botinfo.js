const { EmbedBuilder, Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription("Shows Bot's Info!"),
  /**
   * 
   * @param {SlashCommandBuilder} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`Information about Eerie:`)
      .setColor(0x8711ca)
      .setDescription(`This is an **__Unofficial__** Discord bot Version 2.0 for Pokemon Revolution Online. This bot have almost all the information about **PROClient** (**Pokemon Revolution Online**) and has a variety of commands that are regularly updated. You can find more information about Eerie over at __https://eerie.proclient.repl.co/__.`)
      .addFields(
        { name: "Bot Name:", value: "Eerie", inline: true },
        { name: "Developers Team:", value: "26_Ojasvi#1318iRubenn#0517, SaladAndApples#1254, Keynaris#7433, pokemonKING44#1640, [JUAMPY]#8161", inline: true },
        { name: "Created on:", value: "22nd March 2022 03:17:00 PM GMT+0000 (Coordinated Universal Time)", inline: false },
        { name: "Guilds Using this bot:", value: client.guilds.cache.size.toLocaleString(), inline: false }
      )
      .setTimestamp()
      .setFooter(
        {
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        }
      )
    interaction.reply({
      embeds: [embed]
    });
  },
};
