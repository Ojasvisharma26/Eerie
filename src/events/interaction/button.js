const { Client, ButtonInteraction, Collection } = require("discord.js");
const data = {};

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let i0 = 0;
    let i1 = 10;
    let page = 1;
    const { buttons, componentCooldowns } = client;
    if (interaction.isButton()) {
      const button = buttons.get(interaction.customId);
      //console.log(button)
      if (!button) return new Error('There is no code for this button!')
      if (interaction.customId === '✖') {
        if (interaction.message.deletable)
          return interaction.message.delete()
      };
      if (interaction.customId === '👈') {
        i0 = i0 - 10;
        i1 = i1 - 10;
        page = page - 1;

        // if there is no guild to display, delete the message
        if (i0 + 1 < 0) {
          console.log(i0)
          if (interaction.message.deletable)
            return interaction.message.delete();
        }
        if (!i0 || !i1) {
          if (interaction.message.deletable)
            return interaction.message.delete();
        }

        description =
          `Total Servers - ${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map(r => r)
            .map(
              (r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`)
            .slice(i0, i1)
            .join("\n\n");

        // Update the embed with new informations
        embed
          .setFooter(
            `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
          )
          .setDescription(description);

        // Edit the message
        message.edit(embed);
      }
      try {
        if (!componentCooldowns.buttons.has(button.data.name)) {
          componentCooldowns.buttons.set(button.data.name, new Collection());
        }
        const now = Date.now();
        const timestamps = componentCooldowns.buttons.get(button.data.name);
        const cooldownAmount = (button.cooldown || 10) * 1000; //default of 10 seconds

        if (timestamps.has(interaction.user.id)) {
          if (client.utils.checkOwner(interaction.user.id))
            return button.execute(interaction, client);
          else {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;
              const message = `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${button.data.name}\` button.`
              return interaction.reply(
                {
                  embeds: [
                    {
                      title: `Button: \`${button.data.name}\` is on cooldown!`,
                      description: `\\📛 **Error:** \\📛\n ${message}`,
                      color: 0xfc0303,
                    }
                  ],
                  ephemeral: true
                }
              )
            }
          }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        await button.execute(interaction, client);
      } catch (error) {
        console.log(error);
      }
    }
  }
}