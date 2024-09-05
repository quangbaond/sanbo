const binance = require('../models/binance');
const symbol = require('../models/symbol');
const moment = require('moment-timezone');
const { generateId, getRandomNumber } = require('../common');
const session = require('../models/session');
const trade = require('../models/trade');
const room = require('../models/room');
const user = require('../models/user');

const createDataBinance = async (number = 20, callback = null) => {
    const symbolData = await symbol.find({ status: 1 });

    if (!symbolData.length) {
        return;
    }

    const currentTime = moment().tz("Asia/Ho_Chi_Minh").toDate();
    const data = [];

    symbolData.forEach(item => {
        let lastClose = item.base;
        let trend = Math.random() > 0.5 ? 1 : -1;
        let trendDuration = Math.floor(Math.random() * 10) + 5; // Xu hướng kéo dài 5-15 nến

        for (let i = 1; i <= number; i++) {
            const timeSession = moment(currentTime).add(i, 'minutes').startOf('minute').toDate();
            const closeTime = moment(timeSession).add(1, 'minutes').startOf('minute').toDate();

            // Thay đổi xu hướng nếu cần
            if (i % trendDuration === 0) {
                trend = -trend;
                trendDuration = Math.floor(Math.random() * 10) + 5;
            }

            // Tính toán phần trăm thay đổi (từ -2% đến +2%)
            const changePercent = (Math.random() * 0.04 - 0.02) * trend;

            // Tính toán giá trị mới dựa trên phần trăm thay đổi
            const openPrice = lastClose;
            const closePrice = openPrice * (1 + changePercent);

            // Tính toán giá cao nhất và thấp nhất
            const highPrice = Math.max(openPrice, closePrice) * (1 + Math.random() * 0.005);
            const lowPrice = Math.min(openPrice, closePrice) * (1 - Math.random() * 0.005);

            // Tính toán khối lượng dựa trên mức độ biến động giá
            const priceChange = Math.abs(closePrice - openPrice);
            const volumeMultiplier = 1 + (priceChange / openPrice) * 10;
            const volume = getRandomNumber(item.changeMax * 0.8, item.changeMax * 1.2) * volumeMultiplier;

            const newData = {
                id: `${generateId(item._id)}_${i}`,
                symbolName: item.name,
                time: timeSession,
                open: openPrice,
                high: highPrice,
                low: lowPrice,
                close: closePrice,
                volume: volume,
                closeTime: closeTime,
                symbolId: item._id,
            }

            data.push(newData);
            lastClose = closePrice;
            if (callback) {
                callback(newData, item.name)
            }
        }
    });

    try {
        await binance.insertMany(data);
        console.log(`Created ${data.length} new data points for Binance`);

    } catch (error) {
        console.error("Error creating data binance: ", error);
    }
}

const deleteDataBinance = async () => {
    await binance.deleteMany();
}

const updateDataBinance = async (sessionData) => {
    if (!sessionData) {
        return;
    }
    const binanceData = await binance.findOne({ _id: sessionData.binanceId });

    if (!binanceData) {
        return;
    }
    const changePercent = (Math.random() * 0.009 + 0.001) * (Math.random() < 0.5 ? -1 : 1);
    const newClose = binanceData.close * (1 + changePercent);
    await binance.findOneAndUpdate(
        { _id: binanceData._id },
        { close: newClose }
    )
}
const updateDataSymbol = async () => {
    const symbolData = await symbol.find({ status: 1 });
    symbolData.forEach(async (item) => {
        const changePercent = (Math.random() * 0.009 + 0.001) * (Math.random() < 0.5 ? -1 : 1);
        const newBase = item.base * (1 + changePercent);
        const newChangeMax = item.max * (1 + changePercent);
        const newChangeMin = item.min * (1 + changePercent);

        await symbol.findOneAndUpdate(
            { _id: item._id },
            { base: newBase, max: newChangeMax, min: newChangeMin, changePercent: changePercent }
        )
    });

}

// const createSession = async (number = 20) => {
//     await session.deleteMany();
//     const symbolData = await symbol.find({ status: 1 });
//     const roomData = await room.find({ status: 'active' });
//     if (!symbolData.length || !roomData.length) {
//         return;
//     }
//     const currentTime = moment().tz("Asia/Ho_Chi_Minh").toDate();

//     symbolData.forEach(async (item) => {
//         roomData.forEach(async (room) => {
//             for (let i = 0; i <= number; i++) {
//                 const binanceData = await binance.aggregate([
//                     { $match: { symbolName: item.name } },
//                     { $sample: { size: 1 } }
//                 ]);
//                 if (!binanceData.length) {
//                     return;
//                 }

//                 // thời gian bắt đầu
//                 const timeInMinutes = room.time / 60;
//                 const timeInHours = room.time / 3600;
//                 let timeUnit, timeValue;

