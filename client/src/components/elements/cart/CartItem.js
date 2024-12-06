import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ConfirmDelete from "../../modals/ConfirmDelete";
import { fetchProductDetails } from "../../../services/product/product.service";
import { removeOneItem, addOneItem, deleteItem } from "../../../services/cart/cart.service";
import userContext from "../../../context/userContext"
import { useFocusEffect } from '@react-navigation/native';

const CartItem = ({ item, updateCart }) => {
  const { user } = useContext(userContext);
  const token = user.token;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    price: 0,
  });
  const [productImage, setProductImage] = useState("https://via.placeholder.com/50");
  const [productUnavailableModalVisible, setProductUnavailableModalVisible] = useState(false); // Nouvel état pour le modal d'indisponibilité


  useFocusEffect(
    React.useCallback(() => {
      const loadProductDetails = async () => {
        try {
          setLoading(true); 
          const details = await fetchProductDetails(item.product_id);
          setProductDetails(details);
          if (details.images_product && details.images_product.length > 0) {
            setProductImage(details.images_product[0]);
          }
        } catch (error) {
          console.error("Error loading product details:", error);
        } finally {
          setLoading(false);
        }
      };

      loadProductDetails();
    }, [item.product_id])
  );

  const handleAddItem = async () => {
    try {
      setLoading(true); 
      await addOneItem(item.cart_id, item.product_id, item.quantity + 1, productDetails.price * (item.quantity + 1), token);
      updateCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleRemoveItem = async () => {
    if (item.quantity > 1) {
      try {
        setLoading(true); 
        await removeOneItem(item.cart_id, item.product_id, item.quantity - 1, productDetails.price * (item.quantity - 1), token);
        updateCart();
      } catch (error) {
        console.error("Error removing item from cart:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true); 
      await deleteItem(item.cart_id, token);
      updateCart();
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    } finally {
      setLoading(false);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ligneTableau}>
        <Image
          style={styles.imageProduit}
          source={{ uri: productImage }}
          />
          {productDetails.is_deleted === 1 && (
                        <TouchableOpacity onPress={() => setProductUnavailableModalVisible(true)}>
                        <Ionicons name="alert-circle-outline" size={24} color="red" />
                      </TouchableOpacity>
            )}
        <Text style={styles.cellule}>{productDetails.name}</Text>
        <Text style={styles.cellulePrice}>{item.total_cost} €</Text>
        <View style={styles.actionsCellule}>
          <TouchableOpacity onPress={handleAddItem}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.cellule}>{item.quantity}</Text>
          {item.quantity > 1 ? (
            <TouchableOpacity onPress={handleRemoveItem}>
              <Ionicons name="remove-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="trash-outline" size={23} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ConfirmDelete
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={() => setModalVisible(false)}
      />

<Modal
        transparent={true}
        animationType="fade"
        visible={productUnavailableModalVisible}
        onRequestClose={() => setProductUnavailableModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>On dirait que cet article n'est plus disponible.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setProductUnavailableModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 5,
  },
  ligneTableau: {
    flexDirection: 'row',
    padding: 5,
    marginLeft: 0,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsCellule: {
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: "center",
    width: 60,
    justifyContent: 'space-between',
    gap: 5,
  },
  cellule: {
    flex: 2,
    minWidth: 20,
    color: '#3E4A57',
    textAlign: 'center',
  },
  cellulePrice: {
    flex: 1,
    minWidth: 20,
    color: '#3E4A57',
    textAlign: 'center',
  },
  imageProduit: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#dfaf2c',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
