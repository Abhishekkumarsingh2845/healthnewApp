import { NavigationContainer, DefaultTheme, useNavigation, StackActions } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { RootStackParamList, Screen } from './models';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Demo from '../../screens/demo'
import SplashScreen from '../../screens/splash';
// import Onboarding from '../../screens/onboarding';
import React from 'react';
import Congratulations from '../../screens/congratulations';
import Onboarding from '../../screens/onboarding';
import Login from '../../screens/login';
import Verify from '../../screens/verify';
import LoginSuccess from '../../screens/loginSuccess';
import Welcome from '../../screens/welcome';
import ConnectThrough from '../../screens/connectThrough';
import ConnectToWhom from '../../screens/connectToWhom';
import PersonalDetails from '../../screens/personalDetails';
import FreeReading from '../../screens/freeReading';
import Chat from '../../screens/chat';
import GpOrCmnPujaList from '../../screens/gpOrCmnPujaList';
import GpOrCmnPujaBooking from '../../screens/gpOrCmnPujaBooking';
import Home from '../../screens/home';
import GpOrCmnPujaOrderSummary from '../../screens/gpOrCmnPujaOrderSummary';
import GpOrCmnPujaAddress from '../../screens/gpOrCmnPujaAddress';
import GpOrCmnPujaOrderHistory from '../../screens/gpOrCmnPujaOrderHistory';
import Wallet from '../../screens/wallet ';
import Astrologers from '../../screens/astrologers';
import AstrologerDetails from '../../screens/astrologerDetails';
import StartCardReading from '../../screens/startCardReading';
import aboutYourSelf from '../../screens/aboutYourself';
import AboutYourSelf from '../../screens/aboutYourself';
import CardPicking from '../../screens/cardPicking';
import LivePooja from '../../screens/livePooja';
import Feedbacks from '../../screens/feedbacks';
import Live from '../../screens/live';
import BottomNavigation from '../BottomNavigation';
import Astroshop from '../../screens/astroshop';
import Epooja from '../../screens/ePooja';
import EpoojaDetails from '../../screens/EpoojaDetails';
import BookWith from '../../screens/bookWith';
import Kundli from '../../screens/kundli';
import AddKundli from '../../screens/addKundli';
import ChatWithAstrologer from '../../screens/chatWithAstrloger';
import Remedy from '../../screens/remedy';
import BookWithTab from '../../screens/bookWithTab';
import Recommendations from '../../screens/recommendations';
import Horoscope from '../../screens/horoscope';
import SearchAstrologer from '../../screens/searchAstrologer';
import DrawerNavigation from '../DrawerNavigation';
import LiveAstrologers from '../../screens/liveAstrologers';
import SupportVideo from '../../screens/supportVideo';
import Blogs from '../../screens/blogs';
import BlogDetail from '../../screens/blogDetail';
import OrderHistory from '../../screens/orderHistory';
import Rewards from '../../screens/rewards';
import RewardScratch from '../../screens/rewardScratch';
import KundliReport from '../../screens/kundliReport';
import MatchMaking from '../../screens/matchMaking';
import NewMatchMaking from '../../screens/newMatchMaking';
import Profile from '../../screens/profile';
import HelpSupport from '../../screens/help&Support';
import NotificationSettings from '../../screens/notificationSettings';
import RemedyDetails from '../../screens/remedyDetails';
import MatchMakingReport from '../../screens/matchMakingReport';
import PrivacyPolicy from '../../screens/privacyPolicy';
import TermsConditions from '../../screens/term&condition';
import AboutUs from '../../screens/aboutUs';
import DeleteAccount from '../../screens/deleteAccount';
import PoojaForm from '../../screens/poojaForm';
import SelectSlot from '../../screens/selectSlot';
import Settings from '../../screens/settings';
import SelectPlace from '../../screens/selectplace';
import { RootState } from '../../store';
import { isReadyRef, navigationRef } from "react-navigation-helpers";
import branch from 'react-native-branch';
import CallRequest from '../../screens/callRequest';
import Products from '../../screens/products';
import ProductDetail from '../../screens/productDetail';
import OrderSummary from '../../screens/orderSummary';
import AddAddress from '../../screens/addAddress';
import Addresses from '../../screens/addresses';
import VideoPlay from '../../screens/videoPlay';
import VideoCall from '../../screens/videoCall';
import SupportChat from '../../screens/supportChat';
import RefundPolicy from '../../screens/refundPolicy';
import GroupPoojaDetails from '../../screens/groupPoojaDetails';

