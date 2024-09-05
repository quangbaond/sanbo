const moment = require('moment-timezone');

const getRandomNumber = (min = 0.982, max = 1.012) => {
    return Math.random() * (max - min) + min;
}

const generateId = (string) => {
    const date = moment().tz("Asia/Ho_Chi_Minh");
    return `${date.format('YYYYMMDDHHmm')}${string}`;
}

module.exports = {
    getRandomNumber,
    generateId
}