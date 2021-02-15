import React, {useState, useEffect} from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

const useSocket = (socket) => {
  const [socketId, setSocketId] = useState(null);
  const [values, setValues] = useState({x: 0, y: 0, z: 0, timestamp: 0});
  const [orientation, setOrientation] = useState({pitch: 0, roll: 0});
  const [controls, setControls] = useState(false);
  const [clientConnection, setClientConnection] = useState(false);

  setUpdateIntervalForType(SensorTypes.accelerometer, 100);

  useEffect(() => {
    // socket.io
    socket.on('connect', () => {
      console.log(socket.id);
      setSocketId(socket.id);
    });
    // TODO: get pitch data
    socket.on('orientation', (angles) => {
      setOrientation(angles);
    });

    socket.on('controlMode', (bool) => {
      setControls(bool);
    });

    socket.on('clientConnection', (bool) => {
      setClientConnection(bool);
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

  return {socketId, values, orientation, controls, clientConnection};
};

export default useSocket;
