//Gabriel Edgar Nogueira
//Novembro-2024

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from './screens/ListScreen';
import AddScreen from './screens/AddScreen';
import UpdateScreen from './screens/UpdateScreen';
import DeleteScreen from './screens/DeleteScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Produtos">
        <Stack.Screen name="Produtos" component={ListScreen} />
        <Stack.Screen name="Adicionar" component={AddScreen} />
        <Stack.Screen name="Atualizar" component={UpdateScreen} />
        <Stack.Screen name="Excluir" component={DeleteScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
