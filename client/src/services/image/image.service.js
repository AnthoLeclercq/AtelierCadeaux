import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [5, 5],
    quality: 1,
  });


  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0]; 
  }
  return null;
};

export default pickImage;
