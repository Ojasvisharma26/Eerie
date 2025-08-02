const { SlashCommandBuilder } = require("discord.js");
const itemData = require("../../JSON/item.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Returns Spawn Information About an Item!")
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName("item")
        .setDescription("Enter an Item name")
        .setAutocomplete(false)
        .setRequired(true)
    ),

  async execute(interaction) {
    const itemNameRaw = interaction.options.getString("item");
    const itemName = itemNameRaw.toLowerCase().replace(/[\s_-]+/g, "");
    const matchedKey = Object.keys(itemData).find(
      key => key.toLowerCase().replace(/[\s_-]+/g, "") === itemName
    );

    const itemDetails = itemData[matchedKey];

    // If item not found
    if (!itemDetails) {
      return interaction.reply({
        embeds: [
          {
            title: "❌ Error",
            description: `No spawn information found for the item **${itemNameRaw}**.`,
            color: 0xff0000,
            thumbnail: {
              url: "https://image.flaticon.com/icons/svg/1923/1923533.svg"
            }
          }
        ],
        ephemeral: true
      });
    }

    // Table generation
    let spawnData = `${itemNameRaw}:\n`;
    spawnData += `#Pokemon      Map                    Area      Level        MS  Daytime    Rarity\n`;
    spawnData += `${'-'.repeat(82)}\n`;

    for (const pokemon in itemDetails) {
      const details = itemDetails[pokemon];
      const totalEntries = Math.max(
        details.Map?.length || 0,
        details.Area?.length || 0,
        details.MinLVL?.length || 0,
        details.MaxLVL?.length || 0,
        details.MemberOnly?.length || 0,
        details.Daytime?.length || 0,
        details.Tier?.length || 0
      );

      for (let i = 0; i < totalEntries; i++) {
        const formattedPokemon = pokemon.padEnd(12);
        const mapRaw = details.Map?.[i] || "Unknown";
        const formattedMap = mapRaw
          .replace(/_/g, " ")
          .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
          .padEnd(22);

        const area = (details.Area?.[i] || "N/A").padEnd(11);
        const lvl = `${details.MinLVL?.[i] || "?"}-${details.MaxLVL?.[i] || "?"}`.padEnd(12);
        const member = (details.MemberOnly?.[i] ? "Yes" : "No").padEnd(5);
        const daytime = (details.Daytime?.[i] || "Any").padEnd(10);
        const rarity = details.Tier?.[i] || "Unknown";

        spawnData += `${formattedPokemon}${formattedMap}${area}${lvl}${member}${daytime}${rarity}\n`;
      }
    }

    // Split long messages
    const chunks = [];
    while (spawnData.length > 0) {
      if (spawnData.length <= 1950) {
        chunks.push(spawnData);
        break;
      } else {
        const slicePoint = spawnData.lastIndexOf("\n", 1950);
        chunks.push(spawnData.slice(0, slicePoint));
        spawnData = spawnData.slice(slicePoint + 1);
      }
    }

    for (const chunk of chunks) {
      await interaction.followUp({
        content: `\`\`\`yaml\n${chunk}\`\`\``
      }).catch(() => {});
    }

    // Send the first part using reply
    return interaction.reply({
      content: `\`\`\`yaml\n${chunks[0]}\`\`\``,
      ephemeral: false
    }).catch(() => {}); // Ignore if already replied by followUp
  }
};
