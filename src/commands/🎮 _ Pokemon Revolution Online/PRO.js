const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("pro")
    .setDescription("Gives Information about Pokemon Revolution Online!"),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../Structures/bot")} client
   */
  async execute(interaction, client) {
    const embedData = [
      {
        name: "• Multiplayer Gameplay:",
        value: `\`\`\`yaml\nPokemon Revolution Online offers a vast multiplayer experience where players can interact with other trainers from around the world. It allows for cooperative battles, trading, and socializing with fellow trainers.\`\`\``,
        inline: false
      },
      {
        name: "• Multiple Regions:",
        value: `\`\`\`yaml\nThe game includes multiple regions from the Pokemon universe, such as Kanto, Johto, Hoenn and Sinnoh. Each region features its own unique set of Pokemon, gyms, and challenges.\`\`\``,
        inline: false
      },
      {
        name: "• Customizable Avatars:",
        value: `\`\`\`yaml\nPlayers can create and customize their own avatars, allowing them to personalize their trainer's appearance and style.\`\`\``,
        inline: false
      },
      {
        name: "• PVP Battles:",
        value: `\`\`\`yaml\nPokemon Revolution Online provides PvP (Player versus Player) battles, enabling trainers to compete against each other in real-time battles and test their skills.\`\`\``,
        inline: false
      },
      {
        name: "• Mega Evolutions and Z-Moves:",
        value: `\`\`\`yaml\nPokemon Revolution Online incorporates the popular Mega Evolutions and Z-Moves feature from the main series games. Trainers can unleash powerful and unique abilities during battles to turn the tide in their favor.\`\`\``,
        inline: false
      },
      {
        name: "• Competitive Tournaments:",
        value: `\`\`\`yaml\nThe game hosts regular competitive tournaments where trainers can compete against each other to prove their skills and win exciting prizes.\`\`\``,
        inline: false
      },
      {
        name: "• Gym Leaders and Elite Four:",
        value: `\`\`\`yaml\nTrainers can challenge Gym Leaders in each region to earn badges and qualify for the Elite Four. Defeating the Elite Four and the Champion becomes the ultimate goal for trainers.\`\`\``,
        inline: false
      }
    ];

    return interaction.reply({
      embeds: [
        {
          title: `__Features of Pokemon Revolution Online__`,
          fields: embedData,
          color: 0x8711ca,
          footer: {
            text: "Features of PRO by Eerie"
          },
          timestamp: new Date(),
          thumbnail: {
            url: `https://images-ext-1.discordapp.net/external/MvLx91BPCwQNsl_7U517DGvE3ZKBvY2ZHzVfa-f73P4/https/pokemonrevolution.net/img/logo.png?width=292&height=290`
          }
        }
      ]
    });
  }
};
