import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import axios from 'axios';
import {Colors} from '../../config/colors.config';
import {FontStyle} from '../../config/style.config';
import Header from '../newDetail/components/header';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]); // Store the notification data
  const [loading, setloading] = useState(true);
  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await axios.post(
        'http://15.206.16.230:4000/api/v1/admin/sendnotification',
      );
      if (response.data.success) {
        setNotifications(response.data.data); // Set the fetched notifications in state
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications when the component mounts
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={'red'} />
      </View>
    );
  }

  return (
    <View style={{marginTop: 50, paddingHorizontal: 20}}>
     
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Navigate back on press
        style={{alignItems:"center",flexDirection:"row"}}
      >
         <Image
          source={require('./../../../assets/images/back.png')} // Replace with your image URL or local image path
          style={{width:25,height:20,resizeMode:"contain"}}
        />
        <Text style={{textAlign: 'center',marginLeft:100}}>Notification</Text>
       
      </TouchableOpacity>

      <FlatList
        data={notifications}
        renderItem={({item}) => (
          <View style={styles.notificationContainer}>
            {/* Image on the left */}
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('./../../../assets/images/ic_privacy.png')} // Replace with your image URL or local image path
                style={styles.notificationImage}
              />
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationBody}>{item.body}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => `Notification-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    padding: 10,
    marginTop: 10,
    // backgroundColor: 'white',

    borderColor: Colors.lightGray, // Add border color for visibility
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.black,
  },
  notificationBody: {
    marginTop: 5,
    color: Colors.gray, // Set a gray color for the body text
  },
  notificationImage: {
    width: 40, // Adjust width as needed
    height: 40, // Adjust height as needed
    borderRadius: 20, // Make the image circular if it's a square
    marginRight: 10, // Space between image and text
  },
  backButton: {
    marginBottom: 20, // Space between back button and the content
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary, // Adjust the button color
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Notifications;
