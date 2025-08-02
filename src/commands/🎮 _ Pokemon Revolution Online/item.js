const { SlashCommandBuilder } = require("discord.js");
const itemData = require("../../JSON/item.json");

function trimAndPad(str, maxLength) {
  if (!str) return " ".repeat(maxLength);
  str = str.toString();
  if (str.length > maxLength) return str.slice(0, maxLength - 3) + "...";
  return str.padEnd(maxLength);
}

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

  async execute(interaction) {
    const itemNameRaw = interaction.options.getString("item");
    const itemName = itemNameRaw.toLowerCase().replace(/[\s_-]+/g, "");
    const matchedKey = Object.keys(itemData).find(
      (key) => key.toLowerCase().replace(/[\s_-]+/g, "") === itemName
    );

    const itemDetails = itemData[matchedKey];

    if (!itemDetails) {
      await interaction.reply({
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
      return;
    }

    // Fixed widths
    const widths = {
      pokemon: 12,
      map: 24,
      area: 10,
      level: 10,
      ms: 6,
      daytime: 10,
      rarity: 10
    };

    let spawnData = `${itemNameRaw}:\n`;
    spawnData += trimAndPad("#Pokemon", widths.pokemon)
              + trimAndPad("Map", widths.map)
              + trimAndPad("Area", widths.area)
              + trimAndPad("Level", widths.level)
              + trimAndPad("MS", widths.ms)
              + trimAndPad("Daytime", widths.daytime)
              + "Rarity\n";

    spawnData += `${'-'.repeat(
      widths.pokemon + widths.map + widths.area + widths.level + widths.ms + widths.daytime + widths.rarity
    )}\n`;

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
        const mapRaw = details.Map?.[i] || "Unknown";
        const formattedMap = mapRaw.replace(/_/g, " ").replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );

        const row = trimAndPad(pokemon, widths.pokemon)
          + trimAndPad(formattedMap, widths.map)
          + trimAndPad(details.Area?.[i] || "N/A", widths.area)
          + trimAndPad(`${details.MinLVL?.[i] || "?"}-${details.MaxLVL?.[i] || "?"}`, widths.level)
          + trimAndPad(details.MemberOnly?.[i] ? "Yes" : "No", widths.ms)
          + trimAndPad(details.Daytime?.[i] || "Any", widths.daytime)
          + (details.Tier?.[i] || "Unknown");

        spawnData += row + "\n";
      }
    }

    // Chunk and send
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

    for (let i = 0; i < chunks.length; i++) {
      if (i === 0) {
        await interaction.reply({
          content: `\`\`\`yaml\n${chunks[i]}\`\`\``
        });
      } else {
        await interaction.followUp({
          content: `\`\`\`yaml\n${chunks[i]}\`\`\``
        });
      }
    }
  }
};
