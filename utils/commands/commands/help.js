module.exports = (bot) => {
  bot.command("help", (ctx) => {
    ctx.reply(
      `👑 MERLIN LORD MD\n\n` +
      `📚 Cᴏᴍᴍᴀɴᴅs\n\n` +
      `▶️ /start - Start the bot\n` +
      `❓ /help - Show help\n\n` +
      `🔐 Gᴀᴛᴇᴡᴀʏ verification is required.`
    );
  });
};
