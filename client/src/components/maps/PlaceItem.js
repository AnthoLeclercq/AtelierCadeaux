import { View, Text, Image, Dimensions, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import userContext from "../../context/userContext";
import navigateArrow from '../../../assets/images/navigate_arrow.png';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlaceItem = ({ place, onNavigate }) => {
    const user = useContext(userContext);
    const navigation = useNavigation();

    const handleNavigate = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
        Linking.openURL(url);
    };

    const handleMove = () => {
        if (onNavigate) {
            onNavigate(place.latitude, place.longitude); 
        }
    };
    

    const handleGoToProfile = () => {
        if (user.user.token) {
            navigation.navigate('VisitProfile', { userId: place.user_id });
        } else {
            console.log("L'utilisateur n'est pas connecté.");
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['transparent', 'white', 'white']}>
            <Image
                    source={place.image_profile ? { uri: place.image_profile } : require("../../../assets/images/backround.png")}
                    style={styles.backgroundImage}
                />
                <View style={styles.buttonContainer}>
                    {user.user.token && (
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={handleGoToProfile}
                        >
                            <Ionicons name="person" color="white" size={25} />
                        </TouchableOpacity>
                    )}
                                        <TouchableOpacity
                        style={styles.profileButton}
                        onPress={handleMove}
                    >
                        <Icon name="place" size={25} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navigateButton}
                        onPress={handleNavigate}
                    >
                        <Image tintColor={'white'} source={navigateArrow} style={styles.navigateIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeAddress}>{place.address}</Text>
                    <Text style={styles.profession}>{place.profession}</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * 0.9,
        margin: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        position: 'relative', 
    },
    backgroundImage: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        zIndex: -1,
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 10, 
        left: 15,
        right: 15,
    },
    profileButton: {
        borderRadius: 8,
        backgroundColor: '#3E4A57',
        width: '25%', 
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        top: -100,
    },
    navigateButton: {
        borderRadius: 8,
        backgroundColor: '#E7BD06',
        width: '25%', 
        height: "100%",
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        top: -100,
    },
    navigateIcon: {
        width: 15,
        height: 15,
    },
    contentContainer: {
        padding: 15,
        marginTop: 50, 
    },
    placeName: {
        fontSize: 20,
        fontWeight: '500',
    },
    placeAddress: {
        color: 'gray',
    },
    profession: {
        fontSize: 15,
        fontWeight: '500',
        marginTop: 5,
    },
});

export default PlaceItem;
