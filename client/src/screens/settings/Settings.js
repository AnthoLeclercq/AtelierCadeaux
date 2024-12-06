import React, { useState, useContext } from "react";
import { Text, View, Switch, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logout } from "../../services/authentication/auth.service";
import userContext from "../../context/userContext";
import ChangePasswordModal from "../../components/modals/PasswordChange";
import SuppressionEnCours from "../../components/modals/SuppressionEnCours";
import { fetchProductsByArtisanId, updateProduct } from "../../services/product/product.service";
import { updateUser } from "../../services/user/user.service";

const Settings = ({ navigation }) => {
    const { setUser } = useContext(userContext);
    const { user } = useContext(userContext)
    const [GeoLocSwitch, setGeoLocSwitch] = useState(false);
    const [notificationSwitch, setNotificationSwitch] = useState(false);
    const [mailNotificationSwitch, setMailNotificationSwitch] = useState(false);
    const [updateNotificationSwitch, setUpdateNotificationSwitch] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("light");
    const [selectedLanguage, setSelectedLanguage] = useState("fr");

    const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false); 
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const toggleGeoLocSwitch = () => setGeoLocSwitch((prevState) => !prevState);
    const toggleNotificationSwitch = () => setNotificationSwitch((prevState) => !prevState);
    const toggleMailNotificationSwitch = () => setMailNotificationSwitch((prevState) => !prevState);
    const toggleUpdateNotificationSwitch = () => setUpdateNotificationSwitch((prevState) => !prevState);

    const handleGoBack = () => {
        navigation.navigate('Profile');
    };

    
    const handleLogout = async () => {
        try {
            await logout();  
            setUser({
                address: null,
                city: null,
                email: null,
                is_deleted: null,
                name: null,
                profession: null,
                role: null,
                token: null,
                user_id: null,
                zipcode: null
            });  
            navigation.navigate('Login');
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };
    
    
    

    const handleSoftDeleteUser = async () => {
        setDeleteModalVisible(true)
        try {
            if (user.role === 'artisan') {
                const productsResponse = await fetchProductsByArtisanId(user.user_id);
                const products = productsResponse;
                for (const product of products) {
                    const updatedProduct = { is_deleted: true };
                    await updateProduct(product.product_id, updatedProduct, user.token);
                }
            }
            const updatedUser = { is_deleted: true };
            const userResponse = await updateUser(user.user_id, updatedUser, user.token);
            console.log("here4", userResponse)
            if (userResponse && userResponse.success) {
                Alert.alert("Succès", "Votre compte a été supprimé avec succès.");
                setUser(null); 
                navigation.navigate('Login'); 
            } else {
                Alert.alert("Erreur", "Erreur lors de la suppression du compte.");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression logique de l'utilisateur :", error);
            Alert.alert("Erreur", "Erreur lors de la suppression logique du compte.");
        } finally {
            setDeleteModalVisible(false)
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Ionicons name="arrow-back-outline" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.mainHeader}>Paramètres</Text>
            </View>
            <View style={styles.horizontalLine} />

            <View>
                <Text style={styles.subHeader}>Géolocalisation</Text>
                <View style={styles.languageSelectorContainer}>
                    <Text style={styles.regularText}>Activer la géolocalisation</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#3E4A57" }}
                        thumbColor={GeoLocSwitch ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleGeoLocSwitch}
                        value={GeoLocSwitch}
                    />
                </View>
            </View>
            <View style={styles.horizontalLine} />

            <View>
                <Text style={styles.subHeader}>Notifications</Text>
                <View style={styles.languageSelectorContainer}>
                    <Text style={styles.regularText}>Notifications sur le téléphone</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#3E4A57" }}
                        thumbColor={notificationSwitch ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleNotificationSwitch}
                        value={notificationSwitch}
                    />
                </View>
                <View style={styles.languageSelectorContainer}>
                    <Text style={styles.regularText}>Notifications par mail</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#3E4A57" }}
                        thumbColor={mailNotificationSwitch ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleMailNotificationSwitch}
                        value={mailNotificationSwitch}
                    />
                </View>
                <View style={styles.languageSelectorContainer}>
                    <Text style={styles.regularText}>Notifications pour les mises à jour</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#3E4A57" }}
                        thumbColor={updateNotificationSwitch ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleUpdateNotificationSwitch}
                        value={updateNotificationSwitch}
                    />
                </View>
            </View>
            <View style={styles.horizontalLine} />

            <View>
                <Text style={styles.subHeader}>Langue</Text>
                <View style={styles.languageSelectorContainer}>
                    <Text style={styles.languageSelectorText}>Changer de langue</Text>
                    <Picker
                        style={styles.languageSelectorDropdown}
                        selectedValue={selectedLanguage}
                        onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                    >
                        <Picker.Item label="Français" value="fr" />
                        <Picker.Item label="Anglais" value="en" />
                    </Picker>
                </View>
            </View>
            <View style={styles.horizontalLine} />
            <View>
                <Text style={styles.subHeader}>Autres</Text>
                <View style={styles.languageSelectorContainer}>
                    <Text style={styles.languageSelectorText}>Mode</Text>
                    <Picker
                        style={styles.languageSelectorDropdown}
                        selectedValue={selectedTheme}
                        onValueChange={(itemValue) => setSelectedTheme(itemValue)}
                    >
                        <Picker.Item label="Mode sombre" value="dark" />
                        <Picker.Item label="Mode clair" value="light" />
                        <Picker.Item label="Paramètres système" value="system" />
                    </Picker>
                </View>
            </View>
            
            <View style={styles.buttonContainer1}>
                <TouchableOpacity 
                    style={styles.passwordButton} 
                    onPress={() => setChangePasswordModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Changer le mot de passe</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer2}>
                <TouchableOpacity style={styles.button} onPress={() => {
                        Alert.alert(
                            "Confirmer la suppression",
                            "Êtes-vous sûr de vouloir supprimer votre compte ?",
                            [
                                { text: "Annuler", style: "cancel" },
                                { text: "Confirmer", onPress: handleSoftDeleteUser }
                            ]
                        );
                    }}>
                    <Text style={styles.buttonText}>Supprimer son compte</Text>
                </TouchableOpacity>
            </View>

            <ChangePasswordModal
                isVisible={isChangePasswordModalVisible}
                onClose={() => setChangePasswordModalVisible(false)}
            />
            <SuppressionEnCours isVisible={isDeleteModalVisible} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 25,
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
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10, 
        marginLeft: 25,
        marginBottom: 15, 
    },
    horizontalLine: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    regularText: {
        marginLeft: 15,
    },
    languageSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 10,
    },
    languageSelectorText: {
        marginLeft: 15,
        fontSize: 14,
    },
    languageSelectorDropdown: {
        width: 200,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    pickerItem: {
        fontSize: 14, 
    },
    buttonContainer1: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        marginVertical: 15,
        gap: 5,
        marginTop: 20,
    },
    buttonContainer2: {
        alignItems: "center",
        justifyContent: 'center',
    },
    logoutButton: {
        backgroundColor: '#E7BD06',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: 150,
    },
    passwordButton: {
        backgroundColor: '#E7BD06',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: 200,
    },
    button: {
        backgroundColor: 'darkred',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: 200,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: "center",
    },
});

export default Settings;
