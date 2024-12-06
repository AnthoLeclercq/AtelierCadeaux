import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { fetchFavorites, removeFavorite } from '../../services/favorite/favorite.service';
import { fetchProductDetails } from '../../services/product/product.service';
import { fetchUserDetails } from '../../services/user/user.service';
import userContext from '../../context/userContext';
import { useFocusEffect } from '@react-navigation/native';
import Header from "../../components/layout/header/Header";
import Ionicons from "react-native-vector-icons/Ionicons";

const normalizeProductImages = (product) => {
  if (typeof product.images_product === 'string') {
    return {
      ...product,
      images_product: [product.images_product],
    };
  }

  if (Array.isArray(product.images_product)) {
    return {
      ...product,
      images_product: product.images_product,
    };
  }

  try {
    const parsedImages = JSON.parse(product.images_product);
    if (Array.isArray(parsedImages)) {
      return {
        ...product,
        images_product: parsedImages,
      };
    }
  } catch (e) {
    console.error('Erreur lors du parsing de images_product:', e);
  }

  return {
    ...product,
    images_product: ['default_image_url'],
  };
};

const Favorites = () => {
  const { user } = useContext(userContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchFavorites(user.user_id, user.token);

          if (!data) {
            console.error('Aucune donnée de favoris reçue');
            setError('Erreur lors de la récupération des favoris');
            setLoading(false);
            return;
          }

          const productDetailsPromises = data
            .filter(fav => fav.fav_product)
            .map(async (fav) => {
              try {
                const productId = fav.fav_product;
                const response = await fetchProductDetails(productId);
                if (!response) {
                  console.error(`No data for product ${productId}`);
                  return null;
                }
                const productData = normalizeProductImages(response);
                const productImage = productData.images_product ? productData.images_product[0] : 'default_image_url';
                return { ...productData, type: 'Produit', id: fav.fav_id, productId, image: productImage, is_deleted: productData.is_deleted };
              } catch (err) {
                console.error(`Erreur lors de la récupération des détails du produit ${fav.fav_product}: `, err);
                return null;
              }
            });

          const artisanDetailsPromises = data
            .filter(fav => fav.fav_business)
            .map(async (fav) => {
              try {
                const userId = fav.fav_business;
                const response = await fetchUserDetails(userId);

                if (!response) {
                  console.error(`No data for artisan ${userId}`);
                  return null;
                }

                const artisanData = response;
                const artisanImage = artisanData.image_profile ? artisanData.image_profile : 'default_image_url';
                return { ...artisanData, type: 'Artisan', id: fav.fav_id, userId, image: artisanImage, is_deleted: artisanData.is_deleted };
              } catch (err) {
                console.error(`Erreur lors de la récupération des détails de l'artisan ${fav.fav_business}: `, err);
                return null;
              }
            });

          const productDetails = await Promise.all(productDetailsPromises);
          const artisanDetails = await Promise.all(artisanDetailsPromises);

          const allFavorites = [
            ...productDetails.filter(item => item),
            ...artisanDetails.filter(item => item)
          ];

          setFavorites(allFavorites);
        } catch (err) {
          console.error('Erreur lors de la récupération des favoris :', err.message);
          setError('Erreur lors de la récupération des favoris');
        } finally {
          setLoading(false);
        }
      };

      loadFavorites();
    }, [user.user_id, user.token])
  );

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId, user.token);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNavigate = async (fav) => {
    if (fav.type === 'Produit') {
      try {
        const productDetails = await fetchProductDetails(fav.productId);
        if (productDetails) {
          navigation.navigate('ProductDetails', { product: normalizeProductImages(productDetails) });
        } else {
          console.error('Détails du produit non trouvés');
        }
      } catch (err) {
        console.error('Erreur lors de la navigation vers ProductDetails:', err);
      }
    } else if (fav.type === 'Artisan') {
      try {
        navigation.navigate('VisitProfile', { userId: fav.userId });
      } catch (err) {
        console.error('Erreur lors de la navigation vers VisitProfile:', err);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
      </View>
    );
  }

  const renderActionsContainer = (fav) => {
    if (fav.is_deleted) {
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.indisponible}>
            <Text style={styles.indisponibleText}>Indisponible</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveFavorite(fav.id)} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={23} color="white" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleRemoveFavorite(fav.id)} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={23} color="white" />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.header}>Mes favoris</Text>
      {favorites.length > 0 ? (
        favorites.map((fav) => (
          <TouchableOpacity key={fav.id} style={[styles.favoriteItem, fav.is_deleted && styles.deletedItem]} onPress={() => handleNavigate(fav)}>
            <Image
              source={{ uri: typeof fav.image === 'string' ? fav.image : require('../../../assets/default_profile.jpg') }} 
              style={styles.image}
            />
            <View style={styles.detailsContainer}>
              <Text style={[styles.name, fav.is_deleted && styles.deletedText]}>{fav.name}</Text>
              
              <Text style={[styles.type, fav.is_deleted && styles.deletedText]}>{fav.type}</Text>
              {fav.type === 'Produit' ? (
                <Text style={[styles.price, fav.is_deleted && styles.deletedText]}>{fav.price} €</Text>
              ) : (
                <Text style={[styles.city, fav.is_deleted && styles.deletedText]}>{fav.city}</Text>
              )}
            </View>
            {renderActionsContainer(fav)}
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyMessage}>Aucun favori pour le moment</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  deletedItem: {
    backgroundColor: 'lightgrey', 
  },
  deletedText: {
    color: '#393939', 
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 30,
    backgroundColor: "darkgrey",
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 14,
    color: '#888',
  },
  price: {
    fontSize: 16,
    color: '#333',
  },
  city: {
    fontSize: 16,
    color: '#333',
  },
  actionsContainer: {
    gap: 5,
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: '#ff5c5c',
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    width: 50,
  },
  indisponible: {
    backgroundColor: '#393939',
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  indisponibleText: {
    color: "#fff"
  },
  emptyMessage: {
    paddingTop: 250,
    paddingBottom: 300,
    textAlign: 'center',
    fontSize: 18,
    color: 'darkgrey',
  },
});

export default Favorites;
