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
            color: 0xFF0000,
            thumbnail: {
              url: "https://image.flaticon.com/icons/svg/1923/1923533.svg"
            }
          }
        ],
        ephemeral: false
      });``
    }

    const urls = [
      "https://pokemonrevolution.net/spawns/land_spawns.json",
      "https://pokemonrevolution.net/spawns/surf_spawns.json"
    ];

    const requests = urls.map((url) => axios.get(url));

    const responses = await Promise.all(requests);

    const data = responses.flatMap((response, index) => {
      if (urls[index].includes('land')) {
        return response.data.map((entry) => ({ ...entry, area: 'Land' }));
      } else if (urls[index].includes('surf')) {
        return response.data.map((entry) => ({ ...entry, area: 'Surf/Fish' }));
      } else {
        return [];
      }
    });

    let pokemonData = [];
    for (const pokemon of data) {
      if (pokemonName && pokemon.Pokemon.toLowerCase() === pokemonName.toLowerCase()) {
        pokemonData.push(processPokemonData(pokemon));
      }
      else if (locationName && pokemon.Map.replace(/_/g, ' ').toLowerCase() === locationName.toLowerCase()) {
        pokemonData.push(processPokemonData(pokemon));
      }
    }

    function processPokemonData(pokemon) {
      const formattedMap = pokemon.Map.replace(/_/g, ' ').replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      const area = pokemon.area;

      const displayText = locationName ? `${pokemon.Pokemon}` : formattedMap;

      const MinLVL = pokemon.hasOwnProperty('MinLVL') ? pokemon.MinLVL.toString().split(", ") : [];
      const MinLVLString = MinLVL.length > 0 ? MinLVL.map(lvl => lvl.padStart(2, '0')).join(", ") : "-";

      const MaxLVL = pokemon.hasOwnProperty('MaxLVL') ? pokemon.MaxLVL.toString().split(", ") : [];
      const MaxLVLString = MaxLVL.length > 0 ? MaxLVL.map(lvl => lvl.padStart(2, '0')).join(", ") : "-";

      const Tier = pokemon.hasOwnProperty('Tier') ? pokemon.Tier.toString().split(", ") : [];
      let TierString = "-";
      if (Tier.length > 0) {
        switch (Tier[0]) {
          case "Common":
            TierString = "Common";
            break;
          case "Uncommon":
            TierString = "Uncommon";
            break;
          case "Rare":
            TierString = "Rare";
            break;
        }
      }

      const Item = pokemon.hasOwnProperty('Item') && pokemon.Item !== null ? pokemon.Item.toString().split(", ") : [];
      const ItemString = Item.length > 0 ? Item.map(lvl => lvl.padStart(2, '0')).join(", ") : "-";

      const MemberOnly = pokemon.hasOwnProperty('MemberOnly') ? pokemon.MemberOnly : false;
      const MemberOnlyString = MemberOnly ? "Yes" : "No";

      const daytime = pokemon.hasOwnProperty('Daytime') ? pokemon.Daytime : [];
      let daytimeFormatted = "";
      if (daytime.length === 3) {
        if (daytime[0] === 1) {
          if (daytime[1] === 1) {
            if (daytime[2] === 1) {
              daytimeFormatted = "M/D/N";
            } else {
              daytimeFormatted = "M/D";
            }
          } else if (daytime[2] === 1) {
            daytimeFormatted = "M/N";
          } else {
            daytimeFormatted = "M";
          }
        } else if (daytime[1] === 1) {
          if (daytime[2] === 1) {
            daytimeFormatted = "D/N";
          } else {
            daytimeFormatted = "D";
          }
        } else if (daytime[2] === 1) {
          daytimeFormatted = "N";
        }
      } else {
        daytimeFormatted = "-";
      }

      return `${displayText.padEnd(30)}${area.padEnd(11)}${(MinLVLString + "-" + MaxLVLString).padEnd(12)}${MemberOnlyString.padEnd(5)}${daytimeFormatted.padEnd(10)}${TierString.padEnd(17)}${ItemString.padEnd(10)}`;
    }

    if (pokemonData.length === 0) {
      return interaction.editReply({
        embeds: [{
          title: "Error",
          description: `${pokemonName ? "Pokemon" : "Location"} could not be found.`,
          color: 0xFF0000,
          thumbnail: {
            url: "https://media.discordapp.net/attachments/969481658451517440/1075372125369675846/icon_npc_06.png"
          }
        }],
        ephemeral: false
      });
    } else {
      let spawnData = `${pokemonName || locationName}:\n`;
      spawnData += `#Map/Pokemon             Area      Level  MS  Daytime   Rarity      Item\n`;
      spawnData += `${'-'.repeat(82)}\n`;

      for (const chunk of pokemonData) {
        spawnData += chunk + '\n';
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
  }
};
