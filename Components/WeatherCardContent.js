import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function WeatherCardContent({ deviceObject }) {

  const [temperature, setTemperature] = useState('-');
  const [humidity, setHumidity] = useState('-');
  const [pressure, setPressure] = useState('-');

  const getData = async function () {
    try {
      const response = await fetch(`http://${deviceObject.ip}/GETDATA`)
      if (!response.ok) {
        throw new Error('not connected')
      }
      else {
        const data = await response.json()
        setTemperature(data.tempDHT22.toFixed(2));
        setHumidity(data.humidity.toFixed(2));
        setPressure(data.pressure.toFixed(2));
        return;
      }
    }
    catch (e) {
      console.log('syncData error ', e)
      return;
    }
  }

  useEffect(() => {
    const interval10 = setInterval(getData, 5000);

    return () => {
      clearInterval(interval10);
    };
  }, [])

  return (
    <View style={styles.containerBottomWrap}>
      <View style={styles.containerBottom1}>
        <Text style={styles.text}>Temp: {temperature} oC</Text>
        <Text style={styles.text}>Hum: {humidity} %</Text>
        <Text style={styles.text}>Press: {pressure} hPa</Text>
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
  text: {
    fontSize: 18,
    color: "#CCCCCC",
  },
});
