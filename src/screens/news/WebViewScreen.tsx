import React from 'react';
import {WebView} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';

interface WebViewScreenProps {
  route: RouteProp<RootStackParamList, 'WebViewScreen'>;
}

const WebViewScreen = ({route}: WebViewScreenProps) => {
  const {url} = route.params;
  return <WebView source={{uri:url}} />;
};

export default WebViewScreen;
