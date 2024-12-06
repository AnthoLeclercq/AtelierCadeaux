import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, SafeAreaView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchCommentsByProductId, deleteCommentById } from '../../services/comment/comment.service';
import { fetchUserDetails } from '../../services/user/user.service';
import { fetchProductDetails } from '../../services/product/product.service';
import userContext from '../../context/userContext';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment'; 

const Comment = ({ route }) => {
  const { productId } = route.params;
  const { user } = useContext(userContext);
  const navigation = useNavigation();
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchCommentsByProductId(productId);
        const commentsWithUserDetails = await Promise.all(fetchedComments.map(async (comment) => {
          const userDetails = await fetchUserDetails(comment.user_id);
          return { ...comment, userName: userDetails.name };
        }));
        setComments(commentsWithUserDetails);

        if (commentsWithUserDetails.length > 0) {
          const totalRating = commentsWithUserDetails.reduce((acc, comment) => acc + comment.rating, 0);
          setAverageRating(totalRating / commentsWithUserDetails.length);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.log('Erreur lors de la récupération des commentaires :', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    const loadProductDetails = async () => {
      try {
        const fetchedProduct = await fetchProductDetails(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.log('Erreur lors de la récupération des détails du produit :', error);
      }
    };

    loadComments();
    loadProductDetails();
  }, [productId]);

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentById(commentId, user.token);
      setComments(comments.filter((comment) => comment.comment_id !== commentId));
      Alert.alert('Succès', 'Commentaire supprimé avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer le commentaire');
    }
  };

  const renderStars = () => {
    const filledStars = Math.round(averageRating);
    const emptyStars = 5 - filledStars;

    return (
      <View style={styles.starContainer}>
        <Text style={styles.ratingTitle}>Note globale</Text>
        {Array(filledStars)
          .fill(0)
          .map((_, i) => (
            <Ionicons key={i} name="star" size={24} color="gold" />
          ))}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Ionicons key={i} name="star-outline" size={24} color="gold" />
          ))}
      </View>
    );
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentRow1}>
        <Text style={styles.commentName}>{item.userName}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
      <View style={styles.commentRow2}>
        <Text style={styles.commentDate}>{moment(item.date).format('DD MM YYYY')}</Text>
        <Text style={styles.commentRating}>Note: {item.rating}</Text>
      {user.role === 'client' && user.user_id === item.user_id && (
        <TouchableOpacity onPress={() => handleDeleteComment(item.comment_id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      )}
      </View>
    </View>
  );

  if (loading) {
    return <Text>Chargement des commentaires...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" color="white" size={25} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commentaires</Text>
      </View>
      {product && (
        <View style={styles.productDetailsContainer}>
          <View>
          <Image source={{ uri: product.images_product[0] }} style={styles.productImage} />
          </View>
          <View style={styles.productNameContainer}>
          <Text style={styles.productName}>{product.name}</Text> 
          </View>
        </View>
      )}
      {renderStars()}
      {comments.length > 0 ? (
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.comment_id.toString()}
        />
      ) : (
        <Text style={styles.noCommentsText}>Aucun commentaire pour cet article pour l'instant</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 15,
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
  ratingTitle: {
    color: '#3E4A57',
    fontSize: 20,
    fontWeight: 'bold',
  },
  productDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  productNameContainer: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: 250,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 10,
  },
  commentItem: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderTopColor: "lightgrey",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  commentRow1: {
    width: "80%",
  },
  commentRow2: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  commentName: {
    color: "#3E4A57",
  },
  commentDate: {
    color: "grey",
  },
  commentText: {
    flex: 1,
    fontSize: 16,
  },
  commentRating: {
    marginRight: 10,
    fontSize: 16,
    textAlign: "center",
  },
  noCommentsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default Comment;
