import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { requestPasswordReset } from '../../services/authentication/auth.service'
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordModal = ({ isVisible, onClose }) => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handleRequestReset = async () => {
        try {
            const response = await requestPasswordReset(email);
            Alert.alert('Succès', 'Un e-mail de réinitialisation du mot de passe a été envoyé.');
            setEmail('');
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la demande de réinitialisation.');
        }
    };

    const handleResetPassword = () => {
        navigation.navigate('ResetPassword');
        onClose();
      };

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Mot de passe oublié</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Votre adresse email"
                        placeholderTextColor="grey"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
                        <Text style={styles.modalButtonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={handleRequestReset}>
                        <Text style={styles.sendButtonText}>Envoyer</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={styles.tokenContainer}>
                    <TouchableOpacity style={styles.tokenButton} onPress={handleResetPassword}>
                        <Text style={styles.tokenButtonText}>Vous avez déjà un code ?</Text>
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
        width: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 15,
        paddingHorizontal: 10,
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    tokenContainer: {
        marginVertical: 10,
    },
    modalButton: {
        backgroundColor: '#E7BD06',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    tokenButton: {
        backgroundColor: '#3E4A57',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
    sendButtonText: {
        color: "#3E4A57",
        fontSize: 16,
    },
    tokenButtonText: {
        color: '#E7BD06',
        fontSize: 16,
    },
});

export default ForgotPasswordModal;
