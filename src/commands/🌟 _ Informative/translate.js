const {
  Client,
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");
const translate = require("@iamtraction/google-translate");

module.exports = {
  developer: false,
  category: "util",
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate the Text.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Type Your Message!")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("Set Your Language!")
        .addChoices(
          { name: "English", value: "en" },
          { name: "Hindi", value: "hi" },
          { name: "Japanese", value: "ja" },
          { name: "French", value: "fr" },
          { name: "Spanish", value: "es" },
          { name: "Korean", value: "ko" },
          { name: "Russian", value: "ru" },
          { name: "Portuguese", value: "pt" },
          { name: "German", value: "de" },
          { name: "Arebic", value: "ar" },
          { name: "Dutch", value: "da" },
          { name: "Greek", value: "el" },
          { name: "Polish", value: "pl" },
          { name: "Turkish", value: "tr" },
          { name: "Ukrainian", value: "uk" },
          { name: "Vietnamese", value: "vi" },
          { name: "Urdu", value: "ur" },
        )
        .setRequired(true),
    ),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    const text = interaction.options.getString("message");
    const lang = interaction.options.getString("language");

    await interaction.reply({
      content: ":hammer_pick: Translating your language...",
    });

    const applied = await translate(text, { to: `${lang}` });
    const translatedText = applied.text.charAt(0).toUpperCase() + applied.text.slice(1);
    const embed = new EmbedBuilder()
      .setColor(0x8711ca)
      .setDescription("**__Eerie Translator__ 🔍**")
      .addFields(
        { name: "Old Text 🔁", value: `\`\`\`${text}\`\`\`` },
        { name: "Translated Text 🔁", value: `\`\`\`${translatedText}\`\`\`` },
      )
      .setImage(
        "https://media.discordapp.net/attachments/969481658451517440/987308833393233920/rainbow_line.gif"
      )
      .setThumbnail(
        "https://media.discordapp.net/attachments/969481658451517440/991250292966441000/unknown.png?width=643&height=644"
      )
      .setTimestamp()
      .setFooter({
        text: "Eerie Translator",
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    interaction.editReply({ content: "", embeds: [embed] });
  },
};
