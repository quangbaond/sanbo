const bank = require('../models/bank');

const getBanks = async (req, res) => {
    const banks = await bank.find();
    res.status(200).json({
        banks
    });
}

const getBankById = async (req, res) => {
    const bankData = await bank.findById(req.params.id);
    res.status(200).json({
        bankData
    });
}

const getBankActive = async (req, res) => {
    const bankData = await bank.find({ status: 'active' });
    res.status(200).json({
        bankData
    });
}

const addBank = async (req, res) => {
    const { bankName, bankNumberAccount, bankNameAccount, bankBranch, image } = req.body;
    const bankData = await bank.create({ bankName, bankNumberAccount, bankNameAccount, bankBranch, image, status: 'active' });
    res.status(200).json({
        bankData,
        message: 'Thêm ngân hàng thành công'
    });
}

const updateBank = async (req, res) => {
    const { bankName, bankNumberAccount, bankNameAccount, bankBranch, image } = req.body;
    const bankData = await bank.findByIdAndUpdate(req.params.id, { bankName, bankNumberAccount, bankNameAccount, bankBranch, image });
    res.status(200).json({
        bankData,
        message: 'Cập nhật ngân hàng thành công'
    });
}

const deleteBank = async (req, res) => {
    const bankData = await bank.findByIdAndDelete(req.params.id);
    res.status(200).json({
        bankData,
        message: 'Xóa ngân hàng thành công'
    });
}

module.exports = {
    getBanks,
    addBank,
    updateBank,
    deleteBank,
    getBankById,
    getBankActive
}
