const fetch = require('node-fetch');
const db = require("../helpers/database.js");

const API_URL = 'http://192.162.71.52:5002/predict';

async function getPrediction(productName) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_name: productName }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        await savePrediction(data);

        return data;
    } catch (error) {
        console.error('Error fetching prediction:', error);
        throw error;
    }
}

async function savePrediction(prediction) {
    const insertQuery = `
        INSERT INTO predictions (age, customization, personality, product_name, gender, preference_type)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        prediction.Age,
        prediction.Personnalisation,
        prediction.Personnalite,
        prediction.Produits,
        prediction.Sexe,
        prediction.TypePreference
    ];

    return new Promise((resolve, reject) => {
        db.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('Error inserting prediction:', err);
                reject(err);
            } else {
                resolve(res.insertId);
            }
        });
    });
}

module.exports = {
    getPrediction,
};
