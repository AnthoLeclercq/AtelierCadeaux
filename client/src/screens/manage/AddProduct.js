import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { addProduct, uploadImage } from "../../services/product/product.service";
import userContext from "../../context/userContext";
import pickImage from "../../services/image/image.service";
import { fetchMetaData, fetchSubcategoriesByCategory, addProductMeta } from "../../services/category/category.service";
import { useFocusEffect } from '@react-navigation/native';


const AddProduct = ({ navigation }) => {
  const user = useContext(userContext);
  const token = user.user.token;
  const userId = user.user.user_id;

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [subcategoryMetaId, setSubcategoryMetaId] = useState(null);

  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showSubcategoryOptions, setShowSubcategoryOptions] = useState(false);
  const [showMaterialOptions, setShowMaterialOptions] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
    const loadData = async () => {
      try {
        const categoryData = await fetchMetaData('categories');
        const materialData = await fetchMetaData('materiaux');
        const colorData = await fetchMetaData('couleurs');

        setCategories(categoryData.meta_values);
        setMaterials(materialData.meta_values);
        setColors(colorData.meta_values);
      } catch (error) {
        console.error('Erreur lors de la récupération des données initiales:', error);
        Alert.alert('Erreur', 'Erreur lors de la récupération des données initiales.');
      }
    };

    loadData();
  }, [])
);

  const fetchMetaIds = async () => {
    try {
      const categoriesResponse = await fetchMetaData('categories');
      const materialsResponse = await fetchMetaData('materiaux');
      const colorsResponse = await fetchMetaData('couleurs');
      
      return {
        categoryMetaId: categoriesResponse.meta_id,
        materialMetaId: materialsResponse.meta_id,
        colorMetaId: colorsResponse.meta_id,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des IDs des métadonnées:', error);
      throw new Error('Erreur lors de la récupération des IDs des métadonnées.');
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategoriesByCategory(selectedCategory)
        .then(data => {
          setSubcategories(data.subcategories || []);
          setSubcategoryMetaId(data.meta_id);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des sous-catégories:', error);
          Alert.alert('Erreur', 'Erreur lors de la récupération des sous-catégories.');
        });
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);



  const handleAddProduct = async () => {
    setLoading(true);

    try {
      if (!selectedCategory) {
        throw new Error('Veuillez sélectionner une catégorie.');
      }
      if (!selectedSubcategory) {
        throw new Error('Veuillez sélectionner une sous-catégorie.');
      }
      if (!selectedMaterial) {
        throw new Error('Veuillez sélectionner un matériau.');
      }
      if (!selectedColor) {
        throw new Error('Veuillez sélectionner une couleur.');
      }

      const metaIds = await fetchMetaIds();

      const productData = {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        images_product: productImages,
      };
      const addProductResponse = await addProduct(productData, userId, token);

      if (!addProductResponse.success) {
        throw new Error(addProductResponse.error.message);
      }

      const { product_id } = addProductResponse.data;

      const metaProductData = [
        { meta_id: metaIds.categoryMetaId, meta_value: selectedCategory },
        { meta_id: subcategoryMetaId, meta_value: selectedSubcategory },
        { meta_id: metaIds.materialMetaId, meta_value: selectedMaterial },
        { meta_id: metaIds.colorMetaId, meta_value: selectedColor },
      ].filter(meta => meta.meta_id && meta.meta_value);

      if (metaProductData.length > 0) {
        await Promise.all(metaProductData.map(meta =>
          addProductMeta({
            product_id,
            meta_id: meta.meta_id,
            meta_value: meta.meta_value,
          }, token)
        ));
      }

      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setProductImages([]);
      setSelectedCategory("");
      setSelectedSubcategory("");
      setSelectedMaterial("");
      setSelectedColor("");

      Alert.alert('Succès', 'Produit ajouté avec succès.');
      navigation.navigate('ManageProduct');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error.message);
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'ajout du produit.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductImageUpload = async () => {
    if (productImages.length >= 5) {
      Alert.alert("Limite atteinte", "Vous ne pouvez ajouter que jusqu'à 5 images.");
      return;
    }
    const result = await pickImage();

    if (result && result.uri) {
      try {
        const imageUrl = await uploadImage(result.uri);
        if (imageUrl) {
          setProductImages(prevImages => [...prevImages, imageUrl]);
          Alert.alert('Succès', 'Image téléchargée et ajoutée au produit avec succès.\nAttention, vos images sont chargées mais pas encore sauvegardées.\nN\'oubliez pas d\'enregistrer');
        } else {
          Alert.alert('Erreur', 'Échec de la récupération de l\'URL de l\'image depuis la réponse.');
        }
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image:', error);
        Alert.alert('Erreur', 'Erreur lors du téléchargement de l\'image. Vérifiez votre connexion réseau.');
      }
    } else {
      Alert.alert('Erreur', 'Échec de la sélection de l\'image.');
    }
  };

  const handleImageDelete = async (imageUrl) => {
    setProductImages(prevImages => prevImages.filter(img => img !== imageUrl));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" color="white" size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajouter un Produit</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct} disabled={loading}>
            <Ionicons name="save-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nom du produit</Text>
        <TextInput
          style={styles.input}
          value={productName}
          onChangeText={setProductName}
        />

        <Text style={styles.label}>Prix</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={productPrice}
          onChangeText={setProductPrice}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={productDescription}
          onChangeText={setProductDescription}
        />

        <Text style={styles.label}>Catégorie</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowCategoryOptions(!showCategoryOptions)}>
          <Text>{selectedCategory || 'Sélectionner une catégorie'}</Text>
          <Ionicons name={showCategoryOptions ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} />
        </TouchableOpacity>
        {showCategoryOptions && (
          <View style={styles.dropdownMenu}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedCategory(category);
                setSelectedSubcategory(""); 
                setShowCategoryOptions(false);
              }}>
                <Text style={styles.optionText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedCategory && (
          <>
            <Text style={styles.label}>Sous-catégorie</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowSubcategoryOptions(!showSubcategoryOptions)}>
              <Text>{selectedSubcategory || 'Sélectionner une sous-catégorie'}</Text>
              <Ionicons name={showSubcategoryOptions ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} />
            </TouchableOpacity>
            {showSubcategoryOptions && (
              <View style={styles.dropdownMenu}>
                {subcategories.map((subcategory, index) => (
                  <TouchableOpacity key={index} onPress={() => {
                    setSelectedSubcategory(subcategory);
                    setShowSubcategoryOptions(false);
                  }}>
                    <Text style={styles.optionText}>{subcategory}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        <Text style={styles.label}>Matériau</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowMaterialOptions(!showMaterialOptions)}>
          <Text>{selectedMaterial || 'Sélectionner un matériau'}</Text>
          <Ionicons name={showMaterialOptions ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} />
        </TouchableOpacity>
        {showMaterialOptions && (
          <View style={styles.dropdownMenu}>
            {materials.map((material, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedMaterial(material);
                setShowMaterialOptions(false);
              }}>
                <Text style={styles.optionText}>{material}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Couleur</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowColorOptions(!showColorOptions)}>
          <Text>{selectedColor || 'Sélectionner une couleur'}</Text>
          <Ionicons name={showColorOptions ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} />
        </TouchableOpacity>
        {showColorOptions && (
          <View style={styles.dropdownMenu}>
            {colors.map((color, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedColor(color);
                setShowColorOptions(false);
              }}>
                <Text style={styles.optionText}>{color}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Images</Text>
        <Text style={styles.warningLine}>Vous pouvez ajouter jusqu'à 5 photos maximum</Text>
        <ScrollView horizontal style={styles.imageContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleProductImageUpload}>
      <Ionicons name="add" size={30} color="black" />
    </TouchableOpacity>
          {productImages.map((imageUrl, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
              <TouchableOpacity style={styles.deleteIcon} onPress={() => handleImageDelete(img)}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop : 5,
  },
  container: {
    padding: 16,
    paddingTop: 20,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: "#3E4A57",
    borderRadius: 50,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    top: 5,
    left: 0,
    position: "absolute",
    zIndex: 2,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
  },
  saveButton: {
    flexDirection: "row",
    gap: 5,
    padding: 10,
    backgroundColor: "#3E4A57",
    borderRadius: 50,
    marginLeft: 20,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    top: 5,
    right: 5,
    position: "absolute",
    zIndex: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  warningLine: {
    color: "red", 
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  optionText: {
    padding: 10,
  },
  uploadButton: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginRight: 10,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxHeight: 120,
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    margin: 5,
  },
  deleteIcon: {
    top: -98,
    right: -65,
    width: 33,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    zIndex: 3,
  },
});

export default AddProduct;
