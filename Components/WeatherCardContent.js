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
      <View style={styles.containerBottomInnerLeft}>
        <Text style={styles.textTemp}>{temperature} °C</Text>
      </View>
      <View style={styles.containerBottomInnerRight}>
        <Text style={styles.valueHumPress}>{humidity} %</Text>
        <Text style={styles.labelHumPress}>Humidity</Text>
        <Text style={styles.valueHumPress}>{pressure} hPa</Text>
        <Text style={styles.labelHumPress}>Pressure</Text>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  containerBottomWrap: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: '#121212',
    paddingHorizontal: 5,
    paddingBottom: 5,
  },

  containerBottomInnerLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch',
    backgroundColor: '#1d1d1d',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },

  containerBottomInnerRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#121212',
  },

  text: {
    fontSize: 18,
    color: "#CCCCCC",
  },
  textTemp: {
    fontSize: 30,
    color: "#CCCCCC",
  },
  valueHumPress: {
    fontSize: 18,
    color: "#CCCCCC",
  },
  labelHumPress: {
    fontSize: 15,
    color: "#393E46",
  }
});
