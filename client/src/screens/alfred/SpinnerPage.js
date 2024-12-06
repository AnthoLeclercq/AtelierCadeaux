import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, StyleSheet, Dimensions } from 'react-native';
import gif from '../../../assets/images/gift_alfred.gif';
import Header from '../../components/layout/header/Header';

const width = Dimensions.get('window').width;

const SpinnerPage = () => {
    return (
        <SafeAreaView style={styles.view}>
                <Header />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.spinnerContainer}>
                        <Image
                            source={gif}
                            style={styles.giftSpinner}
                        />
                        <Text style={styles.spinnerText}>Alfred est en train de chercher un cadeau...</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "#383242"
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    spinnerContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    giftSpinner: {
        width: 300,
        height: 300,
        borderRadius: 150, 
        alignSelf: 'center',
        backgroundColor:"rouge",
        marginTop: 20,
    },
    spinnerText: {
        marginTop: 10,
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SpinnerPage;
