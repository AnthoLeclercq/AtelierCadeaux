import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addFavorite, removeFavorite, fetchFavorites } from "../../services/favorite/favorite.service";
import userContext from "../../context/userContext";
import { useFocusEffect } from '@react-navigation/native';

const FavoriteBusinessButton = ({ userId, artisanId, isArtisan, onFavoriteChanged }) => {
    const { user } = useContext(userContext);
    const { token } = user;
    const [isFavorite, setIsFavorite] = useState(false);
    const [favId, setFavId] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const checkIfFavorite = async () => {
                try {
                    const favorites = await fetchFavorites(userId, token);
                    const favoriteItem = favorites.find(fav => fav.fav_business === artisanId);
                    if (favoriteItem) {
                        setIsFavorite(true);
                        setFavId(favoriteItem.fav_id);
                    }
                } catch (error) {
                    console.error('Error fetching favorites:', error.message);
                }
            };
            checkIfFavorite();
        }, [userId, artisanId, token])
    );

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await removeFavorite(favId, token);
                setIsFavorite(false);
            } else {
                await addFavorite(userId, artisanId, isArtisan, token);
                setIsFavorite(true);
            }
            onFavoriteChanged(); 
        } catch (error) {
            console.error('Error toggling favorite:', error.message);
        }
    };

    return (
        <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
            <Icon name="favorite" size={24} color={isFavorite ? 'red' : 'lightgrey'} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    favoriteBtn: {
        position: 'absolute',
        top: 150,
        right: 10,
        backgroundColor: 'white',
        padding: 7,
        borderRadius: 50,
    },
});

export default FavoriteBusinessButton;
