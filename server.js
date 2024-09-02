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
	.catch(console.error);

// Application configurations
const PORT = process.env.PORT || 7777;


const routes = require('./routes/routes');

app.use("/api/pacman", routes);

app.listen(PORT, () => {
	console.log('Sever started at PORT', PORT);
});


////////////////////// Cron Job /////////////////////////////
const { Web3 } = require('web3');
const cron = require('node-cron');
const ABI = require('./config/abi.json');
const { getWinnerAddress, resetScore } = require('./controllers/ScoreController');

const sendPrizeToWinner = async () => {
	console.log("Cron job started.................................");
	const web3 = new Web3(process.env.INFURA_URL);
	const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address
	const contract = new web3.eth.Contract(ABI, process.env.CONTRACT_ADDRESS);

	try {
		const winner = await getWinnerAddress();
		if (!winner) return console.log('No winners');
		console.log('winner:', winner);
		const gas = await contract.methods.endGame(winner).estimateGas({ from: account });
		const gasPrice = await web3.eth.getGasPrice();
		console.log('gas:', gas, 'gasprice:', gasPrice);
		const tx = {
			from: account,
			to: process.env.CONTRACT_ADDRESS,
			gas,
			gasPrice,
			data: contract.methods.endGame(winner).encodeABI(),
		};
		const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
		// const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
		console.log(receipt);
		await resetScore();

	}
	catch(err) {
		console.log(err);
	}
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
		.webApp('Play Game', 'https://pacman-b36f9.web.app')
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