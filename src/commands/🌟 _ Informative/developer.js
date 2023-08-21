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
      .setTitle(`Developer Team of @Eerie#6660`)
      .setColor(0x8711ca)
      .addFields(
        { name: "Developers", value: "26_Ojasvi#1318\nA Yan.#9710", inline: true },
        { name: "Artists", value: "Keynaris#7433\niRubenn#0517\nSaladAndApples#1254", inline: true },
        { name: "Web Designer", value: "26_Ojasvi#1318\nNoob_Aniket#4487", inline: false },
        { name: "Investor", value: "A Yan.#9710\npokemonKING44#1640", inline: true },
        { name: "Supporter/Helper", value: "Keynaris#7433\npokemonKING44#1640\nNoob_Aniket#4487", inline: true }
      )
      .setImage("https://media.discordapp.net/attachments/969481658451517440/1021686891642355752/unknown.png?width=1440&height=518")
      .setTimestamp()
      .setThumbnail("https://media.discordapp.net/attachments/969481658451517440/1076193835836784721/wALupHf2mcEgAAAABJRU5ErkJggg.png?width=670&height=670")
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
    await interaction.reply({ embeds: [embed] })
  }
}