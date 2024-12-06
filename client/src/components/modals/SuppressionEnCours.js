import React from "react";
import { Modal, View, Text, ActivityIndicator, StyleSheet } from "react-native";

const SuppressionEnCours = ({ isVisible }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.modalText}>Suppression en cours...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 200,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default SuppressionEnCours;
