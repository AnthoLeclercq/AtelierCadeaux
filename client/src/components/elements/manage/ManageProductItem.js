import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ConfirmDeleteModal from "../../modals/ConfirmDelete";
import { updateProduct } from "../../../services/product/product.service";  
import userContext from "../../../context/userContext";

const ManageProductItem = ({ product, navigation, onProductDeleted }) => {
  const { user } = useContext(userContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleProduct = () => {
    navigation.navigate('ModifyProduct', { product });
  };

  const handleSoftDelete = async () => {
    try {
      const updatedProduct = { is_deleted: true };
      const response = await updateProduct(product.product_id, updatedProduct, user.token);  

      if (response && response.success) {
        Alert.alert("Succès", "Le produit a été supprimé avec succès.");
        setModalVisible(false);
        onProductDeleted();
      } else {
        Alert.alert("Erreur", "Erreur lors de la suppression du produit.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression logique du produit :", error);
      Alert.alert("Erreur", "Erreur lors de la suppression logique du produit.");
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.productRow}>
        {product.images_product && (
          <Image
            style={styles.image}
            source={{ uri: product.images_product[0] }}
          />
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price} €</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.modifyBtn} onPress={handleProduct}>
            <Ionicons name="create-outline" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmDeleteModal
        visible={modalVisible}
        onConfirm={handleSoftDelete}  
        onCancel={() => setModalVisible(false)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  productInfo: {
    marginLeft: 20,
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
  },
  productPrice: {
    color: "#555",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 25,
    alignItems: "center",
  },
  modifyBtn: {
    fontWeight: "bold",
    backgroundColor: "lightgrey",
    borderRadius: 20,
    padding: 10,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    fontWeight: "bold",
    backgroundColor: "lightgrey",
    borderRadius: 20,
    padding: 10,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ManageProductItem;
