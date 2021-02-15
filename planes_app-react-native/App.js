/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import useSocket from './hooks/useSocket';

// import {
//   accelerometer,
//   setUpdateIntervalForType,
//   SensorTypes,
// } from 'react-native-sensors';

// import {Svg, Path, Defs, G, TextPath, Text} from 'react-native-svg';

import FlightInstrument from './components/FlightInstrument';
import NumberForm from './components/NumberForm';

// import {io} from 'socket.io-client';
import {socket} from './components/ws';

const App: () => React$Node = () => {
  const {socketId, values, orientation, controls, clientConnection} = useSocket(
    socket,
  );

  const handleTapScreen = (e) => {
    socket.emit('tap', true);
  };

  if (clientConnection) {
    return (
      <View
        style={styles.black}
        onStartShouldSetResponder={(e) => {
          return true;
        }}
        onResponderGrant={(e) => {
          handleTapScreen(e);
        }}>
        <FlightInstrument values={{...values}} orientation={orientation} />
        <Text style={styles.shoot}>
          {controls
            ? 'Tilt to fly and tap to shoot'
            : 'Enable accelerometer mode to fly'}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.black}>
        <NumberForm socketId={socketId} socket={socket}></NumberForm>
        <Text style={styles.shoot}>You are not connected</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  black: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  shoot: {
    zIndex: 100,
    position: 'absolute',
    color: '#3f0',
    fontSize: 20,
    fontFamily: 'roboto',
    padding: 10,
    textAlign: 'center',
    width: '100%',
    top: '85%',
  },
});

export default App;
