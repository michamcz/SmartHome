import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Switch } from 'react-native-paper';
import parseDate from '../Tools/parseDate';
import { mergeItem } from '../DataHandle/handleConfigData';


export default function DayTile({ day, deviceObject }) {

  const [dayActive, setDayActive] = useState(false);
  const [dateOpen, setDateOpen] = useState(new Date("December 17, 1995 08:00:00"));
  const [dateClose, setDateClose] = useState(new Date("December 17, 1995 20:00:00"));
  const [showClose, setShowClose] = useState(false);
  const [showOpen, setShowOpen] = useState(false);

  useEffect(() => {
    if (deviceObject[day]) {
      if (deviceObject[day].dateOpen) {
        setDateOpen(new Date(deviceObject[day].dateOpen))
      }
      else setDateOpen(dateOpen)
    }
    if (deviceObject[day]) {
      if (deviceObject[day].dateClose) {
        setDateClose(new Date(deviceObject[day].dateClose))
      }
      else setDateClose(dateClose)
    }
    if (deviceObject[day]) {
      if (deviceObject[day].dateOpen) {
        setDayActive(deviceObject[day].active)
      }
      else setDayActive('false')
    }
  }, [])

  useEffect(() => {
    mergeItem(deviceObject.name, { [day]: { active: dayActive } })
  }, [dayActive])

  useEffect(() => {
    mergeItem(deviceObject.name, { [day]: { dateOpen: dateOpen } })
  }, [dateOpen])

  useEffect(() => {
    mergeItem(deviceObject.name, { [day]: { dateClose: dateClose } })
  }, [dateClose])

  const onChangeOpen = (event, selectedDate) => {
    const currentDate = selectedDate || dateOpen;
    setShowOpen(Platform.OS === 'ios');
    setDateOpen(currentDate);
  };
  const onChangeClose = (event, selectedDate) => {
    const currentDate = selectedDate || dateClose;
    setShowClose(Platform.OS === 'ios');
    setDateClose(currentDate);
  }

  const onDayChange = () => {
    setDayActive(!dayActive)
  }

  return (
    <View style={styles.containerBottom}>
      <View style={styles.daySwitchContainer}>
        <Text style={styles.dayText}> {`${day}`} </Text>
      </View>
      <View style={styles.daySwitchContainer}>
        <Switch value={dayActive} onValueChange={onDayChange} color={"#57CC99"} />
      </View>
      <TouchableOpacity
        style={styles.buttonTime}
        onPress={() => {
          setShowOpen('true')
        }}
      >
        <Text style={dayActive ? styles.hourTextActive : styles.hourTextDisactive}>
          {`${parseDate(dateOpen)[0]}`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonTime}
        onPress={() => {
          setShowClose('true')
        }}
      >
        <Text style={dayActive ? styles.hourTextActive : styles.hourTextDisactive}>
          {`${parseDate(dateClose)[0]}`}
        </Text>
      </TouchableOpacity>
      {showClose && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateClose}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={onChangeClose}
        />
      )}
      {showOpen && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateClose}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={onChangeOpen}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  containerBottom: {
    flex: 0.4,
    flexDirection: "row",
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'stretch',
  },
  daySwitchContainer: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  buttonTime: {
    flex: 0.3,
    backgroundColor: '#121212',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dayText: {
    fontSize: 20,
    color: '#CCCCCC',
  },
  hourTextDisactive: {
    color: '#777777',
    fontSize: 20,
  },
  hourTextActive: {
    color: '#CCCCCC',
    fontSize: 20,
  },
});
