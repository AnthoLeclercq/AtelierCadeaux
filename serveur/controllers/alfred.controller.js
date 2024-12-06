const alfredService = require('../services/alfred.service');

async function predict(req, res) {
    const { product_name } = req.body;

    if (!product_name) {
        return res.status(400).json({ error: 'No product name provided' });
    }

    try {
        const prediction = await alfredService.getPrediction(product_name);
        return res.json(prediction);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get prediction' });
    }
}

module.exports = {
    predict,
};
