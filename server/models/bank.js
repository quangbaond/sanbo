const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const bankSchema = new Schema({
    bankName: {
        type: String,
        required: true
    },
    bankNumberAccount: {
        type: String,
        required: true
    },
    bankNameAccount: {
        type: String,
        required: true
    },
    bankBranch: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
}, { collection: 'bank', virtuals: true, toJSON: { virtuals: true }, timestamps: true });

bankSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('bank', bankSchema);