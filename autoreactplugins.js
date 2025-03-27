const fs = require('fs');
const settingsFile = './plugins/autoReactSettings.json';

// Load or create settings file (default: enabled)
let settings = { enabled: true };
if (fs.existsSync(settingsFile)) {
    settings = JSON.parse(fs.readFileSync(settingsFile));
}

module.exports = {
    name: "autoReactPlugin",
    command: ["areact"], // Command to enable/disable auto-reactions
    event: "message", // Runs when a new message arrives
    description: "Toggle auto-reactions or send reactions",
    
    async handler(sock, message, { text, command }) {
        const chatId = message.key.remoteJid;
        const sender = message.key.participant || chatId;
        const msgText = message.message?.conversation?.toLowerCase() || "";

        // Handle toggle command
        if (command === "areact") {
            if (text === "on") {
                settings.enabled = true;
                fs.writeFileSync(settingsFile, JSON.stringify(settings)); // Save setting
                return await sock.sendMessage(chatId, { text: "✅ Auto-Reactions Enabled!" });
            } else if (text === "off") {
                settings.enabled = false;
                fs.writeFileSync(settingsFile, JSON.stringify(settings)); // Save setting
                return await sock.sendMessage(chatId, { text: "❌ Auto-Reactions Disabled!" });
            } else {
                return await sock.sendMessage(chatId, { text: "Usage: `.areact on` or `.areact off`" });
            }
        }

        // Check if auto-react is enabled
        if (!settings.enabled) return;

        // List of possible random emojis
        const randomEmojis = ['😂', '😎', '🔥', '🤩', '💀', '👀', '😍', '🥳', '💖', '🤔'];

        // Default random reaction
        let reactionEmoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];

        // Keyword-based reactions
        if (msgText.includes("hello")) reactionEmoji = ['👋', '😊', '🤗'][Math.floor(Math.random() * 3)];
        if (msgText.includes("bye")) reactionEmoji = ['👋', '😢', '👀'][Math.floor(Math.random() * 3)];
        if (msgText.includes("thanks") || msgText.includes("thank you")) reactionEmoji = ['🙏', '🤝', '😊'][Math.floor(Math.random() * 3)];
        if (msgText.includes("lol") || msgText.includes("haha")) reactionEmoji = ['😂', '🤣', '💀'][Math.floor(Math.random() * 3)];
        if (msgText.includes("love")) reactionEmoji = ['❤️', '😍', '💖'][Math.floor(Math.random() * 3)];
        if (msgText.includes("fire")) reactionEmoji = ['🔥', '💥', '😎'][Math.floor(Math.random() * 3)];
        if (msgText.includes("wow") || msgText.includes("amazing")) reactionEmoji = ['🤩', '😲', '👏'][Math.floor(Math.random() * 3)];

        // Send reaction
        await sock.sendMessage(chatId, {
            react: { text: reactionEmoji, key: message.key }
        });
    }
};
