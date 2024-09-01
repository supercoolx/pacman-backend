const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');
const fs = require("fs");
const app = express();
const { MONGODB_URI } = require("./config/config");

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


mongoose.connect(MONGODB_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch((error) => console.error('Connection error', error));

// Application configurations
const PORT = process.env.PORT || 7777;


const routes = require('./routes/routes');

app.use("/api/pacman", routes);

app.listen(PORT, () => {
	console.log('Sever started at PORT', PORT);
});


////////////////////// Cron Job /////////////////////////////

const cron = require('node-cron');

const sendPrizeToWinner = () => {
	console.log("Cron job started.................................");

}

cron.schedule('0 0 */2 * *', sendPrizeToWinner, {
	scheduled: true,
	timezone: "America/New_York"
});




////////////////////// bot server ///////////////////////////


const { Bot, InlineKeyboard } = require("grammy");
const botToken = process.env.BOT_TOKEN;
const bot = new Bot(botToken);

bot.command('start', async (ctx) => {
	const keyboard = new InlineKeyboard()
		.webApp('Play Game', 'https://pacman-mini-app.vercel.app/')
		.row()
		.text('About', 'about')
		.row()
		.text('Contact', 'contact');

	await ctx.replyWithPhoto(
		"https://ibb.co/yQySP2B",
		{
			caption: "Let's play",
			reply_markup: keyboard,
		}
	);
});



bot.callbackQuery('about', (ctx) => {
	return ctx.reply('This is a Pacman game.');
});

bot.callbackQuery('contact', (ctx) => {
	return ctx.reply('You can contact the bot admin at example@email.com');
});

(async () => {
	await bot.api.deleteWebhook();
	bot.start();
	console.log('Bot started!');
})();