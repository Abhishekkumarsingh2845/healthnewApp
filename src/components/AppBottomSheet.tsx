import {
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {SlideInDown, SlideInUp} from 'react-native-reanimated';
import {Size} from '../config/size.config';
import {Colors} from '../config/colors.config';
import {ReactNode, memo} from 'react';
import {BlurView} from '@react-native-community/blur';
import {Style} from '../config/style.config';
import {moderateScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
export interface AppBottomSheetPropType {
  modalVisible: boolean;
  setModalVisible: (status: boolean) => void;
  modalContainerStyle?: ViewStyle;
  children?: ReactNode;
  modalHeaderComponent?: ReactNode;
}
const AppBottomSheet = ({
  modalVisible,
  setModalVisible,
  children,
  modalContainerStyle,
}: AppBottomSheetPropType) => {
  return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
 
        <BlurView blurAmount={1} style={style.centeredView}>
          <View style={style.box}>
            <Animated.View
              entering={SlideInDown.duration(600)}
              style={[style.bottomContainer, modalContainerStyle]}>
              {children}
            </Animated.View>
          </View>
        </BlurView>
        {
          //@ts-ignore
          <Toast swipeable={false} />
        }
      </Modal>
  );
};

const style = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',

  },
  box: {
    width: '100%',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-end',
    
  },
  bottomContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: moderateScale(35),
    paddingVertical: moderateScale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
export default AppBottomSheet;
