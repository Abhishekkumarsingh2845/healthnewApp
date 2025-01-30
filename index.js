/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
// import messaging from '@react-native-firebase/messaging';
if (__DEV__) {
  require('./ReactotronConfig');
}

if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
}
else {
  TextInput.defaultProps = {}
  TextInput.defaultProps.allowFontScaling = false;
}
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
}
else {
  Text.defaultProps = {}
  Text.defaultProps.allowFontScaling = false;
}


// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// })
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
