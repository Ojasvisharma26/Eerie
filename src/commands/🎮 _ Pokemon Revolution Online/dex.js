const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const dexData = require("../../JSON/dex_data.json");
const typeDataRaw = require("../../JSON/effectiveness.json");
const emotes = require("../../JSON/emotes.json");
const axios = require("axios");

const getFullEvolutionChain = async (pokemonId) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`,
    );
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

        if (triggerName === "level-up") {
          const level = detail.min_level;
          evolutionInfo.method.push(`Level: ${level}`);
        } else if (triggerName === "use-item") {
          const itemName =
            detail.item.name.charAt(0).toUpperCase() +
            detail.item.name.slice(1);
          evolutionInfo.method.push(itemName);
        } else if (triggerName === "trade") {
          evolutionInfo.method.push("Trade");
        } else if (triggerName === "friendship") {
          evolutionInfo.method.push("Friendship");
        }
      });

      // Handling specific name-based evolution methods
      if (speciesName.endsWith(" Therian")) {
        evolutionInfo.method.push("Reveal Glass <:Bag_Reveal_Glass_SV_Sprite:1140328465296523428>");
    } else if (speciesName.endsWith(" White") || speciesName.endsWith(" Black")) {
        evolutionInfo.method.push("DNA Splicers");
      } else if (speciesName.endsWith(" Resolute")) {
        evolutionInfo.method.push("Move: Secrete Sword");
      } else if (
        speciesName.endsWith(" Attack") ||
        speciesName.endsWith(" Defence") ||
        speciesName.endsWith(" Defense") ||
        speciesName.endsWith(" Speed")
      ) {
        evolutionInfo.method.push(
          "Meteorites <:Bag_Meteorite_Sprite:1140162798349983765>",
        );
      } else if (
        speciesName.endsWith(" Heat") ||
        speciesName.endsWith(" Wash") ||
        speciesName.endsWith(" Frost") ||
        speciesName.endsWith(" Fan") ||
        speciesName.endsWith(" Mow")
      ) {
      } else if (
        speciesName.endsWith(" Alolan") ||
        speciesName.endsWith(" Alola") ||
        speciesName.startsWith("Alolan ") ||
        speciesName.startsWith("Alola ")
      ) {
      }

      const isAlolanForm = (pokemonName) => {
  return (
    pokemonName.endsWith(" Alolan") ||
    pokemonName.endsWith(" Alola") ||
    pokemonName.startsWith("Alolan ") ||
    pokemonName.startsWith("Alola ")
  );
};

if (evolutionData.evolves_to.length > 0) {
  evolutionInfo.evolvesTo = evolutionData.evolves_to
    .filter((evolvesTo) => {
      // Always include Alolan forms
      if (isAlolanForm(evolvesTo.species.name)) return true;

      // Exclude other special forms
      return !isSpecialForm(evolvesTo.species.name);
    })
    .map((evolvesTo) => processEvolutionChain(evolvesTo));
}


      return evolutionInfo;
    };

    const fullEvolutionChain = processEvolutionChain(evolutionChain);

    return fullEvolutionChain;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getEvolutionFromJSON = (pokemonName) => {
  const pokemonData = dexData.find(
    (pokemon) => pokemon.name.english === pokemonName,
  );

  if (pokemonData) {
    const prevNames = pokemonData.evolution.prev || []; 
    const nextNames = pokemonData.evolution.next || [];
    
    let methods;
    if (pokemonName === "Vulpix") {
      methods = ["Fire Stone"];
    } else {
      methods = nextNames.map(evolution => evolution[1]);
    }

    const evolvesToNames = nextNames.map(evolution => evolution[0]);

    // Construct the evolution chain
    const evolvesTo = evolvesToNames.map((name, index) => {
      return {
        speciesName: name,
        method: [methods[index]],
        evolvesTo: []
      };
    });

    return {
      evolvesFrom: prevNames,
      speciesName: pokemonData.name.english,
      method: [],  // Since this method is used for base Pokémon, the evolution method is not here but in the evolvesTo object
      evolvesTo: evolvesTo
    };
  } else {
    return null;
  }
};

const evolutionChainToString = (
  evolutionInfo,
  level = 0,
  highFriendshipIncluded = false,
) => {
  const indent = "  ".repeat(level);
  let result = "";

  if (evolutionInfo.evolvesFrom && evolutionInfo.evolvesFrom.length > 0) {
    result +=
      evolutionInfo.evolvesFrom
        .map((prevName) => `${indent}- \`${prevName}\``)
        .join("\n") + "\n";
  }

  result += ` ${indent}- \`${evolutionInfo.speciesName.charAt(0).toUpperCase() +
    evolutionInfo.speciesName.slice(1)
    }\``;

  if (evolutionInfo.method && evolutionInfo.method.length > 0) {
    const method = evolutionInfo.method
      .map((m) => {
        if (m === "Level: null") {
          if (!highFriendshipIncluded) {
            highFriendshipIncluded = true;
            return "High Friendship";
          } else {
            return null;
          }
        } else if (m.startsWith("Level")) {
          const level = m.split(": ")[1];
          return `Level ${level}`;
        } else {
          return m.charAt(0).toUpperCase() + m.slice(1);
        }
      })
      .filter(Boolean); // Filter out null values

    if (method.length > 0) {
      result += ` ${method.join(", ")}`;
    }
  }

  if (evolutionInfo.evolvesTo && evolutionInfo.evolvesTo.length > 0) {
    result +=
      "\n" +
      evolutionInfo.evolvesTo
        .map((evolution) =>
          evolutionChainToString(evolution, level + 1, highFriendshipIncluded),
        )
        .join("\n");
  }

  return result;
};

