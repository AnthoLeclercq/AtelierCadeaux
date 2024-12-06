//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const getAllDiscussions = async () => {
    try {
      const response = await fetch(`${API_URL}/discussions`);
      const result = await response.json();
      if (response.ok) {
        return result.data;
      } else {
        throw new Error(result.msg || 'Erreur lors de la récupération des discussions');
      }
    } catch (error) {
      console.log('Erreur dans getAllDiscussions:', error);
      throw error;
    }
  };
  
  export const getDiscussionsByClientId = async (clientId) => {
    try {
      const response = await fetch(`${API_URL}/discussions/client/${clientId}`);
      const result = await response.json();
      if (response.ok) {
        return result.data;
      } else {
        throw new Error(result.msg || 'Erreur lors de la récupération des discussions par client ID');
      }
    } catch (error) {
      console.log('Erreur dans getDiscussionsByClientId:', error);
      throw error;
    }
  };
  
  export const getDiscussionsByArtisanId = async (artisanId) => {
    try {
      const response = await fetch(`${API_URL}/discussions/artisan/${artisanId}`);
      const result = await response.json();
      if (response.ok) {
        return result.data;
      } else {
        throw new Error(result.msg || 'Erreur lors de la récupération des discussions par artisan ID');
      }
    } catch (error) {
      console.log('Erreur dans getDiscussionsByArtisanId:', error);
      throw error;
    }
  };
  
  export const createDiscussion = async (newDiscussion) => {
    try {
      const response = await fetch(`${API_URL}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiscussion),
      });
  
      const result = await response.json();
      if (response.ok) {
        return result.data;
      } else {
        throw new Error(result.msg || 'Erreur lors de la création de la discussion');
      }
    } catch (error) {
      console.log('Erreur dans createDiscussion:', error);
      throw error;
    }
  };
  
  export const updateDiscussion = async (discussionId, messages) => {
    try {
      const response = await fetch(`${API_URL}/discussions/${discussionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
  
      const result = await response.json();
      if (response.ok) {
        return result.data;
      } else {
        throw new Error(result.msg || 'Erreur lors de la mise à jour de la discussion');
      }
    } catch (error) {
      console.log('Erreur dans updateDiscussion:', error);
      throw error;
    }
  };
