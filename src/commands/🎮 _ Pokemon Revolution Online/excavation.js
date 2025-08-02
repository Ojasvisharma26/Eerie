const {
  SlashCommandBuilder
} = require('discord.js');
const excavationData = require("../../JSON/excavation.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("excavation")
    .setDescription("Shows all the Excavation Site's Information!")
    .addStringOption((option) =>
      option
        .setName("site")
        .setDescription("Select a Excavation Site")
        .addChoices({
          name: "Feral Site",
          value: "Feral Site"
        }, {
          name: "Historical Site",
          value: "Historical Site"
        }, {
          name: "Haunted Site",
          value: "Haunted Site"
        }, {
          name: "Mineral Site",
          value: "Mineral Site"
        }, {
          name: "Glacial Site",
          value: "Glacial Site"
        }, {
          name: "Natural Site",
          value: "Natural Site"
        }, {
          name: "Wondrous Site",
          value: "Wondrous Site"
        }, {
          name: "Briny Site",
          value: "Briny Site"
        }, {
          name: "Draconic Site",
          value: "Draconic Site"
        })
        .setRequired(true)
    ),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    const site = interaction.options.getString("site");
    const siteData = excavationData[site];

    if (!siteData) {
      return interaction.reply("Invalid excavation site provided.");
    }

    let requirementsList = [];
    let rarityList = [];
    let pokemonList = [];
    let itemList = [];
    let gingeryJonesList = [];

    // Loop through the Pokemon data to populate the lists:
    siteData.Pokemon.forEach(pokemonData => {
      requirementsList.push(pokemonData.Requirements);
      rarityList.push(pokemonData.Rarity);
      pokemonList.push(pokemonData.Pokemon.join(", "));
    });

    // Loop through the Items data to populate the item list:
    if (siteData.Items) {
      siteData.Items.forEach(itemData => {
        itemList.push("**Requirements: **" + itemData.Requirements + "\n" + "**Item: **" + itemData.Items);
      });
    }

    // Loop through the Gingery Jones section:
    const gingeryJonesKey = Object.keys(siteData).find(key => key.startsWith("Gingery Jones"));
    if (gingeryJonesKey) {
      siteData[gingeryJonesKey].forEach(gjData => {
        gingeryJonesList.push("**Requirements: **" + gjData.Requirements + "\n" + "**Rewards: **" + gjData.Reward);
      });
    }

    const embedFields = [
      {
        name: "Requirement",
        value: requirementsList.join("\n"),
        inline: true
      },
      {
        name: "Rarity",
        value: rarityList.join("\n"),
        inline: true
      },
      {
        name: "Pokemon",
        value: pokemonList.join("\n"),
        inline: true
      }
    ];

    // Only add the items if they exist:
    if (itemList.length > 0) {
      embedFields.push({
        name: "__Items__",
        value: itemList.join("\n"),
        inline: false
      });
    }

    // Only add the Gingery Jones section if it exists:
    if (gingeryJonesList.length > 0) {
      embedFields.push({
        name: `__${gingeryJonesKey}__`,
        value: gingeryJonesList.join("\n\n"),
        inline: false
      });
    }

    // Extract the Image URL from the siteData
    const siteImage = siteData.Image;

    // Reply with the constructed embed:
    return interaction.reply({
      embeds: [{
        title: `__${site}__`,
        url: `https://wiki.pokemonrevolution.net/index.php?title=${site.replace(/ /g, '_')}`,
        fields: embedFields,
        timestamp: new Date(),
        footer: {
          text: site
        },
        color: 0x8711ca,
        image: {
          url: siteImage
        }
      }],
    });
  },
};