const binance = require('../models/binance')
const symbol = require('../models/symbol')
const trade = require('../models/trade')
const user = require('../models/user')
const moment = require('moment')

module.exports = (io, socket) => {
    socket.on('binance', async (symbolName) => {
        await getListBinance(symbolName);
    });

    const getListBinance = async (symbolName) => {
        const limit = socket.handshake.headers['user-agent'].includes('mobile') ? 20 : 50;
        const binances = await binance.find({ symbolName: symbolName, time: { $lte: new Date().getTime() } }).sort({ time: 1 }).limit(limit);
        const newData = binances.map(item => [
            new Date(item.time).getTime(),
            item.open,
            item.high,
            item.low,
            item.close,
            item.volume
        ]);
        socket.emit(`binance-${symbolName}`, newData);
    }

    socket.on('tradeDing', async (data) => {
        await tradeDing(data);
    });

    const tradeDing = async (data) => {
        const userData = await user.findOne({
            _id: data.userId
        });
        if (userData.balance < data.amount) {
            return;
        }
        userData.balance -= data.amount;
        await userData.save();
        const tradeData = await trade.create({
            userId: data.userId,
            sessionId: data.sessionId,
            symbolName: data.symbol,
            type: data.type,
            price: data.price,
            amount: data.amount,
            status: 'pending',
            isBot: false
        });

        const userBalance = await user.findOne({
            _id: data.userId
        })

        socket.emit(`trade`, {
            tradeData: tradeData,
            balance: userBalance.balance
        });
    }
}
