import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Banner } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function BannerInfo() {

  const [visible, setVisible] = React.useState(true);

  return (
    <Banner
      visible={visible}
      style={styles.banner}
      actions={[
        {
          label: 'GOT IT',
          color: '#CCCCCC',
          fontSize: 20,
          flex: 0.5,
          onPress: () => setVisible(false),
        },
      ]}
      icon={() => (
        <MaterialCommunityIcons name="google-downasaur" color={'#CCCCCC'} size={35} />
      )}>
      <Text style={styles.bannerText}>To add new device make sure your phone is connected to it via WIFI. If the network is invisible check if the device is in configuration mode. </Text>
    </Banner>
  );
}


const styles = StyleSheet.create({
  bannerText: {
    fontSize: 20,
    color: '#CCCCCC'
  },
  banner: {
    backgroundColor: "#1d1d1d"
  }
});