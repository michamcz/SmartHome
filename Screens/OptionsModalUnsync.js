import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome';
import { removeDevice } from '../DataHandle/handleConfigData';

export default function OptionsModalUnsync({ route, navigation }) {

  const { deviceObject } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.textName}>{`${deviceObject.name} (${deviceObject.ip})`}</Text>
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={() => {
            removeDevice(deviceObject.name)
            navigation.navigate('Home', { rerender: 'true' });
          }}
        >
          <Text style={styles.buttonText}> Delete Device </Text>
          <MaterialCommunityIcons name="remove" color='white' size={30} />
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Home', { rerender: 'true' });
        }
        }
      >
        <Text style={styles.buttonText}> Back </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  leftBox: {
    flex: 0.4,
  },
  textName: {
    marginTop: 25,
    marginBottom: 10,
    marginHorizontal: 25,
    alignSelf: 'center',
    color: '#CCCCCC',
    fontSize: 20,
  },
  button: {
    backgroundColor: '#1d1d1d',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  buttonDelete: {
    backgroundColor: '#1d1d1d',
    padding: 15,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#57CC99',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  buttonText: {
    color: '#CCCCCC',
    fontSize: 20,
  },
});