import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { updatePassword } from "../../services/user/user.service";
import userContext from "../../context/userContext";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const ChangePasswordModal = ({ isVisible, onClose }) => {
    const { user } = useContext(userContext);

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [secureNewPassword, setSecureNewPassword] = useState(true);
    const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await updatePassword(user.user_id, newPassword, user.token);

            if (response.success) {
                Alert.alert("Succès", "Le mot de passe a été mis à jour.");
                setNewPassword('');
                setConfirmNewPassword('');
                onClose();
            } else {
                Alert.alert("Erreur", response.message || "Une erreur est survenue.");
            }
        } catch (error) {
            Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour du mot de passe.");
        }
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Changer le mot de passe</Text>
                    
                    <View style={styles.inputContainer}>
                        <SimpleLineIcons name="lock" size={30} color="grey" />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Nouveau mot de passe"
                            placeholderTextColor="grey"
                            secureTextEntry={secureNewPassword}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity onPress={() => setSecureNewPassword(prev => !prev)}>
                            <SimpleLineIcons
                                name={secureNewPassword ? "eye" : "key"}
                                size={20}
                                color="grey"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <SimpleLineIcons name="lock" size={30} color="grey" />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Confirmer le nouveau mot de passe"
                            placeholderTextColor="grey"
                            secureTextEntry={secureConfirmPassword}
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                        />
                        <TouchableOpacity onPress={() => setSecureConfirmPassword(prev => !prev)}>
                            <SimpleLineIcons
                                name={secureConfirmPassword ? "eye" : "key"}
                                size={20}
                                color="grey"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
                            <Text style={styles.modalButtonText}>Confirmer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => {
                            setNewPassword('');
                            setConfirmNewPassword('');
                            onClose();
                        }}>
                            <Text style={styles.modalButtonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    textInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ChangePasswordModal;
