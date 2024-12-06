import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchUserDetails } from "../../services/user/user.service";
import Ionicons from "react-native-vector-icons/Ionicons";
import userContext from '../../context/userContext';
import FavoriteBusinessButton from '../../components/buttons/FavoriteBusinessButton';
import ProductAvailable from '../../components/elements/product/ProductAvailable';
import { fetchProducts } from '../../services/product/product.service';
import UserDeleted from '../../components/modals/UserDeleted';

const VisitProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const { user } = useContext(userContext);
  const [products, setProducts] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    profession: '',
    city: '',
    role: '',
    description: '',
    profileImage: null,
    bgImage: null,
    detailImages: [],
    is_deleted: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);

  const loadArtisanDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchUserDetails(userId);
      setProfileData({
        name: data.name || '',
        profession: data.profession || '',
        city: data.city || '',
        role: data.role || '',
        description: data.description || '',
        profileImage: data.image_profile || null,
        bgImage: data.image_bg || null,
        detailImages: Array.isArray(data.images_detail) ? data.images_detail : [],
        is_deleted: data.is_deleted || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtisanDetails();
  }, [userId]);

  useEffect(() => {
    if (profileData.role === 'artisan') {
      const loadProducts = async () => {
        try {
          const allProducts = await fetchProducts();
          const artisanProducts = allProducts
            .filter(product => product.artisan_id === userId && product.is_deleted !== 1);
          setProducts(artisanProducts);
        } catch (err) {
          setError(err.message);
        }
      };

      loadProducts();
    }
  }, [profileData]);


  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleFavoriteChanged = () => {
    loadArtisanDetails();
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

  const handleArtisanContact = () => {
    if (profileData.is_deleted === 1) {
      setModalStatusVisible(true);
      return;
    }
    if (profileData && user.role === 'client') {
      navigation.navigate("DiscussionDetails", { userId: userId });
    } else {
      Alert.alert('Erreur', 'Vous ne pouvez pas contacter cet utilisateur');
    }
  };

  const handleStatusModalClose = () => {
    setModalStatusVisible(false);
  };

  const handleGeoLoc = () => {
    navigation.navigate('ContextMap', { userId });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <ImageBackground
          source={profileData.bgImage ? { uri: profileData.bgImage } : require('../../../assets/default_bg.jpg')}
          style={styles.banner}
          resizeMode="cover">
          <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
            <Ionicons name="arrow-back-outline" color="white" size={25} />
          </TouchableOpacity>
          {profileData.profileImage ? (
            <Image
              source={{ uri: profileData.profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <Image source={require('../../../assets/default_profile.jpg')} style={styles.profileImage} />
          )}
          <TouchableOpacity style={styles.helpButton} onPress={() => navigation.navigate('FAQ')}>
            <Icon name="help-outline" size={30} color="black" />
          </TouchableOpacity>
          {profileData.role === 'artisan' && user.role !== 'artisan' && (
            <FavoriteBusinessButton
              userId={user.user_id}
              artisanId={userId}
              isArtisan={true}
              onFavoriteChanged={handleFavoriteChanged}
            />
          )}
        </ImageBackground>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profileData.name || 'Nom de l\'artisan'}</Text>
          {profileData.is_deleted === 1 ? (
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.indisponible}>
                <Text style={styles.indisponibleText}>Indisponible</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Icon name="work" size={20} color="#555" />
                <Text style={styles.profession}>{profileData.profession || 'Profession'}</Text>
              </View>
              <TouchableOpacity style={styles.infoGeoRow} onPress={handleGeoLoc}>
                <Icon name="place" size={20} color="white" />
                <Text style={styles.infoAddress}>{profileData.city || 'Ville'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.separator} />
        <Text style={styles.description}>
          {profileData.description || 'Cet utilisateur n\'a pas encore mis de description. \nSoyez patients, ça arrive !'}
        </Text>
        <View style={styles.separator} />
        <View style={styles.buttonContainer}>
          {profileData.role === 'artisan' && user.role !== 'artisan' && (
            <TouchableOpacity style={styles.button} onPress={handleArtisanContact}>
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.photoGrid}>
          {profileData.detailImages.length > 0 ? (
            profileData.detailImages.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.photo} resizeMode="cover" />
            ))
          ) : (
            <Text style={styles.imagesText}>Cet utilisateur n'a pas encore d'images</Text>
          )}
        </View>
        <View style={styles.separator} />
        {profileData.role === 'artisan' && (
          <View>
            <Text style={styles.productAvailableHeader}>Produits Disponibles</Text>
            <View style={styles.productAvailable}>
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductAvailable key={product.product_id} product={product} navigation={navigation} />
                ))
              ) : (
                <Text style={styles.noProductsText}>Aucun produit disponible pour le moment</Text>
              )}
            </View>
          </View>
        )}
      </View>
      <UserDeleted
        visible={modalStatusVisible}
        onClose={handleStatusModalClose}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    marginLeft: -10,
    marginRight: -10,
    backgroundColor: 'white',
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
  profileContainer: {
    alignItems: 'center',
    padding: 10,
  },
  banner: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: "#3E4A57",
    borderRadius: 20,
    marginLeft: 20,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    top: 5,
    left: -10,
    position: "absolute",
    zIndex: 2,
  },
  helpButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 50,
  },
  profileImage: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    top: 100,
  },
  profileImagePlaceholder: {
    width: 170,
    height: 170,
    backgroundColor: 'grey',
    borderRadius: 85,
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    top: 100,
  },
  infoContainer: {
    marginTop: 90,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: 10,
    gap: 5,
    alignItems: "center",
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
  profession: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
  },
  infoAddress: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
    margin: 10,
    width: "85%",
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '85%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
    marginTop: -10,
  },
  button: {
    backgroundColor: '#E7BD06',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: 160,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: "center",
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  photo: {
    width: 170,
    height: 170,
    backgroundColor: 'lightblue',
    margin: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoGeoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: "#E7BD06",
    padding: 10,
    color: "white",
    paddingRight: 15,
  },
  productAvailable: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  productAvailableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 10,
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default VisitProfile;
