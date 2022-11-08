import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RGBLampCardContent from '../Components/RGBLampCardContent';
import CurtainsCardContent from '../Components/CurtainsCardContent';
import RelayCardContent from '../Components/RelayCardContent'
import WeatherCardContent from '../Components/WeatherCardContent'


export default function ProperCard({ deviceObject }) {
    //console.log(deviceObject)
    if (deviceObject.type == 1) {
        return <CurtainsCardContent deviceObject={deviceObject} />
    }
    else if (deviceObject.type == 2) {
        return <RGBLampCardContent deviceObject={deviceObject} />
    }
    else if (deviceObject.type == 3) {
        return <RelayCardContent deviceObject={deviceObject} />
    }
    else if (deviceObject.type == 4) {
        return <WeatherCardContent deviceObject={deviceObject} />
    }
    else return (
        <View style={styles.containterBottom}>
            <Text style={styles.errorText}>Something went wrong :|</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containterBottom: {
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: '#333333',
        fontSize: 18,
        paddingVertical: 20,
    },
})