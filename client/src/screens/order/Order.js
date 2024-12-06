import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Modal, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import OrderItem from "../../components/elements/order/OrderItem";
import CheckBox from 'expo-checkbox';
import { fetchOrders, fetchOrdersForArtisan } from '../../services/order/order.service';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;

const Order = ({ navigation, route }) => {
  const { userId, accountType } = route.params || {};

  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState([]);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) return;
      const loadOrders = async () => {
        try {
          let fetchedOrders;
          if (accountType === "client") {
            fetchedOrders = await fetchOrders(userId);
          } else if (accountType === "artisan") {
            fetchedOrders = await fetchOrdersForArtisan(userId);
          }
          setOrders(fetchedOrders);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      loadOrders();
    }, [userId, accountType])
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOrderPress = (orderId) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const filteredOrders = (Array.isArray(orders) ? orders : [])
    .filter(order => filterStatus.length === 0 || filterStatus.includes(order.status))
    .sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    });

  const toggleStatusFilter = (status) => {
    setFilterStatus(prevStatus =>
      prevStatus.includes(status)
        ? prevStatus.filter(s => s !== status)
        : [...prevStatus, status]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const translateStatus = (status) => {
    const statusTranslations = {
      "Pending": "En attente",
      "Confirmed": "Confirmé",
      "Paid": "Payé",
      "Delivered": "Livré",
      "Completed": "Terminé",
      "Cancelled": "Annulé"
    };
  
    return statusTranslations[status] || status;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.mainHeader}>
          {accountType === "client" ? "Mes commandes" : "Mes commandes à honorer"}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")} style={styles.filterButton}>
          <Text style={styles.filterText}>Trier par date ({sortOrder === "asc" ? "asc" : "desc"})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStatusModalVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterText}>Filtrer par statut</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {Array.isArray(filteredOrders) && filteredOrders.length === 0 ? (
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>Aucun commande n'a été faite pour le moment</Text>
          </View>
        ) : (
          Array.isArray(filteredOrders) && filteredOrders.map(order => (
            <TouchableOpacity key={order.order_id} onPress={() => handleOrderPress(order.order_id)}>
              <OrderItem order={order} formatDate={formatDate} translateStatus={translateStatus} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez les statuts</Text>
            <View style={styles.modalOptions}>
            {["Pending", "Confirmed", "Paid", "Delivered", "Completed", "Cancelled"].map(status => (
                <View key={status} style={styles.checkboxContainer}>
                  <CheckBox
              value={filterStatus.includes(status)}
              onValueChange={() => toggleStatusFilter(status)}
            />
            <Text>{translateStatus(status)}</Text>
          </View>
              ))}
            </View>
            <View>
              <TouchableOpacity onPress={() => setStatusModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 35,
  },
  backButton: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  mainHeader: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e7e7e7',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: screenWidth - 40,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 5,
    gap: 20,
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E7BD00',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
