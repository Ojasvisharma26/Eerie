const { SlashCommandBuilder } = require("discord.js");
const smogonData = require("../../JSON/smogon.json");
const Pagination = require('../../components/buttons/pagination.js');
const dexData = require("../../JSON/dex_data.json");

module.exports = {
    category: "PROClient",
    developer: false,
    data: new SlashCommandBuilder()
        .setName("smogon")
        .setDescription("Returns Smogon Stats of Pokemon!")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("pokemon")
            .setDescription("Enter a Pokemon name")
            .setAutocomplete(false)
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const pokemonNameRaw = interaction.options.getString("pokemon");
        const standardizedInputName = this.standardizeName(pokemonNameRaw);

        const matchedKey = Object.keys(smogonData).find(key => this.standardizeName(key) === standardizedInputName);
        
        const pokemonDetails = smogonData[matchedKey];
        
        const matchedDexData = dexData.find(poke => this.standardizeName(poke.name.english) === standardizedInputName);

        if (!pokemonDetails) {
            return interaction.reply({
                embeds: [{
                    title: "Error",
                    description: `No smogon stats found for the Pokémon ${pokemonNameRaw}.`,
                    color: 0xFF0000,
                    thumbnail: {
                        url: "https://image.flaticon.com/icons/svg/1923/1923533.svg"
                    }
                }],
                ephemeral: false
            });
        }

        const chunkedEmbeds = [];
        let embedDescription = "";
        let counter = 0;

        for (const build in pokemonDetails) {
            counter++;
            embedDescription += `__**${build}:**__\n`;
            embedDescription += `- **Ability:** \`${pokemonDetails[build].ability}\`\n`;
            embedDescription += `- **Item:** \`${pokemonDetails[build].item}\`\n`;
            embedDescription += `- **Nature:** \`${pokemonDetails[build].nature}\`\n`;
            embedDescription += `- **EVs:** \`${this.formatStats(pokemonDetails[build].evs)}\`\n`;

            if (pokemonDetails[build].ivs) {
                embedDescription += `- **IVs:** \`${this.formatStats(pokemonDetails[build].ivs)}\`\n`;
            }

            embedDescription += `- **Moves:** \`${pokemonDetails[build].moves.join(', ')}\`\n\n`;

            if (counter >= 3 || Object.keys(pokemonDetails).length - 1 == build) {
                const embedObject = {
                    title: `Smogon stats for ${matchedKey}`,
                    description: embedDescription,
                    color: 0x8711ca,
                    image: {
                        url: "https://media.discordapp.net/attachments/969481658451517440/1140937756059652176/image.png?width=1213&height=616"
                    },
                    footer: { text: `Page ${chunkedEmbeds.length + 1} of ?` },
                  timestamp: new Date(),
                };

                if (matchedDexData && matchedDexData.image && matchedDexData.image.thumbnail) {
                    embedObject.thumbnail = { url: matchedDexData.image.thumbnail };
                }

                chunkedEmbeds.push(embedObject);
                embedDescription = "";
                counter = 0;
            }
        }

        // Replace "?" in the footer with the actual total number of pages
        chunkedEmbeds.forEach(embed => embed.footer.text = embed.footer.text.replace('?', chunkedEmbeds.length));

        await interaction.deferReply();
        await interaction.editReply({
            content: 'Here is your request',
            embeds: chunkedEmbeds
        });
        new Pagination(interaction, chunkedEmbeds).send();
    },

    standardizeName(name) {
        return name.toLowerCase()
                   .split(/\s+|-|_/)
                   .sort()
                   .join(' ');
    },

    formatStats(stats) {
        return Object.entries(stats).map(([key, value]) => `${key}: ${value}`).join(', ');
    }
};
