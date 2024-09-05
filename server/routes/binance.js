var express = require('express');
var router = express.Router();
const { getList, updateBinance } = require('../controller/binance');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.get('/', getList);
router.put('/:id', jwtMiddleware.verifyTokenAdmin, updateBinance);

module.exports = router;

