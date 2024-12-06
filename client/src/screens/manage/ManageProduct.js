import React, { useState, useContext } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import ManageProductItem from "../../components/elements/manage/ManageProductItem";
import { fetchProductsByArtisanId } from '../../services/product/product.service';
import { useFocusEffect } from '@react-navigation/native';
import userContext from '../../context/userContext';

const ManageProduct = ({ navigation }) => {
  const { user } = useContext(userContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadProducts = async () => {
        try {
          setIsLoading(true);
          if (user && user.user_id) {
            const artisanProducts = await fetchProductsByArtisanId(user.user_id);
            const displayedProducts = artisanProducts
            .filter(product => product.artisan_id === user.user_id && product.is_deleted !== 1);
            setProducts(displayedProducts);
          }
        } catch (error) {
          console.log("Error loading products:", error);
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      };

      loadProducts();
    }, [user, refresh]),
  );

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const refreshProducts = () => {
    setRefresh(prev => !prev);  
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Gérer mes produits</Text>
          <TouchableOpacity onPress={handleAddProduct}>
            <Text style={styles.addButton}>+</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          products.length > 0 ? (
            products.map((product) => (
              <ManageProductItem key={product.product_id} product={product} navigation={navigation} onProductDeleted={refreshProducts}/>
            ))
          ) : (
            <View style={styles.emptyMessageContainer}>
              <Text style={styles.emptyMessageText}>Aucun produit n'a été publié pour le moment</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageProduct;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop : 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#E7BD06",
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    lineHeight: 40,
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyMessageText: {
    marginTop: 250,
    marginBottom: 450,
    fontSize: 16,
    color: 'darkgrey',
    textAlign: 'center',
  },
});
