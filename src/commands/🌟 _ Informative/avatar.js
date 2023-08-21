const { EmbedBuilder, Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Gets a users avatar!")
    .addUserOption((user) =>
      user.setName("target").setDescription("Select a user!")),

  /**
   * 
   * @param {SlashCommandBuilder} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const targetUser = interaction.options.getUser("target") || interaction.user;

    const avatarEmbed = new EmbedBuilder()
      .setColor(0x8711ca)
      .setAuthor({ name: `${targetUser.username}'s avatar!` })
      .addFields(
        { name: `\`PNG\``, value: `[PNG](${targetUser.avatarURL({ dynamic: true, size: 4096, format: "png" })})`, inline: true },
        { name: `\`JPG\``, value: `[JPG](${targetUser.avatarURL({ dynamic: true, size: 4096, format: "jpg" })})`, inline: true },
        { name: `\`WEBP\``, value: `[WEBP](${targetUser.avatarURL({ dynamic: true, size: 4096, format: "webp" })})`, inline: true },
      )
      .setImage(`${targetUser.displayAvatarURL({ size: 1024 })}`)
    .setTimestamp()
    await interaction.reply({ embeds: [avatarEmbed] })
    } 
  }