import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { saveNewDevice } from '../DataHandle/handleConfigData';
import { sendConfigRequest } from '../DataHandle/sendConfigRequest'
import { parse20signs, parseNoSpace, parseIP } from '../Tools/parseInput';

export default function NewDeviceForm({ navigation }) {
  const [name, setName] = React.useState('');
  const [SSID, setSSID] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [ipAddress, setipAddress] = React.useState('');
  const [gateway, setGateway] = React.useState('');
  const [mask, setmask] = React.useState('255.255.255.0');
  const [nameParsed, setnameParsed] = React.useState(true);
  const [SSIDParsed, setSSIDParsed] = React.useState(true);
  const [passParsed, setpassParsed] = React.useState(true);
  const [ipParsed, setipParsed] = React.useState(true);
  const [gatewayParsed, setgatewayParsed] = React.useState(true);
  const [maskParsed, setmaskParsed] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        endFillColor="#121212"
      >
        <TextInput
          style={styles.textInput}
          mode="outlined"
          error={!nameParsed}
          onFocus={() => setnameParsed(true)}
          outlineColor='#333333'
          activeOutlineColor='#57CC99'
          raised theme={{
            colors: {
              primary: '#57CC99',
              text: '#CCCCCC',
              placeholder: '#CCCCCC',
              accent: '#232931',
            },
            roundness: 12,
          }}
          label="Name"
          value={name}
          onChangeText={name => setName(name)}
        />
        {
          (!nameParsed) ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                Name should contain maximum 20 characters
              </Text>
            </View>
          ) : (
            <View></View>
          )
        }
        <TextInput
          style={styles.textInput}
          mode="outlined"
          error={!SSIDParsed}
          onFocus={() => setSSIDParsed(true)}
          outlineColor='#333333'
          activeOutlineColor='#57CC99'
          raised theme={{
            colors: {
              primary: '#57CC99',
              text: '#CCCCCC',
              placeholder: '#CCCCCC',
              accent: '#232931',
            },
            roundness: 12,
          }}
          label="SSID"
          value={SSID}
          onChangeText={SSID => setSSID(SSID)}
        />
        {
          (!SSIDParsed) ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                SSID cannot contain whitespace character
              </Text>
            </View>
          ) : (
            <View></View>
          )
        }
        <TextInput
          style={styles.textInput}
          mode="outlined"
          error={!passParsed}
          onFocus={() => setpassParsed(true)}
          outlineColor='#333333'
          activeOutlineColor='#57CC99'
          raised theme={{
            colors: {
              primary: '#57CC99',
              text: '#CCCCCC',
              placeholder: '#CCCCCC',
              accent: '#232931',
            },
            roundness: 12,
          }}
          label="Password"
          value={password}
          onChangeText={password => setpassword(password)}
        />
        {
          (!passParsed) ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                Password cannot contain whitespace character
              </Text>
            </View>
          ) : (
            <View></View>
          )
        }
        <TextInput
          style={styles.textInput}
          mode="outlined"
          error={!ipParsed}
          onFocus={() => setipParsed(true)}
          outlineColor='#333333'
          activeOutlineColor='#57CC99'
          raised theme={{
            colors: {
              primary: '#57CC99',
              text: '#CCCCCC',
              placeholder: '#CCCCCC',
              accent: '#232931',
            },
            roundness: 12,
          }}
          label="IP address"
          value={ipAddress}
          placeholder="___.___.___.___"
          onChangeText={ipAddress => setipAddress(ipAddress)}
          keyboardType="numeric"
        />
        {
          (!ipParsed) ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                Invalid IP address
              </Text>
            </View>
          ) : (
            <View></View>
          )
        }
        <TextInput
          style={styles.textInput}
          mode="outlined"
          error={!gatewayParsed}
          onFocus={() => setgatewayParsed(true)}
          outlineColor='#333333'
          activeOutlineColor='#57CC99'
          raised theme={{
            colors: {
              primary: '#57CC99',
              text: '#CCCCCC',
              placeholder: '#CCCCCC',
              accent: '#232931',
            },
            roundness: 12,
          }}
          label="Default gateway"
          value={gateway}
          placeholder="___.___.___.___"
          onChangeText={gateway => setGateway(gateway)}
          keyboardType="numeric"
        />
        {
          (!gatewayParsed) ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                Invalid gateway address
              </Text>
            </View>
          ) : (
            <View></View>
          )
        }
        <TextInput
          style={styles.textInput}
          mode="outlined"
          error={!maskParsed}
          onFocus={() => setmaskParsed(true)}
          outlineColor='#333333'
          activeOutlineColor='#57CC99'
          raised theme={{
            colors: {
              primary: '#57CC99',
              text: '#CCCCCC',
              placeholder: '#CCCCCC',
              accent: '#232931',
            },
            roundness: 12,
          }}
          label="Mask"
          value={mask}
          placeholder="___.___.___.___"
          onChangeText={mask => setmask(mask)}
          keyboardType="numeric"
        />
        {
          (!maskParsed) ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                Invalid mask address
              </Text>
            </View>
          ) : (
            <View></View>
          )
        }
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setnameParsed(parse20signs(name))
          setSSIDParsed(parseNoSpace(SSID))
          setpassParsed(parseNoSpace(password))
          setipParsed(parseIP(ipAddress))
          setgatewayParsed(parseIP(gateway))
          setmaskParsed(parseIP(mask))
          if (parse20signs(name) && parseNoSpace(SSID) && parseNoSpace(password) && parseIP(ipAddress) && parseIP(gateway) && parseIP(mask)) {
            sendConfigRequest({ 'ssid': SSID, 'pass': password, 'ip': ipAddress, 'gateway': gateway, 'mask': mask })
            saveNewDevice({ 'name': name, 'ip': ipAddress, 'type': '0' });
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
  },
  textInput: {
    marginTop: 12,
    marginBottom: 3,
    marginHorizontal: 15,
    backgroundColor: '#1d1d1d',
  },
  button: {
    backgroundColor: '#57CC99',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    color: '#CCCCCC',
    fontSize: 20,
  },
  errorView: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#bb0000',
  },
});
