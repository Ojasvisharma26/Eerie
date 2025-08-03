const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("spawn")
    .setDescription("Returns Spawn Information About a Pokemon or a Location!")
    .setDMPermission(false)
    .addStringOption(option =>
      option.setName("pokemon").setDescription("Enter a Pokemon name").setRequired(false)
    )
    .addStringOption(option =>
      option.setName("location").setDescription("Enter a Location name").setRequired(false)
    ),

  async execute(interaction, client) {
    const pokemonName = interaction.options.getString("pokemon");
    const locationName = interaction.options.getString("location");

    if (!pokemonName && !locationName) {
      return interaction.reply({
        embeds: [{
          title: "Error",
          description: "Please provide either a Pokemon name or a location.",
          color: 0xFF0000
        }],
        ephemeral: true
      });
    }

    const urls = [
      "https://pokemonrevolution.net/spawns/land_spawns.json",
      "https://pokemonrevolution.net/spawns/surf_spawns.json"
    ];

    const responses = await Promise.all(urls.map(url => axios.get(url)));

    const data = responses.flatMap((res, i) =>
      res.data.map(entry => ({ ...entry, area: i === 0 ? "Land" : "Surf/Fish" }))
    );

    const shorten = str => str
      .replace(/Mountain/gi, "Mtn")
      .replace(/Silver/gi, "Slvr")
      .replace(/Exterior/gi, "Ext")
      .replace(/Interior/gi, "Int")
      .replace(/Chamber/gi, "Chmbr")
      .replace(/Entrance/gi, "Ent")
      .replace(/Hidden/gi, "Hdn")
      .replace(/Lower/gi, "Lwr")
      .replace(/Upper/gi, "Upr");

    const formatLine = (pokemon, area, lvl, ms, time, rarity, item) =>
      `${pokemon.padEnd(30)}${area.padEnd(11)}${lvl.padEnd(9)}${ms.padEnd(5)}${time.padEnd(8)}${rarity.padEnd(10)}${item.padEnd(15)}`;

    const filtered = data.filter(p =>
      (pokemonName && p.Pokemon.toLowerCase() === pokemonName.toLowerCase()) ||
      (locationName && p.Map.replace(/_/g, ' ').toLowerCase() === locationName.toLowerCase())
    );

    if (!filtered.length) {
      return interaction.reply({
        embeds: [{
          title: "Error",
          description: `${pokemonName ? "Pokemon" : "Location"} could not be found.`,
          color: 0xFF0000
        }],
        ephemeral: true
      });
    }

    const lines = filtered.map(p => {
      const name = locationName ? p.Pokemon : shorten(p.Map.replace(/_/g, ' '));
      const area = p.area || "-";
      const min = p.MinLVL ? p.MinLVL.toString().padStart(2, '0') : "-";
      const max = p.MaxLVL ? p.MaxLVL.toString().padStart(2, '0') : "-";
      const lvl = `${min}-${max}`;
      const ms = p.MemberOnly ? "Yes" : "No";

      let day = "-";
      if (Array.isArray(p.Daytime) && p.Daytime.length === 3) {
        day = ["M", "D", "N"].filter((_, i) => p.Daytime[i] === 1).join("/") || "-";
      }

      const tier = p.Tier || "-";
      const item = p.Item || "-";

      return formatLine(name, area, lvl, ms, day, tier, item);
    });

    const header = formatLine(
      locationName ? "#Pokemon" : "#Map",
      "Area", "Level", "MS", "Daytime", "Rarity", "Item"
    );
    const divider = "-".repeat(95);

    let output = `${pokemonName || locationName} Spawn Info:\n${header}\n${divider}\n` + lines.join("\n");

    const chunks = [];
    while (output.length > 0) {
      if (output.length <= 1950) {
        chunks.push(output);
        break;
      } else {
        const split = output.lastIndexOf("\n", 1950);
        chunks.push(output.slice(0, split));
        output = output.slice(split + 1);
      }
    }

    await interaction.reply("Processing your request...");
    for (const chunk of chunks) {
      await interaction.channel.send(`\`\`\`yaml\n${chunk}\n\`\`\``);
    }
  }
};
