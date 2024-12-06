import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { getDiscussionsByClientId, getDiscussionsByArtisanId } from '../../services/discussion/discussion.service';
import { fetchUserDetails } from '../../services/user/user.service';
import userContext from '../../context/userContext';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Discussions = () => {
  const { user } = useContext(userContext);
  const [discussions, setDiscussions] = useState([]);
  const [interlocutors, setInterlocutors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchDiscussions = async () => {
        try {
          let discussionsData;
          if (user.role === 'client') {
            discussionsData = await getDiscussionsByClientId(user.user_id);
          } else if (user.role === 'artisan') {
            discussionsData = await getDiscussionsByArtisanId(user.user_id);
          }
          
          const interlocutorsData = {};
          for (const discussion of discussionsData) {
            const interlocutorId = user.role === 'client' ? discussion.artisan_id : discussion.client_id;
            if (!interlocutorsData[interlocutorId]) {
              const interlocutorDetails = await fetchUserDetails(interlocutorId);
              interlocutorsData[interlocutorId] = interlocutorDetails;
            }
          }
          setInterlocutors(interlocutorsData);
          setDiscussions(discussionsData);
        } catch (error) {
          console.log('Erreur lors de la récupération des discussions:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchDiscussions();
    }, [user])
  );

  const formatTime = (time) => {
    const date = new Date(`1970-01-01T${time}Z`);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const handleDiscussion = (item) => {
    const userId = user.role === 'client' ? item.artisan_id : item.client_id;
    navigation.navigate('DiscussionDetails', { 
      userId: userId, 
      discussion_id: item.discussion_id 
    });
  };

  const renderDiscussionElement = ({ item }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const interlocutorId = user.role === 'client' ? item.artisan_id : item.client_id;
    const interlocutor = interlocutors[interlocutorId] || {};

    return (
      <TouchableOpacity style={styles.discussionItem} onPress={() => handleDiscussion(item)}>
        <View style={styles.profileContainer}>
          <Image
            source={interlocutor.image_profile ? { uri: interlocutor.image_profile } : require('../../../assets/default_profile.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.interlocutorName}>{interlocutor.name || 'Nom inconnu'}</Text>
            <Text style={styles.lastMessage}>{lastMessage.text}</Text>
          </View>
          <Text style={styles.messageTime}>{formatTime(lastMessage.time)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" color="white" size={25} />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Messagerie</Text>
      </View>
      <View style={styles.discussionsContainer}>
        {discussions.length > 0 ? (
          <FlatList
            data={discussions}
            renderItem={renderDiscussionElement}
            keyExtractor={(item) => item.discussion_id.toString()}
          />
        ) : (
          <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessageText}>Aucun discussion n'a été initiée pour le moment</Text>
        </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Discussions;

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#3E4A57",
    alignItems: 'center',
    marginTop: 35,
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
  discussionItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  discussionsContainer: {
    flex: 1, 
    paddingLeft: 5, 
    paddingRight: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'lightgray',
  },
  detailsContainer: {
    flex: 1,
  },
  interlocutorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyMessageText: {
    marginTop: 250,
    marginBottom: 350,
    fontSize: 16,
    color: 'darkgrey',
    textAlign: 'center',
  },
});
