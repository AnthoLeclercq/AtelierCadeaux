import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { fetchUserDetails } from '../../../services/user/user.service';
import userContext from "../../../context/userContext";
import FavoriteBusinessButton from '../../buttons/FavoriteBusinessButton';

const UserItem = ({ userId, navigation }) => {
    const { user } = useContext(userContext);
    const loggedInUserId = user ? user.user_id : null; 
    const userRole = user ? user.role : null; 
    const [userDetails, setUserDetails] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const userData = await fetchUserDetails(userId);
                setUserDetails(userData);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l\'utilisateur :', error);
            }
        };

        getUserDetails();
    }, [userId]);

    const handleFavoriteChange = () => {
        setIsFavorite(!isFavorite);
    };

    const shouldShowFavoriteBusinessButton = userRole === 'client';

    const handleUserProfile = () => {
        navigation.navigate('VisitProfile', { userId: userId });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handleUserProfile}>
            <View style={styles.imageContainer}>
                {userDetails && userDetails.profile_image ? (
                    <Image
                        source={{ uri: userDetails.profile_image }}
                        style={styles.userImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Image source={require('../../../../assets/default_profile.jpg')} style={styles.userImage} /> 
                )}
                {shouldShowFavoriteBusinessButton && (
                    <FavoriteBusinessButton
                        userId={loggedInUserId}
                        itemId={userId}
                        onFavoriteChanged={handleFavoriteChange}
                    />
                )}
            </View>
            <Text style={styles.name}>{userDetails ? userDetails.name : 'Chargement...'}</Text>
            <Text style={styles.role}>{userDetails ? userDetails.role : 'Chargement...'}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '44%',
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
    userImage: {
        width: '100%',
        height: 200,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginBottom: 10,
        backgroundColor: "grey",
    },
    noImageText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: 5,
    },
    role: {
        fontSize: 14,
        color: '#666',
        textAlign: "center",
        marginBottom: 10,
    },
});

export default UserItem;
