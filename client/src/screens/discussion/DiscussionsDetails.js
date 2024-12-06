import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { getAllDiscussions, createDiscussion, updateDiscussion } from '../../services/discussion/discussion.service';
import { fetchUserDetails } from '../../services/user/user.service';
import userContext from '../../context/userContext';
import Ionicons from "react-native-vector-icons/Ionicons";

const DiscussionDetails = ({ route, navigation }) => {
  const connectedUser = useContext(userContext);
  const { userId } = route.params;

  const [interlocutor, setInterlocutor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [discussionId, setDiscussionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstConversation, setIsFirstConversation] = useState(false);
  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchDiscussionDetails = async () => {
      try {
        const interlocutorDetails = await fetchUserDetails(userId);
        setInterlocutor(interlocutorDetails);

        if (interlocutorDetails.is_deleted) {
          setIsUserDeleted(true);
          setModalVisible(true);
        }

        const discussions = await getAllDiscussions();
        if (discussions) {
          const relevantDiscussion = discussions.find(discussion =>
            (connectedUser.user.role === 'client' && discussion.artisan_id === userId) ||
            (connectedUser.user.role === 'artisan' && discussion.client_id === userId)
          );

          if (relevantDiscussion) {
            setDiscussionId(relevantDiscussion.discussion_id);
            setMessages(relevantDiscussion.messages);
          } else {
            setIsFirstConversation(true);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la discussion:', error);
      } finally {
        setLoading(false);
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }
    };

    fetchDiscussionDetails();
  }, [userId, connectedUser.user.user_id]);

  const formatTime = (time) => {
    try {
      const dateString = `1970-01-01T${time}Z`;
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.error('Invalid date format:', time);
        return 'Invalid time';
      }

      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || isUserDeleted) return;

    const newMsg = { text: newMessage, time: new Date().toISOString(), user_id: connectedUser.user.user_id };

    try {
      if (discussionId) {
        const updatedDiscussion = await updateDiscussion(discussionId, [newMsg]);
        setMessages(updatedDiscussion.messages);
      } else {
        const newDiscussion = await createDiscussion({
          client_id: connectedUser.user.role === 'client' ? connectedUser.user.user_id : userId,
          artisan_id: connectedUser.user.role === 'artisan' ? connectedUser.user.user_id : userId,
          messages: [newMsg],
        });
        setDiscussionId(newDiscussion.discussion_id);
        setMessages(newDiscussion.messages);
        setIsFirstConversation(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }

    setNewMessage('');
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  const handleGoToProfile = () => {
    if (interlocutor?.is_deleted) {
      setModalVisible(true);
    } else {
      navigation.navigate('VisitProfile', { userId: userId });
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.user_id === connectedUser.user.user_id;
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.interlocutorMessage]}>
        <Text style={[styles.messageText, isCurrentUser ? styles.currentUserText : styles.interlocutorText]}>{item.text}</Text>
        <Text style={styles.messageTime}>{formatTime(item.time)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.interlocutorProfile} onPress={handleGoToProfile}>
          <Text style={styles.interlocutorName}>{interlocutor?.name}</Text>
          <View style={styles.interlocutorImageContainer}>
            {interlocutor ? (
              <Image
                source={
                  interlocutor.image_profile && interlocutor.image_profile !== ''
                    ? { uri: interlocutor.image_profile }
                    : require('../../../assets/default_profile.jpg')
                }
                style={styles.interlocutorImagePlaceholder}
              />
            ) : (
              <View style={styles.interlocutorImagePlaceholder} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrivez un message..."
          style={[styles.textInput, isUserDeleted && styles.textInputDisabled]}
          editable={!isUserDeleted}
        />
        <TouchableOpacity 
          style={[styles.sendButton, isUserDeleted && styles.sendButtonDisabled]} 
          onPress={handleSendMessage} 
          disabled={isUserDeleted}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isFirstConversation}
        onRequestClose={() => setIsFirstConversation(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>C'est votre première conversation avec cette personne !</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setIsFirstConversation(false)}>
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Vous ne pouvez plus contacter cet utilisateur. Si vous avez un souci, contactez-nous dans la rubrique "?" de votre profil.</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DiscussionDetails;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#E7BD06",
    marginTop: 35,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    top: 5,
    left: 10,
    position: "absolute",
    zIndex: 2,
  },
  interlocutorProfile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
    borderRadius: 15,
  },
  interlocutorName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  interlocutorImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  interlocutorImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'lightgray',
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0d683',
  },
  interlocutorMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#373737',
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: "#232323",
  },
  interlocutorText: {
    color: "#e0d683"
  },
  messageTime: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: "white",
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginRight: -1,
    backgroundColor: "white",
  },
  textInputDisabled: {
    backgroundColor: 'lightgrey',
  },
  sendButton: {
    backgroundColor: '#E7BD06',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'grey',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#3E4A57',
    padding: 20,
    width: "75%",
    borderRadius: 10,
    gap: 10,
    alignItems: "center"
  },
  modalText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
  modalBtn: {
    backgroundColor: "#E7BD06",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "75%",
  },
  modalBtnText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#3E4A57",
  }
});
