import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome';
import { mergeItem, removeDevice } from '../DataHandle/handleConfigData';
import Slider from '@react-native-community/slider';
import { sendConfigStepSpeed, sendDayOpenCloseConfig } from '../DataHandle/sendConfigRequest'
import { getOneDeviceObject } from '../DataHandle/handleConfigData';
import DayTile from '../Components/DayTile'
import { parseMaxStep } from '../Tools/parseInput';

export default function OptionsModal({ route, navigation }) {

  const { deviceObject } = route.params;
  const weekTable = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const [maxStep, setmaxStep] = React.useState('');
  const [speed, setspeed] = React.useState(0);
  const [maxStepParsed, setmaxStepParsed] = React.useState(true);

  const sendWeekRequest = async () => {
    try {
      const data = await getOneDeviceObject(deviceObject.name)
      sendDayOpenCloseConfig(data)
    } catch (e) {
      console.log('get names table error ', e)
    }
  }

  React.useEffect(() => {
    setmaxStep(deviceObject.maxStep)
    setspeed(parseInt(deviceObject.speed))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.textName} >{`${deviceObject.name} (${deviceObject.ip})`}</Text>
        <TextInput
          mode="outlined"
          onFocus={() => setmaxStepParsed(true)}
          outlineColor='#333333'
          activeOutlineColor='#57CC99'
          style={styles.textInput}
          error={!maxStepParsed}
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
          label="Maximal Step"
          value={maxStep}
          onChangeText={value => setmaxStep(value)}
        />
        {
          (!maxStepParsed) ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                Maximal step must be a positive number
              </Text>
            </View>
          ) : (
            <View></View>
          )
        }
        <View style={styles.containerBottom}>
          <Text style={styles.pctText}> Speed: {speed} </Text>
          <View style={styles.sliderView}>
            <Slider
              minimumValue={1}
              maximumValue={10}
              value={speed}
              minimumTrackTintColor="#57CC99"
              thumbTintColor='#57CC99'
              maximumTrackTintColor='#232931'
              step={1}
              onValueChange={(value) => setspeed(value)}
            />
          </View>
        </View>
        <View style={styles.openCloseTextBox}>
          <View style={styles.leftBox}>
            <Text style={styles.OpenCloseText}>
              Day
            </Text>
          </View>
          <View style={styles.OpenCloseText}>
            <Text style={styles.OpenCloseText}>
              Open
            </Text>
          </View>
          <View style={styles.OpenCloseText}>
            <Text style={styles.OpenCloseText}>
              Close
            </Text>
          </View>
        </View>
        <View style={styles.DayTilesWrapper}>
          {
            weekTable.map((value, i) => <DayTile key={i} day={value} deviceObject={deviceObject} />)
          }
        </View>
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
          setmaxStepParsed(parseMaxStep(maxStep))
          if (parseMaxStep(maxStep)) {
            sendConfigStepSpeed({ maxStep, speed: JSON.stringify(14 - speed), ip: deviceObject.ip })
            mergeItem(deviceObject.name, { maxStep, speed: JSON.stringify(speed) })
            sendWeekRequest()
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
  containerBottom: {
    flex: 0.4,
    flexDirection: "row",
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginVertical: 15,
    alignSelf: 'stretch',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  openCloseTextBox: {
    flex: 0.2,
    flexDirection: "row",
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 5,
    marginHorizontal: 15,
    alignSelf: 'stretch',
  },
  leftBox: {
    flex: 0.4,
  },
  OpenCloseText: {
    flex: 0.3,
    color: '#CCCCCC',
    fontSize: 20,
    alignSelf: 'center',
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
  DayTilesWrapper: {
    paddingVertical: 12,
    marginVertical: 12,
    marginHorizontal: 15,
    backgroundColor: '#1d1d1d',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
  sliderView: {
    flex: 0.6,
  },
  pctText: {
    fontSize: 20,
    color: '#CCCCCC',
    flex: 0.4,
  },
  errorView: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#bb0000',
  },
});