// import { API_URL } from '@env';
const API_URL =  'http://192.168.200.178:3000';

export const fetchMetaData = async (metaKey) => {
  const formattedMetaKey = metaKey.replace(/\s+/g, '_');
  try {
      const response = await fetch(`${API_URL}/meta/all-except-subcategories`);
      if (!response.ok) throw new Error('Erreur de récupération des métadonnées');

      const data = await response.json();      
      const filteredData = data.data.find(item => item.meta_key === formattedMetaKey);
      return filteredData ? { meta_id: filteredData.meta_id, meta_values: filteredData.meta_values } : { meta_id: '', meta_values: [] };
  } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées:', error);
      throw error;
  }
};

export const fetchSubcategoriesByCategory = async (category) => {
  const formattedCategory = category.replace(/\s+/g, '_');
  try {
      const response = await fetch(`${API_URL}/meta/subcategories-by-category/${formattedCategory}`);
      if (!response.ok) throw new Error('Erreur de récupération des sous-catégories');
      
      const data = await response.json();
      return data.data;  
  } catch (error) {
      console.error('Erreur lors de la récupération des sous-catégories:', error);
      throw error;
  }
};

export const getProductMetasByProductId = async (productId, token) => {
    try {
      const response = await fetch(`${API_URL}/productMeta/product/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 404) {
        return { data: [] };
      }
  
      if (!response.ok) {
        const error = await response.text();
        console.error(`Erreur lors de la récupération des métadonnées: ${error}`);
        return { data: [] };
      }
  
      const data = await response.json();  
      return { data: data.data || [] };
    } catch (error) {
      console.error('Error getting product metas:', error);
      return { data: [] };
    }
  };

export const deleteProductMetasByProductId = async (productId, token) => {
    try {
      const response = await fetch(`${API_URL}/productMeta/product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression des métadonnées');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting product metas:', error);
      throw error;
    }
  };
  
export const addProductMeta = async (metaData, token) => {
    try {
      const response = await fetch(`${API_URL}/productMeta`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metaData),
      });
    
      if (!response.ok) {
        const error = await response.text();
        console.error(`Erreur lors de l'ajout de la métadonnée: ${error}`);
        throw new Error(`Erreur lors de l'ajout de la métadonnée: ${error}`);
      }
  
      const data = await response.json();  
      return data;
    } catch (error) {
      console.error('Error adding product meta:', error);
      throw error;
    }
};