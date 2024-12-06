//import { API_URL } from '@env';
const API_URL="http://192.168.200.178:3000"

export const fetchUserDetails = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`);
        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);   
        }
        const data = await response.json();
        return {
            user_id : data.data?.user_id || '',
            name: data.data?.name || '',
            email: data.data?.email || '',
            role: data.data?.role || '',
            address: data.data?.address || '',
            city: data.data?.city || '',
            zipcode: data.data?.zipcode || '',
            profession: data.data?.profession || '',
            description: data.data?.description || '',
            image_profile: data.data?.image_profile || '',
            image_bg: data.data?.image_bg || '',
            images_detail: data.data?.images_detail || [],
            is_deleted: data.data?.is_deleted || '',
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur :', error);
        throw error;
    }
};

export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const updateUser = async (userId, userDetails, token) => {
  try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        return { success: false, message: 'Erreur lors de la mise à jour du profil' };
      }
      const data = await response.json();
      return { success: true, ...data };
  } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      return { success: false, message: 'Erreur lors de la mise à jour du profil' };
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
          body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      return data.fileUrls ? data.fileUrls[0] : null;
  } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image :', error);
      throw error;
  }
};

export const deleteImage = async (userId, imageType, token) => {
  try {
      const response = await fetch(`${API_URL}/user/${userId}/${imageType}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'image');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'image :', error);
      throw error;
  }
};

export const deleteDetailImage = async (userId, imageUrl, token) => {
  try {
      const response = await fetch(`${API_URL}/user/${userId}/images_detail`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'image de détail');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'image de détail :', error);
      throw error;
  }
};

export const updatePassword = async (userId, newPassword, token) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                password: newPassword }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        if (response.ok) {
            return { success: true, ...data };
        } else {
            return { success: false, message: data.message || 'Erreur inconnue' };
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe :', error);
        return { success: false, message: error.message };
    }
};

