const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    code: {
        type: String,
        required: false
    },
    ipAddress: { type: String, required: false },
    permissions: { type: Object, default: {} },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'active' },
    bankName: { type: String, default: '' },
    bankNumberAccount: { type: String, default: '' },
    bankNameAccount: { type: String, default: '' },
    bankBranch: { type: String, default: '' },
    cccdBefore: { type: String, default: '' },
    cccdAfter: { type: String, default: '' },
    avatar: { type: String, default: '' },
    address: { type: String, default: '' },
}, { collection: 'users', virtuals: true, toJSON: { virtuals: true }, timestamps: true });

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('users', userSchema);

module.exports = User;