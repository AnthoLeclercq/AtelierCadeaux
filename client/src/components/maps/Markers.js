import { View } from 'react-native'
import React, { useContext } from 'react'
import { Marker } from 'react-native-maps'
import { SelectMarkerContext } from '../../context/SelectedMarkerContext'
import { MapPinIcon } from 'react-native-heroicons/solid'

const Markers = ({ item, index }) => {
  const [selectedMarker, setSelectedMarker] = useContext(SelectMarkerContext)
  const size = selectedMarker === index ? 50 : 40
  return (
    <Marker
      key={index}
      coordinate={{
        latitude: item.latitude,
        longitude: item.longitude
      }}

      onPress={() => {
        setSelectedMarker(index)
      }}
    >
      <View style={{ width: 60, height: 60}}>
        <MapPinIcon size={size} color="red" />
      </View>
    </Marker>
  )
}

export default Markers