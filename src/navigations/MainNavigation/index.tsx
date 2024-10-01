import { NavigationContainer, DefaultTheme, useNavigation, StackActions } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { RootStackParamList, Screen } from './models';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';


import SplashScreen from '../../screens/splash';
// import Onboarding from '../../screens/onboarding';
import React from 'react';
import About from '../../screens/about';
import TermsConditions from '../../screens/termsConditions';
import PrivacyPolicy from '../../screens/privacyPolicy';
import BottomNavigation from '../BottomNavigation';


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
    name: 'BottomNavigation',
    screen: BottomNavigation,
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
  
];



export default MainNavigation;


