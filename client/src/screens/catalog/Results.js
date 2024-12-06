import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { fetchProducts } from '../../services/product/product.service';
import { fetchUserDetails } from '../../services/user/user.service';
import ProductItem from '../../components/elements/product/ProductItem';
import UserItem from '../../components/elements/user/UserItem';
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from '../../components/layout/header/Header';
import userContext from '../../context/userContext';  

const Results = ({ route, navigation }) => {
    const { user } = useContext(userContext);  
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { productIds, userIds } = route.params || {};

    useEffect(() => {
        const fetchAndFilterProductsAndUsers = async () => {
            try {
                const allProducts = await fetchProducts();

                const filteredProducts = allProducts
                    .filter(product => product.is_deleted !== 1)
                    .filter(product => productIds.map(id => id.toString()).includes(product.product_id.toString()));  
                setProducts(filteredProducts);

                if (user && user.role) {
                    const userPromises = userIds.map(id => fetchUserDetails(id));
                    const userDetails = await Promise.all(userPromises);
                    setUsers(userDetails);
                } else {
                    setUsers([]); 
                }
            } catch (err) {
                setError('Erreur lors de la récupération des données.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if ((productIds && productIds.length > 0) || (userIds && userIds.length > 0)) {
            fetchAndFilterProductsAndUsers();
        } else {
            setLoading(false);
            setError('Aucun produit ou utilisateur trouvé pour les filtres appliqués.');
        }
    }, [productIds, userIds, user]);

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
                    <Text style={styles.headerTitle}>Vos résultats - Produits</Text>
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
                <View style={styles.separator} />
                <View style={styles.headerUsers}>
                    <Text style={styles.headerTitle}>Vos résultats - Artisans</Text>
                </View>
                {user && user.role ? (
                    <View style={styles.usersContainer}>
                        {users.length > 0 ? (
                            users.map((userDetail) => (
                                <UserItem key={userDetail.user_id} userId={userDetail.user_id} navigation={navigation} />
                            ))
                        ) : (
                            <Text style={styles.noUsersText}>Aucun utilisateur disponible pour le moment</Text>
                        )}
                    </View>
                ) : (
                    <Text style={styles.noUsersText}>Vous devez être connecté pour voir les artisans.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        marginBottom: 100,
    },
    productsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        width: '85%',
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    usersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    headerUsers: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: "#3E4A57",
        borderRadius: 20,
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
        top: 5,
        left: 10,
        position: "absolute",
        zIndex: 2,
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
        marginLeft: "auto",
        marginRight: "auto",
    },
    noUsersText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        marginLeft: "auto",
        marginRight: "auto",
    },
});

export default Results;
