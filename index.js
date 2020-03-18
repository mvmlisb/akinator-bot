const TelegramBot = require('node-telegram-bot-api');
const EventHandler = require("./src/event-handler");

const TOKEN = "YOUR_TOKEN";
const REGION = "en3";
const bot = new TelegramBot(TOKEN, { "polling": true });
const handler = new EventHandler(bot);

bot.onText(/\/start/, (message) => {
    handler.handleMessageToStartGame(message, REGION);
});

bot.on("callback_query", query => {
    handler.handleCommand(query);
});

bot.on("polling_error", (error) => {
    console.log(error);
});