//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const callAlfredAPI = async (selectedOptions) => {
    try {
      const requestBody = selectedOptions;
  
      const response = await fetch(`${API_URL}/ml/call-flask`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de l'appel à Alfred: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Alfred :", error.message);
      throw error;
    }
  };
  