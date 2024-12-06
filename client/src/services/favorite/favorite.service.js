//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const getAllFavorites = async (token) => {
    try {
      const response = await fetch(`${API_URL}/favorite`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des favoris: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Erreur dans getAllFavorites:", error);
      throw error;
    }
  };

export const fetchFavorites = async (userId, token) => {
    try {
        const response = await fetch(`${API_URL}/favorite/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            return []; 
        }

        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        return data.data || []; 
    } catch (error) {
        console.error('Error fetching favorites:', error.message);
        throw error;
    }
};

export const addFavorite = async (userId, itemId, isArtisan, token) => {
    try {
        const response = await fetch(`${API_URL}/favorite/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                product_id: isArtisan ? null : itemId,
                artisan_id: isArtisan ? itemId : null,
            }),
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Failed to add favorite: ${responseText}`);
        }
        const data = JSON.parse(responseText);
        return data;
    } catch (error) {
        console.error('Error adding favorite:', error.message);
        throw error;
    }
};

export const removeFavorite = async (favId, token) => {
    console.log(favId, token)
    try {
        const response = await fetch(`${API_URL}/favorite/${favId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Failed to remove favorite: ${responseText}`);
        }
        const data = JSON.parse(responseText);
        return data;
    } catch (error) {
        console.error('Error removing favorite:', error.message);
        throw error;
    }
};
