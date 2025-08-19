const { SlashCommandBuilder } = require("discord.js");
const repelPknData = require("../../JSON/repel_pkn.json");
const repelLocData = require("../../JSON/repel_loc.json");
const Pagination = require("../../components/buttons/pagination.js");
const dexData = require("../../JSON/dex_data.json");

// ✅ Helper functions outside object
function standardizeName(name) {
  return name.toLowerCase().replace(/[\s_-]+/g, "");
}

function chunkData(data, type, rawName) {
  const chunkedEmbeds = [];
  let embedDescription = "";
  let counter = 0;

  let thumbnailURL = null;
  if (type === "pokemon") {
    const matchedDexData = dexData.find(
      (poke) => poke.name.english.toLowerCase() === rawName.toLowerCase()
    );
    if (
      matchedDexData &&
      matchedDexData.image &&
      matchedDexData.image.thumbnail
    ) {
      thumbnailURL = matchedDexData.image.thumbnail;
    }
  } else {
    thumbnailURL =
      "https://media.discordapp.net/attachments/969481658451517440/1141062515011362956/807307_map_512x512.png?width=616&height=616";
  }

  data.forEach((detail, index) => {
    counter++;
    if (type === "pokemon") {
      embedDescription += `- **Map:** \`${detail.Map}\`\n`;
    } else {
      embedDescription += `- **Pokemon:** \`${detail.Pokemon}\`\n`;
    }
    embedDescription += `- **Area:** \`${detail.Area}\`\n`;
    embedDescription += `- **Daytime:** \`${detail.Daytime}\`\n`;
    embedDescription += `- **Level:** \`${detail.Level}\`\n`;
    embedDescription += `- **Membership:** \`${detail.MS}\`\n\n`;

    if (counter === 3 || index === data.length - 1) {
      chunkedEmbeds.push({
        title: `${
          type === "pokemon"
            ? "Repel-Trick for Pokémon"
            : "Repel-Trick in Location"
        } ${rawName}`,
        description: embedDescription,
        color: 0x8711ca,
        thumbnail: { url: thumbnailURL },
        image: {
          url: "https://media.discordapp.net/attachments/969481658451517440/1141059578532991067/image.png?width=1095&height=616",
        },
      });
      embedDescription = "";
      counter = 0;
    }
  });

  return chunkedEmbeds;
}

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("repel")
    .setDescription("Check the Repel-Trick Information of Pokemon or Location!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("pokemon")
        .setDescription("Enter a Pokemon name")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("Enter a Location name")
        .setRequired(false)
    ),

  async execute(interaction) {
    const pokemonNameRaw = interaction.options.getString("pokemon");
    const locationNameRaw = interaction.options.getString("location");

    if (!pokemonNameRaw && !locationNameRaw) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "Please provide either a Pokémon name or a location.",
            color: 0xff0000,
          },
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply(); // ✅ sirf ek acknowledgement

    let chunkedEmbeds;

    if (pokemonNameRaw) {
      const standardizedInputName = standardizeName(pokemonNameRaw);
      const matchedKey = Object.keys(repelPknData).find(
        (key) => standardizeName(key) === standardizedInputName
      );

      const pokemonDetails = repelPknData[matchedKey];

      if (!pokemonDetails) {
        return interaction.editReply({
          embeds: [
            {
              title: "Error",
              description: `No information found for the Pokémon ${pokemonNameRaw}.`,
              color: 0xff0000,
            },
          ],
        });
      }

      chunkedEmbeds = chunkData(pokemonDetails, "pokemon", pokemonNameRaw);
    } else if (locationNameRaw) {
      const standardizedInputName = standardizeName(locationNameRaw);
      const matchedKey = Object.keys(repelLocData).find(
        (key) => standardizeName(key) === standardizedInputName
      );

      const locationDetails = repelLocData[matchedKey];

      if (!locationDetails) {
        return interaction.editReply({
          embeds: [
            {
              title: "Error",
              description: `No information found for the location ${locationNameRaw}.`,
              color: 0xff0000,
            },
          ],
        });
      }

      chunkedEmbeds = chunkData(locationDetails, "location", locationNameRaw);
    }

    // ⚡ Ab ek hi reply/editReply aur usi mein Pagination
    const pagination = new Pagination(interaction, chunkedEmbeds);
    await pagination.send(); // yeh internally editReply use karega
  },
};
