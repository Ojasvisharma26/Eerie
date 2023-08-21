const {
  Client,
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder
} = require("discord.js");
const ms = require("ms");

module.exports = {
  developer: false,
  category: "util",
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Reports to DEV.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("Command Bugged!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Send Your Query!")
        .setRequired(true)
    ),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    const owner = client.users.cache.get('943050817747959868');
    const command = interaction.options.getString("command")
    const query = interaction.options.getString("query")


    const reportEmbed = {
      color: 0x8711ca,
      author: {
        name: interaction.user.username,
        icon_url: interaction.user.displayAvatarURL({ dynamic: true })
      },
      title: 'New Report/Bug!',
      thumbnail: {
        url: interaction.user.displayAvatarURL({ dynamic: true })
      },
      fields: [
        {
          name: 'Author :paintbrush:',
          value: interaction.user.tag,
          inline: true
        },
        {
          name: 'Guild :house:',
          value: interaction.guild.name,
          inline: true
        },
        {
          name: 'Command Bugged :bug:',
          value: command
        },
        {
          name: 'Report/Bug :interrobang:',
          value: query
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Report from: ' + interaction.guild.name,
        icon_url: interaction.guild.iconURL({ dynamic: true })
      },
      image: {
        url: 'https://media.discordapp.net/attachments/969481658451517440/987308833393233920/rainbow_line.gif'
      }
    }

    owner.send({ embeds: [reportEmbed] });

    interaction.reply({ content: "Thanks for Reporting. I've sent your message to the Developers. They'll contact you as soon as possible (If needed)." });
    //interaction.channel.send({ embeds: [reportEmbed] })

  },
};
