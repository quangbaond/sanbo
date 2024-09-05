const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const roomSessionSchema = new Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    symbolName: {
        type: String,
        required: true
    },
    timeStart: {
        type: Date,
        required: true
    },
    timeEnd: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'done', 'cancel'],
        default: 'active'
    }
}, { collection: 'roomSession', virtuals: true, toJSON: { virtuals: true }, timestamps: true });

roomSessionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('roomSession', roomSessionSchema);