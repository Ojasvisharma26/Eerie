const { SlashCommandBuilder } = require("discord.js");
const evData = require("../../JSON/evspots.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("evspots")
    .setDescription("Returns Information About Evspots!")
    .setDMPermission(false)
    .addStringOption((option) => {
      const choices = Object.keys(evData).map((region) => ({
        name: region.toUpperCase(),
        value: region.toLowerCase(),
      }));

      return option
        .setName("region")
        .setDescription("Select a region")
        .setRequired(true)
        .addChoices(...choices);
    }),

  async execute(interaction, client) {
    const region = interaction.options.getString("region");
    const evStats = evData[region.toLowerCase()];

    if (!evStats) {
      return interaction.reply("Invalid region provided.");
    }

    const embedData = Object.entries(evStats).map(([stat, data]) => ({
      name: `__EV ${stat}__`,
      value: `**Map:** \`${data.Map}\`\n**Area:** \`${data.Area}\`\n**Daytime:** \`${data.Daytime}\`\n**Pokémon:** \`${data.Pokemon}\``,
    }));

    return interaction.reply({
      embeds: [
        {
          title: `EV training spots in __${region.toUpperCase()}__ region`,
          fields: embedData,
          color: 0x8711ca,
          image: {
            url: "https://media.discordapp.net/attachments/969481658451517440/987308833393233920/rainbow_line.gif"
          },
          footer: {
            text: "EvSpots by Eerie"
          },
          timestamp: new Date(),
          thumbnail: {
            url: "https://media.discordapp.net/attachments/969481658451517440/1074967047261397043/tactics_st_stat_enhancing_128.png?width=160&height=160"
          }
        },
      ],
      ephemeral: false,
    });
  },
};
