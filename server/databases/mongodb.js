require('dotenv').config();
var mongoose = require('mongoose');
const { createDataSymbol, createDataBinance, createDataSession, createDataRoom, createDataUser } = require('../init');

// connect db
const db = process.env.MONGO_URI

if (!db) {
    console.error('MONGO_URI không được định nghĩa trong file .env');
    process.exit(1);
}

mongoose.connect(db).then(async () => {
    console.info('Kết nối cơ sở dữ liệu thành công! 🙋');
    await createDataUser();
    await createDataSymbol();
    await createDataRoom();
    await createDataBinance();
    await createDataSession();

}).catch((err) => {
    console.error('Lỗi kết nối cơ sở dữ liệu 🚨');
    console.error('Chi tiết lỗi:', err.message);
    if (err.name === 'MongoParseError') {
        console.error('Có vẻ như MONGO_URI không hợp lệ. Vui lòng kiểm tra lại cấu hình trong file .env');
    }
    process.exit(1);
});

// Thêm sự kiện lắng nghe lỗi
mongoose.connection.on('error', (err) => {
    console.error('Lỗi kết nối MongoDB:', err);
});

