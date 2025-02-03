// import {
//   Image,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
//   ViewStyle,
// } from 'react-native';
// import AppImage from '../AppImage';
// import {Icons} from '../../generated/image.assets';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle, Style} from '../../config/style.config';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import EntypoIcons from 'react-native-vector-icons/Entypo';
// import {Size} from '../../config/size.config';
// import Article from '../../store/article/article.schema';
// import {ArticleType} from '../../store/article/article.interface';
// import moment from 'moment';
// import {memo, useCallback} from 'react';
// import {useToggleLikeArticle} from '../../store/article/article.hooks';
// import { BSON } from 'realm';

// interface CardPropType extends ArticleType {
//   containerStyle?: ViewStyle;
//   onClick?: () => void;
//   onLike?:()=>void
// }
// const Card = (props: CardPropType) => {
//   const ss = [{name:"Technology",url:"https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1733316938942-504121852.png"}]

//   const {toggleLike} = useToggleLikeArticle();
//   const onLike = useCallback(() => {
//     console.log("props===>>",props);

//     const id =  new BSON.ObjectId(props._id);
//     if(props.onLike){
//       props.onLike();
//       return
//     }
//     toggleLike( id);
//   }, [props._id]);
//   return (
//     <>
//       <Pressable
//         style={[style.box, props.containerStyle]}
//         onPress={props.onClick}>
//         <View style={style.container}>
//           <AppImage
//             source={{uri: props.urlToImage}}
//             style={style.image}
//             resizeMode={'stretch'}
//           />

//           <View style={style.overlay}>
//             <View style={[Style.flexRow, {justifyContent: 'space-between'}]}>
//               <View style={[Style.flexRow]}>

//                 <Image
//                   source={{url:"kjds"}}
//                   style={style.icon}
//                   resizeMode={'contain'}
//                 />
//                 <Text style={[FontStyle.titleSemibold, style.label]}>
//                   {props.category}
//                 </Text>
//               </View>

//               <View style={[Style.flexRow, {gap: moderateScale(7)}]}>
//                 <Pressable
//                   style={[style.iconContainer, style.otherIconsContainer]}>
//                   <Image
//                     source={Icons.ic_share}
//                     style={style.iconn}
//                     resizeMode={'contain'}
//                     tintColor={Colors.white}
//                   />
//                 </Pressable>
//                 <Pressable
//                   onPress={onLike}
//                   style={[style.iconContainer, style.otherIconsContainer]}>
//                   <Image
//                     source={
//                       props.isLiked ? Icons.ic_active_love : Icons.ic_love
//                     }
//                     style={style.iconn}
//                     resizeMode={'contain'}
//                     tintColor={Colors.white}
//                   />
//                 </Pressable>
//               </View>
//             </View>
//             <View>
//               <View style={[Style.flexRow, {gap: moderateScale(3)}]}>
//                 <Ionicons
//                   name={'time-outline'}
//                   size={moderateScale(20)}
//                   color={Colors.white}
//                 />
//                 <Text
//                   style={[
//                     FontStyle.regular,
//                     {color: Colors.white, fontSize: moderateScale(12)},
//                   ]}>
//                   {moment(props.updatedAt).fromNow()}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         <View
//           style={[
//             Style.flexRow,
//             {
//               padding: moderateScale(5),
//               alignItems: 'center',
//               gap: moderateScale(10),
//             },
//           ]}>
//           <Text
//             style={[
//               FontStyle.bold,
//               {
//                 color: Colors.black,
//                 justifyContent: 'space-between',
//                 fontSize: moderateScale(18),
//               },
//             ]}>
//             {props.title}
//           </Text>

//         </View>

//         <View>
//           <Text
//             numberOfLines={2}
//             style={[
//               FontStyle.titleSemibold,
//               {
//                 padding: moderateScale(3),
//                 lineHeight: moderateScale(20),
//                 color: '#1D1D1D',
//               },
//             ]}>
//             {props.description}
//           </Text>
//           <View style={Style.flexRow}>
//             <Text
//               style={[
//                 FontStyle.bold,
//                 {color: Colors.primary, fontSize: moderateScale(14)},
//               ]}>
//               Read more
//             </Text>
//             <EntypoIcons
//               name="chevron-small-right"
//               color={Colors.primary}
//               size={moderateScale(25)}
//             />
//           </View>
//         </View>
//       </Pressable>
//     </>
//   );
// };

