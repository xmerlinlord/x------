const { channels, groups } = require("../config/gateway");

async function isMember(bot, userId, username) {
  try {
    const member = await bot.telegram.getChatMember(username, userId);

    return ["creator", "administrator", "member"].includes(member.status);
  } catch (error) {
    console.error(`Gateway check failed for ${username}:`, error.message);
    return false;
  }
}

async function checkGateway(bot, userId) {
  const communities = [...channels, ...groups];

  for (const community of communities) {
    const joined = await isMember(bot, userId, community.username);

    if (!joined) {
      return {
        passed: false,
        missing: community
      };
    }
  }

  return {
    passed: true,
    missing: null
  };
}

module.exports = {
  checkGateway
};
