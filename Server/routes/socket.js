const express = require('express');

const socketController = require('../util/socket');

const router = express.Router();

router.get('/getsong', socketController.GETsong);

router.post('/postsong', socketController.POSTsong);

module.exports = router;