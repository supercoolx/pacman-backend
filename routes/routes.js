const express = require('express');
const infoController = require('../controllers/InfoController');
const payController = require('../controllers/PayController');
const scoreController = require('../controllers/ScoreController');

const router = express.Router();

router.post('/scores', scoreController.SaveScore);
router.get('/scores/:username', scoreController.GetScore);
router.get('/scores/fetchscore/all', scoreController.FetchAllScore);

router.post('/pay', payController.pay);

router.get('/info/remaining_time', infoController.getRemainingTime);

module.exports = router;