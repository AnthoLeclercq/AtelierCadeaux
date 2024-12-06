import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView, Dimensions } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { UserIcon, BuildingOfficeIcon } from "react-native-heroicons/outline"


const RegisterChoice = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.navigate('Authentication');
  };

  const handleRegisterUser = () => {
    navigation.navigate('RegisterUser');
  };

  const handleRegisterArtisan = () => {
    navigation.navigate('RegisterArtisan');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
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
            <Image source={require("../../../../assets/logolettrage.png")} style={styles.logo} />
            <Text style={styles.title}>L'Atelier Cadeaux</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Inscrivez-vous en tant qu'acheteur pour trouver le cadeau parfait ou en tant qu'artisan pour vendre vos créations uniques.</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.normalText}>Vous souhaitez vous inscrire en tant que :</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegisterUser}
            >
              <Text style={styles.buttonText}>Acheteur</Text>
              <UserIcon size={25} color='white' />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegisterArtisan}
            >
              <Text style={styles.buttonText}>Artisan</Text>
              <BuildingOfficeIcon size={25} color='white' />
            </TouchableOpacity>
          </View>
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

export default RegisterChoice;

const screenWidth = Dimensions.get('window').width;

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
    marginVertical: 30,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "justify",
    color: "black",
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
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3E4A57',
    width: screenWidth * 0.36,
    marginRight: 10,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#F5F5F5',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  logoButton: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginTop: 5,
  },
});
