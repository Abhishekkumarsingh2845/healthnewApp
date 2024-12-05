import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';

const BackButton = (prop: {
  color: string;
  size: number;
  onPress?: () => void;
  style?: TextStyle;
}) => {
  const Nav = useNavigation();
  function pushNewScreen(): void {
    // console.log(typeof prop.onPress);
    prop.onPress != undefined ? prop.onPress() : Nav.goBack();
  }
  return (
    <TouchableRipple style={[styles.btn, prop.style]} onPress={pushNewScreen}>
      <Icons name={'arrow-back-ios'} color={prop.color} size={prop.size} />
    </TouchableRipple>
  );
};
const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
    padding: 4,
  },
});
export default BackButton;
