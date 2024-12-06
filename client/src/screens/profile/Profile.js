import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import userContext from '../../context/userContext';
import { fetchUserDetails } from '../../services/user/user.service';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const { user } = useContext(userContext);
  const userId = user.user_id;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadUserDetails = async () => {
        setLoading(true);
        try {
          const data = await fetchUserDetails(userId);
          setProfileData(data);
        } catch (err) {
          setError(err.message);
          Alert.alert('Error', 'Failed to load user details');
        } finally {
          setLoading(false);
        }
      };

      loadUserDetails();
    }, [userId])
  );

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userId });
  };

  const handleOrder = () => {
    navigation.navigate('Order', {
      userId: user.user_id,
      accountType: user.role,
    });
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleHelp = () => {
    navigation.navigate('FAQ');
  };

  const handleChat = () => {
    navigation.navigate('Discussions');
  };

  const renderClientProfile = () => (
    <View style={styles.profileContainer}>
      <ImageBackground 
        source={profileData.image_bg ? { uri: profileData.image_bg } : require('../../../assets/default_bg.jpg')}
        style={styles.banner}
        resizeMode="cover">
        {profileData.image_profile ? (
          <Image 
            source={{ uri: profileData.image_profile }} 
            style={styles.profileImage} 
            resizeMode="cover" 
          />
        ) : (
          <Image source={require('../../../assets/default_profile.jpg')} style={styles.profileImage} /> 
        )}
        <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
          <Icon name="help-outline" size={30} color="black" />
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{profileData.name || 'Nom'}</Text>
        <View style={styles.infoRow}>
          <Icon name="work" size={20} color="#555" />
          <Text style={styles.profession}>{profileData.profession || 'Profession'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="place" size={20} color="#555" />
          <Text style={styles.address}>{profileData.city || 'Ville'}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <Text style={styles.description}>
        {profileData.description || 'Souhaitez-vous ajouter une description ?'}
      </Text>
      <View style={styles.separator} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Text style={styles.buttonText}>Modifier le profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleOrder}>
          <Text style={styles.buttonText}>Mes commandes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChat}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Text style={styles.buttonText}>Paramètres</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.photoGrid}>
        {profileData.images_detail && profileData.images_detail.length > 0 ? (
          profileData.images_detail.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.photoPlaceholder} resizeMode="cover" />
          ))
        ) : (
          <Text style={styles.imagesText}>Vous n'avez pas encore d'images</Text>
        )}
      </View>
    </View>
  );

  const renderArtisanProfile = () => (
    <View style={styles.profileContainer}>
      <ImageBackground 
        source={profileData.image_bg ? { uri: profileData.image_bg } : require('../../../assets/default_bg.jpg')}
        style={styles.banner}
        resizeMode="cover">
        {profileData.image_profile ? (
          <Image 
            source={{ uri: profileData.image_profile }} 
            style={styles.profileImage} 
            resizeMode="cover" 
          />
        ) : (
          <Image source={require('../../../assets/default_profile.jpg')} style={styles.profileImage} /> 
        )}
        <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
          <Icon name="help-outline" size={30} color="black" />
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{profileData.name || 'Nom'}</Text>
        <View style={styles.infoRow}>
          <Icon name="work" size={20} color="#555" />
          <Text style={styles.profession}>{profileData.profession || 'Profession'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="place" size={20} color="#555" />
          <Text style={styles.address}>{profileData.city || 'Ville'}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <Text style={styles.description}>
        {profileData.description || 'Souhaitez-vous ajouter une description ?'}
      </Text>
      <View style={styles.separator} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Text style={styles.buttonText}>Modifier le profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleOrder}>
          <Text style={styles.buttonText}>Mes commandes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}  onPress={handleChat}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Text style={styles.buttonText}>Paramètres</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.photoGrid}>
        {profileData.images_detail && profileData.images_detail.length > 0 ? (
          profileData.images_detail.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.photoPlaceholder} resizeMode="cover" />
          ))
        ) : (
          <Text style={styles.imagesText}>Vous n'avez pas encore d'images</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!profileData) {
    return <Text>Aucune donnée disponible pour ce profil</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {profileData.role === 'artisan' ? renderArtisanProfile() : renderClientProfile()}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginLeft: -10,
    marginRight: -10,
    backgroundColor: 'white',
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
  profileContainer: {
    alignItems: 'center',
    padding: 10,
    paddingTop: 20,

  },
  banner: {
    width: '100%',
    height: 200,
    backgroundColor: 'lightblue',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
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
    backgroundColor: 'darkgrey',
    borderRadius: 100,
    position: 'absolute',
    top: 100,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileImagePlaceholder: {
    width: 170,
    height: 170,
    backgroundColor: 'lightgrey',
    borderRadius: 100,
    position: 'absolute',
    top: 100,
    borderWidth: 3,
    borderColor: 'white',
  },
  infoContainer: {
    marginTop: 90,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profession: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 30,
  },
  photoPlaceholder: {
    width: 170,
    height: 170,
    backgroundColor: 'lightblue',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
    marginTop: -10,
  },
  imagesText: {
    marginTop: 40,
    color: 'darkgrey',
    fontSize: 16,
    textAlign: "center",
  },
});
