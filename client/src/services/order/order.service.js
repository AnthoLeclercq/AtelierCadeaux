//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const fetchOrders = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/order/${userId}/all`);

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/order/${orderId}`);
    const orderDetailsWithArticles = await response.json();
    const articles = await fetchArticleDetails(orderId);
    orderDetailsWithArticles.articles = articles;
    return orderDetailsWithArticles;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

export const fetchArticleDetails = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/order/${orderId}/details`);
    const articles = await response.json();

    const articleDetailsPromises = articles.data.map(async (article) => {
      const productResponse = await fetch(`${API_URL}/product/${article.product_id}`);
      const productData = await productResponse.json();
      const productWithFirstImage = {
        ...productData.data,
        images: productData.data.images_product.length > 0 ? `${API_URL}/${productData.data.images_product[0]}` : null,
      };
      return { ...article, product: productWithFirstImage };
    });

    const articlesWithProductDetails = await Promise.all(articleDetailsPromises);
    return articlesWithProductDetails;
  } catch (error) {
    console.error("Error fetching article details:", error);
    throw error;
  }
};

export const fetchOrdersForArtisan = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/order`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid content type');
    }

    const responseData = await response.json();

    const orders = responseData.data;
    if (!Array.isArray(orders)) {
      throw new Error('Invalid data format');
    }

    const artisanOrders = orders.filter(order => order.artisan_id === userId);
    return artisanOrders;
  } catch (error) {
    console.error("Error fetching orders for artisan:", error);
    throw error;
  }
};

export const fetchArtisanDetails = async (artisanId) => {
  try {
    const response = await fetch(`${API_URL}/user/${artisanId}`);
    const artisan = await response.json();
    return artisan.data;
  } catch (error) {
    console.error("Error fetching artisan details:", error);
    throw error;
  }
};

export const createOrder = async (userId, artisanId, totalCost, items, token) => {
  try {
    const response = await fetch(`${API_URL}/order/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        artisan_id: artisanId,
        total_cost: totalCost,
        items: items,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId, token) => {
  try {
    const response = await fetch(`${API_URL}/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'Cancelled' }),
    });

    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to cancel order');
    }

    return response.json();
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export const updateOrderStatusById = async (orderId, status, token) => {
  try {
    const response = await fetch(`${API_URL}/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.text(); 
      console.error('Error response:', errorData);
      throw new Error('Erreur lors de la mise à jour du statut de la commande');
    }
    
    return await response.json(); 
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
