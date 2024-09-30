import { NavigationContainer, DefaultTheme, useNavigation, StackActions } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { RootStackParamList, Screen } from './models';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';


import SplashScreen from '../../screens/splash';
// import Onboarding from '../../screens/onboarding';
import React from 'react';


const MainNavigation = () => {
  const Stack = createStackNavigator<RootStackParamList>();
  
  

  
  return (
    <>
      <NavigationContainer
        
        theme={{
          ...DefaultTheme, colors: {
            ...DefaultTheme.colors,
          }
        }} >

        <Stack.Navigator
          // initialRouteName={UserState.intialRoute}
        // initialRouteName={'VideoPlay'}
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}>
          {

            AppStack.map((item, index) => {
              return (
                <Stack.Screen
                  key={index}
                  name={item.name}
                  component={item.screen}
                  initialParams={item.initailParams}
                  options={item.options}
                />
              );
            })
          }
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const AppStack: Array<Screen> = [

  {
    name: 'Demo',
    screen: SplashScreen,
  },
  
];



export default MainNavigation;


