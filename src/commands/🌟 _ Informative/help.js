const {
  SlashCommandBuilder,
  EmbedBuilder,
  ComponentType,
} = require("discord.js");
const ms = require("ms");
const os = require("os");

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Returns help menu.")
    .setDMPermission(false),

  async execute(interaction, client) {
    try {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Eerie - A PRO Discord Bot",
          iconURL: "https://media.discordapp.net/attachments/969481658451517440/1078335623045337108/wALupHf2mcEgAAAABJRU5ErkJggg.png?width=616&height=616"
        })
        .setTitle("**Help Menu of __Eerie__** 😈")
        .setColor(0x8711ca)
        .setDescription(`
**✨ __[Dashboard](https://eerie.proclient.repl.co/)__ ✨**
* Please use \`Dropdown Menu\` to see commands!
> **4 Systems**, like **ROClient**, **Informative**, **Moderation**, and **Fun** System
> 🎮 Many **Time-Pass Games** and 🕹 **Fun Commands**
> :no_entry_sign: **Moderation** to clean your server chats
❓ __**How To Use Me?**__ 
> Use \`/\` and click on \`Bot's avatar\` on the \`left menu\` and see\n> the regularly **updated** \`commands\`
📈 __**STATS**__ 
> :gear: **Commands:** \`${client.commands.size}\`
> :file_folder: **Servers:** \`${client.guilds.cache.size.toLocaleString()}\`
> :bust_in_silhouette: **Users:** \`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\`
> :signal_strength: **Uptime:** \`${ms(os.uptime() * 1000, { long: true })}\`
🆘 **__Need Support__** 
\`1. Way\` Use the **Menu** to select all Help Pages, you want to view.
\`2. Way\` Join the **__[Support Server](https://discord.gg/FQBgk3xTcC)__** and ask your question there.
\`3. Way\` Ask your question in **__[Forums](https://pokemonrevolution.net/forum/topic/221020-eerie-a-discord-pro-bot/)__**
\`4. Way\` Use the \`/Suggest\` or \`/Report\` command inform the DEVs
        `)
        .setFooter({ text: `Requested by: ${interaction.user.username}  |  ${new Date().toLocaleDateString("en-US")}`, iconURL: interaction.user.displayAvatarURL() })
        .setThumbnail("https://media.discordapp.net/attachments/969481658451517440/1078335623045337108/wALupHf2mcEgAAAABJRU5ErkJggg.png?width=616&height=616")

      const components = [{
        type: 1,
        components: [{
          type: 3,
          custom_id: "help-menu",
          placeholder: "Eerie Commands 👿",
          options: [{
            label: "Fun",
            value: "🤡 | Fun",
            description: "Fun Commands",
            emoji: {
              name: "🤡"
            }
          }, {
            label: "Moderation",
            value: "⚙️ | Moderation",
            description: "Moderation Commands",
            emoji: {
              name: "⚙️"
            }
          }, {
            label: "Informative",
            value: "🌟 | Informative",
            description: "Informative Commands",
            emoji: {
              name: "🌟"
            }
          }, {
            label: "Pokemon Revolution Online",
            value: "🎮 | Pokemon Revolution Online",
            description: "Pokemon Revolution Online Commands",
            emoji: {
              name: `🎮`
            }
          }]
        }]
      }];

      await interaction.reply({
        embeds: [embed],
        components: components,
        fetchReply: true,
        ephemeral: false,
      });

      const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 60000 });

      collector.on("collect", async (interaction) => {
        if (interaction.customId === 'help-menu') {
          let selectedCategory = interaction.values[0];
          let description;

          if (selectedCategory === '🤡 | Fun') {
            description = `
* \`Together\`: Play games with friends using Discord Together!
            `;
          } else if (selectedCategory === '⚙️ | Moderation') {
            description = `
* \`Clear\`: Delete the messages from the server.
            `;
          } else if (selectedCategory === '🌟 | Informative') {
            description = `
* \`Avatar    \`: Shows the given user's Avatar.\n* \`Botinfo   \`: Shows Bot's Info!\n* \`Developer \`: Shows Bot's Developer Info!\n* \`Help      \`: Shows all the help commands!\n* \`Invite    \`: Shows Bot's Invite Info!\n* \`Links     \`: Shows Bot's Link Info!\n* \`Remindme  \`: Reminds You on Specific Reason.\n* \`Report    \`: Reports a bug to DEVs.\n* \`Serverinfo\`: Shows Server's Info!\n* \`Suggest   \`: Gives suggestion to DEVs.\n* \`Translate \`: Translate the Text.
            `;
          } else if (selectedCategory === '🎮 | Pokemon Revolution Online') {
            description = `
* \`Bosses    \`: Returns Information About Pokemon Bosses!\n* \`Pokedex   \`: Return the Pokédex information of a Pokémon!\n* \`Digspots  \`: Returns Information About All Digspots!\n* \`Evspots   \`: Returns Information About Evspots!\n* \`Excavation\`: Shows all the Excavation Site's Information!\n* \`Headbutt  \`: Check the Pokemon you can find using Headbutt!\n* \`Info      \`: Check the Information about Move, Item, Ability!\n* \`Item      \`: Returns Spawn Information About an Item!\n* \`Learnset  \`: Check the moves for the Pokemon!\n* \`Mostused  \`: Shows Most used pokemon in ranked pvp!\n* \`Poketime  \`: Check the current in-game time of PRO!\n* \`Poketype  \`: Returns Information About Pokemon Types!\n* \`PRO       \`: Gives Information about Pokemon Revolution Online!\n* \`Repel     \`: Check the Repel-Trick Information of Pokemon or Location!\n* \`Smogon    \`: Returns Smogon Stats of Pokemon!\n* \`Sapwn     \`: Returns Spawn Information About a Pokemon or a Location!
            `;
          } else {
            description = "No commands available for this category.";
          }

          const embed2 = new EmbedBuilder()
            .setColor(0x8711ca)
            .setDescription(description)
            .setTitle(`${interaction.values[0]} Commands:`)
            .setTimestamp()
            .setFooter({ text: "Help Menu", iconURL: "https://media.discordapp.net/attachments/969481658451517440/1078335623045337108/wALupHf2mcEgAAAABJRU5ErkJggg.png?width=616&height=616" });
          await interaction.update({ embeds: [embed2] });
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason !== 'time') {
          interaction.update({ components: components(true) });
        }
      });

    } catch (error) {
      console.log(error);
      interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
    }
  },
};