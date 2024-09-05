const symbol = require('../models/symbol');
const binance = require('../models/binance');
const moment = require('moment-timezone');
const room = require('../models/room');
const user = require('../models/user');
const { getRandomNumber, generateId } = require('../common');
const session = require('../models/session');
const md5 = require('md5');



const createDataSymbol = async () => {
    // check if data symbol is already created
    const count = await symbol.countDocuments();

    const data = [
        {
            id: 1,
            name: "XAU/USD",
            base: 873.5000000,
            min: 873.0000000,
            max: 973.9900000,
            change: 0.5,
            changeMax: 12.00,
            rate: 90,
            status: 1,
            changePercent: 0.00,
        },
        {
            id: 2,
            name: "ETH/USD",
            base: 178.3554659,
            min: 78.1554659,
            max: 278.8554659,
            change: 2.00,
            changeMax: 10.00,
            rate: 90,
            status: 1,
            changePercent: 0.00,
        },
        {
            id: 3,
            name: "GBP/USD",
            base: 178.3554659,
            min: 78.1554659,
            max: 278.8554659,
            change: 2.00,
            changeMax: 9.00,
            rate: 90,
            status: 1,
            changePercent: 0.00,
        },
        {
            id: 4,
            name: "USD/JPY",
            base: 128.1132088,
            min: 120.1132099,
            max: 140.1132088,
            change: 5.00,
            changeMax: 7.00,
            rate: 90,
            status: 1,
            changePercent: 0.00,
        },
        {
            id: 5,
            name: "USD/CHF",
            base: 0.9217153,
            min: 0.7217153,
            max: 0.9817153,
            change: 5.00,
            changeMax: 5.00,
            rate: 90,
            status: 1,
            changePercent: 0.00,
        },
    ];

    try {
        await symbol.deleteMany();
        await symbol.insertMany(data);
        console.log("Data symbol created successfully" + data.length);
    } catch (error) {
        console.error("Error creating data symbol: ", error);
    }
}

const createDataBinance = async (number = 60) => {
    const symbolData = await symbol.find({ status: 1 });
    if (!symbolData.length) {
        return;
    }
    const currentTime = moment().tz("Asia/Ho_Chi_Minh").subtract(number, 'minutes').toDate();
    const data = [];

    symbolData.forEach(item => {
        let lastClose = item.base;
        let trend = Math.random() > 0.5 ? 1 : -1;
        let trendDuration = Math.floor(Math.random() * 10) + 5; // Xu hướng kéo dài 5-15 nến

        for (let i = 1; i <= number; i++) {
            // thời gian bắt đầu
            // Thay đổi xu hướng nếu cần
            if (i % trendDuration === 0) {
                trend = -trend;
                trendDuration = Math.floor(Math.random() * 100) + 5;
            }

            // Tính toán phần trăm thay đổi (từ -15% đến +15%)
            const changePercent = (Math.random() * 0.3 - 0.15) * trend;

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

            data.push({
                id: `${generateId(item._id)}_${i}`,
                symbolName: item.name,
                time: moment(currentTime).add(i, 'minutes').toDate(),
                open: openPrice,
                high: highPrice,
                low: lowPrice,
                close: closePrice,
                volume: volume,
                closeTime: moment(currentTime).add(i, 'minutes').add(1, 'minutes').toDate(),
                symbolId: item._id,
            });

            lastClose = closePrice;
        }
    });

    try {
        await binance.deleteMany();
        await binance.insertMany(data);
        console.log("Data binance created successfully" + data.length);
    } catch (error) {
        console.error("Error creating data binance: ", error);
    }
}

const createDataSession = async (number = 20) => {
    await session.deleteMany();
    const symbolData = await symbol.find({ status: 1 });
    const roomData = await room.find({ status: 'active' });
    if (!symbolData.length || !roomData.length) {
        return;
    }
    const currentTime = moment().tz("Asia/Ho_Chi_Minh").toDate();

    symbolData.forEach(async (item) => {
        roomData.forEach(async (room) => {
            for (let i = 0; i <= number; i++) {
                const binanceData = await binance.aggregate([
                    { $match: { symbolName: item.name } },
                    { $sample: { size: 1 } }
                ]);
                if (!binanceData.length) {
                    return;
                }


                const timeSession = moment(currentTime).add(i * room.time, room.timeUnit).toDate();
                const closeTime = moment(timeSession).add(room.time, room.timeUnit).toDate();
                const id = Math.floor(Math.random() * 9999).toString();

                const newSession = {
                    code: generateId(id),
                    symbolId: item._id,
                    symbolName: item.name,
                    binanceId: binanceData[0]._id,
                    timeStart: timeSession,
                    timeEnd: closeTime,
                    status: 'active',
                    typeTime: room.time,
                    roomId: room._id,
                }

                await session.create(newSession);
            }
        })

    });
}
const createDataRoom = async () => {
    const roomData = await room.find({ status: 'active' });
    if (roomData.length > 0) {
        return;
    }

    const data = [
        {
            name: "Room 1",
            profit: 0,
            time: 60,
            status: 'active',
            timeUnit: 'seconds'
        },
        {
            name: "Room 2",
            profit: 0,
            time: 120,
            status: 'active',
            timeUnit: 'seconds'
        },
        {
            name: "Room 3",
            profit: 0,
            time: 180,
            status: 'active',
            timeUnit: 'seconds'
        },
        {
            name: "Room 4",
            profit: 0,
            time: 240,
            status: 'active',
            timeUnit: 'seconds'
        }
    ]

    try {
        await room.insertMany(data);
        console.log("Data room created successfully");
    } catch (error) {
        console.error("Error creating data room: ", error);
    }
}

const createDataUser = async () => {
    const userData = await user.find({ role: 'admin' });
    if (userData.length > 0) {
        return;
    }

    const data = [
        {
            username: 'admin123',
            password: md5('admin123'),
            role: 'admin',
            status: 'active',
            fullname: 'Admin',
            email: 'admin@gmail.com',
            phone: '0987654321',

        }
    ]

    try {
        await user.insertMany(data);
        console.log("Data user created successfully");
    } catch (error) {
        console.error("Error creating data user: ", error);
    }
}
module.exports = {
    createDataSymbol,
    createDataBinance,
    createDataSession,
    createDataRoom,
    createDataUser,
}