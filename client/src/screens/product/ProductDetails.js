import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import AccessDenied from "../../components/modals/AccessDenied";
import AccountType from "../../components/modals/AccountType";
import ProductSuggestions from '../../components/elements/product/ProductSuggestion';
import { fetchUserDetails } from "../../services/user/user.service";
import { fetchProductMetasByProductId } from '../../services/product/product.service';
import userContext from "../../context/userContext";
import { addItemToCart } from '../../services/cart/cart.service';
import FavoriteButton from "../../components/buttons/FavoriteButton";
import ProductDeleted from '../../components/modals/ProductDeleted';
import { fetchCommentsByProductId } from '../../services/comment/comment.service';

const ProductDetails = ({ route, navigation }) => {
  const { user } = useContext(userContext);
  const { product } = route.params;
  const [artisan, setArtisan] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [modalTypeVisible, setModalTypeVisible] = useState(false);
  const [metaValues, setMetaValues] = useState([]); 
  const [averageRating, setAverageRating] = useState(0);

  const isUserLoggedIn = user && user.user_id !== null;
  const isUserArtisan = user && user.role === 'artisan';
  const isUserClient = user && user.role === 'client';

  useEffect(() => {
    if (product) {
      if (product.is_deleted === 1) {
        setModalStatusVisible(true);
      }

      const getArtisanDetails = async () => {
        try {
          const artisanData = await fetchUserDetails(product.artisan_id);
          setArtisan(artisanData);
        } catch (error) {
          console.log('Erreur lors de la récupération des détails de l\'artisan :', error);
        }
      };

      const fetchMetaProductsData = async () => {
        try {
          const productMetas = await fetchProductMetasByProductId(product.product_id);
          const metaValues = productMetas.map(meta => meta.meta_value);
          setMetaValues(metaValues); 
        } catch (error) {
          console.log('Erreur lors de la récupération des méta-produits :', error);
        }
      };

      getArtisanDetails();
      fetchMetaProductsData();
      
    } else {
      console.log('Product or product.artisan_id is undefined');
    }
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchCommentsByProductId(product.product_id);
        if (fetchedComments.length > 0) {
          const totalRating = fetchedComments.reduce((acc, comment) => acc + comment.rating, 0);
          setAverageRating(totalRating / fetchedComments.length);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.log('Erreur lors de la récupération des commentaires :', error);
      }
    };

    loadComments();
  }, [product]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddItemToCart = async () => {
    if (product.is_deleted === 1) {
      setModalStatusVisible(true);
      return;
    }
    if (isUserLoggedIn && isUserClient) {
      try {
        const token = user.token;
        const response = await addItemToCart(user.user_id, product.artisan_id, product.product_id, product.price, token);
        navigation.navigate('Cart');
      } catch (error) {
        console.log('Erreur lors de l\'ajout de l\'article au panier :', error);
      }
    } else if (isUserLoggedIn && isUserArtisan) {
      setModalTypeVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  const renderStars = () => {
    const filledStars = Math.round(averageRating);
    const emptyStars = 5 - filledStars;
  
    return (
      <View style={styles.starContainer}>
        {Array(filledStars).fill(0).map((_, i) => (
          <Ionicons key={i} name="star" size={20} color="gold" />
        ))}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Ionicons key={i} name="star-outline" size={20} color="gold" />
        ))}
      </View>
    );
  };
  
  const handleGoToProfile = () => {
    if (user && (user.role === 'artisan' || user.role === 'client')) {
      navigation.navigate('VisitProfile', { userId: product.artisan_id });
    } else {
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleCommentPress = (productId) => {
    if (productId) {
      navigation.navigate('Comment', { productId }); 
    } else {
      console.log('productId is undefined'); 
    }
  };

  const handleStatusModalClose = () => {
    setModalStatusVisible(false);
  };

  const handleTypeModalClose = () => {
    setModalTypeVisible(false);
  };

  const colorClasses = [styles.metaColor1, styles.metaColor2, styles.metaColor3, styles.metaColor4, styles.metaColor5];

  const renderProductImages = (imagesProduct) => {
    if (typeof imagesProduct === 'string') {
      return (
        <View style={[styles.singleImageContainer]}>
          <Image source={{ uri: imagesProduct }} style={styles.photoPlaceholder} />
        </View>
      );
    } else if (Array.isArray(imagesProduct) && imagesProduct.length === 1) {
      return (
        <View style={[styles.singleImageContainer]}>
          <Image source={{ uri: imagesProduct[0] }} style={styles.photoPlaceholder} />
        </View>
      );
    } else if (Array.isArray(imagesProduct)) {
      return (
        <ScrollView horizontal style={styles.photoSlider}>
          {imagesProduct.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.photoPlaceholder} />
          ))}
        </ScrollView>
      );
    } else {
      return <Text style={styles.noImageText}>Aucune image disponible</Text>;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <Ionicons name={"arrow-back-outline"} color={"black"} size={25} />
      </TouchableOpacity>
      <View style={styles.photoSliderWrapper}>
        {renderProductImages(product.images_product)}
      </View>
      <View style={styles.separator} />
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{product.name}</Text>
        {isUserClient && (
          <FavoriteButton
            userId={user.user_id}
            itemId={product.product_id}
            onFavoriteChanged={handleFavoriteToggle}
            isArtisan={false}
          />
        )}
      </View>
      <ScrollView horizontal style={styles.categoryInfo}>
        {metaValues.map((value, index) => (
          <View key={index} style={[styles.categoryButton, styles.metaButton, colorClasses[index % colorClasses.length]]}>
            <Text style={styles.categoryText}>{value}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.notationContainer}>
      {averageRating > 0 && renderStars()}
      </View>
      <Text style={styles.description}>{product.description}</Text>
      <View style={styles.artAndPriceContainer}>
        <TouchableOpacity style={styles.artisanPriceContainer} onPress={handleGoToProfile}>
          <View style={styles.artisanImageContainer}>
            {artisan ? (
              <Image
                source={artisan.image_profile ? { uri: artisan.image_profile } : require('../../../assets/default_profile.jpg')}
                style={styles.artisanImagePlaceholder} 
              />
            ) : (
              <View style={styles.artisanImagePlaceholder} />
            )}
          </View>
          <Text style={styles.artisanText}>{artisan ? artisan.name : 'Chargement...'}</Text>
        </TouchableOpacity>
        <Text style={styles.priceText}>{product.price} €</Text>
      </View>
      <View style={styles.addInfoContainer}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={() => handleCommentPress(product.product_id)}>
          <Text style={styles.cartBtn}>Commentaires</Text>
          <Ionicons name={"chatbox-outline"} color={"black"} size={25} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddItemToCart}>
          <Text style={styles.cartBtn}>Ajouter au panier</Text>
          <Ionicons name={"cart"} color={"black"} size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionText}>Vous pourriez être intéressé par</Text>
        <ProductSuggestions metaValues={metaValues} currentProduct={product.product_id}/>
        <AccessDenied
          visible={modalVisible}
          onClose={handleModalClose}
        />
        <AccountType
          visible={modalTypeVisible}
          onClose={handleTypeModalClose}
        />
        <ProductDeleted
          visible={modalStatusVisible}
          onClose={handleStatusModalClose}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    padding: 10,
    backgroundColor: 'white',
    marginLeft: -10,
    marginRight: -10,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: "lightgrey",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 25,
    left: 5,
    zIndex: 2,
  },
  photoSliderWrapper: {
    marginTop: 5,
    width: '100%',
  },
  photoSlider: {
    flexDirection: 'row',
  },
  singleImageContainer: {
    justifyContent: "center", 
    alignItems: "center", 
    width: '100%',
  },
  photoPlaceholder: {
    width: 300,
    height: 300,
    backgroundColor: 'lightgray',
    marginRight: 10,
  },
  noImageText: {
    width: 300,
    height: 300,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 300,
    color: 'gray',
  },
  addInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  addToCartBtn: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    marginTop: 20,
    marginRight: 10,
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    justifyContent: "space-around",
    maxWidth: 150,
  },
  notationContainer: {
    marginHorizontal: 15,
    marginVertical: 15,

  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    marginHorizontal: 15,
  },
  productName: {
    paddingTop: 15,
    fontSize: 22,
    paddingLeft: 5,
    fontWeight: 'bold',
    maxWidth: 300,
  },
  favoriteBtn: {
    padding: 10,
    borderRadius: 50,
  },
  categoryInfo: {
    flexDirection: "row",
    marginHorizontal: 15,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#e5b416',
    borderRadius: 10,
    marginTop: 10,
    marginRight: 15,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  metaColor1: { backgroundColor: '#c29a14' }, 
  metaColor2: { backgroundColor: '#e5b416' }, 
  metaColor3: { backgroundColor: '#f1c644' },
  metaColor4: { backgroundColor: '#f7d36b' }, 

  description: {
    fontSize: 16,
    textAlign: "justify",
    marginHorizontal: 15,
  },
  artAndPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 15,
  },
  artisanPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  artisanImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  artisanImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'lightgray',
  },
  artisanText: {
    fontSize: 16,
  },
  priceText: {
    fontSize: 16,
  },
  suggestionContainer:{
    marginHorizontal: 10,
    marginBottom: 30,
  },
  suggestionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default ProductDetails;
