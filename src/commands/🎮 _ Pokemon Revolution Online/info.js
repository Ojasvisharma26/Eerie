const { SlashCommandBuilder } = require("discord.js");
const moveTutorsData = require("../../JSON/move_tutors.json");
const movePlacesData = require("../../JSON/move_places.json");
const moveInfoData = require("../../JSON/moves.json");
const abilityData = require("../../JSON/abilites.json");
const itemData = require("../../JSON/item_data.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Check the Information about Move, Item, Ability!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Enter an Item name")
        .setAutocomplete(false)
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("move")
        .setDescription("Enter a Move name")
        .setAutocomplete(false)
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("ability")
        .setDescription("Enter an Ability name")
        .setAutocomplete(false)
        .setRequired(false)
    ),

  async execute(interaction, client) {
    // ...
    const moveNameRaw = interaction.options.getString("move");
    const abilityNameRaw = interaction.options.getString("ability");
    const itemNameRaw = interaction.options.getString("item");

    // If the user is querying by move:
    if (moveNameRaw) {
      // Remove all spaces and underscores from the move name
      const moveName = moveNameRaw.replace(/[\s_-]+/g, '').toLowerCase();
      const moveInfo = moveInfoData[moveName];


      if (!moveInfo) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            {
              title: "Error",
              description: `No information found for the move ${moveNameRaw}.`,
              color: 0xFF0000,
              thumbnail: {
                url: "https://image.flaticon.com/icons/svg/1923/1923533.svg",
              },
            },
          ],
        });
      }

      let howToLearn = "Learns by Move Relearner or Egg Move Tutor";
      if (moveTutorsData[moveName]) {
        if (Array.isArray(moveTutorsData[moveName])) {
          howToLearn = `Tutor: ${moveTutorsData[moveName].join(', ')}`;
        } else {
          howToLearn = `Tutor: ${moveTutorsData[moveName]}`;
        }
      } else if (movePlacesData[moveName]) {
        if (Array.isArray(movePlacesData[moveName])) {
          howToLearn = `Learned at: ${movePlacesData[moveName].join(', ')}`;
        } else {
          howToLearn = `Learned at: ${movePlacesData[moveName]}`;
        }
      }

      return interaction.reply({
        content: `\`\`\`yaml\nDetails for Move ${moveNameRaw}:\n\nType: ${moveInfo.type}\nPower: ${moveInfo.power} BP\nPP: ${moveInfo.pp}\nAccuracy: ${moveInfo.accuracy}%\nDescription: ${moveInfo.description}\n${howToLearn}\`\`\``,
      });
    }

    // Handle abilityName or other future options here...
    if (abilityNameRaw) {
      const abilityName = abilityNameRaw.replace(/[\s_-]+/g, '').toLowerCase();
      const abilityInfo = abilityData[abilityName];

      if (!abilityInfo) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            {
              title: "Error",
              description: `No information found for the ability ${abilityNameRaw}.`,
              color: 0xFF0000,
              thumbnail: {
                url: "https://image.flaticon.com/icons/svg/1923/1923533.svg",
              },
            },
          ],
        });
      }

      return interaction.reply({
        content: `\`\`\`yaml\nDetails for Ability ${abilityNameRaw}:\n\nName: ${abilityInfo.name}\nDescription: ${abilityInfo.description}\`\`\``,
      });
    }

    // Handle itemName here:
    if (itemNameRaw) {
      const itemName = itemNameRaw.replace(/[\s_-]+/g, '').toLowerCase();
      const itemInfo = itemData[itemName];

      if (!itemInfo) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            {
              title: "Error",
              description: `No information found for the item ${itemNameRaw}.`,
              color: 0xFF0000,
              thumbnail: {
                url: "https://image.flaticon.com/icons/svg/1923/1923533.svg",
              },
            },
          ],
        });
      }

      return interaction.reply({
        content: `\`\`\`yaml\nDetails for Item ${itemNameRaw}:\n\nName: ${itemInfo.name}\nDescription: ${itemInfo.description}\`\`\``,
      });
    }

    // If neither a move, an ability, nor an item is provided:
    return interaction.reply({
      ephemeral: true,
      embeds: [
        {
          title: "Error",
          description: "Please enter a move, ability, or item name.",
          color: 0xFF0000,
          thumbnail: {
            url: "https://image.flaticon.com/icons/svg/1923/1923533.svg",
          },
        },
      ],
    });
  },
};