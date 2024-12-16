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
} from 'react-native';
import axios from 'axios';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {FontStyle, Style} from '../../config/style.config';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {Fonts} from '../../config/font.config';
import {useQuery} from '@realm/react';
import Card from '../../components/AppComponents/card';
import CategorySection from '../../components/CategorySections';
import LottieView from 'lottie-react-native';
import {Icons, Images, Lottie} from '../../generated/image.assets';
import Banner from '../newDetail/components/banner';
import Article from '../../store/article/article.schema';
import TrendingArticle from '../../store/trending/trending.schema';

import Header from '../newDetail/components/header';
import BackButton from '../../components/BackButton';
import {useToggleTrendingLike} from '../../store/trending/trendinghook';

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
  console.log('dd', articleId);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const trendingArticles = useQuery('TrendingArticle'); // Fetch trending art
  console.log('trendingschema', trendingArticles);
  const articlevar = trendingArticles.map(item => item.article_id);
  console.log('articlesid', articlevar);
  // const params = props.route.params;
  const articles = useQuery(Article);
  const details = articles.find(
    article => article._id.toString() === articleId,
  );
  const {toggleLike} = useToggleTrendingLike();
  console.log('jkv jrn v', typeof toggleLike);
  const articleIdToFind = articleId;

  // Extract the single article object
  const singleArticle = trendingArticles.find(
    article => article._id == articleIdToFind,
  );

  console.log('Single Article:', singleArticle);
  const lllg = singleArticle.isLiked;
  console.log('sss', lllg);
  const mm = singleArticle._id;
  console.log('vv', mm);

  // const ff=singleArticle.map(item=>item.isLiked);
  // console.log("lgg",ff);

  const fetchArticleDetails = async () => {
    try {
      const response = await axios.get(
        `http://15.206.16.230:4000/api/v1/android/article/${articleId}`,
      );
      if (response.data.status) {
        setArticle(response.data.data);
        console.log('liked response', response.data.data);
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
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1733316870222-900829952.png';
    } else if (category === 'Physical Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1733316938942-504121852.png';
    } else if (category === 'Financial Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1733316982814-491751420.png';
    } else if (category === 'Community Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1733317023432-801459774.png';
    } else if (category === 'Occupational Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1733317061988-588473540.png';
    } else if (category === 'Environmental Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1733317102960-139581729.png';
    } else if (category === 'Medical Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1733317179977-229729963.png';
    }
    return null; // Return null if category doesn't match
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
          <TouchableOpacity
            onPress={() => {
              toggleLike(mm);
            }}>
            <Image
              resizeMode={'contain'}
              source={lllg ? Icons.ic_active_love : Icons.ic_heart}
              // style={style.icon}
              style={{width: 30, height: 30}}
              tintColor={lllg ? Colors.primary : Colors.black}
            />
          </TouchableOpacity>
          <Image
            resizeMode={'contain'}
            source={Icons.ic_move}
            // style={style.icon}

            style={{width: 30, height: 30}}
            tintColor={Colors.black}
          />
        </View>
      </View>
      <View style={styles.container}>
        <Banner {...details} />

        {article ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Image
                source={{url: getCategoryImageUrl(article.category)}}
                style={{width: 30, height: 30}}
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
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(article.url);
                }}>
                <Text
                  style={[
                    FontStyle.regular,
                    {
                      textAlign: 'right',
                      fontWeight: '400',
                      fontFamily: Fonts.light,
                      lineHeight: moderateScale(23),
                      fontSize: moderateScale(15),
                      color: Colors.primary,
                    },
                  ]}>
                  Show Original
                </Text>
              </TouchableOpacity>
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
            <Card key={index} {...item}
             />
          ))}
      </ScrollView>
      <View style={{marginVertical: 20}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default Detailedtrend;
