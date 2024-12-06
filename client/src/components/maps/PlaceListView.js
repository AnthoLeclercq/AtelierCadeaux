import React, { useContext, useEffect, useRef } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '../../context/SelectedMarkerContext';

const PlaceListView = ({ listArtisant, userId, onNavigate }) => {
  const flatListRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useContext(SelectMarkerContext);

  useEffect(() => {
    if (selectedMarker !== null && selectedMarker !== undefined) {
      scrollToIndex(selectedMarker);
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (userId) {
      const index = listArtisant.findIndex(artisan => artisan.user_id === userId);
      if (index !== -1) {
        scrollToIndex(index); 
        setSelectedMarker(index); 
      }
    }
  }, [userId, listArtisant]);

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const getItemLayout = (_, index) => ({
    length: Dimensions.get('window').width,
    offset: Dimensions.get('window').width * index,
    index,
  });

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      setSelectedMarker(visibleIndex);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View>
      <FlatList
        data={listArtisant}
        horizontal={true}
        pagingEnabled={true}
        ref={flatListRef}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View key={index}>
            <PlaceItem place={item} onNavigate={onNavigate} />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

export default PlaceListView;
