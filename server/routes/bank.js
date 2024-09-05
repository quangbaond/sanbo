var express = require('express');
var router = express.Router();
const { getBanks, addBank, updateBank, deleteBank, getBankById, getBankActive } = require('../controller/bank');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.get('/', jwtMiddleware.verifyToken, getBanks);
router.get('/active', jwtMiddleware.verifyToken, getBankActive);
router.post('/', jwtMiddleware.verifyTokenAdmin, addBank);
router.get('/:id', jwtMiddleware.verifyTokenAdmin, getBankById);
router.put('/:id', jwtMiddleware.verifyTokenAdmin, updateBank);
router.delete('/:id', jwtMiddleware.verifyTokenAdmin, deleteBank);

module.exports = router;