async function getCoordinatesFromAddress(address) {
    const apiKey = 'a3c654d4925846568917342aa851a5fc';
    const encodedAddress = encodeURIComponent(address);
    const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${apiKey}`;

    try {
        // Appel à l'API Geoapify avec fetch
        const response = await fetch(apiUrl);
        
        // Vérifier si la requête a été réussie
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données de l\'API');
        }

        // Convertir la réponse en JSON
        const data = await response.json();

        // Vérifier si des résultats ont été retournés
        if (data.features && data.features.length > 0) {
            const { lat, lon } = data.features[0].properties;
            return { latitude: lat, longitude: lon };
        } else {
            console.log('Aucune coordonnée trouvée pour cette adresse.');
        }
    } catch (error) {
        console.log('Erreur lors de la récupération des coordonnées:', error.message);
    }
}

module.exports = {
    getCoordinatesFromAddress
}
