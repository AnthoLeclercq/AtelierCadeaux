import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { resetPassword } from '../../../services/authentication/auth.service'; // Assurez-vous que ce chemin est correct et que le service est correctement exporté
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const ResetPassword = ({ navigation }) => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureNewPassword, setSecureNewPassword] = useState(true);
    const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
            return;
        }

        if (token.trim() === '') {
            Alert.alert("Erreur", "Le token est requis.");
            return;
        }

        try {
            const response = await resetPassword(token, newPassword);

            if (response && response.message) {
                Alert.alert("Succès", "Le mot de passe a été réinitialisé avec succès.");
                navigation.navigate('Login'); 
            } else {
                throw new Error("Réponse invalide du serveur.");
            }
        } catch (error) {
            Alert.alert("Erreur", error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" color="#E7BD06" size={25} />
            </TouchableOpacity>

            <View style={styles.inner}>
                <Text style={styles.title}>Réinitialiser le mot de passe</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="key-outline" size={20} color="grey" style={styles.iconLeft} />
                    <TextInput
                        style={styles.input}
                        placeholder="Token de réinitialisation"
                        value={token}
                        onChangeText={setToken}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <SimpleLineIcons name="lock" size={20} color="grey" style={styles.iconLeft} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nouveau mot de passe"
                        secureTextEntry={secureNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureNewPassword(prev => !prev)} style={styles.iconRight}>
                        <SimpleLineIcons
                            name={secureNewPassword ? "eye" : "key"}
                            size={20}
                            color="grey"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <SimpleLineIcons name="lock" size={20} color="grey" style={styles.iconLeft} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        secureTextEntry={secureConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureConfirmPassword(prev => !prev)} style={styles.iconRight}>
                        <SimpleLineIcons
                            name={secureConfirmPassword ? "eye" : "key"}
                            size={20}
                            color="grey"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>Confirmer</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'darkgrey',
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: '#3E4A57',
        borderRadius: 20,
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
        top: 30,
        left: 15,
        position: "absolute",
        zIndex: 2,
    },
    inner: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 40,  // Pour laisser de la place à l'icône à gauche
        paddingRight: 40, // Pour laisser de la place à l'icône à droite
    },
    iconLeft: {
        position: 'absolute',
        left: 10,
        top: 10,
    },
    iconRight: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    button: {
        backgroundColor: '#E7BD06',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#3E4A57',
        fontSize: 16,
    },
});

export default ResetPassword;
