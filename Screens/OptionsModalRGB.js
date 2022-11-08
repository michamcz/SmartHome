import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome';
import { mergeItem, removeDevice } from '../DataHandle/handleConfigData';
import { sendConfigLedCount } from '../DataHandle/sendConfigRequest'
import { parseMaxStep } from '../Tools/parseInput';

export default function OptionsModalRGB({ route, navigation }) {

  const { deviceObject } = route.params;

  const [ledCount, setLedCount] = React.useState('60');
  const [ledCountParsed, setLedCountParsed] = React.useState('false');

  React.useEffect(() => {
    setLedCount(deviceObject.ledCount || '60')
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.textName}>{`${deviceObject.name} (${deviceObject.ip})`}</Text>
        <TextInput
          mode="outlined"
          onFocus={() => setLedCountParsed(true)}
          outlineColor='#333333'
          activeOutlineColor='#57CC99'
          style={styles.textInput}
          error={!ledCountParsed}
          raised theme={{
            colors: {
              primary: '#57CC99',
              text: '#CCCCCC',
              placeholder: '#CCCCCC',
              accent: '#232931',
            },
            roundness: 12,
            dense: true,
          }}
          label="LED amount"
          value={ledCount}
          onChangeText={value => setLedCount(value)}
        />
        {
          (!ledCountParsed) ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                Led amount must be a positive number
              </Text>
            </View>
          ) : (
            <View style={styles.errorView}></View>
          )
        }
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
          setLedCountParsed(parseMaxStep(ledCount))
          if (parseMaxStep(ledCount)) {
            sendConfigLedCount({ ledCount, ip: deviceObject.ip })
            mergeItem(deviceObject.name, { ledCount })
            navigation.navigate('Home', { rerender: 'true' });
          }
        }}
      >
        <Text style={styles.buttonText}> Configure </Text>
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
  textInput: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#1d1d1d',
    marginHorizontal: 15,
    marginTop: 15,
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
    backgroundColor: '#57CC99',
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
    marginBottom: 20,
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
  errorView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  errorText: {
    color: '#bb0000',
  },
});