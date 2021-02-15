import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

const Input = ({value, onChangeText}) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={(v) => onChangeText(v)}
      maxLength={4}></TextInput>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
  },
});

export default Input;
