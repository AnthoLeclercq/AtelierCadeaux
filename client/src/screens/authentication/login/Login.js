import { 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  SafeAreaView, 
  TextInput 
} from "react-native";
import React, { useState, useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Formik } from "formik";
import * as yup from "yup";
import { login } from "../../../services/authentication/auth.service";
import userContext from "../../../context/userContext";
import ForgotPasswordModal from "../../../components/modals/ForgotPassword";
import AccountDeletedModal from "../../../components/modals/AccountDeleted";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Veuillez saisir une adresse e-mail valide.")
    .required("Veuillez saisir une adresse e-mail."),
  password: yup
    .string()
    .required("Veuillez saisir un mot de passe.")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Le mot de passe doit contenir au moins un caractère spécial."
    ),
});

const Login = ({ navigation }) => {
  const [secureEntry, setSecureEntry] = useState(true);
  const [loginStatus, setLoginStatus] = useState("");
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [isAccountDeletedVisible, setAccountDeletedVisible] = useState(false);
  const { updateUser } = useContext(userContext);

  const handleGoBack = () => {
    navigation.navigate('Authentication');
  };

  const handleRegister = () => {
    navigation.navigate('RegisterChoice');
  };

  const clearLoginStatus = () => {
    setLoginStatus("");
  };

  const handleLogin = async (values) => {
    try {
      const response = await login(values.email, values.password);
      const data = response.data;
      if (data.is_deleted === 1) {
        setAccountDeletedVisible(true);
        return;
      }
      updateUser(data); 
      
      navigation.reset({
        index: 0,
        routes: [{ name: data.role === "artisan" ? "ArtisanTabs" : "ClientTabs" }],
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
      setLoginStatus("error");
    }
  };
    
  return (
    <SafeAreaView>
      <ScrollView style={styles.containerScroll}>
        <View style={styles.authHeader}>
          <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
            <Ionicons name={"arrow-back-outline"} color={"#E7BD00"} size={25} />
          </TouchableOpacity>
          <View style={styles.logoWrapper}>
            <Image source={require("../../../../assets/logolettrage.png")} style={styles.logo} />
            <Text style={styles.title}>L'Atelier Cadeaux</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>
            Que ce soit votre première visite ou que vous reveniez, nous sommes ravis de vous avoir parmi nous !
          </Text>
        </View>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name={"mail-outline"} size={30} color={"grey"} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Votre adresse email"
                  placeholderTextColor={"grey"}
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  value={values.email}
                  onFocus={clearLoginStatus}
                />
              </View>
              {touched.email && errors.email && (
                <Text style={{ color: "red" }}>{errors.email}</Text>
              )}
              <View style={styles.inputContainer}>
                <SimpleLineIcons name={"lock"} size={30} color={"grey"} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Votre mot de passe"
                  placeholderTextColor={"grey"}
                  secureTextEntry={secureEntry}
                  onChangeText={handleChange("password")}
                  value={values.password}
                  onFocus={clearLoginStatus}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSecureEntry((prev) => !prev);
                  }}
                >
                  <SimpleLineIcons name={secureEntry ? "eye" : "key"} size={20} color={"grey"} />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={{ color: "red" }}>{errors.password}</Text>
              )}
              <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleSubmit}>
                <Text style={styles.loginText}>Se connecter</Text>
              </TouchableOpacity>
              {loginStatus === "error" && (
                <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                  Identifiants incorrects. Veuillez réessayer.
                </Text>
              )}
            </View>
          )}
        </Formik>
        <ForgotPasswordModal
          isVisible={isForgotPasswordVisible}
          onClose={() => setForgotPasswordVisible(false)}
        />
                <AccountDeletedModal
          isVisible={isAccountDeletedVisible}
          onClose={() => setAccountDeletedVisible(false)}
        />
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Vous n'avez pas encore de compte ?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.signupText}>Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

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
