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
    console.log(0, smogonData, dexData)
    // 🛡️ Must call within 3 seconds
    await interaction.deferReply();

    const pokemonNameRaw = interaction.options.getString("pokemon");
    const standardizedInputName = this.standardizeName(pokemonNameRaw);

    const matchedKey = Object.keys(smogonData).find(
      key => this.standardizeName(key) === standardizedInputName
    );

    const pokemonDetails = smogonData[matchedKey];
    const matchedDexData = dexData.find(
      poke => this.standardizeName(poke.name.english) === standardizedInputName
    );
    console.log(1)

    if (!pokemonDetails) {
      console.log(1)
      return interaction.editReply({
        embeds: [{
          title: "Error",
          description: `No smogon stats found for the Pokémon ${pokemonNameRaw}.`,
          color: 0xFF0000,
          thumbnail: {
            url: "https://image.flaticon.com/icons/svg/1923/1923533.svg"
          }
        }]
      });
    }

    const chunkedEmbeds = [];
    let embedDescription = "";
    let counter = 0;
    console.log(1)
    
    const builds = Object.keys(pokemonDetails);

    for (const build of builds) {
      const set = pokemonDetails[build];
      counter++;
      console.log(1)

      embedDescription += `__**${build}:**__\n`;
      embedDescription += `- **Ability:** \`${set.ability}\`\n`;
      embedDescription += `- **Item:** \`${set.item}\`\n`;
      embedDescription += `- **Nature:** \`${set.nature}\`\n`;
      embedDescription += `- **EVs:** \`${this.formatStats(set.evs)}\`\n`;

      if (set.ivs) {
        console.log(1)
        embedDescription += `- **IVs:** \`${this.formatStats(set.ivs)}\`\n`;
      }

      embedDescription += `- **Moves:** \`${set.moves.join(', ')}\`\n\n`;

      // Push embed every 3 builds or at the end
      if (counter >= 3 || build === builds[builds.length - 1]) {
        console.log(1)
        const embedObject = {
          title: `Smogon stats for ${matchedKey}`,
          description: embedDescription,
          color: 0x8711ca,
          image: {
            url: "https://media.discordapp.net/attachments/969481658451517440/1140937756059652176/image.png?width=1213&height=616"
          },
          footer: { text: `Page ${chunkedEmbeds.length + 1} of ?` },
          timestamp: new Date()
        };

        if (matchedDexData?.image?.thumbnail) {
          console.log(1)
          embedObject.thumbnail = { url: matchedDexData.image.thumbnail };
        }
        console.log(1)
        
        chunkedEmbeds.push(embedObject);
        embedDescription = "";
        counter = 0;
      }
    }
    console.log(1)
    
    // Replace '?' with actual page number
    chunkedEmbeds.forEach((embed, i) => {
      embed.footer.text = `Page ${i + 1} of ${chunkedEmbeds.length}`;
    });

    await interaction.editReply({
      content: 'Here is your request',
      embeds: chunkedEmbeds
    });
    console.log(1)
    
    // Start pagination
    new Pagination(interaction, chunkedEmbeds).send();
  },

  standardizeName(name) {
    return name.toLowerCase()
      .split(/\s+|-|_/)
      .sort()
      .join(' ');
  },

  formatStats(stats) {
    return Object.entries(stats)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
};
