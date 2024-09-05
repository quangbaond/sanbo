const users = require('../models/user');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require("../config/auth.js");
const getIP = require('ipware')().get_ip;
const register = async (req, res) => {
    const { phone, username, fullname, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({
            message: 'Mật khẩu không khớp'
        });
    }
    const hashedPassword = md5(password);
    const code = Math.random().toString(36).substring(2, 15);
    const user = await users.create({ phone, username, fullname, password: hashedPassword, code });
    res.status(200).json({
        user,
        message: 'Đăng ký thành công'
    });
};

const login = async (req, res) => {
    const { username, password, isAdmin } = req.body;
    try {
        const user = await users.findOne({ username });
        if (!user) {
        return res.status(400).json({
            message: 'Tên đăng nhập không tồn tại'
        });
    }
        if (user.password !== md5(password)) {
            return res.status(400).json({
                message: 'Mật khẩu không đúng'
            });
        }
        if (user.status !== 'active') {
            return res.status(400).json({
                message: 'Tài khoản đã bị khóa'
            });
        }

        if (isAdmin) {
            if (user.role !== 'admin') {
                return res.status(400).json({
                    message: 'Bạn không phải là admin'
                });
            }
        }
        const ipAddress = getIP(req).clientIp;
        user.ipAddress = ipAddress;
        user.lastLogin = new Date();
        await user.save();
        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400, // 24 hours
            algorithm: 'HS256',
            allowInsecureKeySizes: true
        });
        res.status(200).json({
            user,
            token,
            message: 'Đăng nhập thành công'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    req.session.token = false;

    return res.status(200).json({ message: 'Đăng xuất thành công!' })
}

const profile = async (req, res, next) => {
    let token = ""

    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    console.log(token);

    if (!token) {
        return res.status(401).send({ message: "Đăng nhập hết hạn, Vui lòng đăng nhập lại!" });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Đăng nhập hết hạn, Vui lòng đăng nhập lại!" });
        }
        const user = await users.findById(decoded.id).select({ password: 0 });
        return res.status(200).json({ user });
    });
}

const updateBank = async (req, res) => {
    const { bankName, bankNumberAccount, bankNameAccount, bankBranch, cccdBefore, cccdAfter } = req.body;
    const user = await users.findById(req.userId);
    user.bankName = bankName;
    user.bankNumberAccount = bankNumberAccount;
    user.bankNameAccount = bankNameAccount;
    user.bankBranch = bankBranch;
    user.cccdBefore = cccdBefore;
    user.cccdAfter = cccdAfter;
    await user.save();
    return res.status(200).json({ user, message: 'Cập nhật thông tin thành công' });
}

const updateAvatar = async (req, res) => {
    const { avatar } = req.body;
    const user = await users.findById(req.userId);
    user.avatar = avatar;
    await user.save();
    return res.status(200).json({ user, message: 'Cập nhật thông tin thành công' });
}

const updateProfile = async (req, res) => {
    // const { fullname, phone, address } = req.body;
    const user = await users.findById(req.userId);
    await user.updateOne(req.body)
    const userData = await users.findById(req.userId);
    return res.status(200).json({ user: userData, message: 'Cập nhật thông tin thành công' });
}

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await users.findById(req.userId);
    if (user.password !== md5(oldPassword)) {
        return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Mật khẩu mới không khớp' });
    }
    user.password = md5(newPassword);
    await user.save();
    return res.status(200).json({ message: 'Cập nhật thành công' });
}


module.exports = {
    register,
    login,
    logout,
    profile,
    updateBank,
    updateAvatar,
    updateProfile,
    updatePassword
};