// import {
//   FlatList,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,

// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Categories from '../../components/AppComponents/categories';
// import CategorySection from '../../components/CategorySections';
// import AppImage from '../../components/AppImage';
// import {Icons, Images} from '../../generated/image.assets';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle, Style} from '../../config/style.config';
// import Card from './components/card';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {Spacing} from '../../config/size.config';
// import {ToggleButton} from 'react-native-paper';
// import {memo, useCallback, useMemo, useState} from 'react';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';
// import {Switch} from 'react-native-switch';
// import Feather from 'react-native-vector-icons/Feather';
// const Profile = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const navigate = useCallback((route: string) => {
//     Nav.navigate(route as any);
//   }, []);
//   const [isEnabled, setIsEnabled] = useState(false);
//   const [toggle, setToggle] = useState(false);
//   const toggleSwitch = () => setIsEnabled(previousState => !previousState);

//   return (
//     <>
//       <AppSafeAreaView>
//         <View
//           style={[
//             {
//               paddingTop: Spacing.topSpace,
//             },
//             Style.flexMiddle,
//           ]}>
//           <Image
//             source={Images.appLogo}
//             style={{
//               width: moderateScale(160),
//               height: moderateScale(40),
//             }}
//             tintColor={Colors.primary}
//             resizeMode={'contain'}
//           />
//         </View>
//         <View style={{marginTop: moderateScale(20)}}>
//           <Card
//             containerStyle={{
//               justifyContent: 'space-between',
//             }}
//             onClick={() => {
//               setToggle(!toggle);
//             }}
//             title="Push Notifications"
//             icons={Icons.ic_notification}
//             right={<SwitchBtn toggle={toggle} setToggle={setToggle} />}
//           />
//           <Card
//             title="About us"
//             icons={Icons.ic_about}
//             onClick={() => {
//               navigate('About');
//             }}
//           />
//           <Card
//             title="Privacy Policy"
//             icons={Icons.ic_privacy}
//             onClick={() => {
//               navigate('PrivacyPolicy');
//             }}
//           />
//           <Card
//             title="Term & Conditions"
//             icons={Icons.ic_tnc}
//             onClick={() => {
//               navigate('TermsConditions');
//             }}
//           />
//         </View>

//         <View style={{padding: moderateScale(55)}} />
//       </AppSafeAreaView>
//     </>
//   );
// };

// const InnerCircle = memo(({toggle}: {toggle: boolean}) => {
//   return (
//     <View
//       style={[
//         {
//           flex: 1,
//           backgroundColor: Colors.white,
//           width: '100%',
//           height: '100%',
//           borderRadius: moderateScale(100),
//         },
//         Style.flexMiddle,
//       ]}>
//       <Feather
//         name={'check'}
//         color={toggle ? Colors.primary : 'transparent'}
//         size={moderateScale(14)}
//       />
//     </View>
//   );
// });

// const SwitchBtn = memo(
//   ({toggle, setToggle}: {toggle: boolean; setToggle: (val: any) => void}) => {
//     return (
//       <View style={{marginHorizontal: moderateScale(4)}}>
//         <Switch
//           value={toggle}
//           renderInsideCircle={() => <InnerCircle toggle={toggle} />}
//           onValueChange={val => {}}
//           activeText={'On'}
//           inActiveText={'Off'}
//           circleSize={moderateScale(25)}
//           backgroundActive={Colors.primary}
//           backgroundInactive={'#BCBCBC'}
//           circleActiveColor={'#FFFFFF'}
//           circleInActiveColor={'#FFFFFF'}
//           circleBorderWidth={3}
//           circleBorderActiveColor={Colors.primary}
//           circleBorderInactiveColor={'#BCBCBC'}
//           changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
//           renderActiveText={false}
//           renderInActiveText={false}
//         />
//       </View>
//     );
//   },
// );

