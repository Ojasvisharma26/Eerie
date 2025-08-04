const { SlashCommandBuilder } = require("discord.js");
const Pagination = require("../../components/buttons/pagination.js");
const { scrapeLadderData } = require("../../JSON/scraper.js");

module.exports = {
    category: "PROClient",
    developer: false,
    data: new SlashCommandBuilder()
        .setName("ladder")
        .setDescription("Get current Top 10 players from PRO Silver & Gold server ladder")
        .setDMPermission(false),

    async execute(interaction, client) {
        await interaction.reply("🔍 Fetching ladder data, please wait...");

        try {
            const result = await scrapeLadderData();
            const silverLadder = result?.data?.silver?.rankedLadder?.slice(0, 10);
            const goldLadder = result?.data?.gold?.rankedLadder?.slice(0, 10);

            if (!silverLadder && !goldLadder) {
                return interaction.editReply({
                    embeds: [{
                        title: "Error",
                        description: `Ladder data couldn't be retrieved at the moment.`,
                        color: 0xFF0000
                    }]
                });
            }

            const embeds = this.buildLadderEmbeds(silverLadder, goldLadder);
            await interaction.editReply({
                content: "🏆 Here's the latest ladder data:",
                embeds
            });
            new Pagination(interaction, embeds).send();

        } catch (error) {
            console.error("Error fetching ladder data:", error);
            await interaction.editReply({
                embeds: [{
                    title: "❌ Error",
                    description: `Something went wrong while fetching ladder data.`,
                    color: 0xFF0000
                }]
            });
        }
    },

    buildLadderEmbeds(silverData, goldData) {
        const chunkedEmbeds = [];

        if (silverData?.length) {
            const silverEmbed = {
                title: "🥈 Silver Server - Top 10 Players",
                description: silverData.map((player, index) => {
                    const { username, PVP, guild, lastLocation } = player;
                    return `**#${index + 1} ${username}**\n> Guild: \`${guild?.name || 'None'}\`\n> RR: \`${PVP.rankedRating}\`\n> Wins: \`${PVP.rankedWins}\` | Losses: \`${PVP.rankedLosses}\`\n> Location: \`${lastLocation?.countryLong || 'Unknown'}\`\n`;
                }).join("\n"),
                color: 0xFFD700,
                thumbnail: {
                    url: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png" // silver medal emoji
                }
            };
            chunkedEmbeds.push(silverEmbed);
        }

        if (goldData?.length) {
            const goldEmbed = {
                title: "🥇 Gold Server - Top 10 Players",
                description: goldData.map((player, index) => {
                    const { username, PVP, guild, lastLocation } = player;
                    return `**#${index + 1} ${username}**\n> Guild: \`${guild?.name || 'None'}\`\n> RR: \`${PVP.rankedRating}\`\n> Wins: \`${PVP.rankedWins}\` | Losses: \`${PVP.rankedLosses}\`\n> Location: \`${lastLocation?.countryLong || 'Unknown'}\`\n`;
                }).join("\n"),
                color: 0xFFD700,
                thumbnail: {
                    url: "https://cdn-icons-png.flaticon.com/512/2583/2583174.png" // gold medal emoji
                }
            };
            chunkedEmbeds.push(goldEmbed);
        }

        return chunkedEmbeds;
    }
};
