import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Alert, Button } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchMetaData, fetchSubcategoriesByCategory } from '../../../services/category/category.service';
import { fetchProductIdByMetaValues } from '../../../services/product/product.service';

const CategoryElement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);

  const navigation = useNavigation();

  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isSubcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
  const [isMaterialDropdownOpen, setMaterialDropdownOpen] = useState(false);
  const [isColorDropdownOpen, setColorDropdownOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const loadInitialData = useCallback(async () => {
    try {
      const [categoriesData, materialsData, colorsData] = await Promise.all([
        fetchMetaData('categories'),
        fetchMetaData('materiaux'),
        fetchMetaData('couleurs')
      ]);

      setCategories(categoriesData.meta_values);
      setMaterials(materialsData.meta_values);
      setColors(colorsData.meta_values);

    } catch (error) {
      console.error('Erreur lors du chargement des données initiales:', error);
      Alert.alert('Erreur', 'Erreur lors du chargement des données initiales.');
    }
  }, []);

  const loadSubcategories = useCallback(async (category) => {
    try {
      const data = await fetchSubcategoriesByCategory(category);
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des sous-catégories:', error);
      Alert.alert('Erreur', 'Erreur lors de la récupération des sous-catégories.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [loadInitialData])
  );

  useEffect(() => {
    if (selectedCategory !== '') {
      loadSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, loadSubcategories]);

  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case 'category':
        setCategoryDropdownOpen(!isCategoryDropdownOpen);
        break;
      case 'subcategory':
        setSubcategoryDropdownOpen(!isSubcategoryDropdownOpen);
        break;
      case 'material':
        setMaterialDropdownOpen(!isMaterialDropdownOpen);
        break;
      case 'color':
        setColorDropdownOpen(!isColorDropdownOpen);
        break;
      default:
        break;
    }
  };

  const handleSelect = (type, value) => {
    switch (type) {
      case 'category':
        setSelectedCategory(value);
        setCategoryDropdownOpen(false);
        break;
      case 'subcategory':
        setSelectedSubcategory(value);
        setSubcategoryDropdownOpen(false);
        break;
      case 'material':
        setSelectedMaterial(value);
        setMaterialDropdownOpen(false);
        break;
      case 'color':
        setSelectedColor(value);
        setColorDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  const handleDeselect = (type) => {
    switch (type) {
      case 'category':
        setSelectedCategory('');
        setSubcategories([]);
        break;
      case 'subcategory':
        setSelectedSubcategory('');
        break;
      case 'material':
        setSelectedMaterial('');
        break;
      case 'color':
        setSelectedColor('');
        break;
      default:
        break;
    }
  };

  const handleFilter = async () => {
    if (selectedCategory || selectedSubcategory || selectedMaterial || selectedColor) {
      const metaValues = [
        selectedCategory,
        selectedSubcategory,
        selectedMaterial,
        selectedColor
      ].filter(value => value !== '');

      try {
        const productIds = await fetchProductIdByMetaValues(metaValues);
        if (productIds.length === 0) {
          Alert.alert('Désolé', 'Aucun produit ne correspond aux filtres appliqués.');
        } else {
          navigation.navigate('Results', { productIds });
        }
      } catch (error) {
        Alert.alert('Désolé', 'Aucun produit ne correspond aux filtres appliqués.');
      }
    } else {
      Alert.alert('Attention', 'Veuillez choisir un des filtres.');
    }
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedMaterial('');
    setSelectedColor('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => toggleDropdown('category')}>
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedOption}>{selectedCategory || 'Catégories disponibles'}</Text>
              {selectedCategory !== '' && (
                <TouchableOpacity onPress={() => handleDeselect('category')}>
                  <Text style={styles.cross}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
          {isCategoryDropdownOpen && (
            <View style={styles.dropdown}>
              {categories.map((category, index) => (
                <TouchableOpacity key={index} onPress={() => handleSelect('category', category)}>
                  <Text style={styles.option}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {selectedCategory !== '' && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity onPress={() => toggleDropdown('subcategory')}>
              <View style={styles.selectedContainer}>
                <Text style={styles.selectedOption}>{selectedSubcategory || 'Sous-catégories'}</Text>
                {selectedSubcategory !== '' && (
                  <TouchableOpacity onPress={() => handleDeselect('subcategory')}>
                    <Text style={styles.cross}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
            {isSubcategoryDropdownOpen && (
              <View style={styles.dropdown}>
                {subcategories.map((subcategory, index) => (
                  <TouchableOpacity key={index} onPress={() => handleSelect('subcategory', subcategory)}>
                    <Text style={styles.option}>{subcategory}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => toggleDropdown('material')}>
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedOption}>{selectedMaterial || 'Matériaux'}</Text>
              {selectedMaterial !== '' && (
                <TouchableOpacity onPress={() => handleDeselect('material')}>
                  <Text style={styles.cross}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
          {isMaterialDropdownOpen && (
            <View style={styles.dropdown}>
              {materials.map((material, index) => (
                <TouchableOpacity key={index} onPress={() => handleSelect('material', material)}>
                  <Text style={styles.option}>{material}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => toggleDropdown('color')}>
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedOption}>{selectedColor || 'Couleur'}</Text>
              {selectedColor !== '' && (
                <TouchableOpacity onPress={() => handleDeselect('color')}>
                  <Text style={styles.cross}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
          {isColorDropdownOpen && (
            <View style={styles.dropdown}>
              {colors.map((color, index) => (
                <TouchableOpacity key={index} onPress={() => handleSelect('color', color)}>
                  <Text style={styles.option}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleFilter}>
          <Text style={styles.buttonText}>Appliquer les filtres</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dropdownContainer: {
    margin: 10,
  },
  selectedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedOption: {
    fontSize: 16,
  },
  dropdown: {
    marginTop: 5,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  option: {
    padding: 10,
    fontSize: 16,
  },
  cross: {
    fontSize: 18,
    color: '#ff0000',
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 5,
    padding: 10,
  },
  buttonText: {
    padding: 10,
    backgroundColor: "#E7BD06",
    borderRadius: 10,
    fontSize: 16,
  },
});

export default CategoryElement;
