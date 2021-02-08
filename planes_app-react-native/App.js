/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

// import {Svg, Path, Defs, G, TextPath, Text} from 'react-native-svg';

import FlightInstrument from './components/FlightInstrument';

// import {io} from 'socket.io-client';
import {socket} from './components/ws';

const App: () => React$Node = () => {
  const [values, setValues] = useState({x: 0, y: 0, z: 0, timestamp: 0});
  const [orientation, setOrientation] = useState({pitch: 0, roll: 0});
  const [controls, setControls] = useState(false);

  setUpdateIntervalForType(SensorTypes.accelerometer, 100);

  const handleTapScreen = (e) => {
    socket.emit('tap', true);
  };

  useEffect(() => {
    // socket.io
    socket.on('connect', () => {
      console.log(socket.id);
    });
    // TODO: get pitch data
    socket.on('orientation', (angles) => {
      setOrientation(angles);
    });

    socket.on('controlMode', (bool) => {
      setControls(bool);
    });

    const handleAccelerometerChange = (x, y, z, timestamp) => {
      setValues({x: x, y: y, z: z, timestamp: timestamp});
      socket.emit('accelerometerData', {x: x, y: y, z: z});
    };

    const subscription = accelerometer.subscribe(({x, y, z, timestamp}) =>
      handleAccelerometerChange(x, y, z, timestamp),
    );
    return function cleanup() {
      socket.disconnect();
      subscription.unsubscribe();
    };
  }, []);

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
};

const styles = StyleSheet.create({
  black: {
    backgroundColor: 'black',
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
