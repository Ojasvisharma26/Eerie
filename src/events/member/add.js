const { EmbedBuilder, GuildMember, Client } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  /**
   * 
   * @param {GuildMember} member 
   * @param {Client} client 
   */
  async execute(member, client) {
    const message = `${member.user.username} left server: ${member.guild.name}`;
    const memCount = member.guild.members.cache.filter((m) => m.user.bot === false).size;
    const goodbyeChannel = member.guild.channels.cache.find((ch) =>
      ch.name.includes("leave")
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${member.user.tag}`,
        iconURL: `${member.user.displayAvatarURL({ dynamic: true })}`,
      })
      .setDescription(message)
      .setTitle(`Member Count: ${memCount}`)
      .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
      .setFooter({ text: `${client.user.username}` })
      .setTimestamp();

    if (goodbyeChannel) {
      goodbyeChannel.send({ embeds: [embed] });
    } else {
      console.log('No channel found that includes "leave" in the name');
    }
  },
};
