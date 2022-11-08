import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../Screens/HomeScreen';
import NewDevice from '../Screens/NewDevice';

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: '#57CC99' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ rerender: 'false' }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Add device"
        component={NewDevice}
        options={{
          tabBarLabel: 'Add device',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}