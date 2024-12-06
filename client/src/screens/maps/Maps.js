import React, { useEffect, useState, useContext } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { styles } from './Maps.styles';
import * as Location from 'expo-location';
import PlaceListView from '../../components/maps/PlaceListView';
import Markers from '../../components/maps/Markers';
import { getCoordinatesFromAddress } from '../../services/map/geocoding';
import { fetchAllUsers } from '../../services/user/user.service';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import userContext from '../../context/userContext';

const Maps = ({ userId: routeUserId }) => { 
  const connectedUserId = useContext(userContext);
  const [location, setLocation] = useState({ latitude: 48.866667, longitude: 2.333333 });
  const [errorMsg, setErrorMsg] = useState(null);
  const [listArtisant, setListArtisant] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      try {
        const users = await fetchAllUsers();
        const artisanList = await Promise.all(users.data
          .filter(user => user.role === 'artisan')
          .map(async (user) => {
            const address = `${user.address}, ${user.zipcode} ${user.city}, France`;

            try {
              const coordinates = await getCoordinatesFromAddress(address);
              return {
                user_id: user.user_id,
                name: user.name,
                image_profile: user.image_profile,
                address: address,
                profession: user.profession,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              };
            } catch (error) {
              console.log(`Erreur lors de la récupération des coordonnées pour ${address}:`, error);
              return null;
            }
          })
        );

        setListArtisant(artisanList.filter(artisan => artisan !== null));

        if (routeUserId) {
          const artisan = artisanList.find(user => user.user_id === routeUserId);
          if (artisan) {
            setLocation({ latitude: artisan.latitude, longitude: artisan.longitude });
          }
        }

      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }

    })();
  }, [routeUserId]);

  const updateLocation = (latitude, longitude) => {
    setLocation({ latitude, longitude });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" color="white" size={25} />
        </TouchableOpacity>      
      </View>
      <View>
        <MapView
          style={styles.map}
          region={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
          >
            <Image
              source={require('../../../assets/images/placeholder.png')}
              style={{ width: 50, height: 50 }}
            />
          </Marker>

          {/* Afficher les marqueurs des artisans uniquement si routeUserId est égal à connectedUserId */}
          {routeUserId === connectedUserId.user.user_id && listArtisant && listArtisant.map((item, index) => (
            <Markers item={item} index={index} key={index} />
          ))}
        </MapView>
      </View>

      <View style={styles.placeListContainer}>
        {listArtisant && <PlaceListView listArtisant={listArtisant} onNavigate={updateLocation} userId={routeUserId} />}
      </View>
    </SafeAreaView>
  );
};

export default Maps;
