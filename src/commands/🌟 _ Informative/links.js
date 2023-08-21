const { EmbedBuilder, Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName('links')
    .setDescription("Shows Bot's Link Info!"),
  /**
   * 
   * @param {SlashCommandBuilder} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`Eerie All Links`)
      .setColor(0x8711ca)
      .setDescription(`Use [QR Code](https://media.discordapp.net/attachments/969481658451517440/1021704475045527632/qrcode.png?width=646&height=646) for the [Web Page](https://eerie.proclient.repl.co/)\n\n<a:ShinRight:969829023398129664> Click [**Here**](https://discord.com/oauth2/authorize?client_id=955666381335060512&permissions=415874153697&scope=bot%20applications.commands) To Invite Me <a:ShinLeft:969829022617964554> \n\n<a:ShinRight:969829023398129664> Eerie Official [**Dashboard**](https://eerie.proclient.repl.co/) <a:ShinLeft:969829022617964554> \n\n<a:ShinRight:969829023398129664> Invite Link To PROClient [**Discord**](https://discord.com/invite/98pMNxq) <a:ShinLeft:969829022617964554> \n\n<a:ShinRight:969829023398129664> Click [**Here**](https://pokemonrevolution.net/download) To Download Game <a:ShinLeft:969829022617964554> \n\n<a:ShinRight:969829023398129664> Click [**Here**](https://pokemonrevolution.net/register) To Register In PROClient <a:ShinLeft:969829022617964554>\n\n<a:ShinRight:969829023398129664> Eerie Mail **__Eerie.probot@gmail.com__** <a:ShinLeft:969829022617964554>`, true)
      .setImage("https://media.discordapp.net/attachments/969481658451517440/987308833393233920/rainbow_line.gif")
      .setTimestamp()
      .setThumbnail("https://media.discordapp.net/attachments/969481658451517440/1076765636719542292/image.png?width=652&height=646")
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
    await interaction.reply({
      embeds: [embed]
    });
  },
};
