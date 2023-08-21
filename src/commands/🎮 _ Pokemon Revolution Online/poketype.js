const { SlashCommandBuilder } = require("discord.js");
const typeData = require("../../JSON/effectiveness.json");
const emotes = require("../../JSON/emotes.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("poketype")
    .setDescription("Returns Information About Pokemon Types!")
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName("type1")
        .setDescription("Select the primary Pokémon type")
        .setRequired(true)
        .setAutocomplete(false)
        .addChoices(
          {
            name: "Bug",
            value: "Bug"
          },
          {
            name: "Fighting",
            value: "Fighting"
          },
          {
            name: "Ground",
            value: "Ground"
          },
          {
            name: "Dark",
            value: "Dark"
          },
          {
            name: "Fire",
            value: "Fire"
          },
          {
            name: "Ice",
            value: "Ice"
          },
          {
            name: "Dragon",
            value: "Dragon"
          },
          {
            name: "Flying",
            value: "Flying"
          },
          {
            name: "Normal",
            value: "Normal"
          },
          {
            name: "Electric",
            value: "Electric"
          },
          {
            name: "Ghost",
            value: "Ghost"
          },
          {
            name: "Poison",
            value: "Poison"
          },
          {
            name: "Fairy",
            value: "Fairy"
          },
          {
            name: "Grass",
            value: "Grass"
          },
          {
            name: "Psychic",
            value: "Psychic"
          },
          {
            name: "Rock",
            value: "Rock"
          },
          {
            name: "Steel",
            value: "Steel"
          },
          {
            name: "Water",
            value: "Water"
          }
        )
    )
    .addStringOption(option =>
      option
        .setName("type2")
        .setDescription("Select the secondary Pokémon type (Optional)")
        .setRequired(false)
        .setAutocomplete(false)
        .addChoices(
          {
            name: "Bug",
            value: "Bug"
          },
          {
            name: "Fighting",
            value: "Fighting"
          },
          {
            name: "Ground",
            value: "Ground"
          },
          {
            name: "Dark",
            value: "Dark"
          },
          {
            name: "Fire",
            value: "Fire"
          },
          {
            name: "Ice",
            value: "Ice"
          },
          {
            name: "Dragon",
            value: "Dragon"
          },
          {
            name: "Flying",
            value: "Flying"
          },
          {
            name: "Normal",
            value: "Normal"
          },
          {
            name: "Electric",
            value: "Electric"
          },
          {
            name: "Ghost",
            value: "Ghost"
          },
          {
            name: "Poison",
            value: "Poison"
          },
          {
            name: "Fairy",
            value: "Fairy"
          },
          {
            name: "Grass",
            value: "Grass"
          },
          {
            name: "Psychic",
            value: "Psychic"
          },
          {
            name: "Rock",
            value: "Rock"
          },
          {
            name: "Steel",
            value: "Steel"
          },
          {
            name: "Water",
            value: "Water"
          }
        )
    ),

  async execute(interaction, client) {
    const primaryType = interaction.options.getString("type1");
    const secondaryType = interaction.options.getString("type2");

    function getEmoteByType(type) {
      return emotes[type] || "";
    }


    // Always consider it as an array for easy comparison.
    let typesToSearch = [primaryType];

    if (secondaryType) {
      typesToSearch.push(secondaryType);
    }

    // Sort for consistent comparison
    typesToSearch = typesToSearch.sort();

    const typeEntry = typeData.find(entry => {
      // If entry name is an array, sort and compare. Else, just compare.
      if (Array.isArray(entry.name)) {
        const sortedEntry = entry.name.sort();
        return JSON.stringify(sortedEntry) === JSON.stringify(typesToSearch);
      } else {
        return entry.name.toLowerCase() === primaryType.toLowerCase();
      }
    });

    if (!typeEntry) {
      return interaction.reply({ content: "No data found for the provided type(s)." });
    }

    const embedData = [
      {
        name: "**`Immunes`** 🛡️",
        value: typeEntry.immunes.length ? typeEntry.immunes.map(t => `__${t}__ ${getEmoteByType(t)}`).join(" | ") : "-",
        inline: true
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true
      },
      {
        name: "**`Weaknesses`** 🤕",
        value: typeEntry.weaknesses.length ? typeEntry.weaknesses.map(t => `__${t}__ ${getEmoteByType(t)}`).join(" | ") : "-",
        inline: true
      },
      {
        name: "**`Strengths`** 💪🏻",
        value: typeEntry.strengths.length ? typeEntry.strengths.map(t => `__${t}__ ${getEmoteByType(t)}`).join(" | ") : "-",
        inline: true
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true
      },
      {
        name: "**`Resists`** 👊🏻",
        value: typeEntry.resists.length ? typeEntry.resists.map(t => `__${t}__ ${getEmoteByType(t)}`).join(" | ") : "-",
        inline: true
      }
    ];

    const embed = {
      title: `${getEmoteByType(primaryType)} __${Array.isArray(typeEntry.name) ? typeEntry.name.join(" & ") : typeEntry.name} Type__ ${secondaryType ? getEmoteByType(secondaryType) : ""}`,
      fields: embedData,
      image: {
        url: "https://media.discordapp.net/attachments/969481658451517440/1141384420931145728/image.png?width=1147&height=616"
      },
      footer: {
        text: "PokeType by Eerie"
      },
      timestamp: new Date(),
      color: 0x8711ca,
    };

    return interaction.reply({ embeds: [embed] });
  },
};