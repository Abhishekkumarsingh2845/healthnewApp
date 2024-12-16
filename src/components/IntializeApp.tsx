import MainNavigation from '../navigations/MainNavigation';
import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import SplashScreen from '../screens/splash';
import {Colors} from '../config/colors.config';

const IntailizeApp = () => {
  const [show, setShow] = useState<boolean>(true);
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const containerRef = useRef<View>(null);

  useEffect(() => {
    // console.log(show, 'wrapper');
    // setUpApp()

    const id = setTimeout(() => {
      setShow(true);
      return Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        containerRef.current?.setNativeProps({style: {display: 'none'}});
      });
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, []);
  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{marginTop: 20}}></View>
        <StatusBar backgroundColor={'transparent'} />
        <>
          <Animated.View
            ref={containerRef}
            style={[style.container, {opacity: animatedOpacity}]}>
            <SplashScreen />
          </Animated.View>
          {show && <MainNavigation />}
        </>
      </View>
    </>
  );
};
const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
  },
});
export default IntailizeApp;
