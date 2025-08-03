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

  async execute(interaction, client) {
    const pokemonName = interaction.options.getString("pokemon");
    const locationName = interaction.options.getString("location");

    if (!pokemonName && !locationName) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "Please provide either a Pokemon name or a location.",
            color: 0xff0000
          }
        ],
        ephemeral: false
      });
    }

    const urls = [
      "https://pokemonrevolution.net/spawns/land_spawns.json",
      "https://pokemonrevolution.net/spawns/surf_spawns.json"
    ];

    const requests = urls.map((url) => axios.get(url));
    const responses = await Promise.all(requests);

    const data = responses.flatMap((response, index) => {
      if (urls[index].includes("land")) {
        return response.data.map((entry) => ({ ...entry, area: "Land" }));
      } else if (urls[index].includes("surf")) {
        return response.data.map((entry) => ({ ...entry, area: "Surf/Fish" }));
      } else {
        return [];
      }
    });

    function shortenWords(str) {
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

    function processPokemonData(pokemon) {
      let formattedMap = pokemon.Map.replace(/_/g, ' ').replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
      const area = pokemon.area;
      const displayText = locationName ? pokemon.Pokemon : formattedMap;

      const MinLVL = pokemon.MinLVL?.split(", ") || [];
      const MaxLVL = pokemon.MaxLVL?.split(", ") || [];
      const MinLVLString = MinLVL.length > 0 ? MinLVL.map(lvl => lvl.padStart(2, '0')).join(", ") : "-";
      const MaxLVLString = MaxLVL.length > 0 ? MaxLVL.map(lvl => lvl.padStart(2, '0')).join(", ") : "-";

      const Tier = pokemon.Tier?.split(", ") || ["-"];
      const TierString = Tier[0];

      const Item = pokemon.Item ? pokemon.Item.split(", ") : ["-"];
      const ItemString = Item.join(", ");

      const MemberOnly = pokemon.MemberOnly ? "Yes" : "No";

      const daytime = pokemon.Daytime || [];
      let daytimeFormatted = "-";
      if (daytime.length === 3) {
        const [m, d, n] = daytime;
        daytimeFormatted = `${m ? "M" : ""}${d ? "/D" : ""}${n ? "/N" : ""}`.replace(/^\//, "");
      }

      // Construct the row
      let row = `${displayText.padEnd(30)}${area.padEnd(11)}${(MinLVLString + "-" + MaxLVLString).padEnd(12)}${MemberOnly.padEnd(5)}${daytimeFormatted.padEnd(10)}${TierString.padEnd(17)}${ItemString.padEnd(10)}`;

      // Auto-shortening if too long
      if (row.length > 95) {
        const shortMap = shortenWords(formattedMap);
        const shortDisplay = locationName ? pokemon.Pokemon : shortMap;
        row = `${shortDisplay.padEnd(30)}${area.padEnd(11)}${(MinLVLString + "-" + MaxLVLString).padEnd(12)}${MemberOnly.padEnd(5)}${daytimeFormatted.padEnd(10)}${TierString.padEnd(17)}${ItemString.padEnd(10)}`;
      }

      return row;
    }

    const pokemonData = data
      .filter((pokemon) => {
        if (pokemonName && pokemon.Pokemon.toLowerCase() === pokemonName.toLowerCase()) return true;
        if (locationName && pokemon.Map.replace(/_/g, ' ').toLowerCase() === locationName.toLowerCase()) return true;
        return false;
      })
      .map(processPokemonData);

    if (pokemonData.length === 0) {
      return interaction.reply({
        embeds: [{
          title: "Error",
          description: `${pokemonName ? "Pokemon" : "Location"} could not be found.`,
          color: 0xff0000,
          thumbnail: {
            url: "https://media.discordapp.net/attachments/969481658451517440/1075372125369675846/icon_npc_06.png"
          }
        }],
        ephemeral: false
      });
    }

    let spawnData = `${pokemonName || locationName}:
`;
    spawnData += `#Map/Pokemon                  Area       Level       MS  Daytime   Rarity           Item\n`;
    spawnData += `${'-'.repeat(95)}\n`;
    spawnData += pokemonData.join("\n");

    let chunks = [];
    while (spawnData.length > 0) {
      if (spawnData.length <= 1950) {
        chunks.push(spawnData);
        break;
      }
      const slicePoint = spawnData.lastIndexOf("\n", 1950);
      chunks.push(spawnData.slice(0, slicePoint));
      spawnData = spawnData.slice(slicePoint + 1);
    }

    await interaction.reply({ content: `\`\`\`yaml\n${chunks[0]}\`\`\`` });
    for (let i = 1; i < chunks.length; i++) {
      await interaction.followUp({ content: `\`\`\`yaml\n${chunks[i]}\`\`\`` });
    }
  }
};
