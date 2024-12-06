const client = require('../helpers/elasticsearchConfigHelper.js');

// Fonction pour rechercher dans tous les indices
const searchAll = async (query) => {
    try {
        // Crée des requêtes pour chaque index
        const searches = [
            {
                index: 'products',
                body: {
                    query: {
                        wildcard: {
                            name: `*${query}*`
                        }
                    }
                }
            },
            {
                index: 'product_meta',
                body: {
                    query: {
                        wildcard: {
                            meta_value: `*${query}*`
                        }
                    }
                }
            },
            {
                index: 'users',
                body: {
                    query: {
                        bool: {
                            should: [
                                { wildcard: { name: `*${query}*` } },
                                { wildcard: { email: `*${query}*` } }
                            ],
                            minimum_should_match: 1
                        }
                    }
                }
            }
        ];

        // Exécute toutes les recherches en parallèle
        const results = await Promise.all(searches.map(search => client.search(search)));

        // Formate les résultats
        return {
            products: results[0].hits.hits,
            product_meta: results[1].hits.hits,
            users: results[2].hits.hits
        };
    } catch (error) {
        console.error('Error searching all indices:', error);
        throw new Error('Error searching all indices');
    }
};

module.exports = {
    searchAll
};
