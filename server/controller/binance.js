const binance = require('../models/binance');
const moment = require('moment');
const getList = async (req, res) => {
    const { symbol } = req.query;
    const isMobile = req.headers['user-agent'].toLowerCase().includes('mobile');
    console.log(isMobile);
    const limit = isMobile ? 20 : 40; // Giảm số lượng dữ liệu cho thiết bị di động

    // const data = await binance.find({ symbolName: symbol }).sort({ _id: -1 }).limit(limit);
    // query với thời gian nhỏ hơn thời gian hiện tại
    // const data = await binance.find({ symbolName: symbol, closeTime: { $lt: new Date().getTime() } }).sort({ closeTime: -1 }).limit(limit);

    // const newData = data.map(item => {
    //     return [
    //         new Date(item.closeTime).getTime(),
    //         item.open,
    //         item.high,
    //         item.low,
    //         item.close,
    //         item.volume
    //     ]
    // })
    const data = await binance.find({ symbolName: symbol, time: { $lte: new Date().getTime() } }).sort({ time:1 }).limit(limit);
    const newData = data.map(item => {
        return {
            time: moment(item.time).format('HH:mm:ss DD/MM/YYYY'),
            closeTime: moment(item.closeTime).format('HH:mm:ss DD/MM/YYYY'),
        }
    })
    res.status(200).json({
        status: true,
        data: newData,
        isMobile: isMobile
    });
}

const updateBinance = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const binanceData = await binance.findByIdAndUpdate(id, data);
    res.status(200).json({
        status: true,
        data: binanceData
    });
}

module.exports = {
    getList,
    updateBinance
}