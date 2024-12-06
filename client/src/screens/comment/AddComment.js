import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { submitComment } from "../../services/comment/comment.service";
import { fetchProductDetails } from '../../services/product/product.service';
import userContext from "../../context/userContext";

const AddComment = ({ route, navigation }) => {
    const { user } = useContext(userContext);
    const token = user.token;
    const { orderId, products } = route.params;
    const [comments, setComments] = useState(products.map(product => ({ productId: product.product_id, rating: 0, content: "", productName: "" })));

    useEffect(() => {
        const loadProductNames = async () => {
            try {
                const updatedComments = await Promise.all(comments.map(async (comment) => {
                    const productDetails = await fetchProductDetails(comment.productId);
                    return { ...comment, productName: productDetails.name };
                }));
                setComments(updatedComments);
            } catch (error) {
                console.log('Erreur lors de la récupération des détails des produits :', error);
            }
        };

        loadProductNames();
    }, []);

    const handleRatingChange = (productId, rating) => {
        setComments(comments.map(comment => 
            comment.productId === productId ? { ...comment, rating } : comment
        ));
    };

    const handleContentChange = (productId, content) => {
        setComments(comments.map(comment => 
            comment.productId === productId ? { ...comment, content } : comment
        ));
    };

    const handleSubmit = async () => {
        try {
            await Promise.all(comments.map(comment => submitComment(user.user_id, comment, token)));
            Alert.alert("Succès", "Vos commentaires ont été soumis avec succès.");
            navigation.goBack();
        } catch (error) {
            console.error("Erreur lors de l'envoi des commentaires:", error);
            Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi de vos commentaires.");
        }
    };

    const renderStars = (productId, rating) => (
        <View style={styles.starContainer}>
            {Array(5).fill(0).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => handleRatingChange(productId, i + 1)}>
                    <Ionicons name={i < rating ? "star" : "star-outline"} size={24} color="gold" />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" color="white" size={25} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Laisser un commentaire</Text>
            </View>
            {comments.map(comment => (
                <View key={comment.productId} style={styles.commentBox}>
                    <Text style={styles.productName}>Produit : {comment.productName || "Chargement..."}</Text>
                    {renderStars(comment.productId, comment.rating)}
                    <TextInput
                        style={styles.textInput}
                        placeholder="Écrire un commentaire..."
                        multiline
                        numberOfLines={4}
                        value={comment.content}
                        onChangeText={(text) => handleContentChange(comment.productId, text)}
                    />
                </View>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Soumettre les commentaires</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    },
    header: {
        padding: 16,
        backgroundColor: "#3E4A57",
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: '#E7BD06',
        borderRadius: 20,
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
        top: 5,
        left: 5,
        position: "absolute",
        zIndex: 2,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    commentBox: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    starContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    textInput: {
        borderColor: "lightgrey",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#fff",
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#E7BD06",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 50,
    },
    submitButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddComment;
