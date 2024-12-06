import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { fetchUserDetails } from '../../../services/user/user.service';
import FavoriteButton from '../../buttons/FavoriteButton';
import userContext from "../../../context/userContext";

const ProductAvailable = ({ product, navigation }) => {
    const { user } = useContext(userContext);
    const userId = user.user_id;
    const userRole = user.role;
    const [isFavorite, setIsFavorite] = useState(false);
    const [artisan, setArtisan] = useState(null);

    useEffect(() => {
        const getArtisanDetails = async () => {
          try {
            const artisanData = await fetchUserDetails(product.artisan_id);
            setArtisan(artisanData);
          } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'artisan :', error);
          }
        };
    
        getArtisanDetails();
      }, [product.artisan_id]);

    const handleFavoriteChange = () => {
        setIsFavorite(!isFavorite);
    };

    const shouldShowFavoriteButton = userRole === 'client';

    const handleProduct = () => {
        navigation.navigate('ProductDetails', { product });
    };

    const imageUri = Array.isArray(product.images_product) ? product.images_product[0] : product.images_product;

    return (
        <TouchableOpacity style={styles.container} onPress={handleProduct}>
            <View style={styles.imageContainer}>
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={styles.noImageText}>Aucune image disponible</Text>
                )}
                {shouldShowFavoriteButton && (
                    <FavoriteButton
                        userId={userId}
                        itemId={product.product_id}
                        onFavoriteChanged={handleFavoriteChange}
                    />
                )}
            </View>
            <Text style={styles.title}>{product.name}</Text>
            <View style={styles.productInfos}>
                <Text style={styles.artisanName}>{artisan ? artisan.name : 'Chargement...'}</Text>
                <Text style={styles.price}>{product.price} €</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ProductAvailable;

const styles = StyleSheet.create({
    container: {
        width: 170,
        margin: '3%',
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "lightgrey",
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
    },
    productImage: {
        width: '100%',
        height: 200,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginBottom: 10,
    },
    favoriteBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        padding: 7,
        borderRadius: 50,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: 10,
    },
    productInfos: {
        flexDirection: "row",
        gap: 30,
        alignItems: "center",
        marginBottom: 10,
    },
    price: {
        fontSize: 14,
        color: '#333',
    },
    artisanName: {
        fontSize: 12,
        color: '#666',
        maxWidth: "48%",
        maxHeight: 25,
        overflow: 'hidden',
        lineHeight: 25,
    },
    cartBtn: {
        width: '100%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: "lightgrey",
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginTop: 10,
    },
});
