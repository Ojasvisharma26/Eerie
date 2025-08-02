const {
  SlashCommandBuilder
} = require('discord.js');
const digspotData = require("../../JSON/digspots.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("digspots")
    .setDescription("Returns Information About All Digspots!")
    .addStringOption((option) =>
      option
        .setName("kanto")
        .setDescription("Select a Spot from Kanto Region")
        .addChoices({
          name: "Diglett's Cave",
          value: "Diglett's Cave"
        }, {
          name: "Route 3",
          value: "Route 3"
        }, {
          name: "Route 14",
          value: "Route 14"
        }, {
          name: "Route 15",
          value: "Route 15"
        }, {
          name: "Mt. Moon",
          value: "Mt. Moon"
        }, {
          name: "Mt. Moon 2",
          value: "Mt. Moon 2"
        }, {
          name: "Rock Tunnel",
          value: "Rock Tunnel"
        }, {
          name: "Rock Tunnel 2",
          value: "Rock Tunnel 2"
        })
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("johto")
        .setDescription("Select a Spot from Johto Region")
        .addChoices({
          name: "Dark Cave South",
          value: "Dark Cave South"
        }, {
          name: "Mt. Mortar",
          value: "Mt. Mortar"
        }, {
          name: "Slowpoke Well",
          value: "Slowpoke Well"
        }, {
          name: "Slowpoke Well 2",
          value: "Slowpoke Well 2"
        })
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("sevii-island")
        .setDescription("Select a Spot from Sevii Island")
        .addChoices({
          name: "Water Path",
          value: "Water Path"
        }, {
          name: "Tanoby Key",
          value: "Tanoby Key"
        })
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("sinnoh")
        .setDescription("Select a Spot from Sinnoh Region")
        .addChoices({
          name: "Maniac Tunnel",
          value: "Maniac Tunnel"
        }, {
          name: "Mt. Coronet Summit",
          value: "Mt. Coronet Summit"
        }, {
          name: "Oreburgh Gate B1F",
          value: "Oreburgh Gate B1F"
        }, {
          name: "Ravaged Path",
          value: "Ravaged Path"
        }, {
          name: "Route 209",
          value: "Route 209"
        }, {
          name: "Route 210 North",
          value: "Route 210 North"
        }, {
          name: "Route 211",
          value: "Route 211"
        })
        .setRequired(false)
    ),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    const regionKanto = interaction.options.getString("kanto");
    const regionJohto = interaction.options.getString("johto");
    const regionSevii = interaction.options.getString("sevii-island");
    const regionSinnoh = interaction.options.getString("sinnoh");

    let digspotName;
    let digspotEntry;

    if (regionKanto) {
      digspotName = regionKanto;
      digspotEntry = digspotData.KANTO[digspotName];
    } else if (regionJohto) {
      digspotName = regionJohto;
      digspotEntry = digspotData.JOHTO[digspotName];
    } else if (regionSevii) {
      digspotName = regionSevii;
      digspotEntry = digspotData.SEVII_ISLANDS[digspotName];
    } else if (regionSinnoh) {
      digspotName = regionSinnoh;
      digspotEntry = digspotData.SINNOH[digspotName];
    }

    if (!digspotName) {
      return interaction.reply("You didn't select any dig spot.");
    }

    if (!digspotEntry) {
      return interaction.reply("Invalid dig spot provided.");
    }

    let selectedRegion;

    if (regionKanto) {
      digspotName = regionKanto;
      digspotEntry = digspotData.KANTO[digspotName];
      selectedRegion = "Kanto";
    } else if (regionJohto) {
      digspotName = regionJohto;
      digspotEntry = digspotData.JOHTO[digspotName];
      selectedRegion = "Johto";
    } else if (regionSevii) {
      digspotName = regionSevii;
      digspotEntry = digspotData.SEVII_ISLANDS[digspotName];
      selectedRegion = "Sevii Islands";
    } else if (regionSinnoh) {
      digspotName = regionSinnoh;
      digspotEntry = digspotData.SINNOH[digspotName];
      selectedRegion = "Sinnoh";
    }

    let embedData = [{
      name: "Location 🗺",
      value: digspotEntry.Location,
      inline: false
    }, {
      name: "Pokemon Levels 📊",
      value: digspotEntry["Pokemon Levels"],
      inline: true
    }, {
      name: "Patches :pick:",
      value: digspotEntry.Patches,
      inline: true
    }, {
      name: "Region 🌍",
      value: selectedRegion,
      inline: true
    }, {
      name: "Items :school_satchel:",
      value: Array.isArray(digspotEntry.Items) ? digspotEntry.Items.join(", ") : digspotEntry.Items,
      inline: false
    }, {
      name: "Pokemons :troll:",
      value: Array.isArray(digspotEntry.Pokemons) ? digspotEntry.Pokemons.join(", ") : digspotEntry.Pokemons,
      inline: false
    }];

    return interaction.reply({
      embeds: [{
        title: `__${digspotName}__`,
        description: `Detailed information for the selected dig spot:`,
        fields: embedData,
        footer: {
          text: `Digspots by Eerie`,
          iconURL: "https://media.discordapp.net/attachments/969481658451517440/1140572699278712993/diglett.png?width=375&height=297"
        },
        timestamp: new Date(),
        color: 0x8711ca,
      }],
    });
  },
};