// const style = StyleSheet.create({
//   title: {
//     color: Colors.black,
//   },
//   header: {
//     paddingHorizontal: moderateScale(0),
//   },
//   moreStyle: {
//     color: Colors.primary,
//     ...FontStyle.titleSemibold,
//   },
// });

// export default Profile;

import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Categories from '../../components/AppComponents/categories';
import CategorySection from '../../components/CategorySections';
import AppImage from '../../components/AppImage';
import {Icons, Images} from '../../generated/image.assets';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {FontStyle, Style} from '../../config/style.config';
import Card from './components/card';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Spacing} from '../../config/size.config';
import {memo, useCallback, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';
import {Switch} from 'react-native-switch';
import Feather from 'react-native-vector-icons/Feather';
import {Fonts} from '../../config/font.config';

const Profile = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const navigate = useCallback((route: string) => {
    Nav.navigate(route as any);
  }, []);
  const [isEnabled, setIsEnabled] = useState(false);
  const [toggle, setToggle] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <>
      <AppSafeAreaView>
        <View
          style={[
            {
              // paddingTop: Spacing.topSpace,
              marginTop:10,
            },
            Style.flexMiddle,
          ]}>
          <Image
            source={Images.appLogo}
            style={{
              width: moderateScale(160),
              height: moderateScale(40),
            }}
            tintColor={Colors.primary}
            resizeMode={'contain'}
          />
        </View>
        <View style={{marginTop: moderateScale(20)}}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 5,
              marginBottom: 10,
            }}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <Image
                source={require('../../../assets/images/bell.png')}
                style={{width: 35, height: 35}}
              />
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: Fonts.medium,
                  fontWeight: 600,
                  color: '#000000',
                  marginLeft: 5,
                }}>
                Push Notifications
              </Text>
            </View>
            <View>
              <SwitchBtn toggle={toggle} setToggle={setToggle} />
            </View>
          </View>
          <Card
            title="About us"
            icons={Icons.ic_about}
            onClick={() => {
              navigate('About');
            }}
          />
          <Card
            title="Privacy Policy"
            icons={Icons.ic_privacy}
            onClick={() => {
              navigate('PrivacyPolicy');
            }}
          />
          <Card
            title="Term & Conditions"
            icons={Icons.ic_tnc}
            onClick={() => {
              navigate('TermsConditions');
            }}
          />
        </View>

       
      </AppSafeAreaView>
    </>
  );
};

const InnerCircle = memo(({toggle}: {toggle: boolean}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: Colors.white,
          width: '100%',
          height: '100%',
          borderRadius: moderateScale(100),
        },
        Style.flexMiddle,
      ]}>
      <Feather
        name={'check'}
        color={toggle ? Colors.primary : 'transparent'}
        size={moderateScale(14)}
      />
    </View>
  );
});

const SwitchBtn = memo(
  ({toggle, setToggle}: {toggle: boolean; setToggle: (val: any) => void}) => {
    return (
      <View style={{marginHorizontal: moderateScale(4)}}>
        <Switch
          value={toggle}
          renderInsideCircle={() => <InnerCircle toggle={toggle} />}
          onValueChange={() => setToggle(!toggle)} // Toggle state here
          activeText={'On'}
          inActiveText={'Off'}
          circleSize={moderateScale(25)}
          backgroundActive={Colors.primary}
          backgroundInactive={'#BCBCBC'}
          circleActiveColor={'#FFFFFF'}
          circleInActiveColor={'#FFFFFF'}
          circleBorderWidth={3}
          circleBorderActiveColor={Colors.primary}
          circleBorderInactiveColor={'#BCBCBC'}
          changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
          renderActiveText={false}
          renderInActiveText={false}
        />
      </View>
    );
  },
);

const style = StyleSheet.create({
  title: {
    color: Colors.black,
  },
  header: {
    paddingHorizontal: moderateScale(0),
  },
  moreStyle: {
    color: Colors.primary,
    ...FontStyle.titleSemibold,
  },
});

export default Profile;
