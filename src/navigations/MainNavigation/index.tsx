import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {RootStackParamList, Screen} from './models';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import SplashScreen from '../../screens/splash';
// import Onboarding from '../../screens/onboarding';
import React from 'react';
import About from '../../screens/about';
import TermsConditions from '../../screens/termsConditions';
import PrivacyPolicy from '../../screens/privacyPolicy';
import BottomNavigation from '../BottomNavigation';
import Search from '../../screens/search';
import News from '../../screens/news';
import Notifications from '../../screens/notifications';
import Profile from '../../screens/profile';
import NewsDetail from '../../screens/newDetail';
import {useRealm} from '@realm/react';

import WebView from 'react-native-webview';
import WebViewScreen from '../../screens/news/WebViewScreen';
import ViewAll from '../../screens/trending/ViewAll';
import Detailedtrend from '../../screens/trending/Detailedtrend';
import Favviewall from '../../screens/favscn/Favviewall';

const MainNavigation = () => {
  const Stack = createStackNavigator<RootStackParamList>();
  const realm = useRealm();

  useEffect(() => {
    return () => {
      realm.close();
    };
  }, []);

  return (
    <>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
          },
        }}>
        <Stack.Navigator
          // initialRouteName={UserState.intialRoute}
          initialRouteName={'BottomNavigation'}
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}>
          {AppStack.map((item, index) => {
            return (
              <Stack.Screen
                key={index}
                name={item.name}
                component={item.screen}
                initialParams={item.initailParams}
                options={item.options}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const AppStack: Array<Screen> = [
  {
    name: 'NewsDetail',
    screen: NewsDetail,
  },
  {
    name: 'BottomNavigation',
    screen: BottomNavigation,
  },
  {
    name: 'Notifications',
    screen: Notifications,
  },
  {
    name: 'News',
    screen: News,
    initailParams: {
      title: 'Latest News',
    },
  },
  {
    name: 'Search',
    screen: Search,
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
  {
    name: 'WebViewScreen',
    screen: WebViewScreen,
  },

  {
    name: 'ViewAll',
    screen: ViewAll,
  },
  {
    name: 'Detailedtrend',
    screen: Detailedtrend,
  },
  {
    name: 'Favviewall',
    screen: Favviewall,
  },
];

export default MainNavigation;