// const style = StyleSheet.create({
//   box: {
//     width: Size.screenWidth * 0.85,
//     marginVertical: moderateScale(12),
//     backgroundColor: '#F5FFFD',
//     padding: moderateScale(12),
//     elevation: 3,
//     borderRadius: moderateScale(20),
//     marginHorizontal: moderateScale(6),
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   container: {
//     position: 'relative',
//     overflow: 'hidden',
//     borderRadius: moderateScale(15),
//   },
//   image: {
//     width: '100%',
//     height: moderateScale(170),
//   },
//   overlay: {
//     padding: moderateScale(12),
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#0000004D',
//     justifyContent: 'space-between',
//   },
//   icon: {
//     width: moderateScale(30),
//     height: moderateScale(30),
//   },
//   iconn: {
//     width: moderateScale(16),
//     height: moderateScale(16),
//   },
//   iconContainer: {
//     backgroundColor: Colors.black,
//     padding: moderateScale(6),
//     borderRadius: moderateScale(100),
//   },
//   label: {
//     paddingHorizontal: moderateScale(4),
//     color: Colors.white,
//     textTransform: 'capitalize',
//   },
//   otherIconsContainer: {
//     backgroundColor: '#0000006D',
//   },
// });

// export default memo(Card);

import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Linking,
  Text,
} from 'react-native';
import AppImage from '../AppImage';
import { Icons } from '../../generated/image.assets';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../../config/colors.config';
import { FontStyle, Style } from '../../config/style.config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { Size } from '../../config/size.config';
import { BSON } from 'realm';
import moment from 'moment';
import { useToggleLikeArticle } from '../../store/article/article.hooks';
import appsFlyer from 'react-native-appsflyer';
import { Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgUri } from 'react-native-svg';
// Define a function to get the category image URL

const getCategoryImageUrl = category => {
  if (category === 'Technology Health') {
    return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064797756-670133860.svg';
  } else if (category === 'Physical Health') {
    return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064965405-364083487.svg';
  } else if (category === 'Financial Health') {
    return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064860342-573612613.svg';
  } else if (category === 'Community Health') {
    return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064797756-670133860.svg';
  } else if (category === 'Occupational Health') {
    return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064937602-511736322.svg';
  } else if (category === 'Environmental Health') {
    return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064837345-385825304.svg';
  } else if (category === 'Medical Health') {
    return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064912322-473747556.svg';
  } else if (category === 'Wholesome Originals') {
    return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738142554199-252424239.svg';
  }
  return null;
};



