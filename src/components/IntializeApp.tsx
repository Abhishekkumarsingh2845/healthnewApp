import React from 'react';
import MainNavigation from '../navigations/MainNavigation';
import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Linking,
  Text,
} from 'react-native';
import SplashScreen from '../screens/splash';
import {Colors} from '../config/colors.config';
import appsFlyer from 'react-native-appsflyer';
import {Button} from 'react-native';
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
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        containerRef.current?.setNativeProps({style: {display: 'none'}});
      });
    }, 100);

    return () => {
      clearTimeout(id);
    };
  }, []);

  const [inviteLink, setInviteLink] = useState(null);

  useEffect(() => {
    appsFlyer.initSdk(
      {
        devKey: 'jM5UQCpNnhNqvHx6LV9S6h', // Replace with your AppsFlyer Dev Key
        isDebug: true,
        appId: '154785576', // Replace with your App ID
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
        timeToWaitForATTUserAuthorization: 10, // for iOS 14.5
      },
      result => {
        // console.log('AppsFlyer SDK initialized:', result);

        // Set the OneLink template ID
        appsFlyer.setAppInviteOneLinkID(
          'PUci', // Replace with your OneLink template ID
          result => {
            // console.log('OneLink template ID set successfully:', result);
          },
          error => {
            console.error('Error setting OneLink template ID:', error);
          },
        );
      },
      error => {
        console.error('Error initializing AppsFlyer SDK:', error);
      },
    );
  }, []);

  useEffect(() => {
    // Handle deep links
    const handleDeepLink = response => {
      const deepLinkValue = response?.deepLinkValue; // Get the `deepLinkValue`
      console.log('Deep link value:', deepLinkValue);
    };

    appsFlyer.onDeepLink(handleDeepLink);

    // Clean up listener
    return () => appsFlyer.onDeepLink(null);
  }, []);

  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{marginTop: 20}}></View>
        <StatusBar backgroundColor={'transparent'} />
        {/* <Button title="Generate Invite Link" onPress={generateInviteLink} /> */}
        {/* {inviteLink && (
          <>
            <Text>{inviteLink}</Text>
            <Button title="Share Invite Link" onPress={handleShareInviteLink} />
          </>
        )} */}
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
