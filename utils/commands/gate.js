const { Markup } = require("telegraf");
const { checkGateway } = require("../utils/gatewayCheck");
const { channels, groups } = require("../config/gateway");

module.exports = (bot) => {
  bot.start(async (ctx) => {
    const userId = ctx.from.id;

    const result = await checkGateway(bot, userId);

    if (result.passed) {
      return ctx.reply(
        `👑 Wᴇʟᴄᴏᴍᴇ ᴛᴏ Mᴇʀʟɪɴ Lᴏʀᴅ MD!\n\n` +
        `✅ Gᴀᴛᴇᴡᴀʏ ᴠᴇʀɪғɪᴇᴅ.\n\n` +
        `🚀 Yᴏᴜ ᴄᴀɴ ɴᴏᴡ ᴜsᴇ ᴛʜᴇ ʙᴏᴛ.`
      );
    }

    const buttons = [];

    for (const community of [...channels, ...groups]) {
      buttons.push([
        Markup.button.url(
          `➕ Jᴏɪɴ ${community.name}`,
          community.link
        )
      ]);
    }

    buttons.push([
      Markup.button.callback("✅ Vᴇʀɪғʏ Jᴏɪɴ", "verify_gateway")
    ]);

    return ctx.reply(
      `🔐 Mᴇʀʟɪɴ Lᴏʀᴅ MD Gᴀᴛᴇᴡᴀʏ\n\n` +
      `⚠️ Yᴏᴜ ᴍᴜsᴛ ᴊᴏɪɴ ᴀʟʟ ʀᴇǫᴜɪʀᴇᴅ ᴄᴏᴍᴍᴜɴɪᴛɪᴇs ʙᴇғᴏʀᴇ ᴜsɪɴɢ ᴛʜᴇ ʙᴏᴛ.\n\n` +
      `👇 Jᴏɪɴ ᴛʜᴇᴍ ᴛʜᴇɴ ᴛᴀᴘ Vᴇʀɪғʏ.`,
      Markup.inlineKeyboard(buttons)
    );
  });

  bot.action("verify_gateway", async (ctx) => {
    const userId = ctx.from.id;
    const result = await checkGateway(bot, userId);

    if (result.passed) {
      await ctx.answerCbQuery("✅ Gᴀᴛᴇᴡᴀʏ ᴘᴀssᴇᴅ!");
      return ctx.editMessageText(
        `👑 Mᴇʀʟɪɴ Lᴏʀᴅ MD\n\n` +
        `✅ Gᴀᴛᴇᴡᴀʏ ᴠᴇʀɪғɪᴇᴅ!\n` +
        `🚀 Aᴄᴄᴇss ɢʀᴀɴᴛᴇᴅ.`
      );
    }

    await ctx.answerCbQuery(
      `❌ Yᴏᴜ ʜᴀᴠᴇ ɴᴏᴛ ᴊᴏɪɴᴇᴅ ᴀʟʟ ᴄᴏᴍᴍᴜɴɪᴛɪᴇs.`,
      { show_alert: true }
    );
  });
};
