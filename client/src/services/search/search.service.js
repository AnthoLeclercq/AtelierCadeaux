//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const searchProductsAndArtisans = async (query) => {
    try {
      const response = await fetch(`${API_URL}/elasticsearch/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching search results:', error);
      throw error;
    }
  };