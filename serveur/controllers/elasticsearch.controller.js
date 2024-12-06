const searchService = require('../services/elasticsearch.service.js');

// Route pour rechercher dans tous les indices
const searchAll = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const results = await searchService.searchAll(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    searchAll
};