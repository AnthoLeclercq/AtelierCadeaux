import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";


const Authentication = ({ navigation }) => {
    const [selectedButton, setSelectedButton] = useState(null);

    const handleLoginClick = () => {
        setSelectedButton('login');
        navigation.navigate('Login');
    };

    const handleSignupClick = () => {
        setSelectedButton('signup');
        navigation.navigate('RegisterChoice');
    };

    return (
        <SafeAreaView>
            <ScrollView style={styles.containerScroll}>
                <View style={styles.container}>
                    <Image source={require("../../../assets/logolettrage.png")} style={styles.logo} />
                    <Text style={styles.title}>L'Atelier Cadeaux</Text>
                    <Image source={require("../../../assets/buyerAndArtisan.jpg")} style={styles.bannerImage} />
                    <Text style={styles.subTitle}>Découvrez une communauté dédiée à l'authenticité et à l'artisanat local. Trouvez le cadeau parfait en quelques clics !</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.loginButtonWrapper,
                                { backgroundColor: selectedButton === 'login' ? "#E7BD00" : "white" },
                            ]}
                            onPress={handleLoginClick}
                        >
                            <Text style={[styles.loginButtonText, {color: selectedButton === 'login' ? "black" : "#3E4A57"}]}>Se connecter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.loginButtonWrapper,
                                { backgroundColor: selectedButton === 'signup' ? "#E7BD00" : "white" },
                            ]}
                            onPress={handleSignupClick}
                        >
                            <Text style={[styles.signupButtonText, 
                                { color: selectedButton === 'signup' ? "black" : "#3E4A57" },
                            ]}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Authentication;

const styles = StyleSheet.create({
    containerScroll: {
        height: "100%",
        backgroundColor: "#FCF6E8",
    },
    container: {
        alignItems: "center",
        marginVertical: 40,
    },
    logo: {
        height: 80,
        width: 80,
        marginVertical: 10,
    },
    bannerImage: {
        marginVertical: 40,
        height: 250,
        width: "100%",
    },
    title: {
        fontSize: 40,
        paddingHorizontal: 20,
        textAlign: "center",
        color: "black",
        marginBottom: 30,
    },
    subTitle: {
        fontSize: 18,
        paddingHorizontal: 20,
        textAlign: "center",
        color: "black",
        marginVertical: 30,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: "row",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#3E4A57",
        width: "80%",
        height: 60,
        borderRadius: 100,
    },
    loginButtonWrapper: {
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
        borderRadius: 98,
    },
    loginButtonText: {
        color: "black",
        fontSize: 18,
    },
    signupButtonText: {
        fontSize: 18,
    },
});
