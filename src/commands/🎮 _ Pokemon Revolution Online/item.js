const { SlashCommandBuilder } = require("discord.js");
const itemData = require("../../JSON/item.json");

function shortenWords(str) {
  if (!str) return "";
  const replacements = {
    "Mountain": "Mtn",
    "Mount": "Mt.",
    "Route": "Rt",
    "Silver": "Silv",
    "Exterior": "Ext",
    "Interior": "Int",
    "Upper": "Uppr",
    "Lower": "Lowr",
    "Chamber": "Chmb",
    "Entrance": "Entr",
    "Expert": "Exprt",
    "Forest": "Frst",
    "National Park": "NatPk",
    "Woods": "Wds",
    "Cave": "Cve",
    "Island": "Isl",
    "Volcano": "Volc"
  };
  for (const [full, short] of Object.entries(replacements)) {
    str = str.replace(new RegExp(`\\b${full}\\b`, "gi"), short);
  }
  return str;
}

function trimAndPad(str, maxLength) {
  if (!str) return " ".repeat(maxLength);
  str = str.toString();
  return str.length > maxLength
    ? str.slice(0, maxLength)
    : str.padEnd(maxLength);
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
            color: 0xff0000
          }
        ],
        ephemeral: true
      });
      return;
    }

    const widths = {
      pokemon: 12,
      map: 24,
      area: 10,
      level: 10,
      ms: 6,
      daytime: 10,
      rarity: 10
    };

    const maxLineLength = widths.pokemon + widths.map + widths.area + widths.level + widths.ms + widths.daytime + widths.rarity;

    let spawnData = `${itemNameRaw}:\n`;
    spawnData += trimAndPad("#Pokemon", widths.pokemon)
              + trimAndPad("Map", widths.map)
              + trimAndPad("Area", widths.area)
              + trimAndPad("Level", widths.level)
              + trimAndPad("MS", widths.ms)
              + trimAndPad("Daytime", widths.daytime)
              + "Rarity\n";

    spawnData += `${'-'.repeat(maxLineLength)}\n`;

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
        const areaRaw = details.Area?.[i] || "N/A";
        const level = `${details.MinLVL?.[i] || "?"}-${details.MaxLVL?.[i] || "?"}`;
        const ms = details.MemberOnly?.[i] ? "Yes" : "No";
        const daytime = details.Daytime?.[i] || "Any";
        const rarity = details.Tier?.[i] || "Unknown";

        let mapFormatted = mapRaw.replace(/_/g, " ").replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );

        let areaFormatted = areaRaw;

        // Compose row
        let row =
          trimAndPad(pokemon, widths.pokemon) +
          trimAndPad(mapFormatted, widths.map) +
          trimAndPad(areaFormatted, widths.area) +
          trimAndPad(level, widths.level) +
          trimAndPad(ms, widths.ms) +
          trimAndPad(daytime, widths.daytime) +
          rarity;

        // If too long → shorten map/area
        if (row.length > maxLineLength) {
          mapFormatted = shortenWords(mapFormatted);
          areaFormatted = shortenWords(areaFormatted);

          row =
            trimAndPad(pokemon, widths.pokemon) +
            trimAndPad(mapFormatted, widths.map) +
            trimAndPad(areaFormatted, widths.area) +
            trimAndPad(level, widths.level) +
            trimAndPad(ms, widths.ms) +
            trimAndPad(daytime, widths.daytime) +
            rarity;
        }

        spawnData += row + "\n";
      }
    }

    // Split into chunks
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
