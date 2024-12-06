const ResetPassword = require('../models/resetPassword.model.js');
const User = require('../models/user.model.js');
const nodemailer = require('nodemailer');

// Configurer le transporteur pour envoyer les emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const requestReset = (email, callback) => {
    User.getUserByEmail(email, (err, userResult) => {
        if (err) return callback(err, null);

        const user_id = userResult.data.user_id;
        ResetPassword.generateToken(user_id, (err, token) => {
            if (err) return callback(err, null);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Réinitialisation du mot de passe',
                html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
                    <div style="max-width: 600px; background-color: #ffffff; padding: 30px; margin: auto; border-radius: 10px;">
                        <h2 style="color: #333333;">Réinitialisation du mot de passe</h2>
                        <p style="color: #555555;">Vous avez demandé une réinitialisation de mot de passe. Veuillez copier le code suivant dans votre espace "Réinitialisation du mot de passe" :</p>
                        <div style="margin: 20px 0;">
                            <input type="text" value="${token}" readonly 
                                   style="width: 100%; padding: 10px; font-size: 16px; border: 1px solid #dddddd; border-radius: 5px; text-align: center; cursor: text;" />
                        </div>
                        <p style="color: #555555;">Sélectionnez et copiez manuellement le code ci-dessus.</p>
                    </div>
                </div>
                `
            };
            

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return callback(err, null);
                callback(null, { message: 'Password reset email sent successfully' });
            });
        });
    });
};

const resetPassword = (token, newPassword, callback) => {
    ResetPassword.verifyToken(token, (err, result) => {
        if (err) return callback(err, null);
        if (!result.valid) return callback(null, { message: 'Invalid or expired token' });

        const { user_id } = result;
        ResetPassword.updatePassword(user_id, newPassword, (err, updateResult) => {
            if (err) return callback(err, null);

            ResetPassword.deleteToken(token, (err, deleteResult) => {
                if (err) return callback(err, null);
                callback(null, { message: 'Password reset successfully' });
            });
        });
    });
};

module.exports = {
    requestReset,
    resetPassword
};
