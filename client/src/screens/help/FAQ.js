import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ = ({ navigation }) => {
    const clientData = [
        {
            question: "Qu'est-ce que votre application propose?",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        },
        {
            question: "Comment puis-je passer une commande?",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        },
    ];

    const artisanData = [
        {
            question: "Comment poster mon premier produit?",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        },
        {
            question: "Comment répondre à une demande client?",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        },
    ];

    const [expandedIndexClient, setExpandedIndexClient] = useState(null);
    const [expandedIndexArtisan, setExpandedIndexArtisan] = useState(null);

    const toggleExpandClient = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndexClient(expandedIndexClient === index ? null : index);
    };

    const toggleExpandArtisan = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndexArtisan(expandedIndexArtisan === index ? null : index);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Ionicons name="arrow-back-outline" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.mainHeader}>Foire aux questions</Text>
            </View>

            <Text style={styles.subHeader}>Pour les Clients</Text>
            <View style={styles.horizontalLine} />
            {clientData.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => toggleExpandClient(index)}
                    style={styles.faqItem}
                >
                    <View style={styles.faqQuestionContainer}>
                        <Text style={styles.faqQuestion}>{item.question}</Text>
                    </View>
                    {expandedIndexClient === index && (
                        <View style={styles.faqAnswerContainer}>
                            <Text style={styles.faqAnswer}>{item.answer}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}

            <Text style={styles.subHeader}>Pour les Artisans</Text>
            <View style={styles.horizontalLine} />
            {artisanData.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => toggleExpandArtisan(index)}
                    style={styles.faqItem}
                >
                    <View style={styles.faqQuestionContainer}>
                        <Text style={styles.faqQuestion}>{item.question}</Text>
                    </View>
                    {expandedIndexArtisan === index && (
                        <View style={styles.faqAnswerContainer}>
                            <Text style={styles.faqAnswer}>{item.answer}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 25,
        marginBottom: 10,
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
        backgroundColor: "lightgrey",
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        padding: 15,
    },
    horizontalLine: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    faqItem: {
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
    },
    faqQuestionContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    faqAnswerContainer: {
        padding: 15,
    },
    faqAnswer: {
        fontSize: 14,
    },
});

export default FAQ;
