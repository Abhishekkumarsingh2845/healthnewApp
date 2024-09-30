import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import GetLocation, { Location } from 'react-native-get-location';
import { Platform } from 'react-native';
import { useState } from 'react'
import { ServiceResponse } from './interfaces';
// import Geolocation from 'react-native-geolocation-service';
import { showToastMessage } from './toast';

// Function to get user location...

export const getUserLocation = async (): Promise<ServiceResponse> => {
  try {
    const isGranted = await requestUserPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    // console.log(isGranted?"true":'false', 'granted');
    if (isGranted) {
      const location = await GetLocation.getCurrentPosition();
      // console.log(location, 'location...')
      return {
        status: true,
        message: 'Permission granted successfully',
        response: location
      }
    } else {
      return {
        status: false,
        message: 'Permission granted failed',
      }
    }


  } catch (error) {
    // console.log(error,'err')
    return {
      status: false,
      message: 'Permission granted failed',
    }
  }
}
// Function to request permission

export const requestUserPermission = async (androidPermission: any, iosPermission?: any) => {
  try {
    if(!iosPermission && Platform.OS == 'ios'){
      return true;
    }
    const result = await request(
      Platform.OS === 'ios'
        ? iosPermission
        : androidPermission
    );
    // console.log(result, 'res...')
    return (result === RESULTS.GRANTED || result === RESULTS.LIMITED) ? true
      : false;

  } catch (error) {
    return false;
  }
}

// export const listenLiveLocation = (cb: (res: Geolocation.GeoPosition) => void) => {
//    console.log('listening  started...');
//   Geolocation.watchPosition((res) => {
//     // console.log(res, 'live user location...');
//     cb(res);
//   }, (error) => {
//     showToastMessage(`Location Error:  ${error.message}`, 'error');
//     //  console.log(error, 'error location...');
//     //  console.log(error);
//   },{enableHighAccuracy:true})
// }

