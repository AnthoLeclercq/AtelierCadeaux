//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Erreur de connexion');
  }

  return await response.json();
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    throw new Error("Erreur lors de la déconnexion");
  }
};

export async function registerUser({ username, email, password, setUser }) {
  if (!username || !email || !password) {
    throw new Error("Tous les champs doivent être remplis !");
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email: email,
        password: password,
        role: "client",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'enregistrement. Veuillez réessayer.");
    }

    const data = await response.json();
    const userInfo = data.data.data;
    console.log(userInfo)
    
    await AsyncStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    
    return userInfo;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    throw new Error(error.message || "Erreur inconnue lors de l'enregistrement.");
  }
}

export async function registerArtisan({ username, email, password, address, postalCode, city, setUser }) {
  if (!username || !email || !password || !address || !postalCode || !city) {
    throw new Error("Tous les champs doivent être remplis !");
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email: email,
        password: password,
        address: address,
        postalCode: postalCode,
        city: city,
        role: "artisan",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'enregistrement. Veuillez réessayer.");
    }

    const data = await response.json();
    const userInfo = data.data.data;
    console.log(userInfo);
    
    await AsyncStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    
    return userInfo;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    throw new Error(error.message || "Erreur inconnue lors de l'enregistrement.");
  }
}

export const requestPasswordReset = async (email) => {
  try {
      const response = await fetch(`${API_URL}/password/request-reset`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Une erreur est survenue');
      }

      return await response.json();
  } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
      throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
      const response = await fetch(`${API_URL}/password/reset-password`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.');
      }

      return await response.json();
  } catch (error) {
      throw new Error(`Erreur lors de la réinitialisation du mot de passe: ${error.message}`);
  }
};