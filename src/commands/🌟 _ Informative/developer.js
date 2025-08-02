const { EmbedBuilder, Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName('developer')
    .setDescription("Shows Bot's Developer Info!"),
  /**
   * 
   * @param {SlashCommandBuilder} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setTitle(`Developer Team of Eerie 😈`)
      .setColor(0x8711ca)
      .addFields(
        { name: "Developers", value: "26_Ojasvi#1318", inline: true },
        { name: "Artists", value: "Keynaris#7433\niRubenn#0517\nSaladAndApples#1254", inline: true },
        { name: "Investor", value: "pokemonKING44#1640", inline: true }
      )
      .setImage("https://media.discordapp.net/attachments/1136925210361221141/1247930170736771122/image.png?ex=6661d10a&is=66607f8a&hm=ea19a8a5ba54bc3e91d66c53aae6e0074dab3588e06486adaf6211ba5ffc16e8&=&format=webp&quality=lossless&width=687&height=248")
      .setTimestamp()
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
    await interaction.reply({ embeds: [embed] })
  }
}
