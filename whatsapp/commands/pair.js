const { pairWhatsApp } = require("../whatsapp/pair");

module.exports = (bot) => {
  bot.command("pair", async (ctx) => {
    const args = ctx.message.text.split(/\s+/).slice(1);
    const number = args[0];

    if (!number) {
      return ctx.reply(
        "📱 WʜᴀᴛsAᴘᴘ Pᴀɪʀɪɴɢ\n\n" +
        "Uѕᴇ:\n" +
        "/pair 2348012345678\n\n" +
        "⚠️ Iɴᴄʟᴜᴅᴇ ʏᴏᴜʀ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ.\n" +
        "Dᴏɴ'ᴛ ᴜsᴇ + ᴏʀ sᴘᴀᴄᴇs."
      );
    }

    try {
      await ctx.reply("⏳ Gᴇɴᴇʀᴀᴛɪɴɢ ʏᴏᴜʀ WʜᴀᴛsAᴘᴘ ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ...");

      const result = await pairWhatsApp(number, "MERLIN LORD MD");

      if (!result.code) {
        return ctx.reply(`⚠️ ${result.message}`);
      }

      await ctx.reply(
        `🔐 WʜᴀᴛsAᴘᴘ Pᴀɪʀɪɴɢ Cᴏᴅᴇ\n\n` +
        `📱 Nᴜᴍʙᴇʀ: ${result.phone}\n` +
        `🔑 Cᴏᴅᴇ: \`${result.code}\`\n\n` +
        `📲 WʜᴀᴛsAᴘᴘ → Settings → Linked Devices → Link a Device → Link with phone number\n\n` +
        `⚠️ Kᴇᴇᴘ ᴛʜɪs ᴄᴏᴅᴇ ᴘʀɪᴠᴀᴛᴇ.`,
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      console.error("Pairing error:", error);

      await ctx.reply(
        "❌ Pᴀɪʀɪɴɢ ғᴀɪʟᴇᴅ.\n\n" +
        "Pʟᴇᴀsᴇ ᴄʜᴇᴄᴋ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴀɴᴅ ᴛʀʏ ᴀɢᴀɪɴ."
      );
    }
  });
};
