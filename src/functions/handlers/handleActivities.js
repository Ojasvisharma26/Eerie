const { ActivityType } = require('discord.js');

module.exports = (client) => {
  client.pickPresence = async () => {
    client.user.setPresence({
      activities: [
        {
          name: "PROClient | PRO",
          type: ActivityType.Streaming,
          url: "https://www.twitch.tv/directory/game/Pok%C3%A9mon%20Revolution%20Online",
        },
      ],
      status: 'dnd',
    });
  };
};
