import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const CustomText = ({children, style}) => {
  return <Text style={[styles.dark, style]}>{children}</Text>;
};

export default CustomText;

const styles = StyleSheet.create({
  dark: {
    color: 'black',
  },
});
