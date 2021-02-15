import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const SubmitButton = ({title, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      accessibilityLabel="Submit button">
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: '#3f0',
    borderWidth: 2,
    borderRadius: 10,
    width: '50%',
    backgroundColor: '#001000',
    margin: '3%',
  },
  text: {
    color: '#3f0',
    fontSize: 20,
    fontFamily: 'roboto',
    textAlign: 'center',
    padding: 8,
  },
});

export default SubmitButton;
