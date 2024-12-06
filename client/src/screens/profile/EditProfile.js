import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Alert, ScrollView, TextInput, Image } from 'react-native';
import pickImage from "../../services/image/image.service";
import { fetchUserDetails, updateUser, uploadImage, deleteImage, deleteDetailImage } from '../../services/user/user.service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import userContext from '../../context/userContext';
import { useFocusEffect } from '@react-navigation/native';

const convertLocalPathToUrl = (path) => {
  return path ? path.replace(/\\/g, '/') : '';
};

const EditProfile = ({ route }) => {
  const { userId } = route.params;
  const ConnectedUser = useContext(userContext);
  const token = ConnectedUser.user.token;
  const [focusedInput, setFocusedInput] = useState(null);
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipcode: '',
    profession: '',
    description: '',
    image_profile: '',
    image_bg: '',
    images_detail: []
  });

  useFocusEffect(
    React.useCallback(() => {
    fetchUserDetails(userId)
      .then(data => {
        const updatedData = {
          ...data,
          image_profile: convertLocalPathToUrl(data.image_profile),
          image_bg: convertLocalPathToUrl(data.image_bg),
          images_detail: data.images_detail.map(img => convertLocalPathToUrl(img)) 
        };
        setUser(updatedData);
      })
      .catch(error => console.error('Error fetching user:', error));
  }, [userId])
);

  const handleGoBack = () => {
    navigation.navigate('Profile');
  };

  const handleUpdate = () => {

    updateUser(userId, {
      name: user.name,
      email: user.email,
      address: user.address,
      city: user.city,
      zipcode: user.zipcode,
      profession: user.profession,
      description: user.description,
      image_profile: user.image_profile,
      image_bg: user.image_bg,
      images_detail: user.images_detail
    }, token)
      .then(data => {
        if (data.status === 200) {
          navigation.navigate('Profile')
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => console.error('Error updating profile:', error));
  };

  const handleImageUpload = async (imageType) => {
    const result = await pickImage();


    if (result && result.uri) {

      try {
        const imageUrl = await uploadImage(result.uri);

        if (imageUrl) {
          if (imageType === 'images_detail') {
            setUser(prevUser => ({
              ...prevUser,
              images_detail: [...prevUser.images_detail, imageUrl]
            }));
          } else if (imageType === 'image_profile') {
            setUser(prevUser => ({
              ...prevUser,
              image_profile: imageUrl
            }));
          } else if (imageType === 'image_bg') {
            setUser(prevUser => ({
              ...prevUser,
              image_bg: imageUrl
            }));
          }

          Alert.alert('Success', 'Image uploaded and profile updated successfully');
        } else {
          Alert.alert('Error', 'Failed to get image URL from response');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Error uploading image. Check your network connection.');
      }
    } else {
      Alert.alert('Error', 'Image selection failed');
    }
  };

  const handleImageDelete = (imageType) => {

    deleteImage(userId, imageType, token)
      .then(data => {
        if (data.status === 200) {
          setUser(prevUser => ({ ...prevUser, [imageType]: '' }));
          Alert.alert('Confirmation', 'L\'image a été supprimée');
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => console.error('Error deleting image:', error));
  };

  const handleDetailImageDelete = (imageUrl) => {

    deleteDetailImage(userId, imageUrl, token)
      .then(data => {
        if (data.status === 200) {
          setUser(prevUser => ({
            ...prevUser,
            images_detail: prevUser.images_detail.filter(img => img !== imageUrl)
          }));
          Alert.alert('Confirmation', 'L\'image a été supprimée');
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => console.error('Error deleting detail image:', error));
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground 
        source={user.image_bg ? { uri: user.image_bg } : require('../../../assets/default_bg.jpg')}
        style={styles.banner}
        resizeMode="cover">
          {user.image_bg ? (
              <TouchableOpacity style={styles.btnBgImage}>
                <Icon
                  name="delete"
                  size={30}
                  color="red"
                  onPress={() => handleImageDelete('image_bg')}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnBgImage}>
              <Icon
                name="add"
                size={30}
                color="green"
                onPress={() => handleImageUpload('image_bg')}
              />
              </TouchableOpacity>
            )}

      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" color="white" size={25} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveText}>Sauvegarder</Text>
          <Ionicons name="save-outline" size={25} color="white" />
        </TouchableOpacity>
        <View>
            {user.image_profile ? (
              <TouchableOpacity style={styles.btnProfileImage}>
                <Icon
                  name="delete"
                  size={30}
                  color="red"
                  onPress={() => handleImageDelete('image_profile')}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnProfileImage}>
              <Icon
                name="add"
                size={30}
                color="green"
                onPress={() => handleImageUpload('image_profile')}
              />
              </TouchableOpacity>
            )}
          {user.image_profile ? (
  <Image source={{ uri: user.image_profile }} style={styles.profileImage} />
) : (
  <Image source={require('../../../assets/default_profile.jpg')} style={styles.profileImage} /> 
)}

        </View>
      </ImageBackground>
      <View style={styles.infoContainer}>
        <TextInput
          style={[styles.input, focusedInput === 'name' && styles.focusedInput]}
          value={user.name}
          placeholder="Nom"
          onChangeText={text => setUser(prevUser => ({ ...prevUser, name: text }))}
          onFocus={() => setFocusedInput('name')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'email' && styles.focusedInput]}
          value={user.email}
          placeholder="Email"
          onChangeText={text => setUser(prevUser => ({ ...prevUser, email: text }))}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'address' && styles.focusedInput]}
          value={user.address}
          placeholder="Adresse"
          onChangeText={text => setUser(prevUser => ({ ...prevUser, address: text }))}
          onFocus={() => setFocusedInput('address')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'city' && styles.focusedInput]}
          value={user.city}
          placeholder="Ville"
          onChangeText={text => setUser(prevUser => ({ ...prevUser, city: text }))}
          onFocus={() => setFocusedInput('city')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'zipcode' && styles.focusedInput]}
          value={user.zipcode}
          placeholder="Code Postal"
          onChangeText={text => setUser(prevUser => ({ ...prevUser, zipcode: text }))}
          onFocus={() => setFocusedInput('zipcode')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'profession' && styles.focusedInput]}
          value={user.profession}
          placeholder="Profession"
          onChangeText={text => setUser(prevUser => ({ ...prevUser, profession: text }))}
          onFocus={() => setFocusedInput('profession')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'description' && styles.focusedInput]}
          value={user.description}
          placeholder="Description"
          onChangeText={text => setUser(prevUser => ({ ...prevUser, description: text }))}
          onFocus={() => setFocusedInput('description')}
          onBlur={() => setFocusedInput(null)}
        />
        <View style={styles.photoGrid}>
        <Text style={styles.warningLine}>Vous pouvez ajouter jusqu'à 15 photos maximum</Text>
          {user.images_detail.length < 15 && (
            <TouchableOpacity style={styles.uploadButton} onPress={() => handleImageUpload('images_detail')}>
              <Icon name="add" size={30} color="black" />
            </TouchableOpacity>
          )}
          {user.images_detail.map((img, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: img }} style={styles.photo} />
              <TouchableOpacity 
                style={styles.deleteIcon} 
                onPress={() => handleDetailImageDelete(img)} 
              >
                <Icon name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    marginLeft: -10,
    marginRight: -10,
    marginHorizontal: 10,
    backgroundColor: 'white',
  },
  banner: {
    width: '100%',
    height: 200,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
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
    left: 0,
    position: "absolute",
    zIndex: 2,
  },
  saveButton: {
    flexDirection: "row",
    gap: 5,
    padding: 10,
    backgroundColor: "#3E4A57",
    borderRadius: 20,
    marginLeft: 20,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    top: 5,
    right: 15,
    position: "absolute",
    zIndex: 2,
  },
  saveText: {
    color: "white",
    fontWeight: "semibold",
  },
  addButtonBanner: {
    backgroundColor: 'white',
    padding: 5,
    top: 200,
    borderRadius: 100,
    width: 40,
    height: 40,
    zIndex: 2,
  },
  btnProfileImage: {
    width: 40,
    top: 100,
    left: 130,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    zIndex: 3,
  },
  btnBgImage: {
    top: 180,
    left: -170,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    zIndex: 3,
  },
  profileImage: {
    top: 45,
    width: 170,
    height: 170,
    backgroundColor: 'yellow',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
  },
  infoContainer: {
    marginTop: 70,
    alignItems: 'center',
    padding: 10,
  },
  input: {
    width: '85%',
    color: 'grey',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  focusedInput: {
    color: 'black',
  },
  photoGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    paddingBottom: 50,
  },
  warningLine: {
    color: "red", 
    marginBottom: 30,
  },
  photoPlaceholder: {
    width: 170,
    height: 170,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  photoContainer: {
    position: 'relative',
    margin: 5,
  },
  photo: {
    width: 170,
    height: 170,
    borderRadius: 5,
  },
  deleteIcon: {
    top: -165,
    right: -125,
    width: 40,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    zIndex: 3,
  },
  uploadButton: {
    width: 170,
    height: 170,
    marginRight: 10,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
