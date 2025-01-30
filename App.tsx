import React, {useEffect} from 'react';
import IntailizeApp from './src/components/IntializeApp';
import {RealmProvider, useRealm} from '@realm/react';
// import { realmConfig } from './src/store';
import {realmConfig} from './src/store';
import {SafeAreaView} from 'react-native';
import { LogBox } from 'react-native';
function App(): React.JSX.Element {
  // LogBox.ignoreAllLogs();
  return (
    <RealmProvider schema={realmConfig} deleteRealmIfMigrationNeeded={true}>
      <IntailizeApp />
    </RealmProvider>
  );
}

export default App;

// import React, {useEffect} from 'react';
// import {View, Text} from 'react-native';
// import appsFlyer from 'react-native-appsflyer';

// const App = () => {
//   useEffect(() => {
//     // Check if appsFlyer is available
//     if (appsFlyer) {
//       console.log('AppsFlyer is available');
//     } else {
//       console.error('AppsFlyer is not available');
//     }

//     // Initialize AppsFlyer SDK
//     if (appsFlyer) {
//       appsFlyer.initSdk(
//         {
//           devKey: 'jM5UQCpNnhNqvHx6LV9S6h',
//           isDebug: true,
//           onInstallConversionDataListener: true, // Optional
//           onDeepLinkListener: true, // Optional
//         },
//         (result) => {
//           console.log('AppsFlyer SDK initialized:', result);
//         },
//         (error) => {
//           console.error('AppsFlyer initialization error:', error);
//         },
//       );
//     }
//   }, []);

//   return (
//     <View>
//       <Text>Welcome to AppsFlyer Setup</Text>
//     </View>
//   );
// };

// export default App;

// import React, { useEffect } from 'react';
// import { Alert,Text,View } from 'react-native';
// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

// const App: React.FC = () => {
//   useEffect(() => {
//     // Request permission for notifications
//     const requestPermission = async () => {
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (enabled) {
//         console.log('Notification permission granted.');
//       } else {
//         console.log('Notification permission denied.');
//       }
//     };

//     requestPermission();

//     // Listen for notifications when the app is in the foreground
//     const unsubscribe = messaging().onMessage(
//       async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//         console.log('Foreground notification:', remoteMessage);
//         if (remoteMessage.notification) {
//           Alert.alert(
//             remoteMessage.notification.title ?? 'No Title',
//             remoteMessage.notification.body ?? 'No Body'
//           );
//         }
//       }
//     );

//     // Clean up the listener when the component unmounts
//     return unsubscribe;
//   }, []);

//   return (
//     <View style={{flex:1}}>
//       <Text>notiification</Text>
//     </View>
//   ); // Replace with your app's UI components
// };

// export default App;

// import React from 'react';
// import {View, Text, Button, StyleSheet} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {WebView} from 'react-native-webview';

// type RootStackParamList = {
//   Home: undefined;
//   WebViewScreen: {url: string};
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const HomeScreen = ({navigation}: any) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome to the Home Screen!</Text>
//       <Button
//         title="Go to WebView"
//         onPress={() =>
//           navigation.navigate('WebViewScreen', {
//             url: 'https://www.npmjs.com/package/react-native-webview',
//           })
//         }
//       />
//     </View>
//   );
// };

// const WebViewScreen = ({route}: any) => {
//   const {url} = route.params;
//   console.log("->>>>",url);
//   return <WebView source={{uri: 'https://www.npmjs.com/package/react-native-webview'}} style={{flex: 1}} />;
// };

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
// });

// export default App;
