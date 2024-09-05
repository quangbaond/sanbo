const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    time: {
        type: Number, // số giây mỗi phòng
        default: 60 // 1 phút
    },
    timeUnit: {
        type: String,
        enum: ['seconds', 'minutes', 'hours', 'days'],
        default: 'seconds'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }

}, { collection: 'room', virtuals: true, toJSON: { virtuals: true }, timestamps: true });

roomSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('room', roomSchema);