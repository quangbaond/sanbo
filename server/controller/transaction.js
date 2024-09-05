const transaction = require('../models/transaction');
const user = require('../models/user');

const createTransaction = async (req, res) => {
    const { amount, bankId, type } = req.body;
    const typeTransaction = type === 'withdraw' ? 'withdraw' : 'deposit';

    const userId = req.userId;
    const code = Math.random().toString(36).substring(2, 15);
    const transactionData = await transaction.create({ userId, amount, bankId, code, status: 'pending', type: typeTransaction });
    res.status(200).json({
        transactionData,
        message: 'Tạo giao dịch thành công'
    });
};

const getTransaction = async (req, res) => {
    const { userId } = req.body;
    const transactionData = await transaction.find({ userId });
    res.status(200).json({
        transactionData,
        message: 'Lấy giao dịch thành công'
    });
};

const getMyTransaction = async (req, res) => {
    const userId = req.userId;
    const { page, limit, fromDate, toDate, type, status } = req.query;
    const query = { userId };
    if (fromDate && toDate) {
        query.createdAt = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
        query.createdAt = { $gte: fromDate };
    } else if (toDate) {
        query.createdAt = { $lte: toDate };
    }

    if (type == 'all') {
        query.type = { $ne: 'transfer' };
    } else {
        query.type = type;
    }
    // all thi bo qua status
    if (status == 'all') {
        query.status = { $ne: 'null' };
    } else {
        query.status = status;
    }
    const transactionData = await transaction.paginate(query, { page, limit });
    res.status(200).json({
        transactionData,
        message: 'Lấy giao dịch thành công'
    });
};

// update transaction
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const transactionData = await transaction.findByIdAndUpdate(id, { status });

    if (status === 'success') {
        const userData = await user.findById(transactionData.userId);
        userData.balance += transactionData.amount;
        await userData.save();
    }
    res.status(200).json({
        transactionData,
        message: 'Cập nhật giao dịch thành công'
    });
};

const getAllTransaction = async (req, res) => {
    const { page, limit } = req.query;

    const options = {
        page: page || 1,
        limit: limit || 10,
        sort: { createdAt: -1 },
        populate: 'user bank'
    };
    const query = {};
    const transactionData = await transaction.paginate(query, options);
    res.status(200).json({
        transactionData,
        message: 'Lấy tất cả giao dịch thành công'
    });
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const transactionData = await transaction.findByIdAndDelete(id);
    res.status(200).json({
        transactionData,
        message: 'Xóa giao dịch thành công'
    });
};

module.exports = {
    createTransaction,
    getTransaction,
    updateTransaction,
    getMyTransaction,
    getAllTransaction,
    deleteTransaction
};