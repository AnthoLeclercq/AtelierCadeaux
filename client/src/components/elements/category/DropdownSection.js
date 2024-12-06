import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryElement from './CategoryElement';

const DropdownSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
        <Text style={styles.dropdownHeaderText}>Filtres</Text>
      </TouchableOpacity>
      {isOpen && <CategoryElement />}
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    margin: 10,
  },
  dropdownHeader: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownHeaderText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default DropdownSection;
