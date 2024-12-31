
import React, { useEffect } from 'react';
import { Alert,Text,View } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';



const Notification: React.FC = () => {
  useEffect(() => {
    // Request permission for notifications
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    };

    requestPermission();

    // Listen for notifications when the app is in the foreground
    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Foreground notification:', remoteMessage);
        if (remoteMessage.notification) {
          Alert.alert(
            remoteMessage.notification.title ?? 'No Title',
            remoteMessage.notification.body ?? 'No Body'
          );
        }
      }
    );

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []);

  return (
    <View style={{flex:1}}>
      <Text>notiification</Text>
    </View>
  ); // Replace with your app's UI components
};

export default Notification;




useEffect(() => {
  const fetchDeviceInfo = async () => {
    const model = DeviceInfo.getModel();
    const brand = DeviceInfo.getBrand();
    const systemVersion = DeviceInfo.getSystemVersion();
    const uniqueId = DeviceInfo.getUniqueId();

    setDeviceInfo({ model, brand, systemVersion, uniqueId });
  };

  fetchDeviceInfo();
}, []);