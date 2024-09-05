const symbol = require('../models/symbol');

const getList = async (req, res) => {
    const data = await symbol.find({ status: 1 });
    res.status(200).json({
        success: true,
        data: data
    });
}

const getSymbolActive = async (req, res) => {
    const data = await symbol.find({ status: 1 });
    res.status(200).json({
        success: true,
        data: data
    });
}

module.exports = {
    getList,
    getSymbolActive
}