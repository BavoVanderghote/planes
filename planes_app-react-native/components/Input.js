import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

const Input = ({value, onChangeText}) => {
  return (
    <TextInput
      style={[styles.input, styles.inputText]}
      value={value}
      onChangeText={(v) => onChangeText(v)}
      maxLength={4}></TextInput>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: '#3f0',
    borderWidth: 2,
    borderRadius: 10,
    width: '80%',
    backgroundColor: '#001000',
    margin: '3%',
  },
  inputText: {
    color: '#3f0',
    fontSize: 20,
    fontFamily: 'roboto',
    textAlign: 'center',
  },
});

export default Input;
