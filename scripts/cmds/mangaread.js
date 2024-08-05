const axios = require('axios');

module.exports = {
        config: {
                name: "manhwa",
                aliases: ["manga"],
                version: "1.0",
                author: "marrcus",
                countDown: 5,
                role: 0,
                shortDescription: "get manga data",
                longDescription: "search and get manga infos",
                category: "anime",
                guide: "{pn} <anime name>"
        },

  onStart: async function ({ message, args, api }) {
    const name = args.join(" ");
    if (!name)
      return message.reply(`⚠ | Please enter character name!`);
    else {
      try {
        const searchingMessage = await message.reply('🔎 | Searching for manga please wait');

        const BASE_URL = `https://api.safone.dev/anime/manga?query=${name}`;
        let res = await axios.get(BASE_URL)
        let res2 = res.data

                                let titl = res2.title.english + " " + res2.title.native
                                let statu = res2.status
                                let startDat = res2.startDate.day + "/" + res2.startDate.month + "/" + res2.startDate.year
                                let endDat = res2.endDate.day + "/" + res2.endDate.month + "/" + res2.endDate.year
                                let genre = res2.genres
                                let score = res2.averageScore
                                let desc = res2.description
                                let typ = res2.type
                                let img = res2.imageUrl


                                const form = {
          body: 
           `\n\n╭「Title」: ${titl}`
            + `\n│❏Status: ${statu}`
            + `\n│❏Types: ${typ}`
            + `\n│❏Rank: ${score}`
            + `\n│❏Started: ${startDat}`
            + `\n│❏Ended: ${endDat}`
            + `\n│❏Genres: \n│${genre}`
            + `\n╰———————————`
            + `\n\n❏Description: ${desc}`

                                };
                                if (img)
                                        form.attachment = await global.utils.getStreamFromURL(img);
                                message.reply(form);

                if (searchingMessage.messageID) {
          api.unsendMessage(searchingMessage.messageID);
        }
                        } catch (e) { message.reply(`Not Found`) }

                }
        }
};