const typeData = typeDataRaw.map((type) => ({
  ...type,
  weaknesses: new Set(type.weaknesses || []),
  immunes: new Set(type.immunes || []),
  strengths: new Set(type.strengths || []),
  resists: new Set(type.resists || []),
}));

const mergeTypeEffectiveness = (type1, type2) => {
  type1.weaknesses = type1.weaknesses || new Set();
  type1.immunes = type1.immunes || new Set();
  type1.strengths = type1.strengths || new Set();
  type1.resists = type1.resists || new Set();

  type2.weaknesses = type2.weaknesses || new Set();
  type2.immunes = type2.immunes || new Set();
  type2.strengths = type2.strengths || new Set();
  type2.resists = type2.resists || new Set();

  const combined = {
    weaknesses: new Set([...type1.weaknesses, ...type2.weaknesses]),
    immunities: new Set([...type1.immunes, ...type2.immunes]),
    strengths: new Set([...type1.strengths, ...type2.strengths]),
    resists: new Set([...type1.resists, ...type2.resists]),
  };

  const doubleWeaknesses = new Set();

  for (const typeName of combined.weaknesses) {
    if (type2.weaknesses.has(typeName) && type1.weaknesses.has(typeName)) {
      doubleWeaknesses.add(typeName);
    }
  }

  // Handle overlapping types for weaknesses
  for (const typeName of combined.weaknesses) {
    // If it's a double weakness, skip deletion
    if (doubleWeaknesses.has(typeName)) continue;

    if (type2.resists.has(typeName) || type1.resists.has(typeName)) {
      combined.weaknesses.delete(typeName);
    }
    combined.strengths.delete(typeName);
  }

  // Handle overlapping types for resistances
  for (const typeName of combined.resists) {
    if (type2.weaknesses.has(typeName) || type1.weaknesses.has(typeName)) {
      combined.resists.delete(typeName);
    }
  }

  // If either type is immune, it is added to immunities and removed from other categories
  for (const typeName of combined.immunities) {
    combined.weaknesses.delete(typeName);
    combined.resists.delete(typeName);
    combined.strengths.delete(typeName);
  }

  // If either of the original types are Ghost or Dragon, add to both strengths and weaknesses
  if (
    type1.name.toLowerCase() === "ghost" ||
    type2.name.toLowerCase() === "ghost"
  ) {
    combined.weaknesses.add(`Ghost ${emotes["Ghost"]}`);
    combined.strengths.add(`Ghost ${emotes["Ghost"]}`);
  }

  if (
    type1.name.toLowerCase() === "dragon" ||
    type2.name.toLowerCase() === "dragon"
  ) {
    combined.weaknesses.add(`Dragon ${emotes["Dragon"]}`);
    combined.strengths.add(`Dragon ${emotes["Dragon"]} `);
  }

  return combined;
};

