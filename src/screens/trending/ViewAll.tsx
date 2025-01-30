// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Linking,
// } from 'react-native';
// import {useQuery} from '@realm/react';
// import {moderateScale} from 'react-native-size-matters';
// import {Fonts} from '../../config/font.config';
// import {Colors} from '../../config/colors.config';

// const ViewAll = props => {

//   const trendingArticles = useQuery('TrendingArticle');
//   console.log('-rtyuiovghjk>>>>>>', trendingArticles);
//   const [openedArticles, setOpenedArticles] = useState<Set<string>>(new Set());

//   const handleShowOriginal = (url: string, id: string) => {
//     if (openedArticles.has(id)) {
//       Linking.openURL(url);
//     } else {
//       setOpenedArticles(prev => new Set(prev).add(id));
//       props.navigation.navigate('WebViewScreen', {url});
//     }
//   };

//   const renderArticle = ({item}) => (
//     <View style={styles.articleContainer}>
//       {item.urlToImage && (
//         <Image source={{uri: item.urlToImage}} style={styles.articleImage} />
//       )}

//       <View style={styles.articleContent}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.description}>{item.description}</Text>
//         <Text style={styles.description}>{item.url}</Text>
//         <TouchableOpacity
//           style={styles.showOriginalButton}
//           onPress={() => handleShowOriginal(item.url, item._id)}>
//           <Text style={styles.showOriginalText}>Show Original</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {trendingArticles.isLoading ? (
//         <ActivityIndicator size="large" color="#007BFF" />
//       ) : (
//         <FlatList
//           data={trendingArticles}
//           renderItem={renderArticle}
//           keyExtractor={item => item._id.toString()}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
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
//     borderRadius: 10,
//     resizeMode: 'cover',
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
//     marginBottom: 10,
//   },
//   showOriginalButton: {
//     width: '100%',
//     paddingHorizontal: 15,
//     marginTop: 10,
//   },
//   showOriginalText: {
//     textAlign: 'right',
//     color: Colors.primary,
//     fontSize: 14,
//     fontFamily: Fonts.medium,
//   },
// });

// export default ViewAll;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Linking,
//   ScrollView,
// } from 'react-native';
// import {useQuery, useRealm} from '@realm/react';
// import {moderateScale} from 'react-native-size-matters';
// import {Fonts} from '../../config/font.config';
// import {Colors} from '../../config/colors.config';
// import Header from '../news/components/header';
// import {SafeAreaView} from 'react-native';
// import Card from '../../components/AppComponents/card';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import CategorySection from '../../components/CategorySections';
// import LottieView from 'lottie-react-native';
// import {Lottie} from '../../generated/image.assets';
// import axios from 'axios';
// import {BSON} from 'realm';
// import Favorite from '../../store/favorite/favorite.schema';
// import TrendingArticle from '../../store/trending/trending.schema';

// interface Article {
//   _id: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
// }

// interface Props {
//   navigation: {
//     navigate: (screen: string, params: {url: string}) => void;
//   };
// }

// const ViewAll: React.FC<Props> = props => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const [refreshing, setRefreshing] = useState(false);
//   const trendingArticles = useQuery('TrendingArticle');
//   const [openedArticles, setOpenedArticles] = useState<Set<string>>(new Set());
//   const params = props.route.params;
//   const trendingArticlesFromRealm = useQuery('TrendingArticle');
//   // console.log('->>EEEEEEEEE', trendingArticlesFromRealm);
//   const handleShowOriginal = (url: string, id: string) => {
//     if (openedArticles.has(id)) {
//       Linking.openURL(url);
//     } else {
//       setOpenedArticles(prev => new Set(prev).add(id));
//       props.navigation.navigate('WebViewScreen', {url});
//     }
//   };

//   const fetchTrendingArticles = async () => {
//     try {
//       const response = await axios.get(
//         'http://15.206.16.230:4000/api/v1/android/trendingarticle',
//       );
//       if (response.data.status && response.data.data.length > 0) {
//         realm.write(() => {
//           response.data.data.forEach((article: any) => {
//             const articleId = new BSON.ObjectId(article._id);
//             let data = {
//               ...article,
//               _id: articleId,
//             };
//             const fav = realm
//               .objects(Favorite.schema.name)
//               .filtered(`articleId == $0`, articleId);
//             if (fav.length > 0) {
//               data['isLiked'] = true;
//             } else {
//               data['isLiked'] = false;
//             }
//             realm.create(
//               TrendingArticle.schema.name,
//               data,
//               Realm.UpdateMode.Modified,
//             );
//           });
//         });
//         const aa = realm.objects('TrendingArticle');
//         // console.log('aa', aa);
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     }
//   };

//   const init = async () => {
//     setRefreshing(true);

//     await fetchTrendingArticles();

//     setRefreshing(false);
//   };

//   useEffect(() => {
//     console.log('RUN/');

//     init();
//   }, []);

//   const renderArticle = ({item}: {item: Article}) => (
//     <View style={styles.articleContainer}>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {trendingArticlesFromRealm.map((item, index) => (
//           <Card
//             key={index}
//             {...item}
//             onClick={() => {
//               let id;
//               if (item._id) {
//                 id =
//                   typeof item._id.toHexString === 'function'
//                     ? item._id.toHexString()
//                     : item._id;
//               } else {
//                 id = item.id;
//               }

//               Nav.navigate('Detailedtrend', {
//                 articleId: id,
//               });
//             }}
//             onLike={() => {
//               toggleLike(item?._id as any);
//             }}
//           />
//         ))}
//       </ScrollView>

//       {item.url ? (
//         <TouchableOpacity
//           style={{width: '100%', paddingHorizontal: 15}}
//           onPress={() => handleShowOriginal(item.url, item._id)}>
//           <Text style={{textAlign: 'right', color: Colors.primary}}>
//             show original
//           </Text>
//         </TouchableOpacity>
//       ) : null}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <SafeAreaView />
//       <Header />
//       <View style={{marginTop: 40}}></View>
//       {trendingArticles.isLoading ? (
//         <ActivityIndicator size="large" color="#007BFF" />
//       ) : (
//         <FlatList
//           data={trendingArticles}
//           renderItem={renderArticle}
//           showsVerticalScrollIndicator={false}
//           keyExtractor={(item: Article) => item._id.toString()}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
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
//     borderRadius: 10,
//     resizeMode: 'cover',
//   },
//   articleContent: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 25,
//     fontWeight: '700',
//     marginBottom: 5,
//     fontFamily: Fonts.light,
//     lineHeight: 28.13,
//     color: '#000000',
//   },
//   cat: {
//     fontSize: 14,
//     fontWeight: '400',
//     marginBottom: 5,
//     fontFamily: Fonts.light,
//     lineHeight: 16.13,
//     color: '#000000',
//   },
//   description: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1D1D1D',
//     lineHeight: 23.53,
//     fontFamily: Fonts.medium,
//     // marginBottom: 10,
//   },
//   showOriginalButton: {
//     width: '100%',
//     paddingHorizontal: 15,
//     // backgroundColor:"red",
//   },
//   showOriginalText: {
//     textAlign: 'right',
//     color: Colors.primary,
//     fontSize: 14,
//     fontFamily: Fonts.medium,
//   },
// });

// export default ViewAll;

//this  is for the limit=1000

// import {
//   Image,
//   RefreshControl,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Header from '../news/components/header';
// import Categories from '../../components/AppComponents/categories';
// import CategorySection from '../../components/CategorySections';
// import AppImage from '../../components/AppImage';
// import {Icons, Images, Lottie} from '../../generated/image.assets';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle} from '../../config/style.config';
// import Card from '../../components/AppComponents/card';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';

// import FilterModal from '../../components/AppComponents/filterModal';
// import {useCallback, useEffect, useState} from 'react';
// import LottieView from 'lottie-react-native';
// import {fetchLatestArticles} from '../../store/article/article.network';
// import {errorLog, infoLog} from '../../utils/debug';
// import {
//   useGetArticles,
//   useGetFavArticles,
//   useToggleLikeArticle,
// } from '../../store/article/article.hooks';
// import {NewsDetailsPropType} from '../newDetail';
// import {NewsListType} from '../news/types/enum';
// import {NewsPropType} from '../news/types/interface';
// import {useCategory} from '../../store/category/category.hooks';
// import axios from 'axios';

// import {useRealm, useQuery} from '@realm/react';

// import {
//   useToggleTrendingLike,
//   usetrendingFavArticles,
// } from '../../store/trending/trendinghook';
// import {BSON} from 'realm';
// import TrendingArticle from '../../store/trending/trending.schema';
// import Favorite from '../../store/favorite/favorite.schema';

// const ViewAll = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const {getCatories} = useCategory();
//   const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

//   const [showFilter, setShowFilter] = useState(false);
//   const allArticles = useGetArticles();
//   // console.log("allArticles==>>",allArticles)

//   const {toggleLike} = useToggleTrendingLike();

//   const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
//   const latestFavArticles = useGetFavArticles();
//   const favArticles = [...trendingFavArticles, ...latestFavArticles];
//   // const favArticles = usetrendingFavArticles();
//   // const favArticles = useGetFavArticles();
//   const [refreshing, setRefreshing] = useState(false);

//   const [trendingArticles, setTrendingArticles] = useState([]);
//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   const art = useQuery('Article');

//   const fetchTrendingArticles = async () => {
//     try {
//       const response = await axios.get(
//         'http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=1000',
//       );
//       if (response.data.status && response.data.data.length > 0) {
//         realm.write(() => {
//           response.data.data.forEach((article: any) => {
//             const articleId = new BSON.ObjectId(article._id);
//             let data = {
//               ...article,
//               _id: articleId,
//             };
//             const fav = realm
//               .objects(Favorite.schema.name)
//               .filtered(`articleId == $0`, articleId);
//             if (fav.length > 0) {
//               data['isLiked'] = true;
//             } else {
//               data['isLiked'] = false;
//             }
//             realm.create(
//               TrendingArticle.schema.name,
//               data,
//               Realm.UpdateMode.Modified,
//             );
//           });
//         });
//         const aa = realm.objects('TrendingArticle');
//         // console.log('aa', aa);
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     }
//   };

//   const getLatestArticle = async (page: number) => {
//     const res = await fetchLatestArticles({page, search: ''});
//     console.log('first:', res);
//     if (page == 1) {
//       deleteArticles();
//     }
//     if (res.status) {
//       if (res?.response?.articles) {
//         console.log(
//           'Fetched Articles-kjcjnejkcbnjekbcjkbc:',
//           res?.response?.articles,
//         );
//         saveManyArticles(res?.response?.articles);
//       }
//     } else {
//       errorLog(res.message);
//     }
//   };

//   const init = async () => {
//     setRefreshing(true);
//     await getLatestArticle(1);
//     await fetchTrendingArticles();

//     setRefreshing(false);
//   };

//   useEffect(() => {
//     console.log('RUN/');
//     getCatories();
//     init();
//   }, []);

//   return (
//     <>
//       <AppSafeAreaView>
//         <SafeAreaView />
//         <Header icon={undefined} title={'Trending/Popular New'} />

//         <ScrollView showsVerticalScrollIndicator={false}>
//           {trendingArticlesFromRealm.map((item, index) => (
//             <Card
//               key={index}
//               {...item}
//               onClick={() => {
//                 let id;
//                 if (item._id) {
//                   id =
//                     typeof item._id.toHexString === 'function'
//                       ? item._id.toHexString()
//                       : item._id;
//                 } else {
//                   id = item.id;
//                 }

//                 Nav.navigate('Detailedtrend', {
//                   articleId: id,
//                 });
//               }}
//               onLike={() => {
//                 toggleLike(item?._id as any);
//               }}
//             />
//           ))}
//         </ScrollView>

//         {/* //favourite section */}

//         <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
//       </AppSafeAreaView>
//     </>
//   );
// };

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

// export default ViewAll;

//this is for the  whole data at once.

// import {
//   ActivityIndicator,
//   Image,
//   RefreshControl,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Header from '../news/components/header';
// import Categories from '../../components/AppComponents/categories';
// import CategorySection from '../../components/CategorySections';
// import AppImage from '../../components/AppImage';
// import {Icons, Images, Lottie} from '../../generated/image.assets';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle} from '../../config/style.config';
// import Card from '../../components/AppComponents/card';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';

// import FilterModal from '../../components/AppComponents/filterModal';
// import {useCallback, useEffect, useState} from 'react';
// import LottieView from 'lottie-react-native';
// import {fetchLatestArticles} from '../../store/article/article.network';
// import {errorLog, infoLog} from '../../utils/debug';
// import {
//   useGetArticles,
//   useGetFavArticles,
//   useToggleLikeArticle,
// } from '../../store/article/article.hooks';
// import {NewsDetailsPropType} from '../newDetail';
// import {NewsListType} from '../news/types/enum';
// import {NewsPropType} from '../news/types/interface';
// import {useCategory} from '../../store/category/category.hooks';
// import axios from 'axios';

// import {useRealm, useQuery} from '@realm/react';

// import {
//   useToggleTrendingLike,
//   usetrendingFavArticles,
// } from '../../store/trending/trendinghook';
// import {BSON} from 'realm';
// import TrendingArticle from '../../store/trending/trending.schema';
// import Favorite from '../../store/favorite/favorite.schema';

// const ViewAll = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const {getCatories} = useCategory();
//   const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

//   const [showFilter, setShowFilter] = useState(false);
//   const allArticles = useGetArticles();
//   const {toggleLike} = useToggleTrendingLike();

//   const trendingFavArticles = usetrendingFavArticles();
//   const latestFavArticles = useGetFavArticles();
//   const favArticles = [...trendingFavArticles, ...latestFavArticles];
//   const [refreshing, setRefreshing] = useState(false);

//   const [isLoading, setIsLoading] = useState(true); // Loader state
//   const [trendingArticles, setTrendingArticles] = useState([]);
//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   const fetchTrendingArticles = async () => {
//     try {
//       const response = await axios.get(
//         'http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=1000',
//       );
//       if (response.data.status && response.data.data.length > 0) {
//         realm.write(() => {
//           response.data.data.forEach((article: any) => {
//             const articleId = new BSON.ObjectId(article._id);
//             let data = {
//               ...article,
//               _id: articleId,
//             };
//             const fav = realm
//               .objects(Favorite.schema.name)
//               .filtered(`articleId == $0`, articleId);
//             if (fav.length > 0) {
//               data['isLiked'] = true;
//             } else {
//               data['isLiked'] = false;
//             }
//             realm.create(
//               TrendingArticle.schema.name,
//               data,
//               Realm.UpdateMode.Modified,
//             );
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     }
//   };

//   const getLatestArticle = async (page: number) => {
//     const res = await fetchLatestArticles({page, search: ''});
//     if (page == 1) {
//       deleteArticles();
//     }
//     if (res.status) {
//       if (res?.response?.articles) {
//         saveManyArticles(res?.response?.articles);
//       }
//     } else {
//       errorLog(res.message);
//     }
//   };

//   const init = async () => {
//     setIsLoading(true); // Start loader
//     setRefreshing(true);
//     await getLatestArticle(1);
//     await fetchTrendingArticles();
//     setIsLoading(false); // Stop loader
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     getCatories();
//     init();
//   }, []);

//   return (
//     <>
//       <AppSafeAreaView>
//         <SafeAreaView />
//         <Header icon={undefined} title={'Trending/Popular New'} />

//         {isLoading ? (
//           // Show loader while data is loading
//           <View style={style.loaderContainer}>
//             <ActivityIndicator size="large" color={Colors.primary} />
//           </View>
//         ) : (
//           <ScrollView showsVerticalScrollIndicator={false}>
//             {trendingArticlesFromRealm.map((item, index) => (
//               <Card
//                 key={index}
//                 {...item}
//                 onClick={() => {
//                   let id;
//                   if (item._id) {
//                     id =
//                       typeof item._id.toHexString === 'function'
//                         ? item._id.toHexString()
//                         : item._id;
//                   } else {
//                     id = item.id;
//                   }

//                   Nav.navigate('Detailedtrend', {
//                     articleId: id,
//                   });
//                 }}
//                 onLike={() => {
//                   toggleLike(item?._id as any);
//                 }}
//               />
//             ))}
//           </ScrollView>
//         )}

//         <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
//       </AppSafeAreaView>
//     </>
//   );
// };

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
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ViewAll;

// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   RefreshControl,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Header from '../news/components/header';
// import FilterModal from '../../components/AppComponents/filterModal';
// import Card from '../../components/AppComponents/card';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';
// import axios from 'axios';
// import {useRealm, useQuery} from '@realm/react';
// import {BSON} from 'realm';
// import TrendingArticle from '../../store/trending/trending.schema';
// import Favorite from '../../store/favorite/favorite.schema';
// import {useToggleTrendingLike} from '../../store/trending/trendinghook';
// import {Colors} from '../../config/colors.config';
// import {moderateScale} from 'react-native-size-matters';
// import {FontStyle} from '../../config/style.config';

// const ViewAll = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();

//   const {toggleLike} = useToggleTrendingLike();

//   const [showFilter, setShowFilter] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [trendingArticles, setTrendingArticles] = useState([]);

//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   // Function to fetch trending articles
//   const fetchTrendingArticles = async () => {
//     try {
//       const response = await axios.get(
//         `http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=${limit}&page=${page}`,
//       );

//       if (response.data.status && response.data.data.length > 0) {
//         realm.write(() => {
//           response.data.data.forEach((article: any) => {
//             const articleId = new BSON.ObjectId(article._id);
//             let data = {
//               ...article,
//               _id: articleId,
//             };
//             const fav = realm
//               .objects(Favorite.schema.name)
//               .filtered(`articleId == $0`, articleId);
//             data['isLiked'] = fav.length > 0;
//             realm.create(
//               TrendingArticle.schema.name,
//               data,
//               Realm.UpdateMode.Modified,
//             );
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     }
//   };

//   const fetchMoreArticles = useCallback(async () => {
//     setRefreshing(true);
//     setLimit(prevLimit => prevLimit + 10); // Increase the limit by 10
//     await fetchTrendingArticles();
//     setRefreshing(false);
//   }, [limit, page]);

//   useEffect(() => {
//     fetchTrendingArticles();
//   }, [limit, page]);

//   return (
//     <>
//       <AppSafeAreaView>
//         <SafeAreaView />
//         <Header icon={undefined} title={'Trending/Popular News'} />

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={fetchMoreArticles}
//             />
//           }>
//           {trendingArticlesFromRealm.map((item, index) => (
//             <Card
//               key={index}
//               {...item}
//               onClick={() => {
//                 let id;
//                 if (item._id) {
//                   id =
//                     typeof item._id.toHexString === 'function'
//                       ? item._id.toHexString()
//                       : item._id;
//                 } else {
//                   id = item.id;
//                 }

//                 Nav.navigate('Detailedtrend', {
//                   articleId: id,
//                 });
//               }}
//               onLike={() => {
//                 toggleLike(item?._id as any);
//               }}
//             />
//           ))}
//         </ScrollView>

//         {/* Favorite Section */}
//         <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
//       </AppSafeAreaView>
//     </>
//   );
// };

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

// export default ViewAll;

// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   SafeAreaView,
//   FlatList,
//   StyleSheet,
//   View,
//   ActivityIndicator,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Header from '../news/components/header';
// import FilterModal from '../../components/AppComponents/filterModal';
// import Card from '../../components/AppComponents/card';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';
// import axios from 'axios';
// import {useRealm, useQuery} from '@realm/react';
// import {BSON} from 'realm';
// import TrendingArticle from '../../store/trending/trending.schema';
// import Favorite from '../../store/favorite/favorite.schema';
// import {useToggleTrendingLike} from '../../store/trending/trendinghook';
// import {Colors} from '../../config/colors.config';
// import {moderateScale} from 'react-native-size-matters';
// import {FontStyle} from '../../config/style.config';

// const ViewAll = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();

//   const {toggleLike} = useToggleTrendingLike();

//   const [showFilter, setShowFilter] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [isLoading, setIsLoading] = useState(false);

//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   // Function to fetch trending articles
//   const fetchTrendingArticles = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=${limit}&page=${page}`,
//       );

