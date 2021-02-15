import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Input from './Input';
import SubmitButton from './SubmitButton';

const NumberForm = ({socketId, socket}) => {
  const [value, setValue] = useState('0000');

  const onChangeInputText = (val) => {
    // TODO: check for number w/ /regex/ ?
    setValue(val);
  };

  const onPressButton = () => {
    if (!socketId) {
      console.log('No socket connection');
    } else {
      socket.emit('connectToClient', value);
    }
  };

  return (
    <View style={styles.container}>
      <Input value={value} onChangeText={onChangeInputText}></Input>
      <SubmitButton onPress={onPressButton} title="Connect"></SubmitButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NumberForm;
