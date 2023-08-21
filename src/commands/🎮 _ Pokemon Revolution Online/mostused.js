const { MessageAttachment, SlashCommandBuilder } = require("discord.js");
const mostusedData = require("../../JSON/mostused.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("mostused")
    .setDescription("Shows Most used pokemon in ranked pvp!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("server")
        .setDescription("Enter a Server name")
        .addChoices(
          {
            name: "Silver",
            value: "Silver",
          },
          {
            name: "Gold",
            value: "Gold",
          },
        )
        .setAutocomplete(false)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("month")
        .setDescription("Enter a Month")
        .addChoices(
          {
            name: "January",
            value: "January",
          },
          {
            name: "February",
            value: "February",
          },
          {
            name: "March",
            value: "March",
          },
          {
            name: "April",
            value: "April",
          },
          {
            name: "May",
            value: "May",
          },
          {
            name: "June",
            value: "June",
          },
          {
            name: "July",
            value: "July",
          },
          {
            name: "August",
            value: "August",
          },
          {
            name: "September",
            value: "September",
          },
          {
            name: "October",
            value: "October",
          },
          {
            name: "November",
            value: "November",
          },
          {
            name: "December",
            value: "December",
          },
        )
        .setAutocomplete(false)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("year")
        .setDescription("Enter a Year")
        .setAutocomplete(false)
        .setRequired(true),
    ),

  async execute(interaction, client) {
    const server = interaction.options.getString("server");
    const year = interaction.options.getString("year");
    const month = interaction.options.getString("month");

    // Fetch the relevant data
    const data = mostusedData?.[year]?.[month]?.[server];

    if (!data) {
      return interaction.reply({
        content: "```No data found for the given server, year, and month.```",
      });
    }

    const formattedData = data[
      "Most used pokemon in ranked pvp (source: PRO database)"
    ].map((pokemon) => {
      return `${pokemon.Rank.toString()
        .padStart(4)
        .padEnd(9)} ${pokemon.Pokemon.padEnd(21)} - ${pokemon.Count.toString()
        .padStart(6)
        .padEnd(13)} ${pokemon.Percentage.padEnd(10)} ${pokemon[
        "Win rate"
      ].padEnd(5)}`;
    });

    // Formatting the heading
    let heading =
      `Most Used Pokemon of ${server} in ${month} ${year}:\n\n` +
      `//Rank`.padEnd(10) +
      `Pokemon`.padEnd(25) +
      `Count`.padEnd(10) +
      `Percentage`.padEnd(13) +
      `Win Rate\n`;
    heading += `${"-".repeat(92)}\n`;

    const MAX_CHARS = 1950; // Maximum characters in a single discord message
    const CODE_BLOCK_LENGTH = 6; // ``` added at start and end

    let messagesToSend = [];
    let currentMessage = heading; // Start with the heading

    for (let line of formattedData) {
      if (currentMessage.length + line.length + CODE_BLOCK_LENGTH > MAX_CHARS) {
        messagesToSend.push(currentMessage);
        currentMessage = ""; // Reset currentMessage
      }
      currentMessage += line + "\n";
    }

    if (currentMessage !== heading) {
      // Ensure we have more than just the heading
      messagesToSend.push(currentMessage);
    }

    // Send the initial processing message
    await interaction.reply("Processing Your Request...");

    // If it's the first data message, edit the original reply
    await interaction.editReply("Here is Your Request:");

    // For subsequent messages, use the channel's send() method
    for (let message of messagesToSend) {
      await interaction.channel.send(`\`\`\`js\n${message}\`\`\``);
    }
  },
};
