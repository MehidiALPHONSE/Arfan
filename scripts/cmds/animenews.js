const Scraper = require('mal-scraper');
const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "Animeinfo",
    version: "1.0",
    author: "Arfan",
    countDown: 30,
    role: 0,
    shortDescription: "Get information about an anime",
    longDescription: "Get information about an anime from MyAnimeList",
    category: "info",
    guide: {
      en: "{pn} Animeinfo anime name>"
    }
  },


  onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang  }) {

            const { getPrefix } = global.utils;
       const p = getPrefix(event.threadID);   

    const animeName = args.join(" ");

    if (!animeName) {
      return message.reply("Please provid an anime name.");
    }

    try {
      const Anime = await Scraper.getInfoFromName(animeName); 
      if (!Anime) {
        return message.reply("No anime found with that name.");
      }

      const imageStream = await axios.get(Anime.picture, { responseType: 'stream' });
      const imagePath = `${__dirname}/tmp/${Anime.title.replace(/\s/g, "_")}.png`; 
      const imageWriter = fs.createWriteStream(imagePath); 
      imageStream.data.pipe(imageWriter); 

      imageWriter.on('finish', () => { 
        const messageBody =
          `----📝ANIME NAME📝----\n` +
          `English: ${Anime.title}\n` +
          `Japanese: ${Anime.japaneseTitle}\n` +
          `Studios: ${Anime.studios.join(", ")}\n\n` +
          `---📌ANIME TYPE📌---\n` +
          `Genres: ${Anime.genres.join(", ")}\n` +
          `Popularity: ${Anime.popularity}\n` +
          `MAL Score: ${Anime.score}\n\n` +
          `---🗓️RELEASE INFO🗓️---\n` +
          `Type: ${Anime.type}\n` +
          `Episodes: ${Anime.episodes}\n` +
          `Status: ${Anime.status}\n` +
          `Aired: ${Anime.aired}\n` +
          `Premiered: ${Anime.premiered}\n` +
          `Broadcast: ${Anime.broadcast}\n` +
          `Duration: ${Anime.duration}\n` +
          `Rating: ${Anime.rating}\n\n` +
          `-----🔗OTHER🔗-----\n` +
          `Producer: ${Anime.producers.join(", ")}\n` +
          `Anime synopsis: ${Anime.synopsis}\n\n` +
          `Link: https://myanimelist.net/anime/${Anime.id}`;
        message.reply({
          body: messageBody,
          attachment: fs.createReadStream(imagePath)
        }, () => fs.unlinkSync(imagePath)); 
      });
    } catch (err) {
      console.error(err);
      message.reply("An error plz try again ");
    }
  }
};
