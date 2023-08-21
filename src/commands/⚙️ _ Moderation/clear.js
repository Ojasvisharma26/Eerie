const { Client, SlashCommandBuilder, CommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  developer: false,
  category: "util",
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear messages")
    .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to be Deleted').setMinValue(1).setMaxValue(100).setRequired(true)),

  async execute(interaction, client) {
    const hasManageMessagesPermission = interaction.member.permissions.has('MANAGE_MESSAGES');

    if (!hasManageMessagesPermission) {
      return interaction.reply({ content: 'You do not have permissions to delete messages!', ephemeral: true });
    }

    let number = interaction.options.getInteger('amount').valueOf();

    const channel = interaction.channel;
    const messagesToDelete = await channel.messages.fetch({ limit: number });
    await channel.bulkDelete(messagesToDelete, true); // Set second argument to true to delete messages older than 14 days

    const successEmbed = new EmbedBuilder()
      .setColor('#8711ca')
      .setDescription(`✅ Deleted ${messagesToDelete.size} messages.`);

    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('clear')
          .setEmoji('🗑')
          .setStyle(ButtonStyle.Primary)
      );

    const reply = await interaction.reply({ content: '', embeds: [successEmbed], components: [button] });

    const collector = reply.createMessageComponentCollector();

    collector.on("collect", async i => {
      if (i.customId === 'clear' && hasManageMessagesPermission) {
        interaction.deleteReply();
      }
    });
  }
};
