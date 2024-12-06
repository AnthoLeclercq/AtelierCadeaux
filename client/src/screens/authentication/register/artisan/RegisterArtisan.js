import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView, TextInput } from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { registerArtisan } from '../../../../services/authentication/auth.service'; 

const RegisterArtisan = ({ navigation }) => {
    const [secureEntry, setSecureEntry] = useState(true);
    const [formPart, setFormPart] = useState(1);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [user, setUser] = useState(null);

    const handleNext = () => {
        if (formPart === 1) {
            setFormPart(2);
        } else {
            handleRegister();
        }
    };

    const handlePrevious = () => {
        if (formPart === 2) {
            setFormPart(1);
        }
    };

    const handleGoBack = () => {
        navigation.navigate('RegisterChoice');
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleRegister = async () => {
        try {
            const registeredUser = await registerArtisan({
                username,
                email,
                password,
                address,
                postalCode,
                city,
                setUser,
            });
            setUser(registeredUser);
            console.log(registeredUser);
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView style={styles.containerScroll}>
                <View style={styles.authHeader}>
                    <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
                        <Ionicons
                            name={"arrow-back-outline"}
                            color={"#E7BD00"}
                            size={25}
                        />
                    </TouchableOpacity>
                    <View style={styles.logoWrapper}>
                        <Image source={require("../../../../../assets/logolettrage.png")} style={styles.logo} />
                        <Text style={styles.title}>L'Atelier Cadeaux</Text>
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.subTitle}>Créons votre profil Artisan !</Text>
                </View>
                <View style={styles.formContainer}>
                    {formPart === 1 ? (
                        <>
                            <View style={styles.inputContainer}>
                                <Ionicons name={"mail-outline"} size={30} color={"grey"} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Votre adresse email"
                                    placeholderTextColor={"grey"}
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name={"person-outline"} size={30} color={"grey"} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Votre nom d'utilisateur"
                                    placeholderTextColor={"grey"}
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <SimpleLineIcons name={"lock"} size={30} color={"grey"} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Votre mot de passe"
                                    placeholderTextColor={"grey"}
                                    secureTextEntry={secureEntry}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setSecureEntry((prev) => !prev);
                                    }}
                                >
                                    <SimpleLineIcons name={secureEntry ? "eye" : "key"} size={20} color={"grey"} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputContainer}>
                                <SimpleLineIcons name={"lock"} size={30} color={"grey"} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Confirmer votre mot de passe"
                                    placeholderTextColor={"grey"}
                                    secureTextEntry={secureEntry}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setSecureEntry((prev) => !prev);
                                    }}
                                >
                                    <SimpleLineIcons name={secureEntry ? "eye" : "key"} size={20} color={"grey"} />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.inputContainer}>
                                <Ionicons name={"home-outline"} size={30} color={"grey"} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Votre adresse"
                                    placeholderTextColor={"grey"}
                                    value={address}
                                    onChangeText={setAddress}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name={"location-outline"} size={30} color={"grey"} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Votre code postal"
                                    placeholderTextColor={"grey"}
                                    keyboardType="numeric"
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name={"business-outline"} size={30} color={"grey"} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Votre ville"
                                    placeholderTextColor={"grey"}
                                    value={city}
                                    onChangeText={setCity}
                                />
                            </View>
                            <TouchableOpacity style={styles.previousButtonWrapper} onPress={handlePrevious}>
                                <Text style={styles.previousText}>Précédent</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleNext}>
                        <Text style={styles.loginText}>{formPart === 1 ? "Suivant" : "S'inscrire"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerContainer}>
                    <Text style={styles.accountText}>Vous avez déjà un compte ?</Text>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text style={styles.signupText}>Connectez-vous</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterArtisan;

const styles = StyleSheet.create({
    containerScroll: {
        height: "100%",
        backgroundColor: "white",
    },
    authHeader: {
        alignItems: "center",
        marginVertical: 40,
        flexDirection: "row",
        gap: 45,
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: "#3E4A57",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "black",
        borderWidth: 1,
        marginVertical: 15,
        marginLeft: 20,
    },
    logoWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        height: 50,
        width: 50,
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        paddingHorizontal: 10,
        textAlign: "center",
        color: "black",
    },
    textContainer: {
        alignItems: "center",
        marginVertical: 25,
    },
    subTitle: {
        fontSize: 18,
        paddingHorizontal: 20,
        textAlign: "justify",
        color: "black",
    },
    formContainer: {
        margin: 20,
        marginVertical: 10,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginVertical: 15,
        paddingRight: 15,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 10,
    },
    forgotPasswordText: {
        textAlign: "right",
        color: "#3E4A57",
    },
    loginButtonWrapper: {
        backgroundColor: "#E7BD00",
        borderRadius: 15,
        marginTop: 40,
    },
    loginText: {
        color: "black",
        fontSize: 16,
        textAlign: "center",
        padding: 10,
    },
    previousButtonWrapper: {
        backgroundColor: "#E7BD00",
        borderRadius: 15,
        marginTop: 20,
        marginBottom: -20,
    },
    previousText: {
        color: "black",
        fontSize: 16,
        textAlign: "center",
        padding: 10,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        gap: 5,
    },
    accountText: {
        color: "black",
    },
    signupText: {
        color: "black",
        fontWeight: "bold",
    },
});
