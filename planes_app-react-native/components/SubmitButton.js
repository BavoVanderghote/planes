import React, {useState} from 'react';
import {Button, StyleSheet} from 'react-native';

const SubmitButton = ({title, onPress}) => {
  return (
    <Button
      onPress={onPress}
      title={title}
      accessibilityLabel="Submit button"
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
  },
});

export default SubmitButton;
