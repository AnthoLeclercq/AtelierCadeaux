import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import Header from "../../components/layout/header/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchOrderDetails, fetchArtisanDetails, cancelOrder, updateOrderStatusById } from "../../services/order/order.service";
import { fetchUserDetails } from "../../services/user/user.service";
import OrderItemDetail from "../../components/elements/order/OrderItemDetails";
import ConfirmCancelModal from "../../components/modals/ConfirmCancel";
import StatusChange from "../../components/modals/StatusChange";
import UserUnavailableModal from "../../components/modals/UserUnavailable"
import userContext from "../../context/userContext";
import { useFocusEffect } from '@react-navigation/native';

const OrderDetails = ({ navigation, route }) => {
    const { user } = useContext(userContext);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [artisanDetails, setArtisanDetails] = useState(null);
    const [clientDetails, setClientDetails] = useState(null);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [userUnavailableModalVisible, setUserUnavailableModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const { orderId } = route.params;
            fetchDetails(orderId);
        }, [route.params])
    );

    const fetchDetails = async (orderId) => {
        try {
            const orderData = await fetchOrderDetails(orderId);
            if (orderData && Array.isArray(orderData.articles)) {
                setOrderDetails(orderData);

                if (orderData.artisan_id) {
                    const artisanData = await fetchArtisanDetails(orderData.artisan_id);
                    setArtisanDetails(artisanData);
                }

                if (orderData.user_id && user.role === 'artisan') {
                    const clientData = await fetchUserDetails(orderData.user_id);
                    setClientDetails(clientData);
                }
            } else {
                throw new Error('Invalid order data');
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching details:", error);
            setLoading(false);
        }
    };

    const handleArtisanContact = () => {
        if (orderDetails && user.role === 'client') {
            if (artisanDetails.is_deleted === 1) {
                setUserUnavailableModalVisible(true);
            } else {
                navigation.navigate("DiscussionDetails", { userId: orderDetails.artisan_id });
            }
        } else if (orderDetails && user.role === 'artisan') {
            if (clientDetails.is_deleted === 1) {
                setUserUnavailableModalVisible(true);
            } else {
                navigation.navigate("DiscussionDetails", { userId: orderDetails.user_id });
            }
        }
    };

    const handleGoProfile = () => {
        if (!orderDetails) return;

        if (user.role === 'artisan') {
            if (clientDetails?.is_deleted === 1) {
                setUserUnavailableModalVisible(true);
            } else {
                navigation.navigate('VisitProfile', { userId: orderDetails.user_id });
            }
        } else if (user.role === 'client') {
            if (artisanDetails?.is_deleted === 1) {
                setUserUnavailableModalVisible(true);
            } else {
                navigation.navigate('VisitProfile', { userId: artisanDetails?.user_id });
            }
        }
    };

    const handleCommentPress = () => {
        if (user.role === 'client') {
            navigation.navigate('AddComment', {
                orderId: orderDetails.order_id,
                products: orderDetails.articles
            });
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleCancelOrder = async () => {
        const token = user.token;
        try {
            await cancelOrder(orderDetails.order_id, token);
            setCancelModalVisible(false);
            navigation.goBack();
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    const handleChangeStatus = async (newStatus) => {
        const token = user.token;
        try {
            await updateOrderStatusById(orderDetails.order_id, newStatus, token);
            setOrderDetails({ ...orderDetails, status: newStatus });
            setStatusModalVisible(false);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!orderDetails) {
        return (
            <View style={styles.container}>
                <Text>Détails de la commande non trouvés.</Text>
            </View>
        );
    }

    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString("fr-FR", options);
    };

    const translateStatus = (status) => {
        const statusTranslations = {
            "Pending": "En attente",
            "Confirmed": "Confirmé",
            "Paid": "Payé",
            "Delivered": "Livré",
            "Completed": "Terminé",
            "Cancelled": "Annulé"
        };

        return statusTranslations[status] || status;
    };

    const statusOptions = [
        { key: "Pending", label: "En attente" },
        { key: "Confirmed", label: "Confirmé" },
        { key: "Paid", label: "Payé" },
        { key: "Delivered", label: "Livré" },
        { key: "Completed", label: "Terminé" },
        { key: "Cancelled", label: "Annulé" }
    ];

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Ionicons name="arrow-back-outline" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.mainHeader}>Détails de la commande</Text>
            </View>
            <View style={styles.orderItem}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Commande #{orderDetails.order_id}</Text>
                    <Text style={styles.orderDate}>{formatDate(orderDetails.created_at)}</Text>
                </View>

                {user.role === 'client' && artisanDetails && (
                    <Text>Vendu par : {artisanDetails.name}</Text>
                )}
                {user.role === 'artisan' && clientDetails && (
                    <Text>Acheté par : {clientDetails.name}</Text>
                )}

                <Text>Total de la commande : {orderDetails.total_cost} €</Text>
                <Text style={styles.updatedAt}>
                    Dernière mise à jour : {formatDate(orderDetails.updated_at)}
                </Text>
                <Text style={styles.articlesTitle}>Articles de la commande :</Text>
                <FlatList
                    style={styles.itemDetails}
                    data={orderDetails.articles}
                    keyExtractor={(item) => item.product_id.toString()}
                    renderItem={({ item }) => <OrderItemDetail item={item} />}
                />
            </View>
            <TouchableOpacity
                style={[
                    styles.orderItem,
                    { opacity: user.role === 'artisan' ? 1 : 0.8 }
                ]}
                onPress={() => {
                    if (user.role === 'artisan') {
                        setStatusModalVisible(true);
                    }
                }}
                disabled={user.role !== 'artisan'}
            >
                <View style={styles.orderStatusContainer}>
                    <Text style={styles.orderId}>Statut</Text>
                    <View style={styles.orderStatus}>
                        <Text style={styles.statusBtn}>{translateStatus(orderDetails.status)}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGoProfile}
                    >
                        <Text style={styles.buttonText}>
                            {user.role === 'artisan' ? 'Informations de l\'utilisateur' : 'Informations du vendeur'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleArtisanContact}
                    >
                        <Text style={styles.buttonText}>
                            {user.role === 'client' ? 'Contacter le vendeur' : 'Contacter l\'utilisateur'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>


            {user.role === 'client' && (
                <View style={styles.buttonSecondRow}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: orderDetails.status !== 'Completed' ? 'grey' : '#E7BD06' }]}
                            disabled={orderDetails.status !== 'Completed'}
                            onPress={handleCommentPress}
                        >
                            <Text style={styles.buttonText}>Laisser un commentaire</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
    style={[
        styles.button,
        {
            backgroundColor: 
                orderDetails.status === 'Cancelled' || orderDetails.status === 'Completed'
                    ? 'grey' 
                    : 'darkred'
        }
    ]}
    disabled={orderDetails.status === 'Cancelled' || orderDetails.status === 'Completed'}
    onPress={() => {
        if (orderDetails.status !== 'Cancelled' && orderDetails.status !== 'Completed') {
            setCancelModalVisible(true);
        }
    }}
>
    <Text style={styles.buttonText}>Annuler la commande</Text>
</TouchableOpacity>
                    </View>
                </View>
            )}
            <ConfirmCancelModal
                visible={cancelModalVisible}
                onConfirm={handleCancelOrder}
                onCancel={() => setCancelModalVisible(false)}
            />
            <StatusChange
                visible={statusModalVisible}
                currentStatus={orderDetails.status}
                statusOptions={statusOptions}
                onChangeStatus={handleChangeStatus}
                onCancel={() => setStatusModalVisible(false)}
            />
            <UserUnavailableModal
                visible={userUnavailableModalVisible}
                onClose={() => setUserUnavailableModalVisible(false)}
            />
        </View>
    );
};

export default OrderDetails;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    orderItem: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        borderRadius: 10,
        margin: 10,
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "lightgrey",
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    orderId: {
        fontSize: 18,
        fontWeight: "bold",
    },
    orderDate: {
        fontSize: 16,
        color: "#666",
    },
    articlesTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 20,
    },
    articleDetails: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-around",
        lineHeight: 50,
        maxHeight: 50,
    },
    orderStatusContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    orderStatus: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'lightgrey',
        borderRadius: 10,
        alignItems: "center",
    },
    statusBtn: {
        fontWeight: "bold",
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        gap: 10,
    },
    buttonSecondRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: "space-around",
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: "#E7BD06",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: 'grey',
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
});
