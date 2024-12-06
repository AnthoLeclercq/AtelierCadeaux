import React, { useState, useContext } from "react";
import { StyleSheet, Image, Text, ScrollView, SafeAreaView, View, TouchableOpacity, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { searchProductsAndArtisans } from "../../../services/search/search.service";
import { useNavigation } from '@react-navigation/native';
import userContext from '../../../context/userContext';
import AccessDenied from '../../modals/AccessDenied';

const Header = () => {
  const user = useContext(userContext);
  const isConnected = Boolean(user.user.token);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false); 


  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchText('');
    }
  };

  const handleSearch = async () => {
    const searchQuery = searchText.trim().toLowerCase();
    if (searchQuery.length > 0) {
      try {
        const results = await searchProductsAndArtisans(searchQuery);
        const productIds = results.products.map(product => product._id);
        const userIds = results.users.map(user => user._id);        
        navigation.navigate('Results', { productIds, userIds });
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
  };
  const handleGeoloc = () => {
    if (isConnected) {
      navigation.navigate('ContextMap', { userId: user.user.user_id });
    } else {
      setShowAccessDeniedModal(true); 
    }
};

  const handleGoToHome = () => {
      navigation.navigate('Home');
  };

  return (
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoToHome}>
          <Image source={require("../../../../assets/logolettrage.png")} style={styles.logo} />
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={toggleSearch}>
            <Icon name="search" size={24} color="black" />
          </TouchableOpacity>
          {isSearchActive && (
            <TextInput
              style={styles.searchBar}
              placeholder="Rechercher..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          )}
          <TouchableOpacity>
          <Icon 
              name="my-location" 
              size={24} color="black" 
              style={styles.locationIcon}
              onPress={handleGeoloc}
            />
          </TouchableOpacity>
        </View>
        {showAccessDeniedModal && (
        <AccessDenied 
          onClose={() => setShowAccessDeniedModal(false)} 
        />
      )}
      </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: 30,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: "100%",
  },
  logo: {
    height: 50,
    width: 50,
    marginTop: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationIcon: {
    marginLeft: 20,
    marginRight: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingLeft: 20,
    width: 220, 
  },
  containerScroll: {
    backgroundColor: 'white',
  },
});
