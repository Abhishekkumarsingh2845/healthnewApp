import React, {useEffect} from 'react';
import IntailizeApp from './src/components/IntializeApp';
import {RealmProvider, useRealm} from '@realm/react';
// import { realmConfig } from './src/store';
import {realmConfig} from './src/store';
function App(): React.JSX.Element {
  return (
    <RealmProvider schema={realmConfig}  deleteRealmIfMigrationNeeded={true} >
      <IntailizeApp />
    </RealmProvider>
  );
}

export default App;











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
