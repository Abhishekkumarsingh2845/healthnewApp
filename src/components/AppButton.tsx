import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {useMemo} from 'react';
import {Colors} from '../config/colors.config';
import {moderateScale, scale} from 'react-native-size-matters';
import {Fonts} from '../config/font.config';
import React from 'react';

export interface AppButtonPropsType {
  btnstyle?: ViewStyle;
  label: String;
  textStyle?: TextStyle;
  loading: boolean;
  onClick(data: any): void;
  loaderColor?: string;
  icon?: any;
  activeOpacity?: number;
}

const AppButton = (props: AppButtonPropsType) => {
  // const UserStrore = useSelector((state: RootState) => state.user.data);
  // const themeColor = getThemeColorByUserType(UserStrore.currentAccType);
  const {btnstyle, label, textStyle, loading} = useMemo(() => {
    return props;
  }, [props]);
  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity}
      style={[{backgroundColor: Colors.primary}, {...style.btn, ...btnstyle}]}
      onPress={data => !loading && props.onClick(data)}>
      {loading ? (
        <ActivityIndicator
          size={20}
          style={{marginHorizontal: 10}}
          animating={loading}
          color={props.loaderColor ? props.loaderColor : 'white'}
        />
      ) : (
        <>
          {props.icon}

          <Text style={[style.textStyle, textStyle]}>{label}</Text>
          {/* <Text style={[{ ...style.textStyle }, textStyle]} variant={'titleLarge'} children={label} /> */}
        </>
      )}
    </TouchableOpacity>
  );
};
const style = StyleSheet.create({
  btn: {
    minWidth: 100,
    minHeight: moderateScale(48),
    paddingVertical: 12,
    borderRadius: moderateScale(16),
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: moderateScale(16),
    fontFamily: Fonts.semibold,
  },
});
export default AppButton;
