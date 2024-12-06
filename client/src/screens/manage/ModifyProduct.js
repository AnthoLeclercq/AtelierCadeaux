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
import { updateProduct, uploadImage, deleteImage } from "../../services/product/product.service";
import userContext from "../../context/userContext";
import pickImage from "../../services/image/image.service";
import {
  getProductMetasByProductId,
  fetchMetaData,
  fetchSubcategoriesByCategory,
  deleteProductMetasByProductId,
  addProductMeta
} from "../../services/category/category.service";
import { useFocusEffect } from '@react-navigation/native';


const ModifyProduct = ({ route, navigation }) => {
  const { product } = route.params;
  const ConnectedUser = useContext(userContext);
  const token = ConnectedUser.user.token;

  const [productName, setProductName] = useState(product.name || "");
  const [productPrice, setProductPrice] = useState(product.price ? product.price.toString() : "");
  const [productDescription, setProductDescription] = useState(product.description || "");
  const [productImages, setProductImages] = useState(product.images_product || []);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showSubcategoryOptions, setShowSubcategoryOptions] = useState(false);
  const [showMaterialOptions, setShowMaterialOptions] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);

  const [subcategoryMetaId, setSubcategoryMetaId] = useState(null);

  const [existingMetas, setExistingMetas] = useState({
    category: "",
    subcategory: "",
    material: "",
    color: ""
  });

  const initialState = {
    selectedCategory: "",
    selectedSubcategory: "",
    selectedMaterial: "",
    selectedColor: "",
  };

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchProductMetas = async () => {
        try {
          const metasResponse = await getProductMetasByProductId(product.product_id, token);
          const metas = metasResponse.data || [];

          const categoryMetaData = await fetchMetaData('categories');
          const materialMetaData = await fetchMetaData('materiaux');
          const colorMetaData = await fetchMetaData('couleurs');

          const categoryMetaId = categoryMetaData.meta_id;
          const materialMetaId = materialMetaData.meta_id;
          const colorMetaId = colorMetaData.meta_id;

          const newExistingMetas = {};

          for (const meta of metas) {
            if (meta.meta_id === categoryMetaId) {
              newExistingMetas.category = meta.meta_value;
              setSelectedCategory(meta.meta_value);
            } else if (meta.meta_id === materialMetaId) {
              newExistingMetas.material = meta.meta_value;
              setSelectedMaterial(meta.meta_value);
            } else if (meta.meta_id === colorMetaId) {
              newExistingMetas.color = meta.meta_value;
              setSelectedColor(meta.meta_value);
            } else if (meta.meta_id === subcategoryMetaId) {
              newExistingMetas.subcategory = meta.meta_value;
              setSelectedSubcategory(meta.meta_value);
            }
          }

          setExistingMetas(newExistingMetas);
        } catch (error) {
          console.error('Erreur lors de la récupération des métadonnées du produit:', error);
          Alert.alert('Erreur', 'Erreur lors de la récupération des métadonnées du produit.');
        }
      };

      fetchProductMetas();
    }, [product.product_id, token, subcategoryMetaId])
  );

  useFocusEffect(
    React.useCallback(() => {
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
    }, [selectedCategory])
  );

  const handleUpdate = async () => {
    setLoading(true);
    console.log("Début de la mise à jour du produit");
    console.log(product.product_id)
    try {
      const updateResponse = await updateProduct(product.product_id, {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        images_product: productImages,
      }, token);
      console.log("ici2", updateResponse)

      console.log("Produit mis à jour avec succès");

      const newMetas = [];

      // Ajout de la catégorie
      if (selectedCategory !== existingMetas.category) {
        const categoryMeta = await fetchMetaData('categories');
        newMetas.push({ meta_id: categoryMeta.meta_id, meta_value: selectedCategory });
      } else if (existingMetas.category) {
        newMetas.push({ meta_id: 1, meta_value: existingMetas.category });
      }

      // Ajout de la sous-catégorie
      if (selectedSubcategory) {
        newMetas.push({ meta_id: subcategoryMetaId, meta_value: selectedSubcategory });
      }

      // Ajout du matériau
      if (selectedMaterial !== existingMetas.material) {
        const materialMeta = await fetchMetaData('materiaux');
        newMetas.push({ meta_id: materialMeta.meta_id, meta_value: selectedMaterial });
      } else if (existingMetas.material) {
        newMetas.push({ meta_id: 14, meta_value: existingMetas.material });
      }

      // Ajout de la couleur
      if (selectedColor !== existingMetas.color) {
        const colorMeta = await fetchMetaData('couleurs');
        newMetas.push({ meta_id: colorMeta.meta_id, meta_value: selectedColor });
      } else if (existingMetas.color) {
        newMetas.push({ meta_id: 15, meta_value: existingMetas.color });
      }

      // Vérification des métadonnées existantes
      console.log("Nouvelles métadonnées :", newMetas);

      const metasResponse = await getProductMetasByProductId(product.product_id, token);
      const metas = metasResponse.data || [];
      const metaIdsToDelete = metas.filter(meta => {
        return !newMetas.find(newMeta => newMeta.meta_id === meta.meta_id && newMeta.meta_value === meta.meta_value);
      }).map(meta => meta.meta_id);

      console.log("IDs des métadonnées à supprimer :", metaIdsToDelete);

      if (metaIdsToDelete.length > 0) {
        const deleteResponse = await deleteProductMetasByProductId(product.product_id, token, metaIdsToDelete);
        console.log("Réponse de suppression des métadonnées :", deleteResponse.data);
      }

      // Ajout des nouvelles métadonnées
      const addMetaPromises = newMetas.map(meta =>
        addProductMeta({
          product_id: product.product_id,
          meta_id: meta.meta_id,
          meta_value: meta.meta_value,
        }, token)
      );

      await Promise.all(addMetaPromises);
      Alert.alert('Succès', 'Produit mis à jour avec succès.');
      navigation.navigate('ManageProduct');
    } catch (error) {
      console.log('Erreur lors de la mise à jour du produit et des métadonnées :', error);
      Alert.alert('Erreur', 'Erreur lors de la mise à jour du produit et des métadonnées.');
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
    try {
      const data = await deleteImage(product.product_id, imageUrl, token);
      if (data) {
        setProductImages(prevImages => prevImages.filter(img => img !== imageUrl));
        Alert.alert('Confirmation', 'L\'image a été supprimée');
      } else {
        console.error('Problème lors de la suppression de l\'image:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
    }
  };

  const handleReset = async () => {
    try {
      const result = await deleteProductMetasByProductId(product.product_id, token);
      setSelectedCategory("");
      setSelectedSubcategory("");
      setSelectedMaterial("");
      setSelectedColor("");
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des champs :', error);
    }
  };




  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" color="white" size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier le Produit</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
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

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Réinitialisation des catégories du produit</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Catégorie</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowCategoryOptions(!showCategoryOptions)}>
          <Text>{selectedCategory || 'Sélectionner une catégorie'}</Text>
          <Ionicons name={showCategoryOptions ? 'chevron-up' : 'chevron-down'} size={20} />
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

        <Text style={styles.label}>Sous-catégorie</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowSubcategoryOptions(!showSubcategoryOptions)}>
          <Text>{selectedSubcategory || 'Sélectionner une sous-catégorie'}</Text>
          <Ionicons name={showSubcategoryOptions ? 'chevron-up' : 'chevron-down'} size={20} />
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

        <Text style={styles.label}>Matériau</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowMaterialOptions(!showMaterialOptions)}>
          <Text>{selectedMaterial || 'Sélectionner un matériau'}</Text>
          <Ionicons name={showMaterialOptions ? 'chevron-up' : 'chevron-down'} size={20} />
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
          <Ionicons name={showColorOptions ? 'chevron-up' : 'chevron-down'} size={20} />
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

        <Text style={styles.label}>Images du produit</Text>
        <Text style={styles.warningLine}>Vous pouvez ajouter jusqu'à 5 photos maximum</Text>
        <ScrollView horizontal style={styles.imageContainer}>
          {productImages.length < 5 && (
            <TouchableOpacity style={styles.uploadButton} onPress={handleProductImageUpload}>
              <Ionicons name="add" size={30} color="black" />
            </TouchableOpacity>
          )}
          {productImages.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.image} />
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
    paddingTop: 15,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: "#3E4A57",
    borderRadius: 20,
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
    borderRadius: 20,
    marginLeft: 20,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    top: 5,
    right: 5,
    position: "absolute",
    zIndex: 2,
  },
  container: {
    padding: 16,
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
  resetButton: {
    backgroundColor: "#3E4A57",
    padding: 5, 
    borderRadius: 15,
    marginVertical: 10,
    alignItems: "center",
    marginBottom: 25,
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  optionText: {
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxHeight: 120,
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
  imageWrapper: {
    position: 'relative',
    marginTop: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 4,
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

export default ModifyProduct;
