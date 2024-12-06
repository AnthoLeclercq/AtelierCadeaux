import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ChevronRightIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { useFocusEffect } from '@react-navigation/native';
import SpinnerPage from './SpinnerPage';
import SuggestedProducts from './SuggestedProducts';
import { fetchProducts } from '../../services/product/product.service';
import { callAlfredAPI } from '../../services/alfred/alfred.service';
import { searchProductsAndArtisans } from '../../services/search/search.service';
import Header from '../../components/layout/header/Header';

const Alfred = ({ navigation }) => {
  const questions = [
    { id: 1, text: 'Quel est le sexe de la personne à qui vous offrez le cadeau ?', options: ['Homme', 'Femme', 'Autre'] },
    { id: 2, text: 'Quel est l\'âge de la personne ?', options: ['Bébé', 'Enfant', 'Adolescent', 'Adulte'] },
    { id: 3, text: 'Comment définiriez-vous sa personnalité ?', options: ['Aventureux', 'Creatif', 'Geek', 'Sportif', 'Intellectuel', 'Curieux', 'Écologique'] },
    { id: 4, text: 'Préférez-vous quelque chose de pratique, symbolique ou mémorable ?', options: ['Pratique', 'Symbolique', 'Mémorable'] },
    { id: 5, text: 'Préférez-vous des produits personnalisés ?', options: ['Oui', 'Non'] },
  ];

  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(''));
  const [showAlternateView, setShowAlternateView] = useState(false);
  const [products, setProducts] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadProducts = async () => {
        try {
          const productData = await fetchProducts();
          setProducts(productData);
        } catch (error) {
          setError("Failed to load products");
        }
      };

      loadProducts();
    }, [])
  );

  const handleOptionPress = (option) => {
    const updatedOptions = [...selectedOptions];

    if (questions[currentQuestion].id === 3) {
      const currentSelections = updatedOptions[currentQuestion];
      const newSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option)
        : [...currentSelections, option];

      updatedOptions[currentQuestion] = newSelections;
    } else {
      updatedOptions[currentQuestion] = option === updatedOptions[currentQuestion] ? '' : option;
    }

    setSelectedOptions(updatedOptions);
    setIsNextDisabled(updatedOptions[currentQuestion].length === 0);
  };

  const handleFinish = async () => {
    const formattedAnswers = questions.reduce((acc, question, index) => {
      acc[question.text] = Array.isArray(selectedOptions[index]) ? selectedOptions[index][0] : selectedOptions[index];
      return acc;
    }, {});
    
    try {
      const response = await callAlfredAPI(formattedAnswers);
      const simplifiedProducts = [...new Set(response.map(item => item.split(" ")[0].toLowerCase()))]; 
  
      const keywords = simplifiedProducts.slice(0, 10);
  
      const searchResults = [];
  
      for (const keyword of keywords) {
        try {
          const results = await searchProductsAndArtisans(keyword);
          searchResults.push(results); 
        } catch (error) {
          console.error(`Erreur lors de la recherche pour le mot-clé "${keyword}":`, error);
          searchResults.push(null); 
        }
      }
  
      const aggregatedResults = searchResults.filter(result => result !== null).flat();
      aggregatedResults.forEach(result => {
      });
        const productIds = aggregatedResults.flatMap(result => result.products.map(product => product._id));
  
        navigation.navigate('SuggestedProducts', { productIds });
    } catch (error) {
      console.error("Erreur lors de l'appel au backend ou de la recherche:", error.message);
    }
  };

  if (spinnerVisible) {
    return <SpinnerPage />;
  }

  if (showAlternateView) {
    return <SuggestedProducts products={productIds} onReloadPress={() => setShowAlternateView(false)} />;
  }

  return (
    <SafeAreaView style={styles.view}>
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.alfredContainer}>
        <View style={styles.title}>
          <Text style={styles.titre}>Les suggestions d'Alfred</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.navigate('Home')}>
            <MaterialCommunityIcons name="close" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.questionText}>{questions[currentQuestion].text}</Text>

          <ScrollView>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={
                  questions[currentQuestion].id === 3 && selectedOptions[currentQuestion].includes(option)
                    ? styles.selectedOption
                    : selectedOptions[currentQuestion] === option
                      ? styles.selectedOption
                      : styles.option
                }
                onPress={() => handleOptionPress(option)}
              >
                <Text style={[
                  styles.optionText,
                  (questions[currentQuestion].id === 3 && selectedOptions[currentQuestion].includes(option)) || selectedOptions[currentQuestion] === option
                    ? styles.selectedText
                    : {}
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.previous}
            onPress={() => setCurrentQuestion(Math.max(currentQuestion - 1, 0))}
          >
            <ChevronLeftIcon size={30} color='white' />
          </TouchableOpacity>

          <Text style={styles.questionCounter}>{`${currentQuestion + 1}/${questions.length}`}</Text>

          <TouchableOpacity
            style={styles.next}
            onPress={() => {
              if (!isNextDisabled) {
                currentQuestion === questions.length - 1 ? handleFinish() : setCurrentQuestion(currentQuestion + 1);
              }
            }}
          >
            <ChevronRightIcon size={30} color='white' />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeBtn: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
  },
  alfredContainer: {
    top: 25,
  },
  title: {
    alignItems: 'center',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#007BFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0056b3',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  optionText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff', 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 45,
  },
  previous: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  next: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  questionCounter: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Alfred;
