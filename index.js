// GIFTED TECH - Improved Version

const express = require("express"),
      path = require("path"),
      axios = require("axios"),
      dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const proxyUrl = process.env.PROXY_URL || ""; // Optional proxy support

app.use(express.json());

// Serve homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Send message to Telegram bot
app.post("/send-message", async (req, res) => {
    const { text, user_chat_id } = req.body;

    if (!botToken || !chatId) {
        console.error("BOT_TOKEN or CHAT_ID is missing in .env file.");
        return res.status(500).json({ ok: false, error: "Server misconfiguration." });
    }

    if (!text) {
        return res.status(400).json({ ok: false, error: "Message text is required." });
    }

    try {
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = {
            chat_id: user_chat_id || chatId, // Allow users to specify their chat ID
            text: `🌍 New Message: ${text}`, // Adding a globe emoji to indicate global use
            parse_mode: "Markdown",
        };

        const options = proxyUrl
            ? { proxy: { host: proxyUrl, port: 8080 } }
            : {};

        const response = await axios.post(telegramUrl, data, options);

        if (response.data.ok) {
            res.json({ ok: true, message: "Message sent successfully!" });
        } else {
            res.status(500).json({ ok: false, error: "Failed to send message." });
        }
    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ ok: false, error: "An error occurred while sending the message." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});

module.exports = app;
