require('dotenv').config();

const { MONGODB_URI } = process.env;
// const MONGODB_URI = "mongodb://localhost:27017/pacman";

module.exports = { MONGODB_URI };