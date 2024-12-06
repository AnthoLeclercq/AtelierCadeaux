import React from 'react';
import { StatePovider } from '../../context/SelectedMarkerContext';
import Maps from './Maps';
import { useRoute } from '@react-navigation/native';

const ContextMap = () => {
  const route = useRoute(); 
  const userId = route.params?.userId; 
  const userIdValue = userId ? userId : null; 

  return (
    <StatePovider>
      <Maps userId={userIdValue} />
    </StatePovider>
  );
}

export default ContextMap;
