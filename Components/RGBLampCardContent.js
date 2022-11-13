import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modal, NativeBaseProvider } from 'native-base';
import ColorPicker from 'react-native-wheel-color-picker'
import hexToRGB from '../Tools/hexToRGB';
import EffectsListTile from './EffectListTile';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient'
import { PatternArray } from '../assets/PatternArray'

export default function CurtainsCardContent({ deviceObject }) {

  const [brightnessValue, setBrightnessValue] = useState(((deviceObject.brightness * 100) / 255).toFixed(0) || 50);
  const [ledStatus, setLedStatus] = useState(null);
  const [currentColor, setCurrentColor] = useState(deviceObject.color || '#FF0000');
  const [currentSpeed, setCurrentSpeed] = useState(deviceObject.speed || 50);
  const [currentEffect, setCurrentEffect] = useState(deviceObject.effect || 1);
  const [currentPalette, setCurrentPalette] = useState(parseInt(deviceObject.palette) || 0);
  const [showColorModal, setShowColorModal] = useState(false)
  const [showEffectModal, setShowEffectModal] = useState(false)

  const EffectsList = [
    {
      id: '1',
      title: 'Gradient wave',
    },
    {
      id: '2',
      title: 'Solid color',
    },
    {
      id: '3',
      title: 'Rainbow',
    },
    {
      id: '4',
      title: 'Pulse',
    },
    {
      id: '5',
      title: 'Slider',
    },
    {
      id: '6',
      title: 'Sparkles',
    },
    {
      id: '7',
      title: 'Dot',
    },
    {
      id: '8',
      title: 'Waterfall',
    },
    {
      id: '9',
      title: 'Meteor',
    },
    {
      id: '10',
      title: 'Fire',
    },
  ];

  const handleEffectClick = (effectId) => {
    setCurrentEffect(effectId)
    applyEffect(parseInt(effectId))
  }

  useEffect(() => {
    setBrightnessValue(((deviceObject.brightness * 100) / 255).toFixed(0));
    if (parseInt(deviceObject.effect) == 0) {
      setLedStatus(false)
      setCurrentEffect(1)
    }
    else {
      setLedStatus(true)
      setCurrentEffect(deviceObject.effect)
    }
  }, [])

  const handleLedStatusChange = () => {
    if (ledStatus !== false) {
      applyEffect(0)
    }
    else {
      applyEffect(currentEffect);
    }
    setLedStatus(!ledStatus)
  }

  const applyBrightness = (value) => {
    axios.get(`http://${deviceObject.ip}/BRIGHTNESS?brightness=${(value / 100) * 255}`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('ApplyBrightnessError', error);
      })
  }

  const applySpeed = (value) => {
    axios.get(`http://${deviceObject.ip}/SPEED?speed=${(value)}`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('ApplySpeedError', error);
      })
  }

  const applyColor = (value) => {
    axios.get(`http://${deviceObject.ip}/COLOR?redColor=${hexToRGB(value)[0]}&greenColor=${hexToRGB(value)[1]}&blueColor=${hexToRGB(value)[2]}`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('ApplyColorError', error);
      })
  }

  const applyEffect = (value) => {
    axios.get(`http://${deviceObject.ip}/PATTERN?pattern=${value}`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('ApplyEffectError', error);
      })
  }

  const applyPalette = (value) => {
    axios.get(`http://${deviceObject.ip}/PALETTE?palette=${value}`)
      .then(function (response) {
        if (response.ok) return 1;
      })
      .catch(function (error) {
        console.error('ApplyPaletteError', error);
      })
  }

  return (
    <View style={styles.containerBottomWrap}>

      <NativeBaseProvider>
        <Modal isOpen={showColorModal} onClose={() => setShowColorModal(false)}>
          <Modal.Content maxWidth="500px" style={{ backgroundColor: '#1f1f1f' }}>
            <Modal.CloseButton />
            <Modal.Body>
              {
                (currentEffect != 1) ? (
                  <ColorPicker
                    color={currentColor}
                    thumbSize={30}
                    sliderSize={20}
                    gapSize={20}
                    noSnap={true}
                    row={false}
                    palette={['#ffffff', '#d11cd5', '#0000ff', '#00aeef', '#03fca5', '#00ff00', '#FFFF00', '#ff4400', '#ff0000']}
                    onColorChangeComplete={(color) => {
                      setCurrentColor(color);
                      applyColor(color);
                    }}
                  />
                ) : (
                  <View style={styles.gradientModalContent}>
                    {
                      PatternArray.map((el, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (currentEffect == 1) {
                                setCurrentPalette(el.id)
                                applyPalette(el.id)
                              }
                            }}
                            key={index}
                          >
                            <LinearGradient
                              colors={[el.color1, el.color2, el.color3]}
                              style={styles.gradientIndicator}
                              key={el.id}
                              start={{ x: 0.7, y: 0 }}>
                              {
                                (currentPalette == el.id ? (
                                  <MaterialCommunityIcons name="check" color='#EEEEEE' size={22} />
                                ) : (null))
                              }
                            </LinearGradient>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </View>
                )
              }
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#1f1f1f', borderWidth: 2, borderColor: '#1f1f1f' }}>
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => {
                  setShowColorModal(false)
                }}
              >
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <Modal isOpen={showEffectModal} onClose={() => setShowEffectModal(false)}>
          <Modal.Content maxWidth="500px" style={{ backgroundColor: '#1f1f1f' }}>
            <Modal.Body>
              {
                EffectsList.map(effect => <EffectsListTile key={effect.id} effectTitle={effect.title} effectId={effect.id} onClick={handleEffectClick} currentEffect={currentEffect} />)
              }
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#1f1f1f', borderWidth: 2, borderColor: '#1f1f1f' }}>
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => {
                  setShowEffectModal(false)
                }}
              >
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

      </NativeBaseProvider>
      <View style={styles.containerBottom1}>
        <View style={styles.SwitchTextContainer}>
          <Text style={!ledStatus ? styles.text : styles.textDisactive}> OFF </Text>
        </View>
        <View style={styles.SwitchContainer}>
          <Switch value={ledStatus} onValueChange={handleLedStatusChange} color={"#57CC99"} />
        </View>
        <View style={styles.SwitchTextContainer}>
          <Text style={ledStatus ? styles.text : styles.textDisactive}> ON </Text>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowEffectModal(true)}
          >
            <Text style={styles.text}>Effect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowColorModal(true)
            }}
          >
            <Text style={styles.text}>Color</Text>
            {
              (currentEffect != 1) ? (
                <View style={[styles.colorIndicator, { backgroundColor: currentColor }]}></View>
              ) : (
                <LinearGradient
                  colors={[PatternArray[currentPalette].color1, PatternArray[currentPalette].color2, PatternArray[currentPalette].color3]}
                  style={styles.colorIndicator}
                  start={{ x: 0.7, y: 0 }}>
                </LinearGradient>)
            }
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerBottom2}>
        <MaterialCommunityIcons name="brightness-6" color='#777777' size={20} />
        <View style={styles.sliderView}>
          <Slider
            style={{ height: 35 }}
            value={Number.parseFloat(((deviceObject.brightness * 100) / 255).toFixed(0))}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#57CC99"
            thumbTintColor='#57CC99'
            maximumTrackTintColor='#232931'
            step={5}
            onValueChange={(value) => setBrightnessValue(value)}
            onSlidingComplete={(value) => applyBrightness(value)}
          />
        </View>
        <Text style={styles.pctText}>
          {brightnessValue}%
        </Text>
      </View>
      <View style={styles.containerBottom2}>
        <MaterialCommunityIcons name="run-fast" color='#777777' size={20} />
        <View style={styles.sliderView}>
          <Slider
            style={{ height: 35 }}
            value={50}
            minimumValue={5}
            maximumValue={30}
            minimumTrackTintColor="#57CC99"
            thumbTintColor='#57CC99'
            maximumTrackTintColor='#232931'
            step={1}
            onValueChange={(value) => {
              setCurrentSpeed(100 - (((35 - value) - 5) * 4))
            }}
            onSlidingComplete={(value) => applySpeed(35 - value)}
          />
        </View>
        <Text style={styles.pctText}>
          {currentSpeed}%
        </Text>
      </View>
    </View >
  )
}
const styles = StyleSheet.create({
  containerBottom1: {
    flex: 0.4,
    flexDirection: "row", //'#232931
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 5,
    alignSelf: 'stretch',
  },
  containerBottom2: {
    flex: 0.3,
    flexDirection: "row",
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 3,
    alignSelf: 'stretch',
  },
  containerBottomWrap: {
    flex: 0.90,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  button: {
    flex: 0.5,
    color: "#CCCCCC",
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  buttonConfirm: {
    flex: 1,
    color: "#CCCCCC",
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  buttonView: {
    flex: 0.8,
    flexDirection: "row",
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    paddingVertical: 2,
  },
  sliderView: {
    flex: 0.7,
  },
  text: {
    fontSize: 18,
    color: "#CCCCCC",
  },
  textDisactive: {
    color: '#777777',
    fontSize: 18,
  },
  pctText: {
    fontSize: 18,
    flex: 0.15,
    color: "#777777",
  },
  SwitchTextContainer: {
    flex: 0.15,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  SwitchContainer: {
    flex: 0.15,
    paddingRight: 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorIndicator: {
    width: 18,
    height: 18,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginLeft: 5,
  },
  modal: {
    backgroundColor: '#000000',
    padding: 15,
    borderWidth: 0,
    borderColor: '#000000',
  },
  gradientModalContent: {
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 15,
    flex: 1,
    flexWrap: 'wrap',
  },
  gradientIndicator: {
    flex: 1,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    margin: 10,
  },
});
