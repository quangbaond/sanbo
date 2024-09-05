var express = require('express');
var router = express.Router();
const { getTradeData, getTradeListData } = require('../controller/trade');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.get('/', jwtMiddleware.verifyToken, getTradeData);
router.get('/list', jwtMiddleware.verifyTokenAdmin, getTradeListData);

module.exports = router;