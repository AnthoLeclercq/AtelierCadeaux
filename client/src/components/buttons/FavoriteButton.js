import React, { useState, useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addFavorite, removeFavorite, fetchFavorites } from "../../services/favorite/favorite.service";
import userContext from "../../context/userContext";
import { useFocusEffect } from '@react-navigation/native';

const FavoriteButton = ({ userId, itemId, isArtisan, onFavoriteChanged }) => {
    const { user } = useContext(userContext);
    const { token } = user;
    const [isFavorite, setIsFavorite] = useState(false);
    const [favId, setFavId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const checkIfFavorite = async () => {
                setLoading(true);
                setError(null);
                try {
                    const favorites = await fetchFavorites(userId, token);                    
                    const favoriteItem = isArtisan
                        ? favorites.find(fav => fav.fav_business === itemId)
                        : favorites.find(fav => fav.fav_product === itemId);

                    if (favoriteItem) {
                        setIsFavorite(true);
                        setFavId(favoriteItem.fav_id);
                    } else {
                        setIsFavorite(false);
                        setFavId(null);
                    }
                } catch (error) {
                    console.error('Error fetching favorites:', error.message);
                    setError('Erreur lors de la récupération des favoris. Veuillez réessayer plus tard.');
                } finally {
                    setLoading(false);
                }
            };
            checkIfFavorite();
        }, [userId, itemId, token, isArtisan])
    );

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await removeFavorite(favId, token);
                setIsFavorite(false);
            } else {
                await addFavorite(userId, itemId, isArtisan, token);
                setIsFavorite(true);
            }
            onFavoriteChanged(); 
        } catch (error) {
            console.error('Error toggling favorite:', error.message);
            setError('Erreur lors de la modification du favori. Veuillez réessayer plus tard.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
            <Icon name="favorite" size={24} color={isFavorite ? 'red' : 'lightgrey'} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    favoriteBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        padding: 7,
        borderRadius: 50,
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
        color: 'red',
    },
});

export default FavoriteButton;
