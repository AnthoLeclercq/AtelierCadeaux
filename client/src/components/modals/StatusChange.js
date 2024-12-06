import React from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const StatusChange = ({ visible, currentStatus, statusOptions = [], onChangeStatus, onCancel }) => {
    const [selectedStatus, setSelectedStatus] = React.useState(currentStatus);

    const handleConfirm = () => {
        onChangeStatus(selectedStatus);
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Changer le statut</Text>
                    <Picker
                        selectedValue={selectedStatus}
                        onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                        style={styles.picker}
                    >
                        {statusOptions.map(option => (
                            <Picker.Item key={option.key} label={option.label} value={option.key} />
                        ))}
                    </Picker>
                    <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={onCancel}>
                    <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer} onPress={handleConfirm}>
                    <Text style={styles.buttonText}>Confirmer</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContainer: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    },
    picker: {
        width: '75%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 20,
        marginTop: 15,
    },
    buttonContainer: {
        backgroundColor: "#E7BD06",
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "#3E4A57",
        fontWeight: "bold",
    },
});

export default StatusChange;
