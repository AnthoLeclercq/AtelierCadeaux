import React, { useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView, Text } from "react-native";
import ProductItem from '../../components/elements/product/ProductItem';
import Header from "../../components/layout/header/Header";
import { fetchProducts } from "../../services/product/product.service";
import { useFocusEffect } from '@react-navigation/native';
import DropdownSection from '../../components/elements/category/DropdownSection'; 


const Catalog = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadProducts = async () => {
        try {
          const response = await fetchProducts();
          const filteredProducts = response.filter(product => product.is_deleted !== 1);
          setProducts(filteredProducts);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.errorContainer}>
          <Text>Erreur : {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.containerScroll}>
        <DropdownSection />
        <View style={styles.productsContainer}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductItem key={product.product_id} product={product} navigation={navigation} />
            ))
          ) : (
            <View style={styles.emptyMessageContainer}>
              <Text style={styles.emptyMessageText}>Aucun produit n'est disponible pour le moment</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Catalog;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    paddingBottom: 90,
  },
  containerScroll: {
    backgroundColor: 'white',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyMessageText: {
    marginTop: 250,
    marginBottom: 350,
    fontSize: 16,
    color: 'darkgrey',
    textAlign: 'center',
  },
});
