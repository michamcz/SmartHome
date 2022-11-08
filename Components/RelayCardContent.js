import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios'

export default function RelayCardContent({ deviceObject }) {

  const on = () => {
    axios.get(`http://${deviceObject.ip}/CHANGE?state=1`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('OnError', error);
      })
  }

  const off = () => {
    axios.get(`http://${deviceObject.ip}/CHANGE?state=0`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('OffError', error);
      })
  }

  return (
    <View style={styles.containerBottomWrap}>
      <View style={styles.containerBottom1}>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => on()}
          >
            <Text style={styles.text}>On</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => off()}
          >
            <Text style={styles.text}>Off</Text>
          </TouchableOpacity>
        </View>
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
  containerBottomWrap: {
    flex: 0.70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    color: "#CCCCCC",
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
  text: {
    fontSize: 18,
    color: "#CCCCCC",
  },
});
