import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios'

export default function CurtainsCardContent({ deviceObject, navigation }) {

  const [sliderValue, setSliderValue] = useState(0);

  const open = () => {
    axios.get(`http://${deviceObject.ip}/MOVE?moveTO=0`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('OpenError', error);
      })
  }

  const close = () => {
    axios.get(`http://${deviceObject.ip}/MOVE?moveTO=${deviceObject.maxStep}`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('CloseError', error);
      })
  }

  const apply = (value) => {
    axios.get(`http://${deviceObject.ip}/MOVE?moveTO=${(value / 100) * deviceObject.maxStep}`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('ApplyColorError', error);
      })
  }

  return (
    <View style={styles.containerBottomWrap}>
      <View style={styles.containerBottom1}>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => open()}
          >
            <Text style={styles.text}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => close()}
          >
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerBottom2}>
        <MaterialCommunityIcons name="arrow-expand-horizontal" color='#777777' size={20} />
        <View style={styles.sliderView}>
          <Slider
            style={{ height: 35 }}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#57CC99"
            thumbTintColor='#57CC99'
            maximumTrackTintColor='#232931'
            step={5}
            onValueChange={(value) => setSliderValue(value)}
            onSlidingComplete={(value) => apply(value)}
          />
        </View>
        <Text style={styles.pctText}>
          {sliderValue}%
        </Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  containerBottom1: {
    flex: 0.5,
    flexDirection: "row",
    backgroundColor: '#121212', //'#393E46'
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 5,
    alignSelf: 'stretch',
  },
  containerBottom2: {
    flex: 0.5,
    flexDirection: "row",
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,
    alignSelf: 'stretch',
  },
  containerBottomWrap: {
    flex: 0.70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    color: "#EEEEEE",
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginVertical: 2,
    marginHorizontal: 8,
    width: '25%',
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  buttonView: {
    flex: 0.95,
    flexDirection: "row",
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
  },
  sliderView: {
    flex: 0.7,
  },
  text: {
    fontSize: 18,
    color: "#CCCCCC",
  },
  pctText: {
    fontSize: 18,
    flex: 0.15,
    color: "#777777",
  },
});
