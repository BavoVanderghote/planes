import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';

import {
  Svg,
  Defs,
  Circle,
  Rect,
  Mask,
  RadialGradient,
  Stop,
  Polyline,
  Line,
} from 'react-native-svg';

const FlightInstrument = ({values, orientation}) => {
  // map function
  const map = function (value, in_min, in_max, out_min, out_max) {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };
  // destructure values
  const {pitch, roll} = orientation;
  return (
    <>
      <View
        style={[
          styles.bg,
          {transform: [{translateY: map(pitch, -90, 90, -150, 150)}]},
        ]}>
        <View
          style={[
            styles.base,
            {
              transform: [{rotateZ: `${map(roll, -45, 45, -45, 45)}deg`}],
            },
          ]}>
          <View style={styles.bottom} />
          <Svg style={styles.values}>
            {/* top */}
            <Line
              x1={Dimensions.get('window').width / 2 - 25}
              y1={Dimensions.get('window').height / 2 - 30}
              x2={Dimensions.get('window').width / 2 + 25}
              y2={Dimensions.get('window').height / 2 - 30}
              stroke="#3f0"
              strokeWidth="3"
            />
            <Line
              x1={Dimensions.get('window').width / 2 - 50}
              y1={Dimensions.get('window').height / 2 - 50}
              x2={Dimensions.get('window').width / 2 + 50}
              y2={Dimensions.get('window').height / 2 - 50}
              stroke="#3f0"
              strokeWidth="3"
            />
            <Line
              x1={Dimensions.get('window').width / 2 - 25}
              y1={Dimensions.get('window').height / 2 - 70}
              x2={Dimensions.get('window').width / 2 + 25}
              y2={Dimensions.get('window').height / 2 - 70}
              stroke="#3f0"
              strokeWidth="3"
            />
            <Line
              x1={Dimensions.get('window').width / 2 - 50}
              y1={Dimensions.get('window').height / 2 - 90}
              x2={Dimensions.get('window').width / 2 + 50}
              y2={Dimensions.get('window').height / 2 - 90}
              stroke="#3f0"
              strokeWidth="3"
            />
            {/* bottom */}
            <Line
              x1={Dimensions.get('window').width / 2 - 25}
              y1={Dimensions.get('window').height / 2 + 30}
              x2={Dimensions.get('window').width / 2 + 25}
              y2={Dimensions.get('window').height / 2 + 30}
              stroke="#3f0"
              strokeWidth="3"
            />
            <Line
              x1={Dimensions.get('window').width / 2 - 50}
              y1={Dimensions.get('window').height / 2 + 50}
              x2={Dimensions.get('window').width / 2 + 50}
              y2={Dimensions.get('window').height / 2 + 50}
              stroke="#3f0"
              strokeWidth="3"
            />
            <Line
              x1={Dimensions.get('window').width / 2 - 25}
              y1={Dimensions.get('window').height / 2 + 70}
              x2={Dimensions.get('window').width / 2 + 25}
              y2={Dimensions.get('window').height / 2 + 70}
              stroke="#3f0"
              strokeWidth="3"
            />
            <Line
              x1={Dimensions.get('window').width / 2 - 50}
              y1={Dimensions.get('window').height / 2 + 90}
              x2={Dimensions.get('window').width / 2 + 50}
              y2={Dimensions.get('window').height / 2 + 90}
              stroke="#3f0"
              strokeWidth="3"
            />
          </Svg>
        </View>
      </View>
      <Svg
        style={styles.mask}
        height={Dimensions.get('window').height}
        width={Dimensions.get('window').width}
        viewBox={`0 0 ${Dimensions.get('window').width} ${
          Dimensions.get('window').height
        }`}>
        <Defs>
          <Mask id="mask" x="0" y="0" height="100%" width="100%">
            <Rect height="100%" width="100%" fill="#fff" />
            <Circle
              r={Dimensions.get('window').width / 2 - 50}
              cx={Dimensions.get('window').width / 2}
              cy={Dimensions.get('window').height / 2}
              fill="#000"
            />
          </Mask>
          <RadialGradient
            id="grad"
            cx={Dimensions.get('window').width / 2}
            cy={Dimensions.get('window').height / 2}
            rx={Dimensions.get('window').width / 2 + 10}
            ry={Dimensions.get('window').width / 2 + 10}
            fx="150"
            fy="75"
            gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#3f0" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect
          height="100%"
          width="100%"
          fill="rgba(0, 0, 0, 1)"
          mask="url(#mask)"
          fill-opacity="0"
        />
        <Circle
          r={Dimensions.get('window').width / 2 + 10}
          cx={Dimensions.get('window').width / 2}
          cy={Dimensions.get('window').height / 2}
          strokeWidth="5"
          fill="url(#grad)"
          mask="url(#mask)"
        />
        <Circle
          r={Dimensions.get('window').width / 2 - 50}
          cx={Dimensions.get('window').width / 2}
          cy={Dimensions.get('window').height / 2}
          stroke="#33ff00"
          strokeWidth="3"
          fill="rgba(0, 0, 0, 0)"
        />
        <Circle
          r={Dimensions.get('window').width / 2 - 20}
          cx={Dimensions.get('window').width / 2}
          cy={Dimensions.get('window').height / 2}
          stroke="#33ff00"
          strokeWidth="3"
          fill="rgba(0, 0, 0, 0)"
        />
        <Polyline
          points={`${Dimensions.get('window').width / 2 - 80},${
            Dimensions.get('window').height / 2
          } ${Dimensions.get('window').width / 2 - 20},${
            Dimensions.get('window').height / 2
          } ${Dimensions.get('window').width / 2 - 20},${
            Dimensions.get('window').height / 2 + 20
          }`}
          fill="none"
          stroke="#3f0"
          strokeWidth="3"
        />
        <Polyline
          points={`${Dimensions.get('window').width / 2 + 80},${
            Dimensions.get('window').height / 2
          } ${Dimensions.get('window').width / 2 + 20},${
            Dimensions.get('window').height / 2
          } ${Dimensions.get('window').width / 2 + 20},${
            Dimensions.get('window').height / 2 + 20
          }`}
          fill="none"
          stroke="#3f0"
          strokeWidth="3"
        />
        <Line
          x1={Dimensions.get('window').width / 2}
          y1={Dimensions.get('window').height / 2 - 200}
          x2={Dimensions.get('window').width / 2}
          y2={Dimensions.get('window').height / 2 - 184}
          stroke="#3f0"
          strokeWidth="2"
        />
        <Line
          x1={Dimensions.get('window').width / 2}
          y1={Dimensions.get('window').height / 2 + 200}
          x2={Dimensions.get('window').width / 2}
          y2={Dimensions.get('window').height / 2 + 184}
          stroke="#3f0"
          strokeWidth="2"
        />
        <Line
          x1={Dimensions.get('window').width / 2 - 200}
          y1={Dimensions.get('window').height / 2}
          x2={Dimensions.get('window').width / 2 - 184}
          y2={Dimensions.get('window').height / 2}
          stroke="#3f0"
          strokeWidth="2"
        />
        <Line
          x1={Dimensions.get('window').width / 2 + 200}
          y1={Dimensions.get('window').height / 2}
          x2={Dimensions.get('window').width / 2 + 184}
          y2={Dimensions.get('window').height / 2}
          stroke="#3f0"
          strokeWidth="2"
        />
      </Svg>
    </>
  );
};

const styles = StyleSheet.create({
  mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  values: {
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  bg: {
    height: '100 %',
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  base: {
    width: '100%',
    height: '100%',
    // position: 'relative',
    backgroundColor: '#001000',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
  },
  bottom: {
    width: '100%',
    height: '50%',
    // backgroundColor: '#f00',
    borderTopColor: '#33ff00',
    borderTopWidth: 5,
  },
  joystick: {
    width: 80,
    height: 80,
    backgroundColor: '#505050',
    borderRadius: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    marginTop: -40,
  },
  line: {
    width: 80,
    height: 10,
    backgroundColor: '#33ff00',
  },
});

export default FlightInstrument;
