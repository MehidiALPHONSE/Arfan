module.exports = {
  config: {
    name: "join",
    aliases: ['addme', 'joinme'],
    version: "1.0",
    author: "Samir B. Thakuri",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Add user to group by threadID",
    },
    longDescription: {
      en: "This command adds the user to the group where bot exist",
    },
    category: "owner",
    guide: {
      en: "{pn{ <threadID>.",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    const groupId = args[0];
    if (!groupId) {
      api.sendMessage("Please provide the threadID.", event.threadID);
      return;
    }
    const threadID = event.threadID;
    const userID = event.senderID;
    const threadInfo = await api.getThreadInfo(groupId);
    const participantIDs = threadInfo.participantIDs;
    if (participantIDs.includes(userID)) {
      api.sendMessage(
        "🤫|You are already in the group.",
        threadID
      );
    } else {
      api.addUserToGroup(userID, groupId, (err) => {
        if (err) {
          console.error("❌|Failed to add user to support group:", err);
          api.sendMessage("❌| Can't Add You To The Box Because Of Group Privacy.", threadID);
        } else {
          api.sendMessage(
            "✅| You have been added to this group. Check Message Request.",
            threadID
          );
        }
      });
    }
  },
};