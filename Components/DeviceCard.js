import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getOneDeviceObject } from '../DataHandle/handleConfigData';
import { useFocusEffect } from '@react-navigation/core';
import syncData from '../Tools/syncData';
import ProperCard from '../Tools/ProperCard';
//import { Item } from 'react-native-paper/lib/typescript/components/List/List';

export default function DeviceCard({ navigation, deviceKey, rerender }) {

  const [rerenderr, setrerenrerr] = useState(false);
  const [renderCard, setrenderCard] = useState(false);
  const [fetchData, setfetchData] = useState(false)
  const [deviceObject, setDeviceObject] = useState({ 'name': 'default', 'ip': '192.168.1.2', 'type': '1' });
  const [loading, setloading] = useState(true);
  const [syncDone, setSyncDone] = useState(false); //false to prod
  const [syncMessage, setSyncMessage] = useState('');

  const IconSet = {
    1: "window-shutter",
    2: "lamp",
    3: "power-socket-fr",
    4: "weather-partly-cloudy",
  }

  useFocusEffect(() => {
    setrerenrerr(rerender)
  })

  React.useEffect(() => {
    setSyncDone(false)
    const sync = async () => {
      try {
        const data = await getOneDeviceObject(deviceKey)
        //console.log("MEMORY")
        //console.log(data)
        const sync = await syncData(data)
        setSyncDone(true)
        setfetchData(!fetchData)
        setSyncMessage(sync)
      } catch (e) {
        console.log('sync effect error ', e)
      }
    }
    sync();
  }, [renderCard])

  React.useEffect(() => {
    const fetchDatafun = async () => {
      try {
        setloading(true)
        const data = await getOneDeviceObject(deviceKey)
        //console.log('MEMORY POST')
        //console.log(data)
        data ? setDeviceObject(data) : setDeviceObject({ 'name': 'default', 'ip': '1.2.3.4', 'type': '0' })
        setloading(false);
      } catch (e) {
        console.log('get names table error ', e)
      }
      return () => {
        setloading(false);
      }
    }
    fetchDatafun();
  }, [rerenderr, fetchData]);

  return (
    (!loading && syncDone && deviceObject !== null) ? (
      <View style={styles.containerMain}>
        {
          (syncMessage == false) ? (
            <View style={styles.errorView}>
              <TouchableOpacity
                style={styles.buttonError}
                onPress={() => setrenderCard(!renderCard)}
              >
                <Text style={styles.errorText}>
                  Unable to connect!
                </Text>
                <MaterialCommunityIcons name="reload" color='yellow' size={22} />
              </TouchableOpacity>
            </View>
          ) : (<View></View>)
        }
        <View style={styles.containerTop}>
          <View style={styles.containerTopName}>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              {
                deviceObject.type ? (
                  <MaterialCommunityIcons name={IconSet[deviceObject.type]} color='#CCCCCC' size={20} />
                ) : (
                  <View></View>
                )
              }
              <Text style={{ fontSize: 20, color: '#CCCCCC', paddingStart: 5, }}>{`${deviceObject.name}` || 'default'}</Text>

            </View>
            <TouchableOpacity
              style={styles.buttonOption}
              onPress={() => {
                if (deviceObject.type == 1) navigation.navigate('OptionsModal', { deviceObject })
                else if (deviceObject.type == 2) navigation.navigate('OptionsModalRGB', { deviceObject })
                else if (deviceObject.type == 3) navigation.navigate('OptionsModalRelay', { deviceObject })
                else if (deviceObject.type == 4) navigation.navigate('OptionsModalWeather', { deviceObject })
                else navigation.navigate('OptionsModalUnsync', { deviceObject })
              }}
            >
              <MaterialCommunityIcons name="pencil-outline" color='#777777' size={25} />
            </TouchableOpacity>
          </View>
        </View>
        <ProperCard deviceObject={deviceObject} />
      </View>
    ) : (
      <View style={styles.LoadingSpinner}>
        <ActivityIndicator size="large" color="#57CC99" />
      </View>
    )
  );
}
const styles = StyleSheet.create({
  containerMain: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    //marginHorizontal: 7,
    marginVertical: 3,
    borderBottomWidth: 1,
    borderColor: '#333333',
  },
  LoadingSpinner: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  containerTop: {
    flex: 0.3,
    flexDirection: "row",
    backgroundColor: '#121212', //'#232931'
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 2,
  },
  containerTopName: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: '#121212', //'#232931'
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignSelf: 'stretch',
  },
  buttonOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    flexDirection: "row",
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 18,
    color: "#CCCCCC",
  },
  errorText: {
    color: 'yellow',
    paddingHorizontal: 10,
  },
  errorView: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 5,
  },
  buttonError: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});