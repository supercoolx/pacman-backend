const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	tgId: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
	},
	scores: {
		type: Number,
		default: 0
	},
	wallet: {
		type: String,
		require: true,
		validate: {
			validator: function (v) {
				// Simple validation for Ethereum address format (optional)
				return /^0x[a-fA-F0-9]{40}$/.test(v);
			},
			message: props => `${props.value} is not a valid Ethereum address!`
		}
	},
	wins: {
		type: Number,
		default: 0
	},
	losses: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model('Users', userSchema);