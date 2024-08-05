const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
	config: {
		name: "out",
		aliases: ["leave"],
		version: "1.0",
		author: "milan-says",
		countDown: 5,
		role: 0,
		shortDescription: "bot will leave  gc",
		longDescription: "",
		category: "admin",
		guide:  {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
  const permission = global.GoatBot.config.adminBot;
  if (!permission.includes(event.senderID))
  return api.sendMessage("Only admin has the Permisson To Use This Command!", event.threadID, event.messageID);
  var id;
  if (!args.join(" ")) {
    id = event.threadID;
  } else {
    id = parseInt(args.join(" "));
  }
  return api.sendMessage('Received command out of group from admin!', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};