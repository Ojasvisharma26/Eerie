const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");
const Pagination = require('../../components/buttons/pagination.js');

module.exports = {
  dbRequired: true,
  owner: true,
  developer: true,
  data: new SlashCommandBuilder()
    .setName("servers")
    .setDescription("List of servers the bot is in.")
    .addStringOption((options) =>
      options
        .setName("serverid")
        .setDescription("Get info about a specific server by id.")
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    let gid = interaction.options.getString("serverid");
    let Guild = client.guilds.cache.get(gid);

    if (Guild) {
      const name = Guild.name;
      const ID = Guild.id;
      const ownerTag = Guild.members.cache.get(Guild.ownerId).user.tag;
      const ownerID = Guild.ownerId;
      const mCount = Guild.members.cache.filter(
        (m) => m.user.bot === false
      ).size;
      const bCount = Guild.members.cache.filter(
        (m) => m.user.bot === true
      ).size;
      const date = `<t:${Math.floor(Guild.createdAt / 1000) + 3600}:D>`;
      let comOp;
      if (Guild.features.includes("COMMUNITY")) {
        comOp = true;
      } else comOp = false;

      const info = new EmbedBuilder({
        title: name,
        thumbnail: {
          url: Guild.iconURL({ dynamic: true })
        },
        fields: [
          { name: `Guild ID`, value: `${ID}`, inline: true },
          { name: `Community?`, value: `${comOp}`, inline: true },
          { name: `Guild Created:`, value: `${date}`, inline: true },
          { name: `Guild Owner`, value: `${ownerTag}`, inline: true },
          { name: `Guild Owner ID`, value: `${ownerID}`, inline: true },
          { name: `\u200b`, value: `\u200b`, inline: true },
          { name: `Member Count`, value: `${mCount}`, inline: true },
          { name: `Bot Count`, value: `${bCount}`, inline: true },
          { name: `\u200b`, value: `\u200b`, inline: true }
        ],
        footer: {
          text: client.user.username,
          iconURL: client.user.avatarURL({ dynamic: true }),
        }
      });
      if (Guild.banner) info.setImage(Guild.bannerURL({ dynamic: true }));
      return await interaction.reply({ embeds: [info], ephemeral: false });
    } else {
      const maxServersPerPage = 10;
      let counter = 1;
      const serverList = client.guilds.cache.map(guild => {
        const result = `${counter}. **\`${guild.name}\`** (${guild.id})`;
        counter++;
        return result;
      });

      const embeds = [];
      for (let i = 0; i < serverList.length; i += maxServersPerPage) {
        const chunk = serverList.slice(i, i + maxServersPerPage);
        embeds.push({
          title: "__List of Servers!__ 🏠",
          color: 0x8711ca,
          description: `***__Total Servers:__*** ${client.guilds.cache.size.toLocaleString()}` + `\n` + chunk.join("\n"),
          thumbnail: {
            url: `https://media.discordapp.net/attachments/969481658451517440/1073490820994445342/icon_move_btn_type_19.png`
          }
        });
      }

      if (embeds.length === 0) {
        return await interaction.reply({ content: "No servers found!", ephemeral: true });
      } else {
        await interaction.reply({ content: 'Here is your request', embeds: [embeds[0]] });
        if (embeds.length > 1) {
          new Pagination(interaction, embeds).send();
        }
      }
    }
  },
};
