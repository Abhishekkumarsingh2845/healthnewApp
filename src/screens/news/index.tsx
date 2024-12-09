// his is original code after garv fix
// import {RefreshControl, ScrollView, Text, View} from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Categories from '../../components/AppComponents/categories';
// import CategorySection from '../../components/CategorySections';
// import {moderateScale} from 'react-native-size-matters';
// import Card from '../../components/AppComponents/card';
// import AppImage from '../../components/AppImage';
// import {Icons} from '../../generated/image.assets';
// import {FontStyle, Style} from '../../config/style.config';
// import {Colors} from '../../config/colors.config';
// import {Size, Spacing} from '../../config/size.config';
// import {StackScreenProps} from '@react-navigation/stack';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
// import BackButton from '../../components/BackButton';
// import {
//   useGetArticles,
//   useGetFavArticles,
//   useToggleLikeArticle,
// } from '../../store/article/article.hooks';
// import {NewsDetailsPropType} from '../newDetail';
// import InfiniteList from '../../components/InfiniteList';
// import {ArticleType} from '../../store/article/article.interface';
// import {fetchLatestArticles} from '../../store/article/article.network';
// import {errorLog} from '../../utils/debug';
// import {ActivityIndicator} from 'react-native-paper';
// import {NewsPropType} from './types/interface';
// import Header from './components/header';
// import {NewsListType} from './types/enum';

// const News = (props: NewsPropType) => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const params = props.route.params;
//   const latest = useGetArticles();
//   const favorites = useGetFavArticles();
//   const {deleteArticles, saveManyArticles } = useToggleLikeArticle();
//   const [paginationDetails, setPaginationDetails] = useState({
//     page: 1,
//     totalPages: 0,
//     refreshing: false,
//     loadMore: false,
//   });
//   const Lists = useMemo(() => {
//     switch (params.type) {
//       case NewsListType.Latest:
//         return latest;
//       case NewsListType.Favourite:
//         return favorites;
//       case NewsListType.Trending:
//         return latest;
//       default:
//         return [];
//     }
//   }, [params.type]);

//   const changePaginationValues = useCallback(
//     (key: keyof typeof paginationDetails, value: boolean | number) => {
//       setPaginationDetails(prev => ({...prev, key: value}));
//     },
//     [],
//   );

//   const getLatestArticle = useCallback(async (page: number) => {
//     changePaginationValues('refreshing', true);
//     const res = await fetchLatestArticles({page, search: ''});
//     if (page == 1) {
//       deleteArticles();
//     }
//     if (res.status) {
//       if (res?.response?.articles) {
//         saveManyArticles(res?.response?.articles);
//         const pagination = res?.response?.pagination;
//         changePaginationValues('totalPages', pagination?.totalPages ?? 1);
//       }
//     } else {
//       errorLog(res.message);
//     }
//     changePaginationValues('refreshing', false);
//   }, []);

//   const onLoadMore = async () => {
//     // console.log('load more....')
//     if (Lists.length > 0) {
//       changePaginationValues('loadMore', true);
//       const updatedPage = paginationDetails.page + 1;
//       changePaginationValues('page', updatedPage);
//       await init(updatedPage);
//       changePaginationValues('loadMore', false);
//     }
//   };
//   const init = useCallback(
//     async (page: number = 1) => {
//       switch (params.type) {
//         case NewsListType.Latest:
//           await getLatestArticle(page);
//           break;
//         case NewsListType.Trending:
//           await getLatestArticle(page);
//           break;
//       }
//     },
//     [params.type],
//   );

//   useEffect(() => {
//     init(1);
//   }, []);
//   return (
//     <>
//       <AppSafeAreaView title={''}>
//         <Header {...params} />
//         <View style={{alignItems: 'center'}}>
//           <InfiniteList
//             data={Lists as any}
//             totalPages={paginationDetails.totalPages}
//             refreshControl={
//               <RefreshControl
//                 colors={[Colors.primary]}
//                 refreshing={paginationDetails.refreshing}
//                 onRefresh={init}
//               />
//             }
//             onLoad={onLoadMore}
//             ListFooterComponent={() => {
//               return paginationDetails.loadMore ? (
//                 <View style={{padding: '12%'}}>
//                   <ActivityIndicator
//                     size={moderateScale(30)}
//                     color={Colors.primary}
//                   />
//                 </View>
//               ) : (
//                 <View style={{padding: '12%'}} />
//               );
//             }}
//             renderItem={({item, index}) => {
//               return (
//                 <Card
//                   {...item}
//                   containerStyle={{
//                     width: Size.screenWidth * 0.9,
//                   }}
//                   onClick={() => {
//                     const _id = item._id.toHexString();
//                     Nav.navigate('NewsDetail', {_id} as NewsDetailsPropType);
//                   }}
//                 />
//               );
//             }}
//           />
//         </View>
//         <View style={{padding: moderateScale(55)}} />
//       </AppSafeAreaView>
//     </>
//   );
// };

// export default News;

// //his is trending but written in new
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
// import { moderateScale } from 'react-native-size-matters';

// type Article = {
//   _id: string;
//   article_id: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
//   publishedAt: string;
//   content: string;
//   category: string;
//   status: string;
//   isActive: boolean;
//   isTrending: boolean;
// };

// const TrendingArticlesScreen = () => {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     // Fetch data from API
//     fetch('http://15.206.16.230:4000/api/v1/android/trendingarticle')
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status) {
//           setArticles(data.data); // Set the articles from API response
//         }
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       });
//   }, []);

//   const renderArticle = ({ item }: { item: Article }) => (
//     <View style={styles.articleContainer}>
//       <Image source={{ uri: item.urlToImage }} style={styles.articleImage} />
//       <View style={styles.articleContent}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.description}>{item.description}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <Text>Loading...</Text>
//       ) : (
//         <FlatList
//           data={articles}
//           renderItem={renderArticle}
//           keyExtractor={(item) => item._id}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   articleContainer: {
//     marginBottom: 20,

//     borderBottomColor: '#ddd',
//     paddingBottom: 10,
//   },
//   articleImage: {
//     width: '100%',
//     height: moderateScale(200), // Adjust the height as needed
//     marginBottom: moderateScale(10),
//     borderRadius: 15,
//   },
//   articleContent: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 5,
//   },
//   category: {
//     fontSize: 12,
//     color: '#888',
//     marginBottom: 5,
//   },
//   publishedAt: {
//     fontSize: 12,
//     color: '#888',
//     marginBottom: 10,
//   },
//   readMoreButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 5,
//   },
//   readMoreText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
// });

// export default TrendingArticlesScreen;

// / his is the manaual api hittin code

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import Header from './components/header';
import {Fonts} from '../../config/font.config';
import {Colors} from '../../config/colors.config';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useGetArticles} from '../../store/article/article.hooks';
import Card from '../../components/AppComponents/card';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';
import AppSafeAreaView from '../../components/AppSafeAreaView';
type Article = {
  _id: string;
  article_id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  updatedAt: Date;
  content: string;
  category: string;
  status: string;
  isActive: boolean;
  isTrending: boolean;
};

const index = (props: NewsPropType) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const params = props.route.params;
  const [openedArticles, setOpenedArticles] = useState<Set<string>>(new Set()); // Store opened article IDs
  const allArticles = useGetArticles();
  const handleShowOriginal = (url: string, id: string) => {
    if (openedArticles.has(id)) {
      // If article has been opened before, open URL directly
      Linking.openURL(url);
    } else {
      // Add article ID to the set and navigate to WebView
      setOpenedArticles(prev => new Set(prev).add(id));
      props.navigation.navigate('WebViewScreen', {url});
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          'http://15.206.16.230:4000/api/v1/android/published-articles?search=&page=1',
        );
        const data = await response.json();
        if (data.status && data.data?.articles) {
          setArticles(data.data.articles);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <AppSafeAreaView>
      <SafeAreaView />
      <Header {...params} />
      {/* <View style={{marginTop: 25}}></View> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {allArticles.map((item, index) => {
          return (
            <Card
              key={index}
              onClick={() => {
                const id = item._id.toHexString();
                Nav.navigate('NewsDetail', {
                  _id: id,
                } as NewsDetailsPropType);
              }}
              {...item}
            />
          );
        })}
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  articleContainer: {
    marginBottom: 20,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  articleImage: {
    width: '100%',
    height: moderateScale(200),
    marginBottom: moderateScale(10),
    resizeMode: 'contain',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  articleContent: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    fontFamily: Fonts.medium,
    lineHeight: 28.13,
    color: '#000000',
  },
  description: {
    fontSize: 15,
    color: '#1D1D1D',
    lineHeight: 23.53,
    fontFamily: Fonts.medium,
    marginBottom: 5,
  },
  tme: {
    // marginBottom: 20,
    // marginHorizontal: 20,
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  publishedAt: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },

  roundedImage: {
    borderRadius: moderateScale(20), // Adjust the radius as needed
    overflow: 'hidden',
  },
});

export default index;
