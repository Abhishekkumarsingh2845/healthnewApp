// // his is original code after garv fix

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

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Linking,
//   SafeAreaView,
//   ImageBackground,
//   ScrollView,
// } from 'react-native';

// import {moderateScale} from 'react-native-size-matters';
// import Header from './components/header';
// import {Fonts} from '../../config/font.config';
// import {Colors} from '../../config/colors.config';
// import {TouchableOpacity} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import moment from 'moment';
// import {useGetArticles} from '../../store/article/article.hooks';
// import Card from '../../components/AppComponents/card';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// type Article = {
//   _id: string;
//   article_id: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
//   publishedAt: string;
//   updatedAt: Date;
//   content: string;
//   category: string;
//   status: string;
//   isActive: boolean;
//   isTrending: boolean;
// };

// const index = (props: NewsPropType) => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const params = props.route.params;
//   const [openedArticles, setOpenedArticles] = useState<Set<string>>(new Set()); // Store opened article IDs
//   const allArticles = useGetArticles();
//   const handleShowOriginal = (url: string, id: string) => {
//     if (openedArticles.has(id)) {
//       // If article has been opened before, open URL directly
//       Linking.openURL(url);
//     } else {
//       // Add article ID to the set and navigate to WebView
//       setOpenedArticles(prev => new Set(prev).add(id));
//       props.navigation.navigate('WebViewScreen', {url});
//     }
//   };

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const response = await fetch(
//           'http://15.206.16.230:4000/api/v1/android/published-articles?search=&limit=1000',
//         );
//         const data = await response.json();
//         if (data.status && data.data?.articles) {
//           setArticles(data.data.articles);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, []);

//   return (
//     <AppSafeAreaView>
//       <SafeAreaView />
//       <Header {...params} />
//       {/* <View style={{marginTop: 25}}></View> */}
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {allArticles.map((item, index) => {
//           return (
//             <Card
//               key={index}
//               onClick={() => {
//                 const id = item._id.toHexString();
//                 Nav.navigate('NewsDetail', {
//                   _id: id,
//                 } as NewsDetailsPropType);
//               }}
//               {...item}
//             />
//           );
//         })}
//       </ScrollView>
//     </AppSafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   articleContainer: {
//     marginBottom: 20,
//     borderBottomColor: '#ddd',
//     paddingBottom: 10,
//   },
//   articleImage: {
//     width: '100%',
//     height: moderateScale(200),
//     marginBottom: moderateScale(10),
//     resizeMode: 'contain',
//     alignItems: 'flex-start',
//     justifyContent: 'flex-end',
//   },
//   articleContent: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 5,
//     fontFamily: Fonts.medium,
//     lineHeight: 28.13,
//     color: '#000000',
//   },
//   description: {
//     fontSize: 15,
//     color: '#1D1D1D',
//     lineHeight: 23.53,
//     fontFamily: Fonts.medium,
//     marginBottom: 5,
//   },
//   tme: {
//     // marginBottom: 20,
//     // marginHorizontal: 20,
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

//   roundedImage: {
//     borderRadius: moderateScale(20), // Adjust the radius as needed
//     overflow: 'hidden',
//   },
// });

// export default index;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   ScrollView,
//   SafeAreaView,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { moderateScale } from 'react-native-size-matters';
// import Header from './components/header';
// import Card from '../../components/AppComponents/card';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import { RootStackParamList } from '../../navigations/MainNavigation/models';

// type Article = {
//   _id: string;
//   article_id: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
//   publishedAt: string;
//   updatedAt: Date;
//   content: string;
//   category: string;
//   status: string;
//   isActive: boolean;
//   isTrending: boolean;
// };

// const Index = (props: any) => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const params = props.route.params;

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const response = await fetch(
//           'http://15.206.16.230:4000/api/v1/android/published-articles?search=&'
//         );
//         const data = await response.json();
//         if (data.status && data.data?.articles) {
//           setArticles(data.data.articles);
//         }
//       } catch (error) {
//         console.error('Error fetching articles:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//       </View>
//     );
//   }

//   return (
//     <AppSafeAreaView>
//       <SafeAreaView />
//       <Header {...params} />
//       <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
//         {articles.map((item, index) => (
//           <Card
//             key={item._id}
//             onClick={() =>
//               navigation.navigate('NewsDetail', {
//                 _id: item._id,
//               })
//             }
//             {...item}
//           />
//         ))}
//       </ScrollView>
//     </AppSafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollView: {
//     padding: moderateScale(10),
//   },
// });

// export default Index;

// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   ScrollView,
//   SafeAreaView,
//   StyleSheet,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import {useNavigation, NavigationProp} from '@react-navigation/native';
// import {moderateScale} from 'react-native-size-matters';
// import Header from './components/header';
// import Card from '../../components/AppComponents/card';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';

// type Article = {
//   _id: string;
//   article_id: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
//   publishedAt: string;
//   updatedAt: Date;
//   content: string;
//   category: string;
//   status: string;
//   isActive: boolean;
//   isTrending: boolean;
// };

// const Index = (props: any) => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [page, setPage] = useState<number>(1); // Start with page 1
//   const [hasMore, setHasMore] = useState<boolean>(true); // Tracks if more articles can be fetched
//   const params = props.route.params;

//   const fetchArticles = useCallback(
//     async (currentPage: number) => {
//       try {
//         if (!hasMore) return; // Stop fetching if there's no more data
//         const response = await fetch(
//           `http://15.206.16.230:4000/api/v1/android/published-articles?search=&limit=10&page=${currentPage}`,
//         );
//         const data = await response.json();
//         if (data.status && data.data?.articles) {
//           // Append new articles to the existing list
//           setArticles(prev =>
//             currentPage === 1
//               ? data.data.articles
//               : [...prev, ...data.data.articles],
//           );
//           // Check if more articles are available
//           if (data.data.articles.length < 10) setHasMore(false);
//         }
//       } catch (error) {
//         console.error('Error fetching articles:', error);
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [hasMore],
//   );

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     setPage(1); // Reset to page 1
//     setHasMore(true); // Reset pagination state
//     await fetchArticles(1);
//   };

//   const handleLoadMore = async () => {
//     if (!refreshing && hasMore) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       await fetchArticles(nextPage);
//     }
//   };

//   useEffect(() => {
//     fetchArticles(1); // Fetch the initial articles
//   }, []);

//   if (loading && articles.length === 0) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//       </View>
//     );
//   }

//   return (
//     <AppSafeAreaView>
//       <SafeAreaView />
//       <Header {...params} />
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//         onMomentumScrollEnd={handleLoadMore}
//       >
//         {articles.map((item, index) => (
//           <Card
//             key={item._id}
//             onClick={() =>
//               navigation.navigate('NewsDetail', {
//                 _id: item._id,
//               })
//             }
//             {...item}
//           />
//         ))}
//       </ScrollView>
//     </AppSafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollView: {
//     padding: moderateScale(10),
//   },
// });

// export default Index;




////good code 
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Linking,
//   SafeAreaView,
//   ImageBackground,
//   ScrollView,
//   RefreshControl,
// } from 'react-native';

// import {moderateScale} from 'react-native-size-matters';
// import Header from './components/header';
// import {Fonts} from '../../config/font.config';
// import {Colors} from '../../config/colors.config';
// import {TouchableOpacity} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import moment from 'moment';
// import {
//   useGetArticles,
//   useToggleLikeArticle,
// } from '../../store/article/article.hooks';
// import Card from '../../components/AppComponents/card';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import InfiniteList from '../../components/InfiniteList';
// import {fetchLatestArticles} from '../../store/article/article.network';
// import {errorLog} from '../../utils/debug';
// import {useQuery, useRealm} from '@realm/react';
// import Article from '../../store/article/article.schema';
// import {BSON} from 'realm';
// import Favorite from '../../store/favorite/favorite.schema';
// import Categories from '../../components/AppComponents/categories';

// type Article = {
//   _id: string;
//   article_id: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
//   publishedAt: string;
//   updatedAt: Date;
//   content: string;
//   category: string;
//   status: string;
//   isActive: boolean;
//   isTrending: boolean;
// };

// const index = (props: NewsPropType) => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//     loadingMore: false,
//   });
//   const params = props.route.params;
  
//   const [openedArticles, setOpenedArticles] = useState<Set<string>>(new Set()); // Store opened article IDs
//   // const allArticles = useGetArticles();
//   const allArticles = useQuery(Article).sorted('updatedAt', true);
//   const {saveManyArticles, deleteArticles} = useToggleLikeArticle();
//   const realm = useRealm();

//   const onLoadMore = async (page: number) => {
//     setPagination(prev => ({...prev, loadingMore: true}));
//     console.log('load more...');
//     const res = await fetchLatestArticles({
//       page: page,
//       search: '',
//       limit: 10,
//     });
//     // console.log('first:', res);
//     if (page == 1) {
//       deleteArticles();
//     }
//     if (res.status) {
//       if (res?.response?.articles) {
//         setPagination(prev => ({
//           ...prev,
//           totalPages: res?.response?.pagination?.totalPages ?? 1,
//           page: res?.response?.pagination?.currentPage ?? 1,
//         }));
//         const ss = res?.response?.articles;
//         // console.log('Api data of the latest', ss);

//         realm.write(() => {
//           res.response.articles.forEach((article: any) => {
//             const articleId = new BSON.ObjectId(article._id);
//             let data = {
//               ...article,
//               _id: articleId,
//             };
//             const fav = realm
//               .objects(Favorite.schema.name)
//               .filtered(`articleId == $0`, articleId);
//             data['isLiked'] = fav.length > 0;
//             realm.create(Article.schema.name, data, Realm.UpdateMode.Modified);
//           });
//         });

//         // saveManyArticles(res?.response?.articles);
//         // console.log('datattttattatatatatta', saveManyArticles);
//       }
//     } else {
//       errorLog(res.message);
//     }
//     setPagination(prev => ({...prev, loadingMore: false}));
//   };

//   const handleShowOriginal = (url: string, id: string) => {
//     if (openedArticles.has(id)) {
//       // If article has been opened before, open URL directly
//       Linking.openURL(url);
//     } else {
//       // Add article ID to the set and navigate to WebView
//       setOpenedArticles(prev => new Set(prev).add(id));
//       props.navigation.navigate('WebViewScreen', {url});
//     }
//   };

//   const filteredArticles = allArticles.filter(article => 
//     activeCategory === 'All' || article.category === activeCategory
//   );

//   useEffect(() => {
//     console.log(pagination, 'pagination...');
//   }, [pagination]);

//   return (
//     <AppSafeAreaView>
//       <SafeAreaView />
//       <Header {...params} />
//          <Categories onCategoryChange={setActiveCategory} />

//       <View style={{flex: 1}}>
//         <InfiniteList
//           data={filteredArticles as any}
//           totalPages={pagination.totalPages}
//           refreshControl={
//             <RefreshControl colors={[Colors.primary]} refreshing={loading} />
//           }
//           onLoad={() => {
//             onLoadMore(pagination.page + 1);
//           }}
//           ListEmptyComponent={() => {
//             return <></>;
//           }}
//           ListFooterComponent={() => {
//             return pagination.loadingMore ? (
//               <View style={{marginBottom: moderateScale(120)}}>
//                 <ActivityIndicator
//                   size={moderateScale(30)}
//                   color={Colors.primary}
//                 />
//               </View>
//             ) : (
//               <View style={{marginTop: moderateScale(120)}} />
//             );
//           }}
//           renderItem={({item, index}: any) => {
//             return (
//               <Card
//                 key={`CARD-${index}`}
//                 onClick={() => {
//                   const id = item._id.toHexString();
//                   Nav.navigate('NewsDetail', {
//                     _id: id,
//                   } as NewsDetailsPropType);
//                 }}
//                 {...item}
//                 useFor={props.route.params.type}
//               />
//             );
//           }}
//         />
//       </View>
      
//     </AppSafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   articleContainer: {
//     marginBottom: 20,
//     borderBottomColor: '#ddd',
//     paddingBottom: 10,
//   },
//   articleImage: {
//     width: '100%',
//     height: moderateScale(200),
//     marginBottom: moderateScale(10),
//     resizeMode: 'contain',
//     alignItems: 'flex-start',
//     justifyContent: 'flex-end',
//   },
//   articleContent: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 5,
//     fontFamily: Fonts.medium,
//     lineHeight: 28.13,
//     color: '#000000',
//   },
//   description: {
//     fontSize: 15,
//     color: '#1D1D1D',
//     lineHeight: 23.53,
//     fontFamily: Fonts.medium,
//     marginBottom: 5,
//   },
//   tme: {
//     // marginBottom: 20,
//     // marginHorizontal: 20,
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

//   roundedImage: {
//     borderRadius: moderateScale(20), // Adjust the radius as needed
//     overflow: 'hidden',
//   },
// });

// export default index;







import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Header from '../news/components/header';
import FilterModal from '../../components/AppComponents/filterModal';
import Card from '../../components/AppComponents/card';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigations/MainNavigation/models';
import axios from 'axios';
import { useRealm, useQuery } from '@realm/react';
import { BSON } from 'realm';
import TrendingArticle from '../../store/trending/trending.schema';
import Favorite from '../../store/favorite/favorite.schema';
import { useToggleTrendingLike } from '../../store/trending/trendinghook';
import { Colors } from '../../config/colors.config';
import { moderateScale } from 'react-native-size-matters';
import { FontStyle } from '../../config/style.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfiniteList from '../../components/InfiniteList';

const index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const [activeCategory, setActiveCategory] = useState('All'); // Default to 'All'
  const { toggleLike } = useToggleTrendingLike();

  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    loadingMore: false,
  });





  
  const trendingArticlesFromRealm = useQuery('TrendingArticle');

  // Filter articles based on activeCategory
  const filteredTrendingArticles =
    activeCategory === 'All'
      ? trendingArticlesFromRealm
      : trendingArticlesFromRealm.filter(
          (article) => article.category === activeCategory,
        );

  const fetchTrendingArticles = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=${pagination.limit}&page=${page}`,
      );

      if (response.data.status && response.data.data.length > 0) {
        realm.write(() => {
          response.data.data.forEach((article: any) => {
            const articleId = new BSON.ObjectId(article._id);
            let data = {
              ...article,
              _id: articleId,
            };
            const fav = realm
              .objects(Favorite.schema.name)
              .filtered(`articleId == $0`, articleId);
            data['isLiked'] = fav.length > 0;
            realm.create(
              TrendingArticle.schema.name,
              data,
              Realm.UpdateMode.Modified,
            );
          });
        });

        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination?.totalPages || 1,
          page: response.data.pagination?.currentPage || 1,
        }));
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const onLoadMore = useCallback(async () => {
    if (pagination.loadingMore || pagination.page >= pagination.totalPages) return;

    setPagination((prev) => ({ ...prev, loadingMore: true }));
    await fetchTrendingArticles(pagination.page + 1);
    setPagination((prev) => ({ ...prev, loadingMore: false }));
  }, [pagination]);

  useEffect(() => {
    fetchTrendingArticles(1);
  }, []);

  const renderFooter = () => {
    if (!pagination.loadingMore) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  };

  useEffect(() => {
    const fetchSelectedCategory = async () => {
      try {
        const category = await AsyncStorage.getItem('selectedCategory');
        if (category !== null) {
          setSelectedCategory(category);
          setActiveCategory(category); // Set activeCategory to the retrieved category
          console.log('Category retrieved from AsyncStorage:', category);
        }
      } catch (error) {
        console.error('Failed to fetch category from AsyncStorage:', error);
      }
    };

    fetchSelectedCategory();
  }, []);

  return (
    <>
      <AppSafeAreaView>
        <SafeAreaView />

        <Header icon={undefined} title={'Latest News'} />
        <View style={{ flex: 1 }}>
          <InfiniteList
            data={filteredTrendingArticles}
            totalPages={pagination.totalPages}
            refreshControl={
              <RefreshControl
                colors={[Colors.primary]}
                refreshing={loading}
                onRefresh={() => fetchTrendingArticles(1)}
              />
            }
            onLoad={onLoadMore}
            ListEmptyComponent={() => {
              return <></>;
            }}
            ListFooterComponent={renderFooter}
            renderItem={({ item, index }: any) => {
              return (
                <Card
                  key={`CARD-${index}`}
                  onClick={() => {
                    let id;
                    if (item._id) {
                      id =
                        typeof item._id.toHexString === 'function'
                          ? item._id.toHexString()
                          : item._id;
                    } else {
                      id = item.id;
                    }

                    Nav.navigate('Detailedtrend', {
                      articleId: id,
                    });
                  }}
                  onLike={() => {
                    toggleLike(item?._id as any);
                  }}
                  {...item}
                />
              );
            }}
          />
        </View>

        {/* Filter Modal */}
        <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
      </AppSafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: moderateScale(10),
    alignItems: 'center',
  },
});

export default index;