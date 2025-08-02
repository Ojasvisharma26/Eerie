const { MessageAttachment, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const moveTutorsData = require("../../JSON/move_tutors.json");
const movePokemonData = require("../../JSON/move_pokemon.json")

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("learnset")
    .setDescription("Check the moves for the Pokemon!")
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
        .setName("move")
        .setDescription("Enter a Move name")
        .setAutocomplete(false)
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const pokemonName = interaction.options.getString("pokemon");
    const moveName = interaction.options.getString("move");

    if (!pokemonName && !moveName) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          {
            title: "Error",
            description: "Please enter a Pokemon name or a move name.",
            color: 0xFF0000,
            thumbnail: {
              url: "https://image.flaticon.com/icons/svg/1923/1923533.svg",
            },
          },
        ],
      });
    }

    // If the user is querying by move:
    if (moveName) {
      const pokemonList = movePokemonData[moveName.toLowerCase()];

      if (!pokemonList || pokemonList.length === 0) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            {
              title: "Error",
              description: `No Pokemon found that can learn ${moveName}.`,
              color: 0xFF0000,
              thumbnail: {
                url: "https://image.flaticon.com/icons/svg/1923/1923533.svg",
              },
            },
          ],
        });
      }

      const pokemonString = pokemonList.map(pokemon => `-> ${pokemon}`).join("\n");
      return interaction.reply({
        content: `\`\`\`yaml\nPokémon that can learn ${moveName}:\n\n${pokemonString}\`\`\``,
      });
    }

    const learnsetData = require("../../JSON/learnset.json");
    const pokemonData = learnsetData[pokemonName.toLowerCase()];

    if (!pokemonData) {
      let array = [];
      let characters = [..."abcdefghijklmnopqrstuvwxyz"];

      Object.keys(learnsetData)
        .sort()
        .forEach((item) => {
          let letter = item[0];
          let pos = characters.findIndex((i) => i === letter);
          if (pos < array.length) array[pos].push(item);
          else array.push([item]);
        });

      const file = new MessageAttachment(
        Buffer.from(array.map((item) => item.join(`: `)).join(`:\n`), "utf-8"),
        "learnset.json"
      );

      return await interaction.channel.send({
        files: [file],
      });
    } else {
      const moves = Object.keys(pokemonData);
      const MAX_LENGTH = 2000; // Replace with the appropriate value for your webhook's character limit
      const CODE_BLOCK_LENGTH = 2000; // Minimum number of words per code block

      await interaction.reply({ content: "Loading your learnset data...", ephemeral: true }),
        await interaction.editReply({ content: "Loaded your learnset data ✅", ephemeral: true }); // Defer the reply before sending follow-up messages

      let currentMessage = "```yaml\n";
      let remainingWords = CODE_BLOCK_LENGTH;

      currentMessage += `Learnset of ${pokemonName}\n\n`;

      const moveChunks = chunks(moves, 35);

      for (let i = 0; i < moveChunks.length; i++) {
        const chunk = moveChunks[i];

        for (let j = 0; j < chunk.length; j++) {
          const move = chunk[j];
          const moveInfo = pokemonData[move];
          const tutorInfo = moveTutorsData[move];
          let tmTutorInfo;

          if (moveInfo.some(info => info.includes("E"))) {
            tmTutorInfo = "Learns by Egg Move Tutor";
          } else if (moveInfo.some(info => info.includes("S"))) {
            tmTutorInfo = "Learns by Event Move Tutor";
          } else if (moveInfo.some(info => info.includes("T"))) {
            tmTutorInfo = "Learns by Move Tutor";
          } else {
            tmTutorInfo = "Learns by TM/HM";
          }

          let moveDetails = [];

          if (moveInfo) {
            const levelRegex = /(\d+)L(\d+)/;
            const match = String(moveInfo).match(levelRegex);

            if (match) {
              const level = match[2];
              moveDetails.push(`Level: ${level}`);
            }
          }

          if (tutorInfo) {
            moveDetails.push(`Tutor: ${tutorInfo}`);
          }

          if (tmTutorInfo && moveDetails.length === 0) {
            moveDetails.push(`${tmTutorInfo}`);
          }

          const moveString = `-> ${move} (${moveDetails.join(", ")})\n`;
          const moveWords = moveString.split(" ").filter((word) => word.trim() !== "");

          if (remainingWords >= moveWords.length) {
            currentMessage += moveString;
            remainingWords -= moveWords.length;
          } else {
            currentMessage += "```";
            if (currentMessage.trim() !== "" && currentMessage.trim() !== "```yaml") {
              currentMessage += "\u200b"; // Add zero-width whitespace
              await interaction.channel.send({ content: currentMessage });
            }
            currentMessage = "```yaml\n";
            remainingWords = CODE_BLOCK_LENGTH - moveWords.length;
            currentMessage += moveString;
          }
        }

        if (i < moveChunks.length - 1) {
          currentMessage += "```";
          if (currentMessage.trim() !== "" && currentMessage.trim() !== "```yaml") {
            currentMessage += "\u200b"; // Add zero-width whitespace
            await interaction.channel.send({ content: currentMessage });
          }
          currentMessage = "```yaml\n";
          remainingWords = CODE_BLOCK_LENGTH;
        }
      }

      currentMessage += "```";
      if (currentMessage.trim() !== "" && currentMessage.trim() !== "```yaml") {
        currentMessage += "\u200b"; // Add zero-width whitespace
        await interaction.channel.send({ content: currentMessage });
      }
      await interaction.deleteReply();
    }
  },
};

function chunks(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
