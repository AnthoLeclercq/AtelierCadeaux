//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const fetchCommentsByProductId = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/comment/product/${productId}`);
      if (!response.ok) {
        throw new Error('Ici Erreur lors de la récupération des commentaires');
      }
      const data = await response.json();
      return data.data; 
    } catch (error) {
      console.log('Erreur lors de la récupération des commentaires :', error);
      throw error;
    }
  };
  
  export const deleteCommentById = async (comment_id, token) => {
    try {
      const response = await fetch(`${API_URL}/comment/${comment_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du commentaire');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire :', error);
      throw error;
    }
  };

  export const submitComment = async (userId, { productId, rating, content }, token) => {
    try {
        const response = await fetch(`${API_URL}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                rating: rating,
                content: content
            })
        });

        if (!response.ok) {
            throw new Error('Failed to submit comment');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error submitting comment:', error);
        throw error;
    }
};