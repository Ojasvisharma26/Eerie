const { Guild, EmbedBuilder, Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
category: "util",
data: new SlashCommandBuilder()
.setName('serverinfo')
.setDescription("Shows Server's Info!"),
/**
*

@param {SlashCommandBuilder} interaction
@param {Client} client
*/
async execute(interaction, client) {
const guild = interaction.guild;
if (!guild) return; // check if the guild object is defined
const ownerTag = guild.members.cache.get(guild.ownerId).user.tag;
const userCount = guild.members.cache.filter(m => !m.user.bot).size;
const botCount = guild.members.cache.filter(m => m.user.bot).size; 
const roleCount = guild.roles.cache.size;
const embed = new EmbedBuilder()
  .setTitle(guild.name + " Information!")
  .setColor(0x8711ca)
  .addFields(
    {
      name: "Name",
      value: `${guild.name}`,
      inline: true
    },
    {
      name: "ID",
      value: `${guild.id}`,
      inline: true
    },
    {
      name: "Booster Level",
      value: `${guild.premiumTier}`,
      inline: false
    },
    {
      name: "Owner",
      value: `${ownerTag}`,
      inline: true
    },
    {
      name: "Roles Count",
      value: `${roleCount}`,
      inline: true
    },
    {
      name: "Members Count",
      value: `${userCount}`,
      inline: true
    }, 
    {
      name: "Bot Count",
      value: `${botCount}`,
      inline: true
    },
    {
      name: "Server Created At",
      value: `${guild.createdAt.toDateString()}`,
      inline: true
    }
  )
  .setThumbnail(guild.iconURL({ dynamic: true }))
  .setFooter(
    {
      text: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL({ dynamic: true })
    }
  )
  .setTimestamp()
if (guild.banner) created.setImage(guild.bannerURL({ dynamic: true }));
  interaction.reply({
  embeds: [embed]
});
},
};