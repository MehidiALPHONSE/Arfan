const axios = require('axios');

module.exports = {
  config: {
    name: "anilist",
    aliases: ["al"],
    author: "Samir Œ",
    version: "1.0",
    countDown: 80,
    role: 0,
    shortDescription: "Fetches anime and manga stats from AniList",
    longDescription: "Fetches anime and manga stats from AniList for a given user",
    category: "Anime & Manga",
    guide: {
      en: "/anilist [username]\nFetches anime and manga stats from AniList for the specified username"
    }
  },

  langs: {
    en: {
      loading: "Fetching AniList data, please wait...",
      error: "An error occurred while fetching AniList data. Please try again later."
    }
  },

  onStart: async function ({ event, message, getLang, threadsData, api, args }) {
    const { threadID } = event;

    const username = args[0];
    if (!username) {
      return message.reply(`Please provide a username.`);
    } else {
      try {
        let msgSend = message.reply(getLang("loading"));
        const url = `https://samirxpikachu.onrender.com/anilist/user/${username}`;
        const response = await axios.get(url);
        const data = response.data;

        const recentActivity = data.recentActivity.map(activity => {
          const title = activity.media.title.english || activity.media.title.romaji || activity.media.title.native;
          const status = activity.status.replace('read chapter', 'read chapter').replace('watched episode', 'watched episode').replace('plans to watch', 'plans to watch');
          const progress = activity.progress;
          return `${status} "${title}" (${progress})`;
        }).join('\n\n');

        const animeStats = data.stats.anime;
        const mangaStats = data.stats.manga;

        const statsOutput = `
Recent Activity:
${recentActivity}

Stats:
Anime Stats:
- Count: ${animeStats.count}
- Mean Score: ${animeStats.meanScore}
- Minutes Watched: ${animeStats.minutesWatched}

Manga Stats:
- Count: ${mangaStats.count}
- Mean Score: ${mangaStats.meanScore}
- Chapters Read: ${mangaStats.chaptersRead}
`;

        await message.unsend((await msgSend).messageID);
        message.reply({
          body: statsOutput,
          attachment: await global.utils.getStreamFromURL(`https://samirxpikachu.onrender.com/view/${username}`)
        });
      } catch (error) {
        console.error('Error fetching AniList data:', error);
        return message.reply(getLang("error"));
      }
    }
  }
};