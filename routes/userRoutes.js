const express = require('express');
const authController = require('../controllers/scoreController');
const router = express.Router();

router.post('/scores', authController.SaveScore);
router.get('/scores/:username', authController.GetScore);
router.get('/scores/fetchscore/all', authController.FetchAllScore);

module.exports = router;