// Import necessary modules and dependencies
const {
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");
const axios = require("axios");
const dexData = require("../../JSON/dex_data.json");
const emotes = require("../../JSON/emotes.json");
const effectivenessData = require("../../JSON/effectiveness.json");

// Function to get the full evolution chain of a Pokémon
const getFullEvolutionChain = async (pokemonId) => {
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

                if (triggerName === "level-up") {
                    const level = detail.min_level;
                    evolutionInfo.method.push(`Level: ${level}`);
                } else if (triggerName === "use-item") {
                    const itemName = detail.item.name.charAt(0).toUpperCase() + detail.item.name.slice(1);
                    evolutionInfo.method.push(itemName);
                } else if (triggerName === "trade") {
                    evolutionInfo.method.push("Trade");
                } else if (triggerName === "friendship") {
                    evolutionInfo.method.push("Friendship");
                }
            });

            if (evolutionData.evolves_to.length > 0) {
                evolutionInfo.evolvesTo = evolutionData.evolves_to.map((evolvesTo) =>
                    processEvolutionChain(evolvesTo)
                );
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

// Function to convert evolution chain to string
const evolutionChainToString = (evolutionInfo, level = 0, highFriendshipIncluded = false) => {
    const indent = "  ".repeat(level);
    let result = '';

    if (evolutionInfo.evolvesFrom && evolutionInfo.evolvesFrom.length > 0) {
        result += evolutionInfo.evolvesFrom.map((prevName) => `${indent}- \`${prevName}\``).join("\n") + "\n";
    }

    result += `${indent}- \`${evolutionInfo.speciesName.charAt(0).toUpperCase() + evolutionInfo.speciesName.slice(1)}\``;

    if (evolutionInfo.method && evolutionInfo.method.length > 0) {
        const method = evolutionInfo.method.map((m) => {
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
        }).filter(Boolean); // Filter out null values

        if (method.length > 0) {
            result += ` ${method.join(", ")}`;
        }
    }

    if (evolutionInfo.evolvesTo && evolutionInfo.evolvesTo.length > 0) {
        result += "\n" + evolutionInfo.evolvesTo.map((evolution) => evolutionChainToString(evolution, level + 1, highFriendshipIncluded)).join("\n");
    }

    return result;
};

const getTypeEffectiveness = async (types) => {
    try {
        // Ensure types are always arrays
        if (!Array.isArray(types)) {
            types = [types];
        }

        const typeData = {
            name: types, // Set the name to the type combination
            weaknesses: [],
            strengths: [],
            immunes: [],
            resists: []
        };

        // Find the effectiveness data for the type combination
        const typeInfo = effectivenessData.find(data => {
            return Array.isArray(data.name) &&
                data.name.length === types.length &&
                types.every((type, index) => type.toLowerCase() === data.name[index].toLowerCase());
        });

        if (typeInfo) {
            typeData.weaknesses.push(...typeInfo.weaknesses);
            typeData.strengths.push(...typeInfo.strengths);
            typeData.immunes.push(...typeInfo.immunes);
            typeData.resists.push(...typeInfo.resists);
        } else {
            console.error(`Type data not found for type combination: ${types}`);
        }

        // Return the combined effectiveness data
        return typeData;
    } catch (error) {
        console.error(`Error fetching effectiveness data:`, error);
        return {};
    }
};

// Slash command data
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
                .setThumbnail(
                    "https://image.flaticon.com/icons/svg/1923/1923533.svg"
                );

            return await interaction.reply({
                ephemeral: false,
                embeds: [errorEmbed],
            });
        }

        const canonicalizeName = (name) =>
            name.toLowerCase().split(" ").sort().join(" ");

        const canonicalPokemonName = canonicalizeName(pokemonName);

        const pokemonData = dexData.find(
            (pokemon) =>
            canonicalizeName(pokemon.name.english) === canonicalPokemonName
        );

        if (!pokemonData) {
            const errorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`Pokémon '${pokemonName}' not found.`)
                .setColor("#FF0000")
                .setThumbnail(
                    "https://image.flaticon.com/icons/svg/1923/1923533.svg"
                );

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

        // Fetch type effectiveness data
        const typeData = await getTypeEffectiveness(type);

        // Ensure typeData is not empty
        if (!typeData) {
            console.error(`Type effectiveness data not found for ${type}`);
            // Handle the case when type effectiveness data is not found
        }

        // Extract type effectiveness information from typeData
        const weaknesses = typeData.weaknesses || [];
        const resistances = typeData.resists || [];
        const immunities = typeData.immunes || [];
        const strengths = typeData.strengths || [];

        // Create an object to store combined type data
        let combinedTypeData = {
            weaknesses: new Set(weaknesses),
            resistances: new Set(resistances),
            immunities: new Set(immunities),
            strengths: new Set(strengths),
        };

        // Get evolution chain
        let evolutionChain = "Loading evolution chain..."; // Placeholder for evolution chain
        const fullEvolutionChain = await getFullEvolutionChain(id);
        if (fullEvolutionChain) {
            evolutionChain = evolutionChainToString(fullEvolutionChain);
        }
        const abilityValue = profile.ability
            .map(([ability, isBold]) => {
                return isBold === "true" ? `**${ability}** (Hidden Ability)` : ability;
            })
            .join(`\n`);

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

        const genders = profile.gender.split(":");
        const genderText =
            profile.gender === "Genderless" ?
            " :transgender_symbol: Genderless" :
            `:male_sign: ${genders[0] || "0"}% Male\n:female_sign: ${genders[1] || "0"
                }% Female`;

        const eggSpecies = profile.egg.map(type => {
            const typeName = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
            const emote = emotes[type] || ""; // Fetch emote from emotes
            const emoteText = emotes[type] ? ` ${emote}` : "";
            return `${typeName}${emoteText}`;
        }).join(" | ");

        // Create an embed with Pokémon information
        const embedBuilder = new EmbedBuilder()
            .setTitle(`${name.english}#${id}`)
            .setURL(smogonURL)
            .setDescription(description)
            .setColor("#8711ca")
            .setThumbnail(image.thumbnail)
            .setTimestamp()
            .setFooter({
                text: "PokéDex by Eerie",
                iconURL: "https://media.discordapp.net/attachments/969481658451517440/1034160943552270437/imagen_2022-10-12_200319454.png?width=672&height=560",
            })
            .addFields({
                name: "Type 🩸",
                value: type.map(t => `${emotes[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}`).join("\n"),
                inline: true,
            }, {
                name: "Ability ✨",
                value: abilityValue,
                inline: true,
            }, {
                name: "Gender :couple:",
                value: genderText,
                inline: true,
            }, {
                name: "Evolution 🧬",
                value: evolutionChain,
                inline: false,
            }, {
                name: "Japanese :flag_jp:",
                value: name.japanese,
                inline: true,
            }, {
                name: "Chinese :flag_cn:",
                value: name.chinese,
                inline: true,
            }, {
                name: "French :flag_fr:",
                value: name.french,
                inline: true,
            }, {
                name: "Height :lying_face:",
                value: profile.height,
                inline: true,
            }, {
                name: "Weight 🦾",
                value: profile.weight,
                inline: true,
            }, {
                name: "Species :troll:",
                value: species,
                inline: true,
            }, {
                name: "Egg Species <:egg:1242008953898926130>",
                value: `${eggSpecies}`,
                inline: false,
            }, {
                name: "Base Stats :chart_with_upwards_trend:",
                value: Object.entries(base)
                    .map(([key, value]) => `**${key}:** __${value}__`)
                    .join(" | "),
                inline: false,
            }, {
                name: "``WEAKNESS`` 🤕",
                value: combinedTypeData.weaknesses.size > 0 ? [...combinedTypeData.weaknesses].map(type => `**2x** ${emotes[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`).join("\n") : "-",
                inline: true,
            }, {
                name: "\u200b",
                value: "\u200b",
                inline: true
            }, {
                name: "``RESISTANCE`` 👊🏻",
                value: combinedTypeData.resistances.size > 0 ? [...combinedTypeData.resistances].map(type => `**0.5x** ${emotes[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`).join("\n") : "-",
                inline: true,
            }, {
                name: "``IMMUNITY`` 🛡️",
                value: combinedTypeData.immunities.size > 0 ? [...combinedTypeData.immunities].map(type => `**0x** ${emotes[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`).join("\n") : "-",
                inline: true,
            }, {
                name: "\u200b",
                value: "\u200b",
                inline: true
            }, {
                name: "``STRENGTH`` :muscle_tone1:",
                value: combinedTypeData.strengths.size > 0 ? [...combinedTypeData.strengths].map(type => `**2x** ${emotes[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`).join("\n") : "-",
                inline: true,
            });

        await interaction.reply({
            ephemeral: false,
            content: "Loading Pokémon data...",
        });
        await interaction.editReply({
            ephemeral: false,
            content: `Loaded Pokédex data <:check:1126082400213028894>`,
            embeds: [embedBuilder],
        });
    },
};
