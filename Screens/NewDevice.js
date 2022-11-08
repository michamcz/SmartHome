import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import BannerInfo from '../Components/BannerInfo';

export default function NewDevice({ navigation }) {
  return (
    <>
      <BannerInfo />
      <View style={styles.container} >
        <Text style={styles.buttonText}> Hey! </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NewDeviceForm')}
        >
          <Text style={styles.buttonText}> Configure new Device </Text>
        </TouchableOpacity>
        <Text style={styles.buttonText}> or </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ExistingDeviceForm')}
        >
          <Text style={styles.buttonText}> Add existing Device </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 20
  },
  button: {
    backgroundColor: '#1d1d1d',
    width: '70%',
    padding: 15,
    marginHorizontal: 40,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#57CC99',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttonText: {
    color: '#CCCCCC',
    fontSize: 20,
  }
});
