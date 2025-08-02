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
    .setName("suggest")
    .setDescription("Suggests to DEV.")
    .addStringOption((option) =>
      option
        .setName("subject")
        .setDescription("Tell Your Subject!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("suggestion")
        .setDescription("Send Your Suggestion!")
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
    const subject = interaction.options.getString("subject")
    const query = interaction.options.getString("suggestion")


    const suggestEmbed = {
      color: 0x8711ca,
      author: {
        name: interaction.user.username,
        icon_url: interaction.user.displayAvatarURL({ dynamic: true })
      },
      title: 'New Suggestion!',
      thumbnail: {
        url: interaction.user.displayAvatarURL({ dynamic: true })
      },
      fields: [
        {
          name: 'Author 🖌',
          value: interaction.user.tag,
          inline: true
        },
        {
          name: 'Guild 🏠',
          value: interaction.guild.name,
          inline: true
        },
        {
          name: 'Subject :interrobang:',
          value: subject,
          inline: false
        },
        {
          name: 'Suggestion 🎉',
          value: query
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Suggestion from: ' + interaction.guild.name,
        icon_url: interaction.guild.iconURL({ dynamic: true })
      },
      image: {
        url: 'https://media.discordapp.net/attachments/969481658451517440/987308833393233920/rainbow_line.gif'
      }
    }

    owner.send({ embeds: [suggestEmbed] });

    interaction.reply({ content: "Thanks for suggesting. I've sent your message to the Developers. They'll contact you as soon as possible (If needed)." });
    //interaction.channel.send({ embeds: [suggestEmbed] })

  },
};
