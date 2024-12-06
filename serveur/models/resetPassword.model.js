const db = require('../helpers/database');
const crypto = require('crypto');
const authHelper = require('../helpers/authHelper');

const ResetPassword = function () { };

/************ Generate token for a user ***********************/
ResetPassword.generateToken = (user_id, callback) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // Expire dans 1 heure

    const query = 'INSERT INTO password_resets (user_id, token, expires) VALUES (?, ?, ?)';
    db.query(query, [user_id, token, expires], (err, res) => {
        if (err) return callback(err, null);
        callback(null, token);
    });
};

/************ Check reset token ***********************/
ResetPassword.verifyToken = (token, callback) => {
    const query = 'SELECT * FROM password_resets WHERE token = ? AND expires > NOW()';
    db.query(query, [token], (err, res) => {
        if (err) return callback(err, null);
        if (res.length === 0) return callback(null, { valid: false });
        callback(null, { valid: true, user_id: res[0].user_id });
    });
};

/************ Update user password with encryption ***********************/
ResetPassword.updatePassword = (user_id, newPassword, callback) => {
    authHelper.encryptPassword(newPassword)
        .then(hash => {
            const query = 'UPDATE users SET password = ? WHERE user_id = ?';
            db.query(query, [hash, user_id], (err, res) => {
                if (err) return callback(err, null);
                callback(null, { status: 200, msg: 'Password updated successfully' });
            });
        })
        .catch(err => callback(err, null));
};

/************ Delete the temporary token ***********************/
ResetPassword.deleteToken = (token, callback) => {
    const query = 'DELETE FROM password_resets WHERE token = ?';
    db.query(query, [token], (err, res) => {
        if (err) return callback(err, null);
        callback(null, { status: 200, msg: 'Token deleted successfully' });
    });
};

module.exports = ResetPassword;
