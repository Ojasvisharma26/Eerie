const { SlashCommandBuilder } = require("discord.js");
const headbuttData = require("../../JSON/headbutt.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("headbutt")
    .setDescription("Check the Pokemon you can find using Headbutt!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Enter a location name or a Pokemon name (e.g., azalea town or chikorita)")
        .setAutocomplete(false)
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const queryName = interaction.options.getString("query");

    if (!queryName) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          {
            title: "Error",
            description: "Please enter a location or Pokemon name.",
            color: 0xFF0000,
            thumbnail: {
              url: "https://image.flaticon.com/icons/svg/1923/1923533.svg",
            },
          },
        ],
      });
      return;
    }

    const realKeyName = getCaseInsensitiveKey(headbuttData, queryName);
    const queryData = headbuttData[realKeyName];

    if (!realKeyName || !queryData) {
      await interaction.reply({
        ephemeral: true,
        content: `No information found for ${queryName} using Headbutt.`,
      });
      return;
    }

    let response = generateResponse(queryData, realKeyName);

    await interaction.reply({
      content: response,
    });
  },
};

// Helper function to fetch data key regardless of case
function getCaseInsensitiveKey(obj, searchKey) {
  const lowerCaseSearchKey = searchKey.toLowerCase();
  for (let key of Object.keys(obj)) {
    if (key.toLowerCase() === lowerCaseSearchKey) {
      return key;
    }
  }
  return null;
}

// Helper function to generate the response
function generateResponse(queryData, realKeyName) {
  let response = `${realKeyName}\n`;

  // Determine the header based on the data type (Area or Pokemon)
  const isAreaType = queryData[0].hasOwnProperty('Pokemon');

  if (isAreaType) {
    response += `Pokemon               Tier        Membership    Levels\n`;
  } else {
    response += `Area                  Tier        Membership    Levels\n`;
  }

  response += `------------------------------------------------------\n`;

  for (const data of queryData) {
    const Area = data.Area || "";
    const Pokemon = data.Pokemon || "";
    const Tier = data.Tier || "";
    const Membership = data.Membership || "";
    const Levels = data.Levels || "";

    let formattedLine;
    if (isAreaType) {
      formattedLine = `${Pokemon.padEnd(22)}${Tier.padEnd(16)}${Membership.padEnd(11)}${Levels}\n`;
    } else {
      formattedLine = `${Area.padEnd(22)}${Tier.padEnd(16)}${Membership.padEnd(11)}${Levels}\n`;
    }

    response += formattedLine;
  }

  return "```js\n" + response + "```";
}
