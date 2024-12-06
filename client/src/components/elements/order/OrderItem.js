import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const OrderItem = ({ order, formatDate, translateStatus }) => {
  
  const orderId = order?.order_id || "N/A";
  const orderDate = order?.created_at ? formatDate(order.created_at) : "Date inconnue";
  const totalCost = order?.total_cost ? `${order.total_cost} €` : "Coût inconnu";
  const orderStatus = order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Statut inconnu";

  return (
    <View style={styles.orderItem}>
      <View style={styles.titleContainer}>
        <Text style={styles.orderId}>Commande #{orderId}</Text>
        <Text style={styles.orderDate}>{orderDate}</Text>
      </View>
      
      <TouchableOpacity style={styles.statusContainer}>
        <Text style={styles.statusText}>{translateStatus(order.status)}</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.total}>Total de la commande : {totalCost}</Text>
        <Text style={styles.voirPlus}>Voir plus</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    marginTop: 16,
    margin: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
  },
  statusContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e7e7e7',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voirPlus: {
    textAlign: 'right',
    fontSize: 16,
    color: '#dfaf2c',
  },
});

export default OrderItem;
