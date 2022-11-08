import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from '../Navigation/TabNavigator';
import NewDeviceForm from '../Screens/NewDeviceForm';
import NewDevice from '../Screens/NewDevice';
import OptionsModal from '../Screens/OptionsModal';
import OptionsModalRGB from '../Screens/OptionsModalRGB';
import OptionsModalRelay from '../Screens/OptionsModalRelay';
import OptionsModalWeather from '../Screens/OptionsModalWeather';
import OptionsModalUnsync from '../Screens/OptionsModalUnsync';
import ExistingDeviceForm from '../Screens/ExistingDeviceForm';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="TabNavigation"
          component={TabNavigator}
          options={{
            title: 'SmartSystem',
            headerStyle: {
              backgroundColor: '#131313',
            },
            headerTintColor: '#CCCCCC',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="NewDevice"
          component={NewDevice}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewDeviceForm"
          component={NewDeviceForm}
          options={{
            title: 'Configure the device',
            headerStyle: {
              backgroundColor: '#57CC99',
            },
            headerTintColor: '#DDDDDD',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ExistingDeviceForm"
          component={ExistingDeviceForm}
          options={{
            title: 'Configure the device',
            headerStyle: {
              backgroundColor: '#57CC99',
            },
            headerTintColor: '#DDDDDD',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Group>
      <Stack.Group screenOption={{ presenetation: 'modal' }}>
        <Stack.Screen
          name='OptionsModal'
          component={OptionsModal}
          options={{
            title: 'Device Options',
            headerStyle: {
              backgroundColor: '#57CC99',
            },
            headerTintColor: '#DDDDDD',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name='OptionsModalRGB'
          component={OptionsModalRGB}
          options={{
            title: 'Device Options',
            headerStyle: {
              backgroundColor: '#57CC99',
            },
            headerTintColor: '#DDDDDD',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name='OptionsModalRelay'
          component={OptionsModalRelay}
          options={{
            title: 'Device Options',
            headerStyle: {
              backgroundColor: '#57CC99',
            },
            headerTintColor: '#DDDDDD',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name='OptionsModalWeather'
          component={OptionsModalWeather}
          options={{
            title: 'Device Options',
            headerStyle: {
              backgroundColor: '#57CC99',
            },
            headerTintColor: '#DDDDDD',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name='OptionsModalUnsync'
          component={OptionsModalUnsync}
          options={{
            title: 'Device Options',
            headerStyle: {
              backgroundColor: '#57CC99',
            },
            headerTintColor: '#DDDDDD',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