const MainNavigation = () => {
  const Stack = createStackNavigator<RootStackParamList>();
  const UserState = useSelector((state:RootState)=>state.userStatus);
  

  
  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        theme={{
          ...DefaultTheme, colors: {
            ...DefaultTheme.colors,
          }
        }} >

        <Stack.Navigator
          initialRouteName={UserState.intialRoute}
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
    name: 'Wallet',
    screen: Wallet,
  },
  {
    name: 'GpOrCmnPujaOrderHistory',
    screen: GpOrCmnPujaOrderHistory,
  },
  {
    name: 'GpOrCmnPujaAddress',
    screen: GpOrCmnPujaAddress,
  },
  {
    name: 'GpOrCmnPujaOrderSummary',
    screen: GpOrCmnPujaOrderSummary,
  },
  {
    name: 'GroupPoojaDetails',
    screen: GroupPoojaDetails,
  },
  {
    name: 'GpOrCmnPujaBooking',
    screen: GpOrCmnPujaBooking,
  },
  {
    name: 'GpOrCmnPujaList',
    screen: GpOrCmnPujaList,
  },
  {
    name: 'Congratulations',
    screen: Congratulations,
  },
  {
    name: 'CallRequest',
    screen: CallRequest,
  },
  {
    name: 'FreeReading',
    screen: FreeReading,
  },
  {
    name: 'PersonalDetails',
    screen: PersonalDetails,
  },
  {
    name: 'ConnectToWhom',
    screen: ConnectToWhom,
  },
  {
    name: 'ConnectThrough',
    screen: ConnectThrough,
  },
  {
    name: 'Welcome',
    screen: Welcome,
  },
  {
    name: 'LoginSuccess',
    screen: LoginSuccess,
  },
  {
    name: 'Verify',
    screen: Verify,
  },
  {
    name: 'Login',
    screen: Login,
  },
  {
    name: 'Onboarding',
    screen: Onboarding,
  },
  // {
  //   name: 'Home',
  //   screen: Home,
  // },
  {
    name: 'Astrologers',
    screen: Astrologers,
  },
  {
    name: 'AstrologerDetails',
    screen: AstrologerDetails,
    options:{
      gestureEnabled:true
    }
  },
  {
    name: 'StartCardReading',
    screen: StartCardReading,
  },
  {
    name: 'AboutYourSelf',
    screen: AboutYourSelf,
  },
  {
    name: 'CardPicking',
    screen: CardPicking,
  },
  {
    name: 'LivePooja',
    screen: LivePooja,
  },
  {
    name: 'Live',
    screen: Live,
  },
  {
    name: 'Chat',
    screen: Chat,
  },
  {
    name: 'BottomNavigation',
    screen: BottomNavigation,
  },
  {
    name: 'Feedbacks',
    screen: Feedbacks,
  },
  {
    name: 'Astroshop',
    screen: Astroshop,
  },
  {
    name: 'Epooja',
    screen: Epooja,
  },
  {
    name: 'EpoojaDetails',
    screen: EpoojaDetails,
  },
  {
    name: 'BookWith',
    screen: BookWith,
  },
  {
    name: 'Kundli',
    screen: Kundli,
  },
  {
    name: 'AddKundli',
    screen: AddKundli,
    initailParams:{
      for:'report'
    }
  },
  {
    name: 'ChatWithAstrologer',
    screen: ChatWithAstrologer,
    // initailParams:{
    //   title:'Chat With Astrologers'
    // }
  },
  {
    name: 'Remedy',
    screen: Remedy,
  },
  {
    name: 'BookWithTab',
    screen: BookWithTab,
  },
  {
    name: 'Recommendations',
    screen: Recommendations,
  },
  {
    name: 'Horoscope',
    screen: Horoscope,
  },
  {
    name: 'SearchAstrologer',
    screen: SearchAstrologer,
    options:{
      gestureEnabled:true
    }
  },
  {
    name: 'DrawerNavigation',
    screen: DrawerNavigation,
  },
  {
    name: 'LiveAstrologers',
    screen: LiveAstrologers,
  },
  {
    name: 'SupportVideo',
    screen: SupportVideo,
  },
  {
    name: 'Blogs',
    screen: Blogs,
  },
  {
    name: 'BlogDetail',
    screen: BlogDetail,
  },
  {
    name: 'OrderHistory',
    screen: OrderHistory,
  },
  {
    name: 'Rewards',
    screen: Rewards,
  },
  {
    name: 'RewardScratch',
    screen: RewardScratch,
  },
  {
    name: 'KundliReport',
    screen: KundliReport,
  },
  {
    name: 'MatchMaking',
    screen: MatchMaking,
  },
  {
    name: 'NewMatchMaking',
    screen: NewMatchMaking,
  },
  {
    name: 'Profile',
    screen: Profile,
  },
  {
    name: 'HelpSupport',
    screen: HelpSupport,
  },
  {
    name: 'NotificationSettings',
    screen: NotificationSettings,
  },
  {
    name: 'RemedyDetails',
    screen: RemedyDetails,
  },
  {
    name: 'MatchMakingReport',
    screen: MatchMakingReport,
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
    name: 'AboutUs',
    screen: AboutUs,
  },
  {
    name: 'DeleteAccount',
    screen: DeleteAccount,
  },
  {
    name: 'PoojaForm',
    screen: PoojaForm,
  },
  {
    name: 'SelectSlot',
    screen: SelectSlot,
  },
  {
    name: 'Settings',
    screen: Settings,
  },
  {
    name: 'SelectPlace',
    screen: SelectPlace,
  },
  {
    name: 'Products',
    screen: Products,
  },
  {
    name: 'ProductDetail',
    screen: ProductDetail,
  },
  {
    name: 'OrderSummary',
    screen: OrderSummary,
  },
  {
    name: 'AddAddress',
    screen: AddAddress,
  },
  {
    name: 'Addresses',
    screen: Addresses,
  },
  {
    name: 'VideoPlay',
    screen: VideoPlay,
    // initailParams:{
    //   url:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    // }
  },
  {
    name: 'VideoCall',
    screen: VideoCall,
  },
  {
    name: 'SupportChat',
    screen: SupportChat,
  },
  {
    name: 'RefundPolicy',
    screen: RefundPolicy,
  },
  // {
  //   name: 'Onboarding',
  //   screen: Onboarding,
  // },
  // {
  //   name: 'SplashScreen',
  //   screen: SplashScreen,
  // },
];



export default MainNavigation;