const Card = props => {
  const navigation = useNavigation();
  const [inviteLink, setInviteLink] = useState(null);

  // console.log("props======>>>", props);


  // useEffect(() => {
  //   appsFlyer.initSdk(
  //     {
  //       devKey: 'jM5UQCpNnhNqvHx6LV9S6h', // Replace with your AppsFlyer Dev Key
  //       isDebug: true,
  //       appId: '6740557794', // Replace with your App ID
  //       onInstallConversionDataListener: true,
  //       onDeepLinkListener: true,
  //       timeToWaitForATTUserAuthorization: 10, // for iOS 14.5
  //     },
  //     result => {
  //       // console.log('AppsFlyer SDK initialized:', result);

  //       // Set the OneLink template ID
  //       appsFlyer.setAppInviteOneLinkID(
  //         'PUci', // Replace with your OneLink template ID
  //         result => {
  //           // console.log('OneLink template ID set successfully:', result);
  //         },
  //         error => {
  //           console.error('Error setting OneLink template ID:', error);
  //         },
  //       );
  //     },
  //     error => {
  //       console.error('Error initializing AppsFlyer SDK:', error);
  //     },
  //   );
  // }, []);

  // useEffect(() => {
  //   // Handle deep links
  //   const handleDeepLink = response => {
  //     const deepLinkValue = response?.deepLinkValue; // Get the `deepLinkValue`
  //     console.log('Deep link value:', deepLinkValue);
  //     if (deepLinkValue === 'Intro') {
  //       navigation.navigate('SplashScreen' as never); // Navigate to your MainNavigation screen
  //     }
  //   };

  //   appsFlyer.onDeepLink(handleDeepLink);

  //   // Clean up listener
  //   return () => appsFlyer.onDeepLink(null);
  // }, []);

  const generateInviteLink = () => {
    // Generate the invite link
    appsFlyer.generateInviteLink(
      {
        channel: 'wholesomebywh', // Specify the channel, e.g., email, social media
        campaign: 'wholesomebywh', // Specify your campaign name
        customerID: 'user123', // Optional: User ID for tracking
        userParams: {
          deep_link_value: 'Intro',
          af_force_deeplink: true,
        },
      },
      link => {
        console.log('Generated Invite Link:', link);
        setInviteLink(link); // Save the link to state
        Share.share({
          message: `Check out this app: ${link}`,
        })
          .then(res => {
            console.log('Share successful:', res);
          })
          .catch(err => {
            console.error('Error sharing link:', err);
          });
      },

      error => {
        console.error('Error generating invite link:', error);
      },
    );
  };

  const handleShareInviteLink = () => {
    if (inviteLink) {
      Linking.openURL(
        `mailto:?subject=Check out this app&body=${inviteLink}`,
      ).catch(err => console.error('Error opening email client:', err));
    } else {
      console.log('Invite link is not generated yet.');
    }
  };
  const { toggleLike } = useToggleLikeArticle();

  const onLike = useCallback(() => {
    console.log('likedkkkkkkkkkkkkk');
    const id = new BSON.ObjectId(props._id);
    if (props.onLike) {
      props.onLike();
      return;
    }
    toggleLike(id);

    console.log('li');
  }, [props._id]);

  const [state, setstate] = useState(false);
  const chg = () => {
    setstate(!state);
  };
  return (
    <Pressable
      style={[style.box, props.containerStyle]}
      onPress={props.onClick}>
      <View style={style.container}>
        <AppImage
          source={{ uri: props.urlToImage }}
          style={style.image}
          resizeMode={'stretch'}
        />
        <View style={style.overlay}>
          <View style={[Style.flexRow, { justifyContent: 'space-between' }]}>
            <View style={[Style.flexRow]}>
              <View style={style.icon}>

              <SvgUri
                uri={ getCategoryImageUrl(props.category)}
                onError={() => console.log('error svg')}
                width="100%"
                height="100%" />
                </View>
              {/* <Image
                source={{uri: getCategoryImageUrl(props.category)}} // Use the logic to set the category image
                style={style.icon}
                resizeMode={'contain'}
              /> */}
              <Text style={[FontStyle.titleSemibold, style.label]}>
                {props.category}
              </Text>
            </View>
            <View style={[Style.flexRow, { gap: moderateScale(7) }]}>
              <Pressable
                onPress={generateInviteLink}
                style={[style.iconContainer, style.otherIconsContainer]}>
                <Image
                  source={Icons.ic_share}
                  style={style.iconn}
                  resizeMode={'contain'}
                  tintColor={Colors.white}
                />
              </Pressable>
              <Pressable
                onPress={onLike}
                style={[style.iconContainer, style.otherIconsContainer]}>
                <Image
                  source={props.isLiked ? Icons.ic_active_love : Icons.ic_love}
                  style={style.iconn}
                  resizeMode={'contain'}
                  tintColor={props.isLiked ? Colors.primary : Colors.white}
                />
              </Pressable>
            </View>
          </View>
          <View>
            <View style={[Style.flexRow, { gap: moderateScale(3) }]}>
              <Ionicons
                name={'time-outline'}
                size={moderateScale(20)}
                color={Colors.white}
              />
              <Text
                style={[
                  FontStyle.regular,
                  { color: Colors.white, fontSize: moderateScale(12) },
                ]}>
                {moment(props.updatedAt).fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={[
          Style.flexRow,
          {
            padding: moderateScale(5),
            alignItems: 'center',
            gap: moderateScale(10),
          },
        ]}>
        <Text
          style={[
            FontStyle.bold,
            {
              color: Colors.black,
              justifyContent: 'space-between',
              fontSize: moderateScale(18),
            },
          ]}>
          {props.title}
        </Text>
      </View>

      <View>
        <Text
          numberOfLines={2}
          style={[
            FontStyle.titleSemibold,
            {
              padding: moderateScale(3),
              lineHeight: moderateScale(20),
              color: '#1D1D1D',
            },
          ]}>
          {props.description}
        </Text>
        <View style={Style.flexRow}>
          <Text
            style={[
              FontStyle.bold,
              { color: Colors.primary, fontSize: moderateScale(14) },
            ]}>
            Read more
          </Text>
          <EntypoIcons
            name="chevron-small-right"
            color={Colors.primary}
            size={moderateScale(25)}
          />
        </View>
      </View>
    </Pressable>
  );
};

const style = StyleSheet.create({
  box: {
    width: Size.screenWidth * 0.85,
    marginVertical: moderateScale(12),
    backgroundColor: '#F5FFFD',
    padding: moderateScale(12),
    elevation: 3,
    borderRadius: moderateScale(20),
    marginHorizontal: moderateScale(6),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: moderateScale(15),
  },
  image: {
    width: '100%',
    height: moderateScale(170),
  },
  overlay: {
    padding: moderateScale(12),
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0000004D',
    justifyContent: 'space-between',
  },
  icon: {
    width: moderateScale(30),
    height: moderateScale(30),
  },
  iconn: {
    width: moderateScale(18),
    height: moderateScale(18),
  },
  iconContainer: {
    backgroundColor: Colors.black,
    padding: moderateScale(6),
    borderRadius: moderateScale(100),
  },
  label: {
    paddingHorizontal: moderateScale(4),
    color: Colors.white,
    textTransform: 'capitalize',
  },
  otherIconsContainer: {
    backgroundColor: '#0000006D',
  },
});

export default memo(Card);
