const express = require('express');

const songsController = require('../controllers/songs');

const router = express.Router();

router.get('/songsList', songsController.GETsearchList);

router.get('/chords-lyrics', songsController.GETchordAndLyrics);

module.exports = router;

