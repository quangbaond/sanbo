const session = require('../models/session')
const binance = require('../models/binance')
const trade = require('../models/trade')
const symbol = require('../models/symbol')
const moment = require('moment')
const { getSession } = require('../cronjob/index')

module.exports = (io, socket) => {

    const getTimeSession = async (symbolName, userId, time) => {
        if (!time) {
            return;
        }
        const sessionData = await getSession(symbolName, reward, time);

        if (!sessionData) {
            return;
        }
        const tradeData = await trade.find({ userId: userId }).limit(10).sort({ createdAt: -1 });
        const tradeOnline = await trade.find({ sessionId: sessionData._id }).limit(10).sort({ createdAt: -1 });

        const binanceData = await binance.findOne({ _id: sessionData.binanceId });
        if (!binanceData) {
            return;
        }
        const timeSession = moment(sessionData.timeEnd).toDate();
        const duration = moment.duration(moment(timeSession).diff(moment()));
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        const newData = [
            new Date(sessionData.timeStart).getTime(),
            binanceData.open,
            binanceData.high,
            binanceData.low,
            binanceData.close,
            binanceData.volume
        ];

        const symbolData = await symbol.find({ status: 1 });
        if (!symbolData.length) {
            return;
        }

        socket.emit(`${symbolName}-session-time`, {
            time: `${hours}:${minutes}:${seconds}`,
            data: newData,
            symbolData: symbolData,
            sessionData: sessionData,
            tradeData: tradeData,
            tradeOnline: tradeOnline
        });
    }

    socket.on('getTimeSession', async (data) => {
        await getTimeSession(data.symbolName, data.userId, data.time)
    })

    const reward = async (status, balance) => {
        console.log('reward', status, balance);
        socket.emit('reward', {
            status: status,
            balance: balance
        });
    }

    const getSessionData = async (data) => {
        console.log(data);
        const sessionData = await session.find({ status: 'active', timeStart: { $gte: moment().toDate() }, typeTime: data.room, symbolName: data.symbol }).limit(20);
        console.log(sessionData);
        socket.emit('getSessionData', {
            sessionData: sessionData
        });
    }

    socket.on('getSessionData', async (data) => {
        await getSessionData(data);
    })
}