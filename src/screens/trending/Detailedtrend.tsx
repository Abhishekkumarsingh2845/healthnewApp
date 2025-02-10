
// notfication


import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  Modal,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {FontStyle, Style} from '../../config/style.config';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {NavigationProp} from '@react-navigation/native';
import {Fonts} from '../../config/font.config';
import {useQuery, useRealm} from '@realm/react';
import Card from '../../components/AppComponents/Card';
import CategorySection from '../../components/CategorySections';
import LottieView from 'lottie-react-native';
import {Icons, Images, Lottie} from '../../generated/image.assets';
import Banner from '../newDetail/components/banner';
import Article from '../../store/article/article.schema';
import TrendingArticle from '../../store/trending/trending.schema';
import appsFlyer from 'react-native-appsflyer';
import {Share} from 'react-native';
import Header from '../newDetail/components/header';
import BackButton from '../../components/BackButton';
import {useToggleTrendingLike} from '../../store/trending/trendinghook';
import moment from 'moment';
import {SvgUri} from 'react-native-svg';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BSON} from 'realm';
import Favorite from '../../store/favorite/favorite.schema';
type RootStackParamList = {
  NewsDetail: {articleId: string};
};

type NewsDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewsDetail'
>;
type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetail'>;

const Detailedtrend: React.FC<{route: NewsDetailScreenRouteProp}> = ({
  route,
}) => {
  const {articleId} = route.params;
  console.log('ARTICLE ---> ', articleId);

  const realm = useRealm();

  const [article, setArticle] = useState<any>(null);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [trendingArticles, settrendingArticles] = useState([]);

  const trendingArticles1 = useQuery('TrendingArticle'); // Correct way to access query cache
  // const [singleArticle,setsingleArticle]= useState([]);
  const navigation = useNavigation();
  const [inviteLink, setInviteLink] = useState(null);

  const fetchTrendingArticles = async () => {
    // const {deleteTrendingArticles} = useDeleteTrendingArticles();
    try {
      // deleteTrendingArticles();
      const response = await axios.get(
        'http://15.206.16.230:4000/api/v1/android/trendingarticle',
      );
      // deleteTrendingArticles();
      const aa = response.data;
      // console.log('Api data of the trending response', aa);

      if (response.data.status && response.data.data.length > 0) {
        const currentArticles = realm.objects(TrendingArticle.schema.name);

        const fetchedArticleIds = response.data.data.map(
          (article: any) => article._id,
        );

        realm.write(() => {
          // deleteTrendingArticles();
          response.data.data.forEach((article: any) => {
            const articleId = new BSON.ObjectId(article._id);
            let data = {
              ...article,
              _id: articleId,
              category: article.category || 'defaultCategory', //his i have chnaged
            };

            const fav = realm
              .objects(Favorite.schema.name)
              .filtered(`articleId == $0`, articleId);
            data['isLiked'] = fav.length > 0;

            // Create or modify the trending article in the Realm database
            realm.create(
              TrendingArticle.schema.name,
              data,
              Realm.UpdateMode.Modified,
            );
          });

          currentArticles.forEach((currentArticle: any) => {
            if (!fetchedArticleIds.includes(currentArticle._id.toString())) {
              realm.delete(currentArticle); // Delete the article from Realm DB
            }
          });
        });
      } else {
        console.log('no artilces');
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error);
    }
  };

  useEffect(() => {
    settrendingArticles(trendingArticles1);
    // console.log(trendingArticles1, 'trending...')
  }, [trendingArticles1]);
  useEffect(() => {
    const fetchData = async () => {
      await fetchTrendingArticles();
      console.log('herer');
      // const trendingArticles1 = useQuery('TrendingArticle'); // Correct way to access query cache
      // console.log("trendingArticles1::",trendingArticles1)
      // settrendingArticles(trendingArticles1);
    };

    fetchData();
    // setsingleArticle(singleArticleOne);
  }, []);

  const singleArticle = trendingArticles.find(
    article => article._id == articleId,
  );
  const lllg = singleArticle?.isLiked;

  const mm = singleArticle?._id;

  // console.log('trendingschema', trendingArticles);
  const articlevar = trendingArticles.map(item => item.article_id);
  // console.log('articlesid', articlevar);
  // const params = props.route.params;

  const articles = useQuery(Article);
  const details = articles.find(
    article => article._id.toString() === articleId,
  );

  const {toggleLike} = useToggleTrendingLike();

  useEffect(() => {
    appsFlyer.initSdk(
      {
        devKey: 'jM5UQCpNnhNqvHx6LV9S6h',
        isDebug: true,
        appId: '6740557794',
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
        timeToWaitForATTUserAuthorization: 10,
      },
      result => {
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
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  // const ff=singleArticle.map(item=>item.isLiked);
  // console.log("lgg",ff);

  const fetchArticleDetails = async () => {
    try {
      const response = await axios.get(
        `http://15.206.16.230:4000/api/v1/android/article/${articleId}`,
      );
      if (response.data.status) {
        setArticle(response.data.data);
        // console.log(
        //   'response of the treding detailed articles',
        //   response.data.data,
        // );
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleDetails();
  }, [articleId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
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

  return (
    <ScrollView
      style={{flex: 1, paddingHorizontal: 20}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <SafeAreaView />
      {/* <Header icon={undefined} title={'Trending/Popular New'} /> */}
      {/* <Header {...details} /> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={[
            Style.flexRow,
            {alignItems: 'center', justifyContent: 'flex-start'},
          ]}>
          <BackButton
            color={Colors.black}
            size={moderateScale(20)}
            onPress={() => navigation.navigate('BottomNavigation')}
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
            // Style.flexRow,
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: moderateScale(10),
              paddingTop: moderateScale(6),
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              toggleLike(singleArticle?._id);
            }}>
            <Image
              resizeMode={'contain'}
              source={
                singleArticle?.isLiked ? Icons.ic_active_love : Icons.ic_heart
              }
              // style={style.icon}
              style={{width: 25, height: 25}}
              tintColor={singleArticle?.isLiked ? Colors.primary : Colors.black}
            />
          </TouchableOpacity>
          <Pressable onPress={generateInviteLink}>
            <Image
              resizeMode={'contain'}
              source={Icons.ic_move}
              // style={style.icon}

              style={{width: 30, height: 30}}
              tintColor={Colors.black}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.container}>
        {/* <Banner {...details} /> */}
        <ImageBackground
          source={{uri: article.urlToImage}}
          style={{width: '100%', height: 170, marginVertical: 10}}
          imageStyle={{borderRadius: 10}}
          resizeMode="stretch">
          <Text
            style={{
              position: 'absolute',
              bottom: 10,
              color: 'white',
              left: 25,
            }}>
            {moment(article.updatedAt).fromNow()}
          </Text>
        </ImageBackground>
        {/* {moment(props.updatedAt).fromNow()} */}

        {article ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              {/* <Image
                source={{uri: getCategoryImageUrl(article.category)}}
                style={{width: 35, height: 35}}
              /> */}
              <SvgUri
                uri={getCategoryImageUrl(article.category)}
                onError={() => console.log('error svg')}
                width="35"
                height="35"
              />
              <Text
                style={{
                  fontSize: 15,
                  color: '#000000',
                  // marginVertical: moderateScale(10),
                  fontFamily: Fonts.bold,
                  fontWeight: 400,
                  marginLeft: 10,

                  lineHeight: 16,
                }}>
                {article.category}
              </Text>
            </View>

            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.description}>{article.content}</Text>

            {article.url ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Article URL:', article.url);
                    setWebViewVisible(true);
                  }}>
                  <Text
                    style={{
                      fontWeight: '400',
                      fontFamily: Fonts.light,
                      lineHeight: moderateScale(23),
                      fontSize: moderateScale(15),
                      textAlign: 'right',
                      color: Colors.primary,
                    }}>
                    Show Original
                  </Text>
                </TouchableOpacity>

                <Modal visible={webViewVisible} animationType="slide">
                  <StatusBar
                    barStyle={'light-content'}
                    backgroundColor={'white'}
                  />
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      onPress={() => {
                        setWebViewVisible(false);
                      }}
                      style={styles.closeButton}>
                      <Text style={styles.closeButtonText}>Back</Text>
                    </TouchableOpacity>
                    {article && <WebView source={{uri: article.url}} />}
                  </View>
                </Modal>
              </>
            ) : null}
          </>
        ) : (
          <Text style={styles.error}>Article not found</Text>
        )}
      </View>
      <CategorySection
        prefixAtTitle={
          <LottieView
            source={Lottie.latest}
            autoPlay
            loop
            style={{width: moderateScale(30), height: moderateScale(30)}}
          />
        }
        title={'Related News'}
        titleStyle={Style.title}
        headerContainerStyle={Style.header}
        // left={'View All'}
        moreStyle={Style.moreStyle}
      />

      <ScrollView
        style={styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {trendingArticles
          .filter(item => {
            // Exclude the current article by comparing IDs
            const currentId =
              typeof item._id?.toHexString === 'function'
                ? item._id.toHexString()
                : item._id || item.id;
            return currentId !== articleId;
          })
          .map((item, index) => (
            <Card
              key={index}
              {...item}
              onClick={() => {
                const id = item._id.toHexString();
                Nav.navigate('Detailedtrend', {
                  articleId: id,
                } as NewsDetailsPropType);
              }}
            />
          ))}
      </ScrollView>
      <View style={{marginVertical: 20}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: moderateScale(24),
    height: moderateScale(24),
  },

  container: {
    // paddingHorizontal: moderateScale(16),
  },
  image: {
    width: '100%',
    height: moderateScale(200),
    borderRadius: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    // marginTop: 20,
    color: '#000000',
    fontFamily: Fonts.medium,
    lineHeight: 28,
  },
  publishedAt: {
    fontSize: moderateScale(14),
    color: Colors.grey,
  },
  description: {
    fontSize: moderateScale(15),
    marginTop: 20,
    color: '#1D1D1D',
    lineHeight: 23,
    fontFamily: Fonts.medium,
  },
  url: {
    fontSize: moderateScale(14),
    color: Colors.primary,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  error: {
    fontSize: moderateScale(16),
    color: Colors.error,
    textAlign: 'center',
    marginTop: moderateScale(20),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  header: {
    paddingHorizontal: moderateScale(0),
  },
  moreStyle: {
    color: Colors.primary,
    ...FontStyle.titleSemibold,
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 30,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'black',
    alignSelf: 'flex-start',
  },
});

export default Detailedtrend;











// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Linking,
//   SafeAreaView,
//   TouchableOpacity,
//   Pressable,
//   ImageBackground,
// } from 'react-native';
// import axios from 'axios';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle, Style} from '../../config/style.config';
// import {useNavigation, RouteProp} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {NavigationProp} from '@react-navigation/native';
// import {Fonts} from '../../config/font.config';
// import {useQuery} from '@realm/react';
// import Card from '../../components/AppComponents/Card';
// import CategorySection from '../../components/CategorySections';
// import LottieView from 'lottie-react-native';
// import {Icons, Images, Lottie} from '../../generated/image.assets';
// import Banner from '../newDetail/components/banner';
// import Article from '../../store/article/article.schema';
// import TrendingArticle from '../../store/trending/trending.schema';
// import appsFlyer from 'react-native-appsflyer';
// import {Share} from 'react-native';
// import Header from '../newDetail/components/header';
// import BackButton from '../../components/BackButton';
// import {useToggleTrendingLike} from '../../store/trending/trendinghook';
// import moment from 'moment';
// import {SvgUri} from 'react-native-svg';
// type RootStackParamList = {
//   NewsDetail: {articleId: string};
// };

// type NewsDetailScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'NewsDetail'
// >;
// type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetail'>;

// const Detailedtrend: React.FC<{route: NewsDetailScreenRouteProp}> = ({
//   route,
// }) => {
//   const {articleId} = route.params;
//   console.log('dd', articleId);
//   const [article, setArticle] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const navigation = useNavigation();
//   const [inviteLink, setInviteLink] = useState(null);
//   const trendingArticles = useQuery('TrendingArticle'); // Fetch trending art
//   // console.log('trendingschema', trendingArticles);
//   const articlevar = trendingArticles.map(item => item.article_id);
//   // console.log('articlesid', articlevar);
//   // const params = props.route.params;
//   const articles = useQuery(Article);
//   const details = articles.find(
//     article => article._id.toString() === articleId,
//   );

//   const {toggleLike} = useToggleTrendingLike();
//   const articleIdToFind = articleId;
//   const singleArticle = trendingArticles.find(
//     article => article._id == articleIdToFind,
//   );

//   const lllg = singleArticle.isLiked;

//   const mm = singleArticle._id;
//   useEffect(() => {
//     appsFlyer.initSdk(
//       {
//         devKey: 'jM5UQCpNnhNqvHx6LV9S6h',
//         isDebug: true,
//         appId: '6740557794',
//         onInstallConversionDataListener: true,
//         onDeepLinkListener: true,
//         timeToWaitForATTUserAuthorization: 10,
//       },
//       result => {
//         appsFlyer.setAppInviteOneLinkID(
//           'PUci', // Replace with your OneLink template ID
//           result => {
//             // console.log('OneLink template ID set successfully:', result);
//           },
//           error => {
//             console.error('Error setting OneLink template ID:', error);
//           },
//         );
//       },
//       error => {
//         console.error('Error initializing AppsFlyer SDK:', error);
//       },
//     );
//   }, []);

//   useEffect(() => {
//     // Handle deep links
//     const handleDeepLink = response => {
//       const deepLinkValue = response?.deepLinkValue; // Get the `deepLinkValue`
//       console.log('Deep link value:', deepLinkValue);
//       if (deepLinkValue === 'Intro') {
//         navigation.navigate('SplashScreen' as never); // Navigate to your MainNavigation screen
//       }
//     };

//     appsFlyer.onDeepLink(handleDeepLink);

//     // Clean up listener
//     return () => appsFlyer.onDeepLink(null);
//   }, []);

//   const generateInviteLink = () => {
//     // Generate the invite link
//     appsFlyer.generateInviteLink(
//       {
//         channel: 'wholesomebywh', // Specify the channel, e.g., email, social media
//         campaign: 'wholesomebywh', // Specify your campaign name
//         customerID: 'user123', // Optional: User ID for tracking
//         userParams: {
//           deep_link_value: 'Intro',
//           af_force_deeplink: true,
//         },
//       },
//       link => {
//         console.log('Generated Invite Link:', link);
//         setInviteLink(link); // Save the link to state
//         Share.share({
//           message: `Check out this app: ${link}`,
//         })
//           .then(res => {
//             console.log('Share successful:', res);
//           })
//           .catch(err => {
//             console.error('Error sharing link:', err);
//           });
//       },

//       error => {
//         console.error('Error generating invite link:', error);
//       },
//     );
//   };

//   const handleShareInviteLink = () => {
//     if (inviteLink) {
//       Linking.openURL(
//         `mailto:?subject=Check out this app&body=${inviteLink}`,
//       ).catch(err => console.error('Error opening email client:', err));
//     } else {
//       console.log('Invite link is not generated yet.');
//     }
//   };
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   // const ff=singleArticle.map(item=>item.isLiked);
//   // console.log("lgg",ff);

//   const fetchArticleDetails = async () => {
//     try {
//       const response = await axios.get(
//         `http://15.206.16.230:4000/api/v1/android/article/${articleId}`,
//       );
//       if (response.data.status) {
//         setArticle(response.data.data);
//         // console.log(
//         //   'response of the treding detailed articles',
//         //   response.data.data,
//         // );
//       }
//     } catch (error) {
//       console.error('Error fetching article:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchArticleDetails();
//   }, [articleId]);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }
//   const getCategoryImageUrl = category => {
//     if (category === 'Technology Health') {
//       return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064797756-670133860.svg';
//     } else if (category === 'Physical Health') {
//       return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064965405-364083487.svg';
//     } else if (category === 'Financial Health') {
//       return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064860342-573612613.svg';
//     } else if (category === 'Community Health') {
//       return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064797756-670133860.svg';
//     } else if (category === 'Occupational Health') {
//       return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064937602-511736322.svg';
//     } else if (category === 'Environmental Health') {
//       return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064837345-385825304.svg';
//     } else if (category === 'Medical Health') {
//       return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064912322-473747556.svg';
//     } else if (category === 'Wholesome Originals') {
//       return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738142554199-252424239.svg';
//     }
//     return null;
//   };

//   return (
//     <ScrollView
//       style={{flex: 1, paddingHorizontal: 20}}
//       showsHorizontalScrollIndicator={false}
//       showsVerticalScrollIndicator={false}>
//       <SafeAreaView />
//       {/* <Header icon={undefined} title={'Trending/Popular New'} /> */}
//       {/* <Header {...details} /> */}
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//         }}>
//         <View
//           style={[
//             Style.flexRow,
//             {alignItems: 'center', justifyContent: 'flex-start'},
//           ]}>
//           <BackButton
//             color={Colors.black}
//             size={moderateScale(20)}
//             style={{position: 'relative'}}
//           />
//           <Image
//             source={Images.appLogo}
//             resizeMode={'contain'}
//             tintColor={Colors.primary}
//             style={{width: moderateScale(105), height: moderateScale(40)}}
//           />
//         </View>
//         <View
//           style={[
//             // Style.flexRow,
//             {
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: moderateScale(10),
//               paddingTop: moderateScale(6),
//             },
//           ]}>
//           <TouchableOpacity
//             onPress={() => {
//               toggleLike(mm);
//             }}>
//             <Image
//               resizeMode={'contain'}
//               source={lllg ? Icons.ic_active_love : Icons.ic_heart}
//               // style={style.icon}
//               style={{width: 25, height: 25}}
//               tintColor={lllg ? Colors.primary : Colors.black}
//             />
//           </TouchableOpacity>
//           <Pressable onPress={generateInviteLink}>
//             <Image
//               resizeMode={'contain'}
//               source={Icons.ic_move}
//               // style={style.icon}

//               style={{width: 30, height: 30}}
//               tintColor={Colors.black}
//             />
//           </Pressable>
//         </View>
//       </View>
//       <View style={styles.container}>
//         {/* <Banner {...details} /> */}
//         <ImageBackground
//           source={{uri: article.urlToImage}}
//           style={{width: '100%', height: 170, marginVertical: 10}}
//           imageStyle={{borderRadius: 10}}
//           resizeMode="stretch">
//           <Text
//             style={{
//               position: 'absolute',
//               bottom: 10,
//               color: 'white',
//               left: 25,
//             }}>
//             {moment(article.updatedAt).fromNow()}
//           </Text>
//         </ImageBackground>
//         {/* {moment(props.updatedAt).fromNow()} */}

//         {article ? (
//           <>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginBottom: 10,
//               }}>
//               {/* <Image
//                 source={{uri: getCategoryImageUrl(article.category)}}
//                 style={{width: 35, height: 35}}
//               /> */}
//               <SvgUri
//                 uri={getCategoryImageUrl(article.category)}
//                 onError={() => console.log('error svg')}
//                 width="35"
//                 height="35"
//               />
//               <Text
//                 style={{
//                   fontSize: 15,
//                   color: '#000000',
//                   // marginVertical: moderateScale(10),
//                   fontFamily: Fonts.bold,
//                   fontWeight: 400,
//                   marginLeft: 10,

//                   lineHeight: 16,
//                 }}>
//                 {article.category}
//               </Text>
//             </View>

//             <Text style={styles.title}>{article.title}</Text>
//             <Text style={styles.description}>{article.content}</Text>
//             {article.url ? (
//               <TouchableOpacity
//                 onPress={() => {
//                   Linking.openURL(article.url);
//                 }}>
//                 <Text
//                   style={[
//                     FontStyle.regular,
//                     {
//                       textAlign: 'right',
//                       fontWeight: '400',
//                       fontFamily: Fonts.light,
//                       lineHeight: moderateScale(23),
//                       fontSize: moderateScale(15),
//                       color: Colors.primary,
//                     },
//                   ]}>
//                   Show Original
//                 </Text>
//               </TouchableOpacity>
//             ) : null}
//           </>
//         ) : (
//           <Text style={styles.error}>Article not found</Text>
//         )}
//       </View>
//       <CategorySection
//         prefixAtTitle={
//           <LottieView
//             source={Lottie.latest}
//             autoPlay
//             loop
//             style={{width: moderateScale(30), height: moderateScale(30)}}
//           />
//         }
//         title={'Related News'}
//         titleStyle={Style.title}
//         headerContainerStyle={Style.header}
//         // left={'View All'}
//         moreStyle={Style.moreStyle}
//       />

//       <ScrollView
//         style={styles.container}
//         horizontal={true}
//         showsHorizontalScrollIndicator={false}>
//         {trendingArticles
//           .filter(item => {
//             // Exclude the current article by comparing IDs
//             const currentId =
//               typeof item._id?.toHexString === 'function'
//                 ? item._id.toHexString()
//                 : item._id || item.id;
//             return currentId !== articleId;
//           })
//           .map((item, index) => (
//             <Card
//               key={index}
//               {...item}
//               onClick={() => {
//                 const id = item._id.toHexString();
//                 Nav.navigate('Detailedtrend', {
//                   articleId: id,
//                 } as NewsDetailsPropType);
//               }}
//             />
//           ))}
//       </ScrollView>
//       <View style={{marginVertical: 20}}></View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   icon: {
//     width: moderateScale(24),
//     height: moderateScale(24),
//   },

//   container: {
//     // paddingHorizontal: moderateScale(16),
//   },
//   image: {
//     width: '100%',
//     height: moderateScale(200),
//     borderRadius: moderateScale(8),
//   },
//   title: {
//     fontSize: moderateScale(22),
//     fontWeight: '700',
//     // marginTop: 20,
//     color: '#000000',
//     fontFamily: Fonts.medium,
//     lineHeight: 28,
//   },
//   publishedAt: {
//     fontSize: moderateScale(14),
//     color: Colors.grey,
//   },
//   description: {
//     fontSize: moderateScale(15),
//     marginTop: 20,
//     color: '#1D1D1D',
//     lineHeight: 23,
//     fontFamily: Fonts.medium,
//   },
//   url: {
//     fontSize: moderateScale(14),
//     color: Colors.primary,
//   },
//   link: {
//     color: Colors.primary,
//     textDecorationLine: 'underline',
//   },
//   error: {
//     fontSize: moderateScale(16),
//     color: Colors.error,
//     textAlign: 'center',
//     marginTop: moderateScale(20),
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },

//   header: {
//     paddingHorizontal: moderateScale(0),
//   },
//   moreStyle: {
//     color: Colors.primary,
//     ...FontStyle.titleSemibold,
//   },
// });

// export default Detailedtrend;


























































































