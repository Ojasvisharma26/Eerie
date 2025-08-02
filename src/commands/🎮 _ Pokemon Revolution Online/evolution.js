const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const dexData = require("../../JSON/dex_data.json");
const axios = require("axios");

const evolutionaryItemEmojis = {
  "dawn-stone": "<:Dawn_Stone:1152969473901477959>",
  "deep-sea-scale": "<:Deep_Sea_Scale:1152969479366639848>",
  "deep-sea-tooth": "<:Deep_Sea_Tooth:1152969483305091093>",
  "dragon-scale": "<:Dragon_Scale:1152969486018826280>",
  "dubious-disc": "<:Dubious_Disc:1152969490036961491>",
  "dusk-stone": "<:Dusk_Stone:1152969494730387536>",
  "electirizer": "<:Electirizer:1152969498412978226>",
  "fire-stone": "<:Fire_Stone:1152969500564656200>",
  "ice-stone": "<:Ice_Stone:1152969504465363094>",
  "kings-rock": "<:Kings_Rock:1152969509003608105>",
  "leaf-stone": "<:Leaf_Stone:1152969513097244684>",
  "reaper-cloth": "<:Reaper_Cloth:1152969672929587300>",
  "razor-fang": "<:Razor_Fang:1152969669033078945>",
  "magmarizer": "<:Magmarizer:1152969515597054042>",
  "sachet": "<:Sachet:1152969726654423142>",
  "shiny-stone": "<:Shiny_Stone:1152969730475429958>",
  "metal-coat": "<:Metal_Coat:1152969519501938739>",
  "moon-stone": "<:Moon_Stone:1152969523440386058>",
  "sun-stone": "<:Sun_Stone:1152969732585168937>",
  "thunder-stone": "<:Thunder_Stone:1152969737563807755>",
  "oval-stone": "<:Oval_Stone:1152969526078615754>",
  "prism-scale": "<:Prism_Scale:1152969529962532884>",
  "upgrade": "<:UpGrade:1152969748372529193>",
  "water-stone": "<:Water_Stone:1152969752231293108>",
  "protector": "<:Protector:1152969533875826749>",
  "razor-claw": "<:Razor_Claw:1152969535935217685>",
  "whipped-dream": "<:Whipped_Dream:1152969783663411220>",
  "friendship": ":sparkling_heart:",
};

const isSpecialForm = (pokemonName) => {
  const specialForms = [
    " Therian",
    " White",
    " Black",
    " Resolute",
    " Attack",
    " Defence",
    " Defense",
    " Speed",
    " Heat",
    " Wash",
    " Frost",
    " Fan",
    " Mow",
    " Mega "
  ];
  return specialForms.some((form) => pokemonName.endsWith(form));
};

