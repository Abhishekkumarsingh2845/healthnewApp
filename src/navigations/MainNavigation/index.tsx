import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {RootStackParamList, Screen} from './models';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import SplashScreen from '../../screens/splash';
// import Onboarding from '../../screens/onboarding';
import React from 'react';
import About from '../../screens/about';
import TermsConditions from '../../screens/termsConditions';
import PrivacyPolicy from '../../screens/privacyPolicy';
import BottomNavigation from '../BottomNavigation';
import Search from '../../screens/search';
import News from '../../screens/news';
import Notifications from '../../screens/notifications';
import Profile from '../../screens/profile';
import NewsDetail from '../../screens/newDetail';
import {useRealm} from '@realm/react';

import WebView from 'react-native-webview';
import WebViewScreen from '../../screens/news/WebViewScreen';
import ViewAll from '../../screens/trending/ViewAll';
import Detailedtrend from '../../screens/trending/Detailedtrend';
import Favviewall from '../../screens/favscn/Favviewall';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {PermissionsAndroid} from 'react-native';
import {useRoute} from '../../context/initialRoute';

let param = '';
const MainNavigation = () => {
  const Stack = createStackNavigator<RootStackParamList>();
  const realm = useRealm();

  useEffect(() => {
    return () => {
      realm.close();
    };
  }, []);

  const [notifications, setNotifications] = useState([]);
  const {setInitialRoute} = useRoute();

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
      // Alert.alert('Error', 'Failed to save token to API');
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
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification opened from background->>>>>>>>>>>>>>>>>>>>>>',
        remoteMessage,
      );
      const articleId = remoteMessage?.data?.articleId || '';
      console.log('data from async ------->', articleId);

      setInitialRoute(articleId);
      // setInitRoute(remoteMessage)
      // Here you might want to navigate using a global navigation ref or other logic
    });
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });
    // Handle notifications when the app is opened from a quit stat

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from terminated state:', remoteMessage);
          const articleId = remoteMessage?.data?.articleId || '';
          console.log('data from async ------->', articleId);

          setInitialRoute(articleId);
        }
      });
  }, []);

  return (
    <>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
          },
        }}>
        <Stack.Navigator
          initialRouteName={'BottomNavigation'}
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}>
          {AppStack.map((item, index) => (
            <Stack.Screen
              key={index}
              name={item.name}
              component={item.screen}
              initialParams={item?.initialParams}
              options={item.options}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const AppStack: Array<Screen> = [
  {
    name: 'NewsDetail',
    screen: NewsDetail,
  },
  {
    name: 'BottomNavigation',
    screen: BottomNavigation,
  },
  {
    name: 'Notifications',
    screen: Notifications,
  },
  {
    name: 'News',
    screen: News,
    initailParams: {
      title: 'Latest News',
    },
  },
  {
    name: 'Search',
    screen: Search,
  },

  {
    name: 'PrivacyPolicy',
    screen: PrivacyPolicy,
  },
  {
    name: 'TermsConditions',
    screen: TermsConditions,
  },
  {
    name: 'About',
    screen: About,
  },
  {
    name: 'WebViewScreen',
    screen: WebViewScreen,
  },

  {
    name: 'ViewAll',
    screen: ViewAll,
  },
  {
    name: 'Detailedtrend',
    screen: Detailedtrend,
    initailParams: {
      articleId: param,
    },
  },
  {
    name: 'Favviewall',
    screen: Favviewall,
  },
];

export default MainNavigation;