//                 if (timeInHours >= 1 && Number.isInteger(timeInHours)) {
//                     timeUnit = 'hours';
//                     timeValue = timeInHours;
//                 } else if (timeInMinutes >= 1 && Number.isInteger(timeInMinutes)) {
//                     timeUnit = 'minutes';
//                     timeValue = timeInMinutes;
//                 } else {
//                     timeUnit = 'seconds';
//                     timeValue = room.time;
//                 }

//                 const timeSession = moment(currentTime).add(i * timeValue, timeUnit).toDate();
//                 const closeTime = moment(timeSession).add(timeValue, timeUnit).toDate();

//                 const newSession = {
//                     symbolId: item._id,
//                     symbolName: item.name,
//                     binanceId: binanceData[0]._id,
//                     timeStart: timeSession,
//                     timeEnd: closeTime,
//                     status: 'active',
//                     typeTime: room.time,
//                 }

//                 await session.create(newSession);
//             }
//         })

//     });
// }

const getSession = async (symbolName, callback = null, time = 0) => {
    const currentTime = moment().tz("Asia/Ho_Chi_Minh").toDate();
    let sessionData = await session.findOne({ status: 'active', timeStart: { $lte: currentTime }, symbolName: symbolName, typeTime: time }).sort({ timeStart: 1 });
    if (sessionData) {
        const timeSession = moment(sessionData.timeEnd).toDate();
        const hour = moment(timeSession).diff(moment(), 'hours');
        const minute = moment(timeSession).diff(moment(), 'minutes');
        const second = moment(timeSession).diff(moment(), 'seconds');
        if (hour <= 0 && minute <= 0 && second <= 0) {
            await session.findOneAndUpdate({ _id: sessionData._id }, { status: 'done' })
            await trade.deleteMany({ sessionId: sessionData._id, isBot: true });
            await reward(sessionData, callback);
            return null;
        } else {
            await updateDataBinance(sessionData);
            return sessionData;
        }
    }
}
const reward = async (sessionData, callback = null) => {
    const roomData = await room.findOne({ time: sessionData.typeTime });
    let invest = roomData.profit > 0 ? roomData.profit : 5
    invest = invest / 100;
    if (!sessionData) {
        return;
    }

    const tradeData = await trade.find({ sessionId: sessionData._id, status: 'pending', isBot: false });

    if (!tradeData.length) {
        return;
    }
    const binanceData = await binance.findOne({ _id: sessionData.binanceId });
    if (!binanceData) {
        return;
    }
    tradeData.forEach(async (item) => {
        const userData = await user.findOne({ _id: item.userId });
        if (!userData) {
            return;
        }
        let status = '';

        let newBalance = userData.balance;

        if (item.type == 'buy') {
            if (item.price <= binanceData.close) {
                await trade.findOneAndUpdate({ _id: item._id }, { status: 'success' });
                // cộng vào balance của user với số tiền cược nhân với 5%
                newBalance += item.amount + (item.amount * invest);
                status = 'success';
            } else {
                await trade.findOneAndUpdate({ _id: item._id }, { status: 'failed' });
                status = 'failed';
            }
        } else {
            if (item.price >= binanceData.close) {
                await trade.findOneAndUpdate({ _id: item._id }, { status: 'success' });
                newBalance += item.amount + (item.amount * invest);
                status = 'success';
            } else {
                await trade.findOneAndUpdate({ _id: item._id }, { status: 'failed' });
                status = 'failed';
            }
        }
        await user.findOneAndUpdate({ _id: userData._id }, { balance: newBalance });

        item.status = status;
        await item.save();
        if (callback) {
            callback(status, newBalance);
        }
    });
}

const generateTrade = async () => {
    const currentTime = moment().tz("Asia/Ho_Chi_Minh").toDate();

    const sessionDataOld = await session.find({ status: 'done' })

    // await trade.deleteMany({ sessionId: { $in: sessionDataOld.map(item => item._id) }, isBot: true })
    sessionDataOld.forEach(async (item) => {
        await trade.deleteMany({ sessionId: item._id, isBot: true })
    })

    const sessionData = await session.find({ status: 'active', timeStart: { $lte: currentTime } }).sort({ timeStart: 1 });
    if (!sessionData.length) {
        return;
    }
    sessionData.forEach(async (item) => {
        const userId = generateId(item._id);
        const sessionId = item._id;
        const symbolName = item.symbolName;
        const price = Math.floor(Math.random() * 1000) + 1;
        const amount = Math.floor(Math.random() * 1000) + 1;
        const status = 'pending';
        const newTrade = {
            userId: userId,
            sessionId: sessionId,
            symbolName: symbolName,
            price: price,
            amount: amount,
            status: status,
            type: Math.random() > 0.5 ? 'buy' : 'sell',
            isBot: true
        }
        const intervall = Math.floor(Math.random() * 10) + 1;
        setTimeout(async () => {
            await trade.create(newTrade);
        }, intervall * 1000);
    });
}
module.exports = {
    createDataBinance,
    deleteDataBinance,
    updateDataBinance,
    updateDataSymbol,
    // createSession,
    getSession,
    reward,
    generateTrade
}
