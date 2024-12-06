import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import CartItem from "../../components/elements/cart/CartItem";
import Header from "../../components/layout/header/Header";
import UserContext from "../../context/userContext";
import { fetchCartItems, deleteCartItem } from "../../services/cart/cart.service";
import { createOrder } from "../../services/order/order.service";
import { fetchProductDetails } from "../../services/product/product.service";
import { fetchUserDetails } from "../../services/user/user.service";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Cart = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artisanDetails, setArtisanDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const loadCartItems = async () => {
        setLoading(true);
        try {
          const items = await fetchCartItems(user.user_id, user.token);
          setCartItems(items);
          console.log(items)

          const artisanIds = [...new Set(items.map(item => item.artisan_id))];
          const details = {};
          for (const id of artisanIds) {
            const data = await fetchUserDetails(id);
            details[id] = {
              name: data.name || 'Non spécifié',
              is_deleted: data.is_deleted || 0,
            };
          }
          setArtisanDetails(details);
        } catch (err) {
          console.error("Error loading cart items or artisan details:", err);
        } finally {
          setLoading(false);
        }
      };

      loadCartItems();
    }, [user.user_id])
  );

  const updateCart = async () => {
    setLoading(true);
    try {
      const items = await fetchCartItems(user.user_id, user.token);
      setCartItems(items);
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (artisanId) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [artisanId]: !prevState[artisanId],
    }));
  };

  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.artisan_id]) {
      acc[item.artisan_id] = [];
    }
    acc[item.artisan_id].push(item);
    return acc;
  }, {});

  const calculateTotalCost = (items) => {
    return items.reduce((total, item) => total + parseFloat(item.total_cost || 0), 0);
  };

  const confirmerPanier = async (artisanId) => {
    try {
      const token = user.token;

      const cartsToConfirm = cartItems.filter(item => String(item.artisan_id) === String(artisanId));

      if (cartsToConfirm.length === 0) {
        console.error('No carts found to confirm');
        return;
      }

      const totalCost = calculateTotalCost(cartsToConfirm);

      const artisan = artisanDetails[artisanId];
      if (artisan.is_deleted === 1) {
        Alert.alert("Attention", "Désolé, l'artisan n'est plus disponible.");
        return;
      }

      const productDetailsPromises = cartsToConfirm.map(item => fetchProductDetails(item.product_id));
      const productDetailsList = await Promise.all(productDetailsPromises);
      const productDetailsMap = productDetailsList.reduce((acc, product) => {
        acc[product.product_id] = product;
        return acc;
      }, {});
  
      const hasDeletedProduct = cartsToConfirm.some(item => productDetailsMap[item.product_id]?.is_deleted === 1);
      if (hasDeletedProduct) {
        Alert.alert("Attention", "Désolé, un des produits n'est plus disponible.");
        return;
      }
      await createOrder(user.user_id, artisanId, totalCost, cartsToConfirm, token);

      await Promise.all(cartsToConfirm.map(cart => deleteCartItem(cart.cart_id, token)));

      updateCart();

      navigation.navigate('Order', {
        userId: user.user_id,
        accountType: user.role,
      });
    } catch (error) {
      console.error('Error confirming cart:', error);
    }
  };

  return (
    <SafeAreaView style={styles.emptyCartContainer}>
      <Header />
      {loading ? (
        <Text>Loading...</Text>
      ) : cartItems.length > 0 ? (
        <ScrollView>
          <Text style={styles.cartTitle}>Mes paniers</Text>
          {Object.keys(groupedCartItems).map(artisanId => (
            <View key={artisanId} style={styles.cartPage}>
              <TouchableOpacity onPress={() => toggleSection(artisanId)} style={styles.cartArtisan}>
                <Text style={styles.artisanName}>Boutique : {artisanDetails[artisanId]?.name || "Loading..."}</Text>
                {artisanDetails[artisanId]?.is_deleted === 1 && (
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.indisponible}>
                      <Text style={styles.indisponibleText}>Indisponible</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Ionicons
                  name={expandedSections[artisanId] ? "chevron-up-outline" : "chevron-down-outline"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              {expandedSections[artisanId] && (
                <View style={styles.productItemContainer}>
                  {groupedCartItems[artisanId].map(item => (
                    <CartItem key={item.cart_id} item={item} updateCart={updateCart} />
                  ))}
                  <View style={styles.totalCostContainer}>
                    <View style={styles.totalCost}>
                      <Text>Prix total :</Text>
                      <Text style={styles.totalCostText}>{calculateTotalCost(groupedCartItems[artisanId])} €</Text>
                    </View>
                    <TouchableOpacity style={styles.confirmCart} onPress={() => confirmerPanier(artisanId)}>
                      <Text style={styles.confirmCartText}>Confirmer le panier</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.panierVideText}>Votre panier est vide</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  emptyCartContainer: {
    flex: 1,
  },
  panierVideText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 300,
    color: 'darkgrey',
    textAlign: 'center',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  cartPage: {
    backgroundColor: "white",
    margin: 5,
    borderTopColor: "darkgrey",
    borderTopWidth: 1,
    borderBottomColor: "darkgrey",
    borderBottomWidth: 1,
  },
  cartArtisan: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  artisanName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionsContainer: {
    gap: 5,
    alignItems: "center",
  },
  indisponible: {
    backgroundColor: '#393939',
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  indisponibleText: {
    color: "#fff"
  },
  productItemContainer: {
    paddingTop: 5,
    paddingBottom: 10,
  },
  totalCostContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  totalCost: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    padding: 15,
  },
  totalCostText: {
    fontWeight: "bold",
  },
  confirmCart: {
    alignSelf: 'center',
    backgroundColor: '#dfaf2c',
    padding: 15,
    borderRadius: 20,
  },
  confirmCartText: {
    fontWeight: 'bold',
  },
});
