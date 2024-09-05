var express = require('express');
var router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { getSessionBefore } = require('../controller/session');

router.get('/before', jwtMiddleware.verifyToken, getSessionBefore);

module.exports = router;