import React, {useState, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductLatest from '../../components/elements/product/ProductLatest';
import Header from '../../components/layout/header/Header'
import { fetchLatestProducts } from '../../services/product/product.service';
import { useFocusEffect } from '@react-navigation/native';
import userContext from '../../context/userContext';
import AccessDenied from '../../components/modals/AccessDenied';

const Home = ({navigation}) => {
  const user = useContext(userContext);
  const isConnected = Boolean(user.user.token);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false); 


  useFocusEffect(
    React.useCallback(() => {
      const loadProducts = async () => {
        try {
          const response = await fetchLatestProducts();
          const availableProducts = response.filter(product => product.is_deleted !== 1);
          setProducts(availableProducts);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, [])
  );


  const handleShowCatalogue = () => {
    navigation.navigate('Catalog');
  };

  const handleAskAlfred = () => {
    if (isConnected) {
      navigation.navigate('Alfred');
    } else {
      setShowAccessDeniedModal(true); 
    }
  };

  return (
    <View style={styles.container}>
        <Header />
      <Text style={styles.welcomeText}>Bienvenue sur l'application L'Atelier Cadeaux</Text>
      <Text style={styles.question}>Avez-vous des idées de cadeaux ?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleShowCatalogue}>
          <Text style={styles.buttonText}>Oui, montre-moi le catalogue</Text>
          <MaterialCommunityIcons name="view-dashboard" size={22} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isConnected && styles.disabledButton]}
          onPress={handleAskAlfred}
        >
          <Text style={styles.buttonText}>Non, je demande à Alfred</Text>
          <MaterialCommunityIcons name="baby-face" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>Derniers ajouts</Text>
      </View>
      <ScrollView>
      <View style={styles.productAvailable}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductLatest key={product.product_id} product={product} navigation={navigation} />
              ))
            ) : (
              <Text style={styles.noProductsText}>Aucun produit n'est disponible pour le moment</Text>
            )}
          </View>
      </ScrollView>
      {showAccessDeniedModal && (
        <AccessDenied 
          onClose={() => setShowAccessDeniedModal(false)} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: 150,
    alignItems: 'center',
    gap: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: "center",
  },
  disabledButton: { 
    backgroundColor: 'grey',
  },
  titleContainer: {
    borderTopColor: "lightgrey",
    borderBottomColor: "lightgrey",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign:"center",
  },
  productAvailable: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 220,
    maxWidth: 500,
  },
  noProductsText: {
    marginBottom: 220,
    marginTop: 120,
    fontSize: 16,
    color: "grey",
  },
});

export default Home;
