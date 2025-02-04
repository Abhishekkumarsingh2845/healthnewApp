import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import BackButton from '../../../components/BackButton';
import AppImage from '../../../components/AppImage';
import {Icons, Images} from '../../../generated/image.assets';
import {Style} from '../../../config/style.config';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../../config/colors.config';
import {Spacing} from '../../../config/size.config';
import {ArticleType} from '../../../store/article/article.interface';
import {
  useGetArticlesById,
  useToggleLikeArticle,
} from '../../../store/article/article.hooks';
import {BSON} from 'realm';
import {useQuery, useRealm} from '@realm/react';
import Article from '../../../store/article/article.schema';
import {useToggleTrendingLike} from '../../../store/trending/trendinghook';
import TrendingArticle from '../../../store/trending/trending.schema';
import {TrendingTypeArticle} from '../../../store/trending/trending.interface';
import appsFlyer from 'react-native-appsflyer';
import {Share} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
const Header = (props: ArticleType) => {
  const navigation = useNavigation();
  const [inviteLink, setInviteLink] = useState(null);
  const objId = new BSON.ObjectId(props._id);
  const realm = useRealm();
  console.log('HEADER>>>');
  const details = realm.objectForPrimaryKey(
    Article.schema.name,
    objId,
  ) as ArticleType;
  // console.log('yyyyyyy', details);
  // const details = useGetArticlesById(new BSON.ObjectId(props._id)) as ArticleType;
  const {toggleLike} = useToggleLikeArticle();
  const dd = realm.objectForPrimaryKey(
    TrendingArticle.schema.name,
    objId,
  ) as TrendingTypeArticle;
  useEffect(() => {
    appsFlyer.initSdk(
      {
        devKey: 'jM5UQCpNnhNqvHx6LV9S6h', // Replace with your AppsFlyer Dev Key
        isDebug: true,
        appId: '6740557794', // Replace with your App ID
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
        timeToWaitForATTUserAuthorization: 10, // for iOS 14.5
      },
      result => {
        // console.log('AppsFlyer SDK initialized:', result);

        // Set the OneLink template ID
        appsFlyer.setAppInviteOneLinkID(
          'PUci', // Replace with your OneLink template ID
          result => {
            // console.log('OneLink template ID set successfully:', result);
          },
          error => {
            console.error('Error setting OneLink template ID:', error);
          },
        );
      },
      error => {
        console.error('Error initializing AppsFlyer SDK:', error);
      },
    );
  }, []);

  useEffect(() => {
    // Handle deep links
    const handleDeepLink = response => {
      const deepLinkValue = response?.deepLinkValue; // Get the `deepLinkValue`
      console.log('Deep link value:', deepLinkValue);
      if (deepLinkValue === 'Intro') {
        navigation.navigate('SplashScreen' as never); // Navigate to your MainNavigation screen
      }
    };

    appsFlyer.onDeepLink(handleDeepLink);

    // Clean up listener
    return () => appsFlyer.onDeepLink(null);
  }, []);

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
  return (
    <SafeAreaView
      style={[
        Style.flexRow,
        {
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          // paddingTop: Spacing.topSpace,
        },
      ]}>
      <View
        style={[
          Style.flexRow,
          {alignItems: 'center', justifyContent: 'flex-start'},
        ]}>
        <BackButton
          color={Colors.black}
          size={moderateScale(20)}
          style={{position: 'relative'}}
        />
        <Image
          source={Images.appLogo}
          resizeMode={'contain'}
          tintColor={Colors.primary}
          style={{width: moderateScale(105), height: moderateScale(40)}}
        />
      </View>
      <View
        style={[
          Style.flexRow,
          {
            alignItems: 'center',
            gap: moderateScale(10),
            paddingTop: moderateScale(6),
          },
        ]}>
        <Pressable
          onPress={() => {
            toggleLike(props._id);
          }}>
          <Image
            resizeMode={'contain'}
            source={details.isLiked ? Icons.ic_active_love : Icons.ic_heart}
            style={style.icon}
            tintColor={details.isLiked ? Colors.primary : Colors.black}
          />
        </Pressable>
        <Pressable
          onPress={generateInviteLink}
          style={[style.iconContainer, style.otherIconsContainer]}>
          <Image
            resizeMode={'contain'}
            source={Icons.ic_move}
            style={style.icon}
            tintColor={Colors.black}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  icon: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
});
export default Header;

