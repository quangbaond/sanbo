var express = require('express');
var router = express.Router();
const { createRoom, getRoomActive } = require('../controller/room');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.post('/create', jwtMiddleware.verifyToken, createRoom);

router.get('/active', jwtMiddleware.verifyToken, getRoomActive);

module.exports = router;


