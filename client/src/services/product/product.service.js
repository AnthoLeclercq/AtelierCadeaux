//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const addProduct = async (productData, artisanId, token) => {
  try {
    const response = await fetch(`${API_URL}/product/${artisanId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.log(JSON.stringify(responseData))
    }

    return { success: true, data: responseData.data };
  } catch (error) {
    console.log('Erreur lors de l\'ajout du produit:');
    return { success: false, error: JSON.parse(error.message) };
  }
};

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/product/`);
    if (response.status === 404) {
      return [];
    }
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log('Erreur lors de la récupération des produits :', error);
    return [];
  }
};

export const fetchLatestProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/product/`);
    if (response.status === 404) {
      return [];
    }
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des produits : ${response.statusText}`);
    }

    const result = await response.json();
    const data = result.data;

    if (!Array.isArray(data)) {
      throw new Error('Les données reçues ne sont pas un tableau');
    }

    const sortedProducts = data.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      return dateB - dateA;
    });

    return sortedProducts.slice(0, 6);
  } catch (error) {
    console.log('Erreur lors de la récupération des produits:', error);
    return [];
  }
};

export const fetchProductsByArtisanId = async (artisanId) => {
  try {
    const response = await fetch(`${API_URL}/product/`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits');
    }
    const data = await response.json();
    const artisanProducts = data.data;
    return artisanProducts;
  } catch (error) {
    console.log('Erreur lors de la récupération des produits :', error);
    throw error;
  }
};

export const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/product/${productId}`);
    const data = await response.json();
    return {
      product_id: data.data.product_id,
      name: data.data.name,
      description: data.data.description,
      artisan_id: data.data.artisan_id,
      price: data.data.price,
      images_product: data.data.images_product,
      is_deleted: data.data.is_deleted,
    };
  } catch (error) {
    console.log("Error fetching product details:", error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedProductData, token) => {
  try {
    const response = await fetch(`${API_URL}/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProductData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du produit',
      };
    }
    const data = await response.json();
    return {
      success: true,
      data: data, 
    };
  } catch (error) {
    console.log('Erreur lors de la mise à jour du produit :', error);
    return {
      success: false,
      message: 'Erreur lors de la mise à jour du produit',
    };
  }
};

export const uploadImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('images', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'image.jpg',
  });

  try {
    const response = await fetch(`${API_URL}/image/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${responseBody}`);
    }

    const data = JSON.parse(responseBody);
    return data.fileUrls ? data.fileUrls[0] : null;
  } catch (error) {
    console.log('Erreur lors du téléchargement de l\'image :', error);
    throw error;
  }
};

export const deleteImage = async (productId, imageUrl, token) => {
  try {
    const response = await fetch(`${API_URL}/product/image/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Erreur lors de la suppression de l\'image :', error);
    throw error;
  }
};

export const fetchProductMetasByProductId = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/productMeta/product/${productId}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }
    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.log('Erreur lors de la récupération des méta-données pour le produit :', error);
    throw error;
  }
};

export const fetchProductIdByMetaValues = async (metaValues) => {
  try {
    const response = await fetch(`${API_URL}/productMeta/getProductIdByMetaValues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ metaValues }),
    });

    if (!response.ok) {
      console.log("Erreur ID:",response.status)
    }

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.log('Erreur lors de la récupération des IDs de produits:');
  }
};

export const fetchSuggestedProducts = async (metaValues) => {
  try {
    const productIds = await fetchProductIdByMetaValues(metaValues);

    if (productIds.length === 0) {
      return [];
    }

    const suggestedProducts = await Promise.all(
      productIds.map(async (productId) => {
        try {
          return await fetchProductDetails(productId);
        } catch (error) {
          console.log(`Erreur lors de la récupération des détails du produit ${productId}:`, error);
          return null; $
        }
      })
    );
    return suggestedProducts.filter(product => product !== null);

  } catch (error) {
    console.log('Erreur lors de la récupération des produits suggérés:', error);
    return [];
  }
};

export const deleteProductById = async (productId, token) => {
  console.log(productId, token)
  try {
    const response = await fetch(`${API_URL}/product/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du produit');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
