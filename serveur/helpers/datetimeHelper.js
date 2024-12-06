const moment = require('moment-timezone');

// Fonction pour obtenir l'heure actuelle au format HH:MM:SS en France
const getCurrentTimeInFrance = () => {
    return moment().tz('Europe/Paris').format('HH:mm:ss');
};

module.exports = {
    getCurrentTimeInFrance
};