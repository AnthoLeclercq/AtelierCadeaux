const fetch = require('node-fetch');

const callFlaskAPI = async (requestBody) => {
    const response = await fetch('http://127.0.0.1:8000/alfred', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`Erreur lors de l'appel à Flask: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};

module.exports = { callFlaskAPI };
