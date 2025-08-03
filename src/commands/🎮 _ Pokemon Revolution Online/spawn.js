const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("spawn")
    .setDescription("Returns Spawn Information About a Pokemon or a Location!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("pokemon")
        .setDescription("Enter a Pokemon name")
        .setAutocomplete(false)
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("Enter a Location name")
        .setAutocomplete(false)
        .setRequired(false)
    ),

  async execute(interaction) {
    const pokemonName = interaction.options.getString("pokemon");
    const locationName = interaction.options.getString("location");

    if (!pokemonName && !locationName) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "Please provide either a Pokemon name or a location.",
            color: 0xff0000,
            thumbnail: {
              url: "https://image.flaticon.com/icons/svg/1923/1923533.svg"
            }
          }
        ],
        ephemeral: false
      });
    }

    const urls = [
      "https://pokemonrevolution.net/spawns/land_spawns.json",
      "https://pokemonrevolution.net/spawns/surf_spawns.json"
    ];

    const responses = await Promise.all(urls.map(url => axios.get(url)));
    const data = responses.flatMap((res, idx) => {
      const area = urls[idx].includes("land") ? "Land" : "Surf/Fish";
      return res.data.map(entry => ({ ...entry, area }));
    });

    const pokemonData = [];
    const shortenMapName = (name) => {
      const substitutions = {
        "Mount": "Mnt",
        "Mountain": "Mtn",
        "Route": "Rt",
        "Silver": "Slvr",
        "Chamber": "Chmbr",
        "Exterior": "Ex",
        "Interior": "In",
        "Upper": "Up",
        "Lower": "Low",
        "Expert Belt": "ExBelt"
      };
      for (const key in substitutions) {
        name = name.replace(new RegExp(key, "gi"), substitutions[key]);
      }
      return name;
    };

    for (const entry of data) {
      const formattedMap = entry.Map.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
      const shortMap = shortenMapName(formattedMap);
      const displayText = locationName ? entry.Pokemon : shortMap.length > 24 ? shortMap.slice(0, 24) : formattedMap;

      if ((pokemonName && entry.Pokemon.toLowerCase() === pokemonName.toLowerCase()) ||
          (locationName && formattedMap.toLowerCase() === locationName.toLowerCase())) {

        const MinLVL = entry.MinLVL?.toString().padStart(2, '0') ?? "-";
        const MaxLVL = entry.MaxLVL?.toString().padStart(2, '0') ?? "-";
        const Tier = entry.Tier ?? "-";
        const Item = entry.Item ?? "-";
        const MemberOnly = entry.MemberOnly ? "Yes" : "No";

        let daytime = entry.Daytime ?? [];
        const dt = ["M", "D", "N"];
        const daytimeFormatted = daytime.map((v, i) => v ? dt[i] : null).filter(Boolean).join("/") || "-";

        const row = `${displayText.padEnd(26)}${entry.area.padEnd(10)}${(MinLVL + '-' + MaxLVL).padEnd(10)}${MemberOnly.padEnd(5)}${daytimeFormatted.padEnd(8)}${Tier.padEnd(10)}${Item}`;
        pokemonData.push(row);
      }
    }

    if (!pokemonData.length) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: `${pokemonName ? "Pokemon" : "Location"} not found in spawns.\`,
            color: 0xff0000,
            thumbnail: {
              url: "https://media.discordapp.net/attachments/969481658451517440/1075372125369675846/icon_npc_06.png"
            }
          }
        ]
      });
    }

    let spawnData = `${pokemonName || locationName} Spawns:\n`;
    spawnData += `#Map/Pokemon             Area     Level     MS   Daytime Rarity    Item\n`;
    spawnData += `${"-".repeat(90)}\n`;
    pokemonData.forEach(line => spawnData += line + '\n');

    const chunks = [];
    while (spawnData.length > 0) {
      if (spawnData.length <= 1950) {
        chunks.push(spawnData);
        break;
      }
      const split = spawnData.lastIndexOf("\n", 1950);
      chunks.push(spawnData.slice(0, split));
      spawnData = spawnData.slice(split + 1);
    }

    await interaction.reply({ content: `\`\`\`yaml\n${chunks[0]}\`\`\`` });
    for (let i = 1; i < chunks.length; i++) {
      await interaction.followUp({ content: `\`\`\`yaml\n${chunks[i]}\`\`\`` });
    }
  }
};
