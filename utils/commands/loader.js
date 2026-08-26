const fs = require("fs");
const path = require("path");

function loadCommands(bot) {
  const commandsPath = path.join(__dirname, "commands");

  if (!fs.existsSync(commandsPath)) {
    console.log("⚠️ commands folder not found.");
    return;
  }

  const files = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of files) {
    try {
      const command = require(path.join(commandsPath, file));

      if (typeof command === "function") {
        command(bot);
        console.log(`✅ Loaded: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Failed to load ${file}:`, error.message);
    }
  }
}

module.exports = { loadCommands };
