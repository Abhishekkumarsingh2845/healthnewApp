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
} from 'react-native';
import axios from 'axios';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {FontStyle, Style} from '../../config/style.config';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Header from '../news/components/header';
import {Fonts} from '../../config/font.config';
import {useQuery} from '@realm/react';
import Card from '../../components/AppComponents/card';
import CategorySection from '../../components/CategorySections';
import LottieView from 'lottie-react-native';
import {Lottie} from '../../generated/image.assets';
import Banner from '../newDetail/components/banner';
import Article from '../../store/article/article.schema';
import TrendingArticle from '../../store/trending/trending.schema';

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
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const trendingArticles = useQuery('TrendingArticle'); // Fetch trending art
  // const params = props.route.params;
  const articles = useQuery(Article);
  const details = articles.find(
    article => article._id.toString() === articleId,
  );
  const fetchArticleDetails = async () => {
    try {
      const response = await axios.get(
        `http://15.206.16.230:4000/api/v1/android/article/${articleId}`,
      );
      if (response.data.status) {
        setArticle(response.data.data);
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

  return (
    <ScrollView
      style={{flex: 1}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <SafeAreaView />
      <Header icon={undefined} title={'Trending/Popular New'} />
      <View style={styles.container}>
        <Banner {...details} />
        {article ? (
          <>
            <Text style={styles.title}>{article.category}</Text>
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
                      fontWeight: '400',
                      fontFamily: Fonts.light,
                      lineHeight: moderateScale(23),
                      fontSize: moderateScale(15),
                      color: '#1D1D1D',
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
        title={'Latest News'}
        titleStyle={Style.title}
        headerContainerStyle={Style.header}
        left={'View All'}
        moreStyle={Style.moreStyle}
      />
      <View>
        <ScrollView style={styles.container} horizontal>
          <View style={styles.cardContainer}>
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
                <Card key={index} {...item} />
              ))}
          </View>
        </ScrollView>
        <View style={{marginVertical: 20}}></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  image: {
    width: '100%',
    height: moderateScale(200),
    borderRadius: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    marginTop: 20,
    color: '#000000',
    fontFamily: Fonts.medium,
    lineHeight: 28,
  },
  publishedAt: {
    fontSize: moderateScale(14),
    color: Colors.grey,
  },
  description: {
    fontSize: moderateScale(16),
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

export default Detailedtrend;
