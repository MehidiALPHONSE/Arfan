  module.exports = {
  config: {
    name: "avatar2",
    version: "1.0",
    author: "Samir Œ",
    shortDescription: "Get avatar image",
    longDescription: "Fetches and sends the avatar image for the specified user.",
    category: "Utility",
    guide: {
      en: "{pn} [name | id | subname]"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      let [name, id, subname] = args.join(" ").split("|").map(item => item.trim());

      if (!name) {
        api.sendMessage({ body: "Please provide a name." }, event.threadID);
        return;
      }

      if (!id) {
        api.sendMessage({ body: "Please provide an ID." }, event.threadID);
        return;
      }

      let apiUrl = `https://apis-samir.onrender.com/avatar?name=${encodeURIComponent(name)}&id=${id}`;
      if (subname) {
        apiUrl += `&subname=${encodeURIComponent(subname)}`;
      }

      const streamUrl = await global.utils.getStreamFromURL(apiUrl);

      if (streamUrl) {
        api.sendMessage({
          body: `Avatar for ${name}`,
          attachment: streamUrl
        }, event.threadID);
      } else {
        api.sendMessage({ body: "Failed to fetch avatar." }, event.threadID);
      }
    } catch (error) {
      console.error("Error retrieving avatar:", error.message);
      api.sendMessage({ body: "Failed to retrieve avatar." }, event.threadID);
    }
  }
};
