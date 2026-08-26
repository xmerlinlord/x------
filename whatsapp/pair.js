const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const path = require("path");

const sessions = new Map();

function cleanNumber(number) {
  return String(number).replace(/\D/g, "");
}

async function pairWhatsApp(number, botName) {
  const phone = cleanNumber(number);

  if (!phone || phone.length < 8) {
    throw new Error("Invalid WhatsApp number.");
  }

  if (sessions.has(phone)) {
    return {
      code: null,
      message: "This WhatsApp number already has a session."
    };
  }

  const sessionPath = path.join(
    process.cwd(),
    "sessions",
    phone
  );

  const { state, saveCreds } =
    await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    browser: [botName || "MERLIN LORD MD", "Chrome", "1.0.0"]
  });

  sessions.set(phone, sock);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log(`✅ WhatsApp connected: ${phone}`);
    }

    if (connection === "close") {
      const code =
        lastDisconnect?.error?.output?.statusCode;

      sessions.delete(phone);

      if (code !== DisconnectReason.loggedOut) {
        console.log(`🔄 WhatsApp disconnected: ${phone}`);
      } else {
        console.log(`❌ WhatsApp logged out: ${phone}`);
      }
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const pairingCode = await sock.requestPairingCode(phone);

  return {
    code: pairingCode,
    phone
  };
}

function getSession(phone) {
  return sessions.get(cleanNumber(phone));
}

module.exports = {
  pairWhatsApp,
  getSession
};
