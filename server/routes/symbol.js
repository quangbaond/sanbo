var express = require('express');
var router = express.Router();
const { getList, getSymbolActive } = require('../controller/symbol');

router.get('/', getList);
router.get('/active', getSymbolActive);
module.exports = router;