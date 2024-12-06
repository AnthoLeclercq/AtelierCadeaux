//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const addItemToCart = async (userId, artisanId, productId, price, token) => {
  try {
    const url = `${API_URL}/cart/${userId}`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        artisan_id: artisanId,
        product_id: productId,
        total_cost: price,
        quantity: 1
      }),
    };

    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to add item to cart1');
    }

    return responseData;
  } catch (error) {
    console.log('Error adding item to cart:2', error.message);
    throw error;
  }
};

export const addOneItem = async (cartId, productId, productQuantity, price, token) => {
  try {
    const url = `${API_URL}/cart/${cartId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        total_cost: price,
        quantity: productQuantity,
      }),
    };

    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to add item to cart1');
    }

    return responseData;
  } catch (error) {
    console.log('Error adding item to cart:2', error.message);
    throw error;
  }
};

export const fetchCartItems = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/cart/${userId}/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; 
      }
      throw new Error('Failed to fetch cart items');
    }

    const responseData = await response.json();

    if (!responseData.data || responseData.data.length === 0) {
      return []; 
    }

    return responseData.data;
  } catch (error) {
    console.log('Error fetching cart items:', error);
    throw error;
  }
};

export const removeOneItem = async (cartId, productId, productQuantity, totalCost, token) => {
  const response = await fetch(`${API_URL}/cart/${cartId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: productQuantity,
      total_cost: totalCost,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }

  return await response.json();
};

export const deleteItem = async (cartId, token) => {
  const response = await fetch(`${API_URL}/cart/${cartId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete item from cart');
  }

  return await response.json();
};

export const deleteCartItem = async (cartId, token) => {
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete cart item ${cartId}`);
    }

    return await response.json();
  } catch (error) {
    console.log('Error deleting cart item:', error);
    throw error;
  }
};