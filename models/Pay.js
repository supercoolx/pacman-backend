const mongoose = require('mongoose');

const paySchema = new mongoose.Schema({
    tgId: {
        type: String,
        required: true,
    },
    wallet: {
        type: String,
        required: true,
    },
    txHash: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('pays', paySchema);