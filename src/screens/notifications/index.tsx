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
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../config/colors.config';
import {Fonts} from '../../config/font.config';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const saveTokenToApi = async (deviceId, fcmToken) => {
    try {
      const response = await axios.post(
        'http://15.206.16.230:4000/api/v1/android/savingtokendata',
        {
          deviceId: deviceId,
          fcmToken: fcmToken,
        },
      );
      console.log('Response:', response.data);
      if (response.data.message) {
        Alert.alert('Success', response.data.message);
      }
    } catch (error) {
      console.error('Error saving token to API:', error);
      Alert.alert('Error', 'Failed to save token to API');
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        getFCMToken();
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    };

    const getFCMToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);

        const deviceId = await DeviceInfo.getUniqueId();
        console.log('Device ID:', deviceId);

        saveTokenToApi(deviceId, fcmToken);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    requestPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);

      const {notification: {title, body, android} = {}, data} = remoteMessage;

      // Extract and store only the required fields
      setNotifications(prev => {
        const updatedNotifications = [
          ...prev,
          {
            title: title || 'No Title',
            body: body || 'No Body',
            imageUrl: android?.imageUrl || null,
            articleId: data?.articleId || 'No Article ID',
            category: data?.category || 'No Category',
            updatedAt: data?.updatedAt || new Date().toISOString(), // Use current date if no `updatedAt`
          },
        ];


        return updatedNotifications.sort(
          (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        );
      });
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
        renderItem={({item}) => (
          <View style={styles.notificationContainer}>
            {item.imageUrl && (
              <Image
                source={{uri: item.imageUrl}}
                style={styles.notificationImage}
              />
            )}
            <View style={{marginLeft: 30,marginRight:60}}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationField}>{item.category}</Text>
            </View>

          </View>
        )}
        keyExtractor={(item, index) => `Notification-${index}`}
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
    marginLeft: 100,
    fontSize: 18,
    fontFamily: Fonts.medium,
    fontWeight: '700',
    color: '#000000',
  },
  notificationContainer: {
    marginTop: 10,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.black,
  },
  notificationField: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 5,
  },
  notificationImage: {
    width: 70,
    height: 50,
    resizeMode: 'cover',
    marginTop: 10,
    borderRadius: 10,
  },
});

export default Notifications;






// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const index = () => {
//   return (
//     <View>
//       <Text>index</Text>
//     </View>
//   )
// }

// export default index

// const styles = StyleSheet.create({})