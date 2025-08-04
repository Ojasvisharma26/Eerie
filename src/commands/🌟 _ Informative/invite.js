const { EmbedBuilder, Client, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder, PermissionsBitField, } = require('discord.js');

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription("Shows Bot's Invite Info!"),
  /**
   * 
   * @param {SlashCommandBuilder} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Eerie Discord Bot`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`<:GengarHype:969829007875014696> **__[Invite Me](https://discord.com/oauth2/authorize?client_id=955666381335060512&permissions=1644938395127&scope=bot)__** **In Your Server Now!** <:GengarHype:969829007875014696>`)
      //.setURL("https://discord.com/oauth2/authorize?client_id=955666381335060512&permissions=1644938395127&scope=bot")
      .setColor(0x8711ca)
      .addFields({ name: "Support Server:", value: "Click **__[Here](https://discord.gg/m2BPEXypmR)__** to join the Support Server", inline: true })
      .setImage("https://media.discordapp.net/attachments/969481658451517440/1021695552158711818/unknown.png?width=1149&height=646")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

    // const button = new ButtonBuilder()
    //   .setLabel(`Eerie Dashboard`)
    //   .setStyle(ButtonStyle.Link)
    //   .setURL("https://eerie.proclient.repl.co/")
    //   .setEmoji(`<:GengarHype:969829007875014696>`);
    await interaction.reply({
      components: [new ActionRowBuilder().addComponents(button)],
      embeds: [embed]
    });
  },
};
