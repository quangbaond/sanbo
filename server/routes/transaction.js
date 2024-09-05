var express = require('express');
var router = express.Router();

const { createTransaction, getAllTransaction, updateTransaction, getMyTransaction, deleteTransaction } = require('../controller/transaction');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.post('/', jwtMiddleware.verifyToken, createTransaction);
router.get('/', jwtMiddleware.verifyTokenAdmin, getAllTransaction);
router.put('/:id', jwtMiddleware.verifyTokenAdmin, updateTransaction);
router.delete('/:id', jwtMiddleware.verifyTokenAdmin, deleteTransaction);
router.get('/my', jwtMiddleware.verifyToken, getMyTransaction);

module.exports = router;