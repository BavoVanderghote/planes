import React, {useState} from 'react';
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
    <>
      <Input value={value} onChangeText={onChangeInputText}></Input>
      <SubmitButton onPress={onPressButton} title="Connect"></SubmitButton>
    </>
  );
};

export default NumberForm;