const getFullEvolutionChain = async (pokemonId, pokemonName = "") => {
  if (pokemonName.includes("Mega ")) {
    const megaPokemonData = dexData.find(pokemon => pokemon.name.english === pokemonName);
    
    // Check if the megaPokemonData exists before accessing its properties
    if (!megaPokemonData) {
        console.error(`Mega Pokémon data for '${pokemonName}' not found in dexData.`);
        return null;
    }

    let prevEvolution = megaPokemonData.evolution.prev[0];

    return {
      speciesName: prevEvolution,
      method: [],
      evolvesTo: [{
        speciesName: pokemonName,
        method: [megaPokemonData.method],
        evolvesTo: []
      }],
    };
}

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    const evolutionChainURL = response.data.evolution_chain.url;
    const evolutionChainResponse = await axios.get(evolutionChainURL);
    const evolutionChain = evolutionChainResponse.data.chain;

    const processEvolutionChain = (evolutionData) => {
      const speciesName = evolutionData.species.name;
      const evolutionDetails = evolutionData.evolution_details;

      const evolutionInfo = {
        speciesName: speciesName,
        method: [],
        evolvesTo: [],
      };

      evolutionDetails.forEach((detail) => {
        const triggerName = detail.trigger.name;
        const emoji = evolutionaryItemEmojis[triggerName] || '';
        switch (triggerName) {
          case "level-up":
            const level = detail.min_level;
            evolutionInfo.method.push(`Level: ${level}`);
            break;
          case "use-item":
            const itemName = detail.item.name.charAt(0).toUpperCase() + detail.item.name.slice(1);
            evolutionInfo.method.push(`${itemName} ${emoji}`);
            break;
          case "trade":
            evolutionInfo.method.push("Trade");
            break;
          case "friendship":
          case "high-friendship":
            evolutionInfo.method.push(`High Friendship ${emoji}`);
            break;
          default:
            break;
        }
      });

      if (evolutionData.evolves_to.length > 0) {
        evolutionInfo.evolvesTo = evolutionData.evolves_to
          .filter((evolvesTo) => !isSpecialForm(evolvesTo.species.name))
          .map((evolvesTo) => processEvolutionChain(evolvesTo));
      }

      return evolutionInfo;
    };

    return processEvolutionChain(evolutionChain);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const evolutionChainToString = (evolutionInfo, level = 0) => {
  const indent = "  ".repeat(level);
  let result = ` ${indent}- \`${evolutionInfo.speciesName.charAt(0).toUpperCase() +
    evolutionInfo.speciesName.slice(1)
    }\``;

  if (evolutionInfo.method && evolutionInfo.method.length > 0) {
    const method = evolutionInfo.method
      .map((m) => {
        if (m === "Level: null") {
          return "High Friendship";
        } else if (m.startsWith("Level")) {
          const level = m.split(": ")[1];
          return `Level ${level}`;
        } else {
          return m.charAt(0).toUpperCase() + m.slice(1);
        }
      });
    result += ` ${method.join(", ")}`;
  }

  if (evolutionInfo.evolvesTo && evolutionInfo.evolvesTo.length > 0) {
    result +=
      "\n" +
      evolutionInfo.evolvesTo
        .map((evolution) =>
          evolutionChainToString(evolution, level + 1),
        )
        .join("\n");
  }

  return result;
};

const normalizePokemonName = (inputName) => {
  let formattedName = inputName.toLowerCase().trim().split(' ');

  if (formattedName.includes("mega")) {
    formattedName = formattedName.filter(word => word !== "mega");
    return "Mega " + formattedName.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return formattedName.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("evolution")
    .setDescription("Return the evolution information of a Pokémon!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("pokemon")
        .setDescription("Enter a Pokémon name")
        .setAutocomplete(false)
        .setRequired(true),
    ),
  async execute(interaction, client) {
    const pokemonName = normalizePokemonName(interaction.options.getString("pokemon"));
    const pokemonData = dexData.find(
      (pokemon) =>
        pokemon.name.english.toLowerCase() === pokemonName.toLowerCase(),
    );

    if (!pokemonData) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(`Pokémon '${pokemonName}' not found.`)
        .setColor("#FF0000")
        .setThumbnail("https://image.flaticon.com/icons/svg/1923/1923533.svg");
      return await interaction.reply({
        ephemeral: false,
        embeds: [errorEmbed],
      });
    }

    let fullEvolutionChain;
    if (isSpecialForm(pokemonData.name.english)) {
      const basePokemonName = pokemonData.evolution.prev[0];
      const basePokemonData = dexData.find(
        (pokemon) =>
          pokemon.name.english.toLowerCase() === basePokemonName.toLowerCase(),
      );
      fullEvolutionChain = await getFullEvolutionChain(basePokemonData.id, basePokemonName);
    } else {
      fullEvolutionChain = await getFullEvolutionChain(pokemonData.id, pokemonName);
    }

    const evolutionChain = fullEvolutionChain
      ? evolutionChainToString(fullEvolutionChain)
      : "N/A";

    const {
      id,
      name,
      type,
      base,
      species,
      description,
      evolution,
      profile,
      image,
    } = pokemonData;

    const embed = new EmbedBuilder()
      .setTitle(`${pokemonData.name.english}`)
      .setDescription(`Evolution Information About ${pokemonName}`)
      .setColor("#8711ca")
      .setThumbnail(image.thumbnail)
      .setTimestamp()
      .addFields(
        {
          name: "Evolution 🧬",
          value: evolutionChain,
          inline: false,
        },
      )
      .setImage("https://media.discordapp.net/attachments/969481658451517440/1152964170862579712/image.png?width=1095&height=616");

    await interaction.reply({
      ephemeral: false,
      content: "Loading Pokémon evolution data...",
    });
    await interaction.editReply({
      ephemeral: false,
      content: `Loaded evolution data`,
      embeds: [embed],
    });
  },
};