//       if (response.data.status && response.data.data.length > 0) {
//         realm.write(() => {
//           response.data.data.forEach((article: any) => {
//             const articleId = new BSON.ObjectId(article._id);
//             let data = {
//               ...article,
//               _id: articleId,
//             };
//             const fav = realm
//               .objects(Favorite.schema.name)
//               .filtered(`articleId == $0`, articleId);
//             data['isLiked'] = fav.length > 0;
//             realm.create(
//               TrendingArticle.schema.name,
//               data,
//               Realm.UpdateMode.Modified,
//             );
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchMoreArticles = useCallback(async () => {
//     setPage(prevPage => prevPage + 1); // Increment the page number
//     await fetchTrendingArticles();
//   }, [page]);

//   useEffect(() => {
//     fetchTrendingArticles();
//   }, [page]);

//   const renderFooter = () => {
//     if (!isLoading) return null;
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   };

//   return (
//     <>
//       <AppSafeAreaView>
//         <SafeAreaView />
//         <Header icon={undefined} title={'Trending/Popular News'} />

//         <FlatList
//           data={trendingArticlesFromRealm}
//           keyExtractor={(item, index) =>
//             item._id ? item._id.toHexString() : `${index}`
//           }
//           renderItem={({item}) => (
//             <Card
//               {...item}
//               onClick={() => {
//                 let id;
//                 if (item._id) {
//                   id =
//                     typeof item._id.toHexString === 'function'
//                       ? item._id.toHexString()
//                       : item._id;
//                 } else {
//                   id = item.id;
//                 }

//                 Nav.navigate('Detailedtrend', {
//                   articleId: id,
//                 });
//               }}
//               onLike={() => {
//                 toggleLike(item?._id as any);
//               }}
//             />
//           )}
//           onEndReached={fetchMoreArticles}
//           onEndReachedThreshold={0.5} // Trigger when 50% from the bottom
//           ListFooterComponent={renderFooter}
//           showsVerticalScrollIndicator={false}
//         />

//         {/* Filter Modal */}
//         <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
//       </AppSafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     paddingVertical: moderateScale(10),
//     alignItems: 'center',
//   },
// });

// export default ViewAll;

import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Header from '../news/components/header';
import Categories from '../../components/AppComponents/categories';
import CategorySection from '../../components/CategorySections';
import AppImage from '../../components/AppImage';
import {Icons, Images, Lottie} from '../../generated/image.assets';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {FontStyle} from '../../config/style.config';
import Card from '../../components/AppComponents/card';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';

import FilterModal from '../../components/AppComponents/filterModal';
import {useCallback, useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
import {fetchLatestArticles} from '../../store/article/article.network';
import {errorLog, infoLog} from '../../utils/debug';
import {
  useGetArticles,
  useGetFavArticles,
  useToggleLikeArticle,
} from '../../store/article/article.hooks';
import {NewsDetailsPropType} from '../newDetail';
import {NewsListType} from '../news/types/enum';
import {NewsPropType} from '../news/types/interface';
import {useCategory} from '../../store/category/category.hooks';
import axios from 'axios';

import {useRealm, useQuery} from '@realm/react';

import {
  useToggleTrendingLike,
  usetrendingFavArticles,
} from '../../store/trending/trendinghook';
import {BSON} from 'realm';
import TrendingArticle from '../../store/trending/trending.schema';
import Favorite from '../../store/favorite/favorite.schema';

const ViewAll = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const {getCatories} = useCategory();
  const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

  const [showFilter, setShowFilter] = useState(false);
  const allArticles = useGetArticles();
  // console.log("allArticles==>>",allArticles)

  const {toggleLike} = useToggleTrendingLike();

  const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
  const latestFavArticles = useGetFavArticles();
  const favArticles = [...trendingFavArticles, ...latestFavArticles];
  // const favArticles = usetrendingFavArticles();
  // const favArticles = useGetFavArticles();
  const [refreshing, setRefreshing] = useState(false);

  const [trendingArticles, setTrendingArticles] = useState([]);
  const trendingArticlesFromRealm = useQuery('TrendingArticle');

  const art = useQuery('Article');

  const fetchTrendingArticles = async () => {
    try {
      const response = await axios.get(
        'http://15.206.16.230:4000/api/v1/android/trendingarticle',
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
            if (fav.length > 0) {
              data['isLiked'] = true;
            } else {
              data['isLiked'] = false;
            }
            realm.create(
              TrendingArticle.schema.name,
              data,
              Realm.UpdateMode.Modified,
            );
          });
        });
        const aa = realm.objects('TrendingArticle');
        // console.log('aa', aa);
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error);
    }
  };

  const getLatestArticle = async (page: number) => {
    const res = await fetchLatestArticles({page, search: ''});
    console.log('first:', res);
    if (page == 1) {
      deleteArticles();
    }
    if (res.status) {
      if (res?.response?.articles) {
        console.log(
          'Fetched Articles-kjcjnejkcbnjekbcjkbc:',
          res?.response?.articles,
        );
        saveManyArticles(res?.response?.articles);
      }
    } else {
      errorLog(res.message);
    }
  };

  const init = async () => {
    setRefreshing(true);
    await getLatestArticle(1);
    await fetchTrendingArticles();

    setRefreshing(false);
  };

  useEffect(() => {
    console.log('RUN/');
    getCatories();
    init();
  }, []);

  return (
    <>
      <AppSafeAreaView>
        <SafeAreaView />
        <Header icon={undefined} title={'Trending/Popular New'} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {trendingArticlesFromRealm.map((item, index) => (
            <Card
              key={index}
              {...item}
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
            />
          ))}
        </ScrollView>

        {/* //favourite section */}

        <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
      </AppSafeAreaView>
    </>
  );
};

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

export default ViewAll;
