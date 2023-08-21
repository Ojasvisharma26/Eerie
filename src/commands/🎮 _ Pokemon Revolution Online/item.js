const { SlashCommandBuilder } = require("discord.js");
const itemData = require("../../JSON/item.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Returns Spawn Information About an Item!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Enter an Item name")
        .setAutocomplete(false)
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const itemNameRaw = interaction.options.getString("item");
    const itemName = itemNameRaw.toLowerCase().replace(/[\s_-]+/g, ""); // Remove all spaces

    const matchedKey = Object.keys(itemData).find(key => key.toLowerCase().replace(/[\s_-]+/g, "") === itemName);

    const itemDetails = itemData[matchedKey];

    if (!itemDetails) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: `No spawn information found for the item ${itemNameRaw}.`,
            color: 0xFF0000,
            thumbnail: {
              url: "https://image.flaticon.com/icons/svg/1923/1923533.svg"
            }
          }
        ],
        ephemeral: false
      });
    }

    let spawnData = `${itemNameRaw}:\n`;
    spawnData += `#Pokemon      Map                             Area      Level        MS  Daytime    Rarity\n`;
    spawnData += `${'-'.repeat(92)}\n`;

    for (const pokemon in itemDetails) {
      const details = itemDetails[pokemon];

      for (let i = 0; i < details.Map.length; i++) {
        const formattedPokemon = pokemon.padEnd(12);
        const formattedMap = details.Map[i].replace(/_/g, ' ').replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }).padEnd(34);

        const area = details.Area[i].padEnd(11);
        const lvl = (details.MinLVL[i] + "-" + details.MaxLVL[i]).padEnd(12);
        const daytime = details.Daytime[i].padEnd(10);
        const rarity = details.Tier[i];
        const member = details.MemberOnly[i] ? "Yes".padEnd(5) : "No".padEnd(5)

        spawnData += `${formattedPokemon}${formattedMap}${area}${lvl}${member}${daytime}${rarity}\n`;
      }
    }

    let chunks = [];
    while (spawnData.length > 0) {
      if (spawnData.length <= 1950) {
        chunks.push(spawnData);
        spawnData = "";
      } else {
        let slicePoint = spawnData.lastIndexOf("\n", 1950);
        chunks.push(spawnData.slice(0, slicePoint));
        spawnData = spawnData.slice(slicePoint + 1);
      }
    }

    interaction.reply('Processing Your Request...').then(() => {
        chunks.forEach((chunk) => {
          interaction.editReply('Here is Your Request:');
          interaction.channel.send(`\`\`\`yaml\n${chunk}\`\`\``);
        });
      });
  }
};
