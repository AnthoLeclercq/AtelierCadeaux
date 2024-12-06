import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { fetchSuggestedProducts } from '../../../services/product/product.service'
import { useNavigation } from '@react-navigation/native';
import ProductAvailable from "./ProductAvailable"

const ProductSuggestions = ({ metaValues, currentProduct }) => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadSuggestedProducts = async () => {
      try {
        const products = await fetchSuggestedProducts(metaValues);
        const filteredProducts = products
          .filter(product => product.product_id !== currentProduct && product.is_deleted !== 1);
        setSuggestedProducts(filteredProducts);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits suggérés:', error);
      }
    };

    if (metaValues && metaValues.length > 0) {
      loadSuggestedProducts();
    }
  }, [metaValues, currentProduct]);

  return (
    <View style={styles.suggestionsContainer}>
      {suggestedProducts.length > 0 ? (
        suggestedProducts.map((product, index) => (
          <ProductAvailable key={product.product_id} product={product} navigation={navigation} />
        ))
      ) : (
        <Text style={styles.noProductsText}>Aucun produit suggéré disponible</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  productItem: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  productName: {
    fontSize: 16,
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray',
  },
  noProductsText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default ProductSuggestions;
