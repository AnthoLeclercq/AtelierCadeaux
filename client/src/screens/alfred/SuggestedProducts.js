import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { fetchProducts } from '../../services/product/product.service';
import ProductItem from '../../components/elements/product/ProductItem';
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from '../../components/layout/header/Header';
import userContext from '../../context/userContext';  

const SuggestedProducts = ({ route, navigation }) => {
    const { user } = useContext(userContext);  
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { productIds } = route.params || {};

    useEffect(() => {
        const fetchAndFilterProducts = async () => {
            try {
                const allProducts = await fetchProducts();

                const filteredProducts = allProducts
                    .filter(product => product.is_deleted !== 1)
                    .filter(product => productIds.map(id => id.toString()).includes(product.product_id.toString()));  

                setProducts(filteredProducts);
            } catch (err) {
                setError('Erreur lors de la récupération des produits.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (productIds && productIds.length > 0) {
            fetchAndFilterProducts();
        } else {
            setLoading(false);
            setError('Aucun produit trouvé.');
        }
    }, [productIds]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" color="white" size={25} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Suggestions de produits</Text>
                </View>
                <View style={styles.productsContainer}>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductItem key={product.product_id} product={product} navigation={navigation} />
                        ))
                    ) : (
                        <Text style={styles.noProductsText}>Aucun produit disponible pour le moment</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
    },
    productsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: "#3E4A57",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 2,
        left: 10,
    },
    headerTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    noProductsText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default SuggestedProducts;
