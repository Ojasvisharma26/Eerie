module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {import('discord.js').StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error('Select menu not found');

      try {
        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'An error occured while executing this command.',
          ephemeral: true,
        });
      }
    }
  }
}