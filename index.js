require("dotenv").config();

const { Telegraf } = require("telegraf");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");

const BOT_TOKEN = process.env.BOT_TOKEN;
const PREFIX = process.env.PREFIX || ".";
const BOT_NAME = process.env.BOT_NAME || "MERLIN LORD MD";

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing.");
  process.exit(1);
}

const telegram = new Telegraf(BOT_TOKEN);

async function startWhatsApp() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    browser: [BOT_NAME, "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log(`✅ ${BOT_NAME} WhatsApp connected!`);
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting WhatsApp...");
        startWhatsApp();
      } else {
        console.log("❌ WhatsApp logged out.");
      }
    }
  });

  return sock;
}

let whatsapp;

telegram.start(async (ctx) => {
  await ctx.reply(
    `╭━━━〔 ⚔️ ${BOT_NAME} 〕━━━╮

👑 Wᴇʟᴄᴏᴍᴇ!

Uѕᴇ:
/pair — Pair WhatsApp
/menu — Bot menu

╰━━━━━━━━━━━━━━━━━━╯`
  );
});

telegram.command("menu", async (ctx) => {
  await ctx.reply(
    `⚔️ ${BOT_NAME}

📱 WhatsApp Bot
🔗 Telegram Pairing
⚡ Fast & Powerful

Commands:
/pair
/menu`
  );
});

telegram.command("pair", async (ctx) => {
  await ctx.reply(
    "📱 Pᴀɪʀɪɴɢ sʏsᴛᴇᴍ ɪs ʀᴇᴀᴅʏ.\n\nWᴇ'ʟʟ ᴀᴅᴅ ᴛʜᴇ WʜᴀᴛsAᴘᴘ ɴᴜᴍʙᴇʀ ᴀɴᴅ ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ ɴᴇxᴛ."
  );
});

(async () => {
  whatsapp = await startWhatsApp();

  await telegram.launch();

  console.log(`🤖 ${BOT_NAME} Telegram bot is running!`);
})();
