module.exports = {
  data: {
    name: "select"
  },
  async execute(interaction, client) {
    return interaction.reply({
      content: 'it replies '
    })
  }
}