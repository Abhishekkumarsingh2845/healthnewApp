// import React, {useEffect, useState} from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   Platform,
// } from 'react-native';
// import axios from 'axios';
// import {useNavigation} from '@react-navigation/native';
// import {Colors} from '../../config/colors.config';
// import {Fonts} from '../../config/font.config';
// import messaging from '@react-native-firebase/messaging';
// import DeviceInfo from 'react-native-device-info';

// const Notifications = () => {
//   const navigation = useNavigation();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const saveTokenToApi = async (deviceId, fcmToken) => {
//     try {
//       const response = await axios.post(
//         'http://15.206.16.230:4000/api/v1/android/savingtokendata',
//         {
//           deviceId: deviceId,
//           fcmToken: fcmToken,
//         },
//       );
//       console.log('sucess saving the FCMtoken and Device Id', response.data);
//       // if (response.data.message) {
//       //   Alert.alert('Success', response.data.message);
//       // }
//     } catch (error) {
//       console.error('Error saving token to API:', error);
//       Alert.alert('Error', 'Failed to save token to API');
//     }
//   };

//   const getFCMToken = async () => {
//     try {
//       // Register the device for remote messages
//       await messaging().registerDeviceForRemoteMessages();

//       // Now retrieve the FCM token
//       const fcmToken = await messaging().getToken();
//       console.log('FCM Token:', fcmToken);

//       const deviceId = await DeviceInfo.getUniqueId();
//       console.log('Device ID:', deviceId);

//       // Save the token to the API
//       saveTokenToApi(deviceId, fcmToken);
//     } catch (error) {
//       console.error('Error initializing FCM:', error);
//     }
//   };

//   useEffect(() => {
//     const requestPermission = async () => {
//       const authStatus = await messaging().requestPermission();

//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (enabled) {
//         console.log('Notification permission granted.');
//         getFCMToken();
//       } else {
//         console.log('Notification permission denied.');
//       }
//     };

//     const checkFCM = async () => {
//       if (Platform.OS === 'ios') {
//         const authStatus = await messaging().requestPermission();

//         if (
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL
//         ) {
//           console.log('iOS notification permission granted.');
//           const fcmToken = await messaging().getToken();
//           console.log('FCM Token for iOS:', fcmToken);

//           const deviceId = await DeviceInfo.getUniqueId();
//           saveTokenToApi(deviceId, fcmToken);
//         } else {
//           console.log('iOS notification permission denied.');
//         }
//       } else if (Platform.OS === 'android') {
//         requestPermission();
//       }
//     };

//     checkFCM();

//     // Foreground message listener
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground notification:', remoteMessage);

//       const {notification: {title, body, android} = {}, data} = remoteMessage;

//       setNotifications(prev => {
//         const updatedNotifications = [
//           ...prev,
//           {
//             title: title || 'No Title',
//             body: body || 'No Body',
//             imageUrl: android?.imageUrl || null,
//             articleId: data?.articleId || 'No Article ID',
//             category: data?.category || 'No Category',
//             updatedAt: data?.updatedAt || new Date().toISOString(),
//           },
//         ];

//         return updatedNotifications.sort(
//           (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
//         );
//       });
//     });

//     // Background and terminated state notification listener
//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log('Notification opened from background:', remoteMessage);
//       navigation.navigate('Detailedtrend', {
//         articleId: remoteMessage.data?.articleId || 'No Article ID',
//       });
//     });

//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log('App opened from terminated state:', remoteMessage);
//           navigation.navigate('Detailedtrend', {
//             articleId: remoteMessage.data?.articleId || 'No Article ID',
//           });
//         }
//       });

//     return unsubscribe;
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator color="red" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={{marginTop: 20}}></View>
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.backButtonContainer}>
//         <Image
//           source={require('./../../../assets/images/back.png')}
//           style={styles.backButtonImage}
//         />
//         <Text style={styles.backButtonText}>Notification</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={notifications}
//         renderItem={({item}) => (
//           <TouchableOpacity
//             style={styles.notificationContainer}
//             onPress={() =>
//               navigation.navigate('Detailedtrend', {
//                 articleId: '676534e92daa2ac9fece2512',
//               })
//             } // Pass the articleId
//           >
//             {item.imageUrl && (
//               <Image
//                 source={{uri: item.imageUrl}}
//                 style={styles.notificationImage}
//               />
//             )}
//             <View style={{marginLeft: 30, marginRight: 60}}>
//               <Text style={styles.notificationTitle}>{item.title}</Text>
//               <Text style={styles.notificationField}>{item.category}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item, index) => `Notification-${index}`}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   backButtonContainer: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   backButtonImage: {
//     width: 25,
//     height: 20,
//     resizeMode: 'contain',
//   },
//   backButtonText: {
//     textAlign: 'center',
//     marginLeft: 70,
//     fontSize: 18,
//     fontFamily: Fonts.medium,
//     fontWeight: '700',
//     color: '#000000',
//   },
//   notificationContainer: {
//     marginTop: 10,
//     borderColor: Colors.lightGray,
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   notificationTitle: {
//     fontWeight: 'bold',
//     paddingHorizontal: 5,
//     fontSize: 16,
//     color: Colors.black,
//   },
//   notificationField: {
//     fontSize: 12,
//     color: Colors.gray,
//     marginTop: 5,
//     paddingHorizontal: 5,
//   },
//   notificationImage: {
//     width: 70,
//     height: 50,
//     resizeMode: 'cover',
//     marginTop: 10,
//     borderRadius: 10,
//   },
// });

// export default Notifications;

// import React, {useEffect, useState} from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   Platform,
// } from 'react-native';
// import axios from 'axios';
// import {useNavigation} from '@react-navigation/native';
// import messaging from '@react-native-firebase/messaging';
// import DeviceInfo from 'react-native-device-info';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Notifications = () => {
//   const navigation = useNavigation();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const saveTokenToApi = async (deviceId, fcmToken) => {
//     try {
//       const response = await axios.post(
//         'http://15.206.16.230:4000/api/v1/android/savingtokendata',
//         {
//           deviceId: deviceId,
//           fcmToken: fcmToken,
//         },
//       );
//       console.log('Success saving the FCM token and Device ID:', response.data);
//     } catch (error) {
//       console.error('Error saving token to API:', error);
//       Alert.alert('Error', 'Failed to save token to API');
//     }
//   };

//   const getFCMToken = async () => {
//     try {
//       await messaging().registerDeviceForRemoteMessages();
//       const fcmToken = await messaging().getToken();
//       console.log('FCM Token:', fcmToken);

//       const deviceId = await DeviceInfo.getUniqueId();
//       console.log('Device ID:', deviceId);

//       saveTokenToApi(deviceId, fcmToken);
//     } catch (error) {
//       console.error('Error initializing FCM:', error);
//     }
//   };

//   const saveNotificationsToStorage = async newNotifications => {
//     try {
//       await AsyncStorage.setItem(
//         'notifications',
//         JSON.stringify(newNotifications),
//       );
//     } catch (error) {
//       console.error('Error saving notifications to storage:', error);
//     }
//   };

//   const loadNotificationsFromStorage = async () => {
//     try {
//       const storedNotifications = await AsyncStorage.getItem('notifications');
//       if (storedNotifications) {
//         setNotifications(JSON.parse(storedNotifications));
//       }
//     } catch (error) {
//       console.error('Error loading notifications from storage:', error);
//     }
//   };

//   useEffect(() => {
//     const requestPermission = async () => {
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (enabled) {
//         console.log('Notification permission granted.');
//         getFCMToken();
//       } else {
//         console.log('Notification permission denied.');
//       }
//     };

//     const checkFCM = async () => {
//       if (Platform.OS === 'ios') {
//         const authStatus = await messaging().requestPermission();

//         if (
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL
//         ) {
//           console.log('iOS notification permission granted.');
//           const fcmToken = await messaging().getToken();
//           console.log('FCM Token for iOS:', fcmToken);

//           const deviceId = await DeviceInfo.getUniqueId();
//           saveTokenToApi(deviceId, fcmToken);
//         } else {
//           console.log('iOS notification permission denied.');
//         }
//       } else if (Platform.OS === 'android') {
//         requestPermission();
//         const fcmToken = await messaging().getToken();
//         console.log('FCM Token for andriod:', fcmToken);
//         const deviceId = await DeviceInfo.getUniqueId();
//         saveTokenToApi(deviceId, fcmToken);
//       }
//     };

//     checkFCM();
//     loadNotificationsFromStorage();

//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground notification:', remoteMessage);
//       const {notification: {title, body, android} = {}, data} = remoteMessage;
//       setNotifications(prev => {
//         const updatedNotifications = [
//           ...prev,
//           {
//             title: title || 'No Title',
//             body: body || 'No Body',
//             imageUrl: android?.imageUrl || null,
//             articleId: data?.articleId || 'No Article ID',
//             category: data?.category || 'No Category',
//             updatedAt: data?.updatedAt || new Date().toISOString(),
//           },
//         ];
//         saveNotificationsToStorage(updatedNotifications);
//         return updatedNotifications.sort(
//           (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
//         );
//       });
//     });

//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log('Notification opened from background:', remoteMessage);
//       navigation.navigate('Detailedtrend', {
//         articleId: remoteMessage.data?.articleId || 'No Article ID',
//       });
//     });

//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log('App opened from terminated state:', remoteMessage);
//           navigation.navigate('Detailedtrend', {
//             articleId: remoteMessage.data?.articleId || 'No Article ID',
//           });
//         }
//       });

//     return unsubscribe;
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator color="red" />
//       </View>
//     );
//   }
// console.log("notifications--->",JSON.stringify(notifications));

//   return (
//     <View style={styles.container}>
//       <View style={{marginTop: 20}} />
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.backButtonContainer}>
//         <Image
//           source={require('./../../../assets/images/back.png')}
//           style={styles.backButtonImage}
//         />
//         <Text style={styles.backButtonText}>Notification</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={notifications}
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//         renderItem={({item}) => (
//           <TouchableOpacity
//             style={styles.notificationContainer}
//             // onPress={() =>
//             //   navigation.navigate('Detailedtrend', {
//             //     articleId: item.articleId,
//             //   })
//             // }
//           >
//             {item.imageUrl && (
//               <Image
//                 source={{uri: item.imageUrl}}
//                 style={styles.notificationImage}
//               />
//             )}
//             <View style={{marginLeft: 30, marginRight: 60}}>
//               <Text style={styles.notificationTitle}>{item.title}</Text>
//               <Text style={styles.notificationField}>{item.category}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item, index) =>item?.articleId?.toString()}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   backButtonContainer: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   backButtonImage: {
//     width: 25,
//     height: 20,
//     resizeMode: 'contain',
//   },
//   backButtonText: {
//     textAlign: 'center',
//     marginLeft: 70,
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#000000',
//   },
//   notificationContainer: {
//     marginTop: 10,
//     borderColor: '#e0e0e0',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   notificationTitle: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#000',
//   },
//   notificationField: {
//     fontSize: 12,
//     color: '#888',
//     marginTop: 5,
//   },
//   notificationImage: {
//     width: 100,
//     height: 100,
//     resizeMode: "contain",
//     borderRadius: 10,
//     backgroundColor:"red",
//   },
// });

// export default Notifications;

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const loadNotificationsFromStorage = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted.');
        getFCMToken();
      } else {
        console.log('Notification permission denied.');
      }
    };

    const checkFCM = async () => {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();

        if (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
          console.log('iOS notification permission granted.');
          const fcmToken = await messaging().getToken();
          console.log('FCM Token for iOS:', fcmToken);

          const deviceId = await DeviceInfo.getUniqueId();
          saveTokenToApi(deviceId, fcmToken);
        } else {
          console.log('iOS notification permission denied.');
        }
      } else {
        requestPermission();
      }
    };

    checkFCM();
    loadNotificationsFromStorage();

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

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened from background:', remoteMessage);
      navigation.navigate('Detailedtrend', {
        articleId: remoteMessage.data?.articleId || 'No Article ID',
      });
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from terminated state:', remoteMessage);
          navigation.navigate('Detailedtrend', {
            articleId: remoteMessage.data?.articleId || 'No Article ID',
          });
        }
      });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="red" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButtonContainer}>
        <Image
          source={require('./../../../assets/images/back.png')}
          style={styles.backButtonImage}
        />
        <Text style={styles.backButtonText}>Notification</Text>
      </TouchableOpacity>

      <FlatList
        data={notifications}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() =>
              navigation.navigate('Detailedtrend', {
                articleId: item.articleId,
              })
            }>
            {item.imageUrl ? (
              <Image
                source={{uri: item.imageUrl}}
                style={styles.notificationImage}
              />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationField}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `${item.articleId}-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  backButtonImage: {
    width: 25,
    height: 20,
    resizeMode: 'contain',
  },
  backButtonText: {
    textAlign: 'center',
    marginLeft: 70,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 20,
  },
  notificationContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  notificationField: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  notificationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
  },
});

export default Notifications;
