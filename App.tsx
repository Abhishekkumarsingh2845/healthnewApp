//original code
// import React, {useEffect} from 'react';
// import IntailizeApp from './src/components/IntializeApp';
// import {RealmProvider, useRealm} from '@realm/react';
// // import { realmConfig } from './src/store';
// import {realmConfig} from './src/store';
// import {SafeAreaView} from 'react-native';
// import { LogBox } from 'react-native';
// function App(): React.JSX.Element {
//   // LogBox.ignoreAllLogs();
//   return (
//     <RealmProvider schema={realmConfig} deleteRealmIfMigrationNeeded={true}>
//       <IntailizeApp />
//     </RealmProvider>
//   );
// }

// export default App;


import React, {useEffect, useState} from 'react';
import IntailizeApp from './src/components/IntializeApp';
import {RealmProvider, useRealm} from '@realm/react';
// import { realmConfig } from './src/store';
import {realmConfig} from './src/store';
import {Alert, PermissionsAndroid, Platform, SafeAreaView} from 'react-native';
import {LogBox} from 'react-native';
import axios from 'axios';

import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProvider } from './src/context/initialRoute';
function App(): React.JSX.Element {
  const [notifications, setNotifications] = useState([]);

  // Save token to your API
  const saveTokenToApi = async (deviceId, fcmToken) => {
    try {
      const response = await axios.post(
        'http://15.206.16.230:4000/api/v1/android/savingtokendata',
        {deviceId, fcmToken},
      );
      console.log('Success saving the FCM token and Device ID:', response.data);
    } catch (error) {
      console.error('Error saving token to API:', error);
      Alert.alert('Error', 'Failed to save token to API');
    }
  };

  // Retrieve and send the FCM token
  const getFCMToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      const deviceId = await DeviceInfo.getUniqueId();
      console.log('Device ID:', deviceId);
      saveTokenToApi(deviceId, fcmToken);
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  };

  // Request permission and initialize t
  // oken retrieval
  const initializeFCM = async () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Notification permission granted.');
      await getFCMToken();
    } else {
      console.log('Notification permission denied.');
    }
  };

  // Save notifications to storage (optional)
  const saveNotificationsToStorage = async newNotifications => {
    try {
      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(newNotifications),
      );
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  };

  useEffect(() => {
    // Initialize FCM token and permission
    initializeFCM();

    // Load any previously stored notifications if needed
    (async () => {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    })();

    // Global foreground notification listener
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      const {notification: {title, body} = {}, data} = remoteMessage;

      const imageUrl = data?.['fcm_options']?.['image'] || null;

      setNotifications(prev => {
        const updatedNotifications = [
          {
            title: title || 'No Title',
            body: body || 'No Body',
            imageUrl: imageUrl,
            articleId: data?.articleId || 'No Article ID',
            category: data?.category || 'No Category',
            updatedAt: data?.updatedAt || new Date().toISOString(),
          },
          ...prev,
        ];
        saveNotificationsToStorage(updatedNotifications);
        return updatedNotifications.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
      });
    });

    // Handle notifications when the app is opened from the background

    // messaging().onNotificationOpenedApp(remoteMessage =>
    //   console.log('Notification opened from background:', remoteMessage)
    // );

    // Handle notifications when the app is opened from a quit state
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if (remoteMessage) {
    //       console.log('App opened from terminated state app:', remoteMessage);
    //       // Handle navigation or other logic
    //     }
    //   });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  // LogBox.ignoreAllLogs();
  return (
    <RealmProvider schema={realmConfig} deleteRealmIfMigrationNeeded={true}>
      <RouteProvider>
        <IntailizeApp />
      </RouteProvider>
    </RealmProvider>
  );
}

export default App;




