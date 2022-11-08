import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EffectsListTile({ effectTitle, effectId, currentEffect, onClick }) {
  return (
    <TouchableOpacity
      onPress={() => onClick(effectId)}
    >
      <View style={styles.tile}>
        <Text style={styles.nameText}>{effectTitle}</Text>
        <Text>
          {
            (currentEffect == effectId) ? (
              <View>
                <MaterialCommunityIcons name="check" color='#CCCCCC' size={22} />
              </View>
            ) : (<View></View>)
          }
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tile: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 22,
    color: '#CCCCCC'
  },
})