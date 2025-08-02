const {
  SlashCommandBuilder
} = require('discord.js');
const bossData = require("../../JSON/bosses.json");

module.exports = {
  category: "PROClient",
  developer: false,
  data: new SlashCommandBuilder()
    .setName("bosses")
    .setDescription("Returns Information About Pokemon Bosses!")
    .addStringOption((option) =>
      option
        .setName("kanto")
        .setDescription("Select a Boss from Kanto Region")
        .addChoices({
          name: "Brock",
          value: "Brock"
        }, {
          name: "Chuck",
          value: "Chuck"
        }, {
          name: "Cie",
          value: "Cie"
        }, {
          name: "Erika",
          value: "Erika"
        }, {
          name: "George",
          value: "George"
        }, {
          name: "Guardian (Entei)",
          value: "Guardian Entei"
        }, {
          name: "Jessie & James",
          value: "Jessie & James"
        }, {
          name: "Klohver",
          value: "Klohver"
        }, {
          name: "Koichi",
          value: "Koichi"
        }, {
          name: "Naero",
          value: "Naero"
        }, {
          name: "Officer Jenny",
          value: "Officer Jenny"
        }, {
          name: "Officer Shamac",
          value: "Officer Shamac"
        }, {
          name: "PreHax",
          value: "PreHax"
        }, {
          name: "Shary & Shaui",
          value: "Shary & Shaui"
        }, {
          name: "The Pumkin King",
          value: "The Pumpkin King"
        }, {
          name: "Youngster Joey",
          value: "Youngster Joey"
        })
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("johto")
        .setDescription("Select a Boss from Johto Region")
        .addChoices({
          name: "BattleBot",
          value: "BattleBot"
        }, {
          name: "Red",
          value: "Red"
        }, {
          name: "Bruno",
          value: "Bruno"
        }, {
          name: "Bugsy",
          value: "Bugsy"
        }, {
          name: "Professor Elm",
          value: "Professor Elm"
        }, {
          name: "Lance - Dragons Den B1F",
          value: "Lance - Dragons Den B1F"
        }, {
          name: "Lance - Dragons Shrine",
          value: "Lance - Dragons Shrine"
        }, {
          name: "Lorelei",
          value: "Lorelei"
        }, {
          name: "Misty",
          value: "Misty"
        }, {
          name: "Neroli",
          value: "Neroli"
        }, {
          name: "Gamers Pewdie & Diepy",
          value: "Gamers Pewdie & Diepy"
        }, {
          name: "Sage",
          value: "Sage"
        }, {
          name: "Guardian Suicune",
          value: "Guardian Suicune"
        }, {
          name: "Thor",
          value: "Thor"
        })
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("hoenn")
        .setDescription("Select a Boss from Hoenn Region")
        .addChoices({
          name: "Naruto Fanboy",
          value: "Naruto Fanboy"
        }, {
          name: "Professor Birch",
          value: "Professor Birch"
        }, {
          name: "Gingery Jones",
          value: "Gingery Jones"
        }, {
          name: "Lt. Surge",
          value: "Lt. Sure"
        }, {
          name: "Maxie",
          value: "Maxie"
        }, {
          name: "Archie",
          value: "Archie"
        }, {
          name: "Morty",
          value: "Morty"
        }, {
          name: "Guardian Raikou",
          value: "Guardian Raikou"
        }, {
          name: "Steven",
          value: "Steven"
        }, {
          name: "Toothless",
          value: "Toothless"
        }, {
          name: "Tigerous",
          value: "Tigerous"
        })
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("sinnoh")
        .setDescription("Select a Boss from Sinnoh Region")
        .addChoices({
          name: "Medusa & Eldir",
          value: "Medusa & Eldir"
        }, {
          name: "Ash Westbrook",
          value: "Ash Westbrook"
        }, {
          name: "Letrix",
          value: "Letrix"
        }, {
          name: "Link",
          value: "Link"
        }, {
          name: "Maribela",
          value: "Maribela"
        }, {
          name: "Professor Rowan",
          value: "Professor Rowan"
        }, {
          name: "Saphirr",
          value: "Saphirr"
        }, {
          name: "Spectify",
          value: "Spectufy"
        }, {
          name: "Logan",
          value: "Logan"
        }, {
          name: "MehCanMet",
          value: "MehCanMet"
        })
        .setRequired(false)
    ),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @returns
   */
  async execute(interaction, client) {
    const regionKanto = interaction.options.getString("kanto");
    const regionJohto = interaction.options.getString("johto");
    const regionHoenn = interaction.options.getString("hoenn");
    const regionSinnoh = interaction.options.getString("sinnoh");

    let bossName;
    let bossEntry;

    if (regionKanto) {
      bossName = regionKanto;
      bossEntry = bossData.Kanto[bossName];
    } else if (regionJohto) {
      bossName = regionJohto;
      bossEntry = bossData.Johto[bossName];
    } else if (regionHoenn) {
      bossName = regionHoenn;
      bossEntry = bossData.Hoenn[bossName];
    } else if (regionSinnoh) {
      bossName = regionSinnoh;
      bossEntry = bossData.Sinnoh[bossName];
    }

    if (!bossName) {
      return interaction.reply("You didn't select any boss.");
    }

    if (!bossEntry) {
      return interaction.reply("Invalid Pokémon boss provided.");
    }

    let embedData = [{
      name: "Location 🗺",
      value: bossEntry.Location,
      inline: true
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: true
    },
    {
      name: "Cooldown ⏰",
      value: bossEntry.Cooldown,
      inline: true
    },
    {
      name: "Region :triangular_flag_on_post:",
      value: bossEntry.Region,
      inline: true
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: true
    },
    {
      name: "Requirements <:requirement:1135275186820759582>",
      value: Array.isArray(bossEntry.Requirements) ? bossEntry.Requirements.join("\n") : bossEntry.Requirements,
      inline: true
    },
    ];

    if (bossName === "Jessie & James") {
      embedData.push({
        name: "Jessie <:easy:1135271554830315551> ",
        value: bossEntry["Jessie"].join("\n"),
        inline: true
      }, {
        name: "\u200b",
        value: "\u200b",
        inline: true
      }, {
        name: "James <:easy:1135271554830315551> ",
        value: bossEntry["James"].join("\n"),
        inline: true
      });
    } else if (bossName === "Youngster Joey") {
      embedData.push({
        name: "Lineup <:easy:1135271554830315551> ",
        value: bossEntry["Joey"].join("\n"),
        inline: true
      });
    } else if (bossName === "BattleBot") {
      embedData.push({
        name: "Lineup <:easy:1135271554830315551> ",
        value: bossEntry["Bot"].join("\n"),
        inline: true
      });
    } else if (bossName === "Red") {
      embedData.push({
        name: "Lineup <:easy:1135271554830315551> ",
        value: bossEntry["Red"].join("\n"),
        inline: true
      });
    } else if (bossName === "Lance - Dragons Den B1F") {
      embedData.push({
        name: "Lineup <:easy:1135271554830315551> ",
        value: bossEntry["Lance"].join("\n"),
        inline: true
      });
    } else if (bossName === "Maxie") {
      embedData.push({
        name: "Lineup <:easy:1135271554830315551> ",
        value: bossEntry["Maxie"].join("\n"),
        inline: true
      });
    } else if (bossName === "Archie") {
      embedData.push({
        name: "Lineup <:easy:1135271554830315551> ",
        value: bossEntry["Archie"].join("\n"),
        inline: true
      });
    } else if (bossName === "PreHax") {
      embedData.push({
        name: "Lineup <:easy:1135271554830315551> ",
        value: bossEntry["Munch"].join("\n"),
        inline: true
      });
    } else if (bossName === "The Pumpkin King") {
      embedData.push({
        name: "Lineup <:easy:1135271554830315551> ",
        value: bossEntry["King"].join("\n"),
        inline: true
      });
    } else if (bossName === "Medusa & Eldir") {
      // Field before "Easy, Medium, Hard" for Medusa
      embedData.push({
        name: "\u200b",
        value: "--------",
        inline: true
      }, {
        name: "\u200b",
        value: "***__MEDUSA__***",
        inline: true
      }, {
        name: "\u200b",
        value: "--------",
        inline: true
      });

      embedData.push({
        name: "Easy <:easy:1135271554830315551>",
        value: bossEntry.Team1.join("\n"),
        inline: true
      });

      if (bossEntry.Team2) {
        embedData.push({
          name: "Medium <:medium:1135271561688010924>",
          value: bossEntry.Team2.join("\n"),
          inline: true
        });
      }

      if (bossEntry.Team3) {
        embedData.push({
          name: "Hard <:hard:1135271570542186636>",
          value: bossEntry.Team3.join("\n"),
          inline: true
        });
      }
      embedData.push(
        {
          name: "\u200b",
          value: "--------",
          inline: true
        }, {
        name: "\u200b",
        value: "ㅤ***__ELDIR__***",
        inline: true
      }, {
        name: "\u200b",
        value: "--------",
        inline: true
      });

      if (bossEntry.TeamE1) {
        embedData.push({
          name: "Easy <:easy:1135271554830315551>",
          value: bossEntry.TeamE1.join("\n"),
          inline: true
        });
      }

      if (bossEntry.TeamE2) {
        embedData.push({
          name: "Medium <:medium:1135271561688010924> ",
          value: bossEntry.TeamE2.join("\n"),
          inline: true
        });
      }

      if (bossEntry.TeamE3) {
        embedData.push({
          name: "Hard <:hard:1135271570542186636>",
          value: bossEntry.TeamE3.join("\n"),
          inline: true
        });
      }
    } else if (bossName === "Shary & Shaui") {
      // Field before "Easy, Medium, Hard" for Shary
      embedData.push({
        name: "\u200b",
        value: "--------",
        inline: true
      }, {
        name: "\u200b",
        value: "ㅤ***__SHARY__***",
        inline: true
      }, {
        name: "\u200b",
        value: "--------",
        inline: true
      });

      if (bossEntry.Team1) {
        embedData.push({
          name: "Easy <:easy:1135271554830315551>",
          value: bossEntry.Team1.join("\n"),
          inline: true
        });
      }

      if (bossEntry.Team2) {
        embedData.push({
          name: "Medium <:medium:1135271561688010924>",
          value: bossEntry.Team2.join("\n"),
          inline: true
        });
      }

      if (bossEntry.Team3) {
        embedData.push({
          name: "Hard <:hard:1135271570542186636>",
          value: bossEntry.Team3.join("\n"),
          inline: true
        });
      }

      if (bossName === "Shary & Shaui") {
        embedData.push({
          name: "\u200b",
          value: "--------",
          inline: true
        }, {
          name: "\u200b",
          value: "ㅤ***__SHAUI__***",
          inline: true
        }, {
          name: "\u200b",
          value: "--------",
          inline: true
        });

        if (bossEntry.TeamS1) {
          embedData.push({
            name: "Easy <:easy:1135271554830315551>",
            value: bossEntry.TeamS1.join("\n"),
            inline: true
          });
        }

        if (bossEntry.TeamS2) {
          embedData.push({
            name: "Medium <:medium:1135271561688010924>",
            value: bossEntry.TeamS2.join("\n"),
            inline: true
          });
        }

        if (bossEntry.TeamS3) {
          embedData.push({
            name: "Hard <:hard:1135271570542186636>",
            value: bossEntry.TeamS3.join("\n"),
            inline: true
          });
        }
        // Don't show fields for Shaui here, only for Shary.
      }
    } else {
      if (bossName === "Gamers Pewdie & Diepy") {
        // Field before "Easy, Medium, Hard" for Gamers Pewdie
        embedData.push({
          name: "\u200b",
          value: "--------",
          inline: true
        }, {
          name: "\u200b",
          value: "***__GAMER PEWDIE__***",
          inline: true
        }, {
          name: "\u200b",
          value: "--------",
          inline: true
        });

        if (bossEntry.Team1) {
          embedData.push({
            name: "Easy <:easy:1135271554830315551>",
            value: bossEntry.Team1.join("\n"),
            inline: true
          });
        }

        if (bossEntry.Team2) {
          embedData.push({
            name: "Medium <:medium:1135271561688010924>",
            value: bossEntry.Team2.join("\n"),
            inline: true
          });
        }

        if (bossEntry.Team3) {
          embedData.push({
            name: "Hard <:hard:1135271570542186636>",
            value: bossEntry.Team3.join("\n"),
            inline: true
          });
        }

        // Field before "Easy, Medium, Hard" for Gamers Diepy
        embedData.push({
          name: "\u200b",
          value: "--------",
          inline: true
        }, {
          name: "\u200b",
          value: "***__GAMER DIEPY__***",
          inline: true
        }, {
          name: "\u200b",
          value: "--------",
          inline: true
        });

        if (bossEntry.TeamG1) {
          embedData.push({
            name: "Easy <:easy:1135271554830315551>",
            value: bossEntry.TeamG1.join("\n"),
            inline: true
          });
        }

        if (bossEntry.TeamG2) {
          embedData.push({
            name: "Medium <:medium:1135271561688010924>",
            value: bossEntry.TeamG2.join("\n"),
            inline: true
          });
        }

        if (bossEntry.TeamG3) {
          embedData.push({
            name: "Hard <:hard:1135271570542186636>",
            value: bossEntry.TeamG3.join("\n"),
            inline: true
          });
        }
        // Don't show fields for Shary or Shaui here.
      }
    }

    if (!["Shary & Shaui", "Medusa & Eldir", "Gamers Pewdie & Diepy"].includes(bossName)) {
      if (bossEntry.Team1) {
        embedData.push({
          name: "Easy <:easy:1135271554830315551>",
          value: bossEntry.Team1.join("\n"),
          inline: true
        });
      }

      if (bossEntry.Team2) {
        embedData.push({
          name: "Medium <:medium:1135271561688010924>",
          value: bossEntry.Team2.join("\n"),
          inline: true
        });
      }

      if (bossEntry.Team3) {
        embedData.push({
          name: "Hard <:hard:1135271570542186636>",
          value: bossEntry.Team3.join("\n"),
          inline: true
        });
      }
    }

    embedData.push(
      {
        name: "Rewards 💷",
        value: bossEntry.Rewards,
        inline: false
      }, {
      name: "Third Rewards 🌟",
      value: bossEntry["Third Rewards"],
      inline: false
    }
    );

    let embedDescription = bossEntry.Description;

    if (bossEntry.Description2) {
      embedDescription += "\n\n" + bossEntry.Description2;
    }

    return interaction.reply({
      embeds: [{
        title: `__` + bossName + `__`,
        URL: bossEntry.URL,
        description: `*` + embedDescription + `\n~${bossName}` + `*`,
        fields: embedData,
        footer: {
          text: `|   ${bossName} by Eerie`,
          iconURL: "https://media.discordapp.net/attachments/969481658451517440/1243072167101595658/unknown.png?ex=665024ab&is=664ed32b&hm=9a231bbe5394097acb76eecf504689c6973d847e6602971239b095ab766a3eaa&=&format=webp&quality=lossless&width=416&height=437"
        },
        thumbnail: {
          url: bossEntry.Thumbnail
        },
        timestamp: new Date(),
        color: 0x8711ca,
      },],
    });
  },
};
