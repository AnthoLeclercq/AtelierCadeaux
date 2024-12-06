const resetPasswordHelper = require('../helpers/resetPasswordHelper.js');

exports.requestReset = (req, res) => {
    const { email } = req.body;
    resetPasswordHelper.requestReset(email, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(result);
    });
};

exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;
    resetPasswordHelper.resetPassword(token, newPassword, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(result);
    });
};