const adjustEffectivenessForAbility = (typeData, ability) => {
  if (!ability) return typeData;

  const adjustedTypeData = { ...typeData };

  switch (ability) {
    case "Dry Skin":
    case "Water Absorb":
      adjustedTypeData.weaknesses.delete("Water");
      adjustedTypeData.resists.delete("Water");
      adjustedTypeData.immunes.add("Water");
      break;
    case "Earth Eater":
    case "Levitate":
      adjustedTypeData.weaknesses.delete("Ground");
      adjustedTypeData.resists.delete("Ground");
      adjustedTypeData.immunes.add("Ground");
      break;
    case "Flash Fire":
      adjustedTypeData.weaknesses.delete("Fire");
      adjustedTypeData.resists.delete("Fire");
      adjustedTypeData.immunes.add("Fire");
      break;
    case "Lightning Rod":
    case "Motor Drive":
    case "Volt Absorb":
      adjustedTypeData.weaknesses.delete("Electric");
      adjustedTypeData.resists.delete("Electric");
      adjustedTypeData.immunes.add("Electric");
      break;
    case "Sap Sipper":
      adjustedTypeData.weaknesses.delete("Grass");
      adjustedTypeData.resists.delete("Grass");
      adjustedTypeData.immunes.add("Grass");
      break;
    default:
      break;
  }

  return adjustedTypeData;
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

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("pokedex")
    .setDescription("Return the Pokédex information of a Pokémon!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("pokemon")
        .setDescription("Enter a Pokémon name")
        .setAutocomplete(false)
        .setRequired(true),
    ),

  async execute(interaction, client) {
    const pokemonName = interaction.options.getString("pokemon");

    if (!pokemonName) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Please enter a Pokémon name.")
        .setColor("#FF0000")
        .setThumbnail("https://image.flaticon.com/icons/svg/1923/1923533.svg");

      return await interaction.reply({
        ephemeral: false,
        embeds: [errorEmbed.build()],
      });
    }

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

    let smogonURL = "";

    if (name.english.startsWith("Mega ")) {
      // Remove "Mega " prefix and any " X" or " Y" suffix.
      let baseName = name.english
        .replace("Mega ", "")
        .replace(" X", "")
        .replace(" Y", "");
      smogonURL = `https://www.smogon.com/dex/sm/pokemon/${baseName.toLowerCase()}/`;
    } else if (name.english.startsWith("Rotom")) {
      const urlName = name.english.replace(/\s+/g, "-").toLowerCase(); // Replace spaces with dashes for URL
      smogonURL = `https://www.smogon.com/dex/sm/pokemon/${urlName}/`;
    } else if (
      name.english.endsWith(" White") ||
      name.english.endsWith(" Black") ||
      name.english.endsWith(" Therian") ||
      name.english.endsWith(" Resolute") ||
      name.english.endsWith(" Attack") ||
      name.english.endsWith(" Defence") ||
      name.english.endsWith(" Speed")
    ) {
      const urlName = name.english;
      smogonURL = `https://www.smogon.com/dex/sm/pokemon/${urlName
        .toLowerCase()
        .replace(/\s+/g, "_")}/`;
    } else if (name.english.includes("Alola") || name.english.includes("Alolan")) {
      // Construct URL for Alolan forms
      let baseName = name.english.replace("Alolan ", "").replace("Alola ", "").replace(" Alola", "").replace(" Alolan", "");
      smogonURL = `https://www.smogon.com/dex/sm/pokemon/${baseName.toLowerCase()}-alola/`;
    } else {
      // If no special condition is met, just use the Pokémon's name.
      smogonURL = `https://www.smogon.com/dex/sm/pokemon/${name.english.toLowerCase()}/`;
    }

    // Convert types to emotes and display both the emote and the written type
    const emoteTypes = type.map((type) => `${emotes[type]} ${type}`);

    // Add leading zeros to the ID
    const paddedId = String(id).padStart(3, "0");

    const abilityValue = profile.ability
      .map(([ability, isBold]) => {
        return isBold === "true" ? `**${ability}** (Hidden Ability)` : ability;
      })
      .join(`\n`);

    const genders = profile.gender.split(":");
    const genderText =
      profile.gender === "Genderless"
        ? " :transgender_symbol: Genderless"
        : `:male_sign: ${genders[0] || "0"}% Male\n:female_sign: ${genders[1] || "0"
        }% Female`;

    const defaultTypeData = {
      weaknesses: new Set(),
      immunes: new Set(),
      strengths: new Set(),
      resists: new Set(),
    };

    // Assuming 'type' is an array of Pokémon types.
    const sortedTypes = type.map((t) => t.toLowerCase()).sort();

    let combinedTypeData = typeData.find((t) => {
      const sortedDataTypes = t.name.map((name) => name.toLowerCase()).sort();
      return JSON.stringify(sortedDataTypes) === JSON.stringify(sortedTypes);
    });

    // If no match is found, default to a predefined object.
    if (!combinedTypeData) {
      combinedTypeData = {
        immunes: [],
        weaknesses: [],
        strengths: [],
        resists: [],
      };
    }

    const formatEvolutionChain = (evolutionData) => {
      let result = `- \`${evolutionData.speciesName}\``;
      if (evolutionData.method && evolutionData.method !== "") {
        result += ` ${evolutionData.method}`;
      }

      if (evolutionData.evolvesFrom && evolutionData.evolvesFrom.length > 0) {
        result +=
          "\n" +
          evolutionData.evolvesFrom
            .map(
              (evolution, index) =>
                `${"  ".repeat(index + 1)}- \`${evolution}\``,
            )
            .join("\n");
      }

      return result;
    };
    let fullEvolutionChain;

if (
  name.english.startsWith("Mega ") ||
  name.english.endsWith(" Therian") ||
  name.english.endsWith(" Black") ||
  name.english.endsWith(" White") ||
  name.english.endsWith(" Attck") ||
  name.english.endsWith(" Defence") ||
  name.english.endsWith(" Defense") ||
  name.english.endsWith(" Speed") ||
  name.english.endsWith(" Heat") ||
  name.english.endsWith(" Wash") ||
  name.english.endsWith(" Frost") ||
  name.english.endsWith(" Fan") ||
  name.english.endsWith(" Mow") ||
  name.english.endsWith(" Alolan") ||
  name.english.endsWith(" Alola") ||
  name.english.startsWith("Alolan ") ||
  name.english.startsWith("Alola ")
) {
  fullEvolutionChain = getEvolutionFromJSON(name.english);
} else {
  fullEvolutionChain = await getFullEvolutionChain(id);
}

const evolutionChain = fullEvolutionChain
  ? evolutionChainToString(fullEvolutionChain)
  : "N/A";

    const prevNames = pokemonData.evolution.prev;

    const abilities = profile.ability;
    abilities.forEach((abilityPair) => {
      combinedTypeData = adjustEffectivenessForAbility(
        combinedTypeData,
        abilityPair[0],
      );
    });

    const embed = new EmbedBuilder()
      .setTitle(`${name.english}#${paddedId}`)
      .setURL(smogonURL)
      .setDescription(description)
      .setColor("#8711ca")
      .setThumbnail(image.thumbnail)
      .setTimestamp()
      .setFooter({
        text: "PokéDex by Eerie",
        iconURL:
          "https://media.discordapp.net/attachments/969481658451517440/1034160943552270437/imagen_2022-10-12_200319454.png?width=672&height=560",
      })
      .addFields(
        {
          name: "Type 🩸",
          value: emoteTypes.join(`\n`),
          inline: true,
        },
        {
          name: "Ability ✨",
          value: abilityValue,
          inline: true,
        },
        {
          name: "Gender :couple:",
          value: genderText,
          inline: true,
        },
        {
          name: "Evolution 🧬",
          value: evolutionChain,
          inline: false,
        },
        {
          name: "Japanese :flag_jp:",
          value: name.japanese,
          inline: true,
        },
        {
          name: "Chinese :flag_cn:",
          value: name.chinese,
          inline: true,
        },
        {
          name: "French :flag_fr:",
          value: name.french,
          inline: true,
        },
        {
          name: "Height :lying_face:",
          value: profile.height,
          inline: true,
        },
        {
          name: "Weight 🦾",
          value: profile.weight,
          inline: true,
        },
        {
          name: "Species :troll:",
          value: species,
          inline: true,
        },
        {
          name: "Base Stats :chart_with_upwards_trend:",
          value: Object.entries(base)
            .map(([key, value]) => `**${key}:** __${value}__`)
            .join(" | "),
          inline: false,
        },
        {
          name: "``WEAKNESS`` 🤕",
          value:
            [...combinedTypeData.weaknesses]
              .map((typeName) => `${typeName} ${emotes[typeName]}`)
              .join("\n") || "-",
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "``IMMUNITY`` 🛡️",
          value:
            [...combinedTypeData.immunes]
              .map((typeName) => `${typeName} ${emotes[typeName]}`)
              .join("\n") || "-",
          inline: true,
        },
        {
          name: "``STRENGTH`` 💪🏻",
          value:
            [...combinedTypeData.strengths]
              .map((typeName) => `${typeName} ${emotes[typeName]}`)
              .join("\n") || "-",
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "``RESISTANCE`` 👊🏻",
          value:
            [...combinedTypeData.resists]
              .map((typeName) => `${typeName} ${emotes[typeName]}`)
              .join("\n") || "-",
          inline: true,
        },
      );

    await interaction.reply({
      ephemeral: false,
      content: "Loading Pokémon data...",
    });
    await interaction.editReply({
      ephemeral: false,
      content: `Loaded Pokédex data <:check:1126082400213028894>`,
      embeds: [embed],
    });
  },
};
