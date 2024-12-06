import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const OrderItemDetail = ({ item }) => {
    return (
        <View style={styles.articleItem}>
            <View style={styles.articleDetails}>
                {item.product && item.product.images_product && item.product.images_product.length > 0 ? (
                    <Image
                        source={{ uri: item.product.images_product[0] }} 
                        style={styles.articleImage}
                    />
                ) : (
                    <Text>Pas d'image disponible</Text>
                )}
                <Text style={styles.articleName}>{item.product.name}</Text>
                <Text>Quantité : {item.quantity}</Text>
                <Text>{item.product.price} €</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    articleItem: {
        marginBottom: 15,
        justifyContent: "space-around",
    },
    articleDetails: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-around",
        lineHeight: 50,
        maxHeight: 80,
    },
    articleImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    articleName: {
        fontSize: 16,
        fontWeight: "bold",
        maxWidth: 180,
    },
});

export default OrderItemDetail;
