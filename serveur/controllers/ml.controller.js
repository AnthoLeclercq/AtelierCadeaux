const { callFlaskAPI } = require('../services/ml.service');

const callFlask = async (req, res) => {
    try {
        const flaskResponse = await callFlaskAPI(req.body);
        res.status(200).json(flaskResponse);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Flask : ", error.message);
        res.status(500).json({ error: "Erreur lors de l'appel à l'API Flask." });
    }
};

module.exports = { callFlask };
