import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import DeviceCard from '../Components/DeviceCard';
import { getDevicesNamesTable, removeDevice } from '../DataHandle/handleConfigData';
import { useFocusEffect } from '@react-navigation/core';

export default function HomeScreen({ route, navigation }) {

  const { rerender } = route.params;
  const [rerenderr, setrerenrerr] = React.useState(false);
  const [devicesTab, setdevicesTab] = React.useState([]);
  const [loading, setloading] = React.useState(true)

  // manualy delate object from memory
  // useEffect(() => {
  //   removeDevice('name');
  // }, []);

  useFocusEffect(() => {
    setrerenrerr(rerender)
  })

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      try {
        const data = await getDevicesNamesTable()
        //console.log(data);  //devices table
        setdevicesTab(data)
        setloading(false);
      } catch (e) {
        console.log('get names table error ', e)
      }
      return () => {
        setloading(false);
      }
    }
    fetchData();
    navigation.setParams({
      rerender: 'false',
    });
  }, [rerenderr]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        {
          (!loading) ? (
            (devicesTab.length != 0) ? (
              devicesTab.map((value, i) => <DeviceCard key={i} rerender={rerenderr} deviceKey={value} navigation={navigation} />
              )
            ) : (
              <View style={styles.TextView}>
                <Text style={styles.Text}>Go to "Add device" screen and configure new device!</Text>
              </View>
            )
          ) : (
            <View style={styles.LoadingSpinner}>
              <ActivityIndicator size="large" color="#57CC99" />
            </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', //'#232931'
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  LoadingSpinner: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  scroll: {
    width: '100%',
    backgroundColor: '#121212',
  },
  Text: {
    color: '#CCCCCC',
    fontSize: 20,
  },
  TextView: {
    flex: 1,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 55,
  }
});
