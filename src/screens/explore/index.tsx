import {StyleSheet, Image, Text, View} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Header from './components/header';
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
import {useRealm, useQuery} from '@realm/react';
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

// import {useRealm, useQuery} from '@realm/react';

// import {useDeleteTrendingArticles} from '../../store/trending/trendinghook';

import {
  useToggleTrendingLike,
  usetrendingFavArticles,
} from '../../store/trending/trendinghook';
import {BSON} from 'realm';
import TrendingArticle from '../../store/trending/trending.schema';
import Favorite from '../../store/favorite/favorite.schema';
import axios from 'axios';

const Explore = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const {getCatories} = useCategory();

  const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

  const [showFilter, setShowFilter] = useState(false);
  const allArticles = useGetArticles();
  // console.log("allArticles==>>",allArticles)

  const {toggleLike} = useToggleTrendingLike();
  const [favArticless, setFavArticles] = useState([]);
  const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
  const latestFavArticles = useGetFavArticles();
  const combinedFavArticles = [...trendingFavArticles, ...latestFavArticles];
  const favArticles = combinedFavArticles.filter((article, index, self) => {
    return (
      index ===
      self.findIndex(
        t => t._id === article._id || t.id === article.id, // Compare article IDs
      )
    );
  });

  console.log('fav->>>', favArticles);
  // const favArticles = usetrendingFavArticles();
  // const favArticles = useGetFavArticles();
  const [refreshing, setRefreshing] = useState(false);

  const [trendingArticles, setTrendingArticles] = useState([]);
  const trendingArticlesFromRealm = useQuery('TrendingArticle');
  console.log('treding new ->>>', trendingArticlesFromRealm.toJSON());
  const art = useQuery('Article');
  // console.log("latest new ->>>",art.toJSON());
  // const {deleteTrendingArticles} = useDeleteTrendingArticles();

  //new treding articles fetching with data delte admin panel
  const fetchTrendingArticles = async () => {
    try {
      const response = await axios.get(
        'http://15.206.16.230:4000/api/v1/android/trendingarticle',
      );

      if (response.data.status && response.data.data.length > 0) {
        // Get the current articles in the Realm database
        const currentArticles = realm.objects(TrendingArticle.schema.name);

        // Create an array of IDs from the API response
        const fetchedArticleIds = response.data.data.map(
          (article: any) => article._id,
        );

        realm.write(() => {
          // Loop through the response articles and update/create in the Realm database
          response.data.data.forEach((article: any) => {
            const articleId = new BSON.ObjectId(article._id);
            let data = {
              ...article,
              _id: articleId,
            };

            // Check if the article is liked by the user
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

          // Loop through the current articles in the Realm DB
          // Remove articles that are not present in the fetched list (deleted by admin)
          currentArticles.forEach((currentArticle: any) => {
            if (!fetchedArticleIds.includes(currentArticle._id.toString())) {
              realm.delete(currentArticle); // Delete the article from Realm DB
            }
          });
        });
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
        <Header
          onPressFilter={() => {
            setShowFilter(true);
          }}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              colors={[Colors.primary]}
              refreshing={refreshing}
              onRefresh={init}
            />
          }
          showsVerticalScrollIndicator={false}>
          <Categories />
        

          {allArticles.length > 0 && (
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
              titleStyle={style.title}
              headerContainerStyle={style.header}
              left={'View All'}
              moreStyle={style.moreStyle}
              onViewAllPress={() => {
                Nav.navigate('News', {
                  title: 'Latest News',
                  type: NewsListType.Latest,
                  icon: (
                    <LottieView
                      source={Lottie.latest}
                      autoPlay
                      loop
                      style={{
                        width: moderateScale(30),
                        height: moderateScale(30),
                      }}
                    />
                  ),
                } as NewsPropType);
              }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
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
            </CategorySection>
          )}

          {/* //trending section */}

          <CategorySection
            prefixAtTitle={
              <LottieView
                source={Lottie.trending}
                autoPlay
                loop
                style={{width: moderateScale(30), height: moderateScale(30)}}
              />
            }
            title="Trending News"
            titleStyle={style.title}
            headerContainerStyle={style.header}
            left="View All"
            moreStyle={style.moreStyle}
            onViewAllPress={() => Nav.navigate('ViewAll')}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
          </CategorySection>

          {/* //favourite section */}
          {favArticles.length > 0 && (
            <CategorySection
              prefixAtTitle={
                <Image
                  tintColor={Colors.error}
                  source={Icons.ic_love}
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                    marginHorizontal: moderateScale(4),
                  }}
                />
              }
              title={'Favorites News'}
              titleStyle={style.title}
              headerContainerStyle={style.header}
              left={'View All'}
              moreStyle={style.moreStyle}
              onViewAllPress={() => {
                Nav.navigate('Favviewall', {
                  title: 'Favorites News',
                  type: NewsListType.Favourite,
                  icon: (
                    <Image
                      tintColor={Colors.error}
                      source={Icons.ic_love}
                      style={{
                        width: moderateScale(20),
                        height: moderateScale(20),
                        marginHorizontal: moderateScale(4),
                      }}
                    />
                  ),
                } as NewsPropType);
              }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {favArticles.map((item, index) => {
                  return (
                    <Card
                      {...item}
                      key={index}
                      onClick={() => {
                        const id = item._id.toHexString();
                        Nav.navigate('NewsDetail', {
                          _id: id,
                        } as NewsDetailsPropType);
                      }}
                    />
                  );
                })}
              </ScrollView>
            </CategorySection>
          )}

          <View style={{padding: moderateScale(55)}} />
        </ScrollView>
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

export default Explore;

// // testing schema manaual
// import React, {useEffect} from 'react';
// import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
// import axios from 'axios';
// import {useRealm, useQuery} from '@realm/react';
// import TrendingArticle from '../../store/trending/trending.schema';

// const IntailizeApp = () => {
//   const realm = useRealm();

//   // Query to get all TrendingArticles stored in Realm
//   const trendingArticles = useQuery('TrendingArticle');

//   // Fetch data from API and store it in Realm
//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const response = await axios.get(
//           'http://15.206.16.230:4000/api/v1/android/trendingarticle',
//         );
//         if (response.data.status && response.data.data.length > 0) {
//           // Store fetched articles into Realm
//           realm.write(() => {
//             response.data.data.forEach((article: any) => {
//               realm.create(
//                 'TrendingArticle',
//                 {
//                   _id: article._id,
//                   article_id: article.article_id,
//                   title: article.title,
//                   description: article.description,
//                   url: article.url,
//                   urlToImage: article.urlToImage,
//                   publishedAt: article.publishedAt,
//                   content: article.content,
//                   category: article.category,
//                   status: article.status,
//                   isActive: article.isActive,
//                   isTrending: article.isTrending,
//                 },
//                 'modified',
//               ); // 'modified' to update existing entries
//             });
//           });
//           const aa = realm.objects('TrendingArticle');
//           console.log('->>> Trending Articles:', aa);
//         }
//       } catch (error) {
//         console.error('Error fetching articles:', error);
//       }
//     };

//     fetchArticles();
//   }, [realm]);

//   // Render the list of trending articles (image, title, and description)
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Trending Articles</Text>
//       <FlatList
//         data={trendingArticles}
//         keyExtractor={item => item._id}
//         renderItem={({item}) => (
//           <View style={styles.articleItem}>
//             {item.urlToImage ? (
//               <Image
//                 source={{uri: item.urlToImage}}
//                 style={styles.articleImage}
//                 resizeMode="cover"
//               />
//             ) : null}
//             <Text style={styles.articleTitle}>{item.title}</Text>
//             {/* <Text style={styles.articleTitle}>{item.description}</Text> */}
//             <Text style={styles.articleTitle}>{item.content}</Text>

//             <Text style={styles.articleTitle}>{item.publishedAt}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   articleItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   articleImage: {
//     width: '100%',
//     height: 200,
//     marginBottom: 10,
//   },
//   articleTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   articleDescription: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#555',
//   },
// });

// export default IntailizeApp;

// api data of trending in the realm confirm
// import React, {useEffect, useState} from 'react';
// import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
// import axios from 'axios';
// import {useRealm, useQuery} from '@realm/react';
// import TrendingArticle from '../../store/trending/trending.schema';

// const IntailizeApp = () => {
//   const realm = useRealm();
//   const [error, setError] = useState(''); // State to manage error messages

//   // Query to get all TrendingArticles stored in Realm
//   const trendingArticles = useQuery('TrendingArticle');

//   // Fetch data from API and store it in Realm
//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const response = await axios.get(
//           'http://15.206.16.230:4000/api/v1/android/trendingarticle',
//         );
//         if (response.data.status && response.data.data.length > 0) {
//           // Store fetched articles into Realm
//           realm.write(() => {
//             response.data.data.forEach((article: any) => {
//               if (!article.article_id) {
//                 console.warn('Missing article_id for article:', article);
//                 return; // Skip articles missing article_id
//               }

//               realm.create(
//                 'TrendingArticle', // Corrected the typo here from 'TrendingArtile' to 'TrendingArticle'
//                 {
//                   _id: article._id,
//                   article_id: article.article_id, // Ensure this is always available
//                   title: article.title,
//                   description: article.description,
//                   url: article.url,
//                   urlToImage: article.urlToImage,
//                   publishedAt: article.publishedAt,
//                   content: article.content,
//                   category: article.category,
//                   status: article.status,
//                   isActive: article.isActive,
//                   isTrending: article.isTrending,
//                 },
//                 'modified', // 'modified' to update existing entries
//               );
//             });
//           });
//           const aa = realm.objects('TrendingArticle');
//           console.log('->>> Trending Articles:', aa);
//         }
//       } catch (error) {
//         console.error('Error fetching articles:', error);
//         setError('An error occurred while fetching the articles.'); // Set the error message
//       }
//     };

//     fetchArticles();
//   }, [realm]);

//   // Render the list of trending articles (image, title, and description)
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Trending Artices</Text>
//       {error ? ( // Conditionally render the error message if there's an error
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <FlatList
//           data={trendingArticles}
//           keyExtractor={item => item._id}
//           renderItem={({item}) => (
//             <View style={styles.articleItem}>
//               {item.urlToImage && (
//                 <Image
//                   source={{uri: item.urlToImage}}
//                   style={styles.articleImage}
//                   resizeMode="cover"
//                 />
//               )}
//               <Text style={styles.articleTitle}>{item.title}</Text>
//               <Text style={styles.articleDescription}>{item.description}</Text>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   articleItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   articleImage: {
//     width: '100%',
//     height: 200,
//     marginBottom: 10,
//   },
//   articleTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   articleDescription: {
//     fontSize: 14,
//     color: '#555',
//   },
//   errorText: {
//     color: 'red', // Style the error message
//     fontSize: 16,
//     marginBottom: 20,
//   },
// });

// export default IntailizeApp;

// Main code
// // original code of explore after garv fix

// import {
//   Image,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Header from './components/header';
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

// import {useToggleTrendingLike} from '../../store/trending/trendinghook';
// import {BSON} from 'realm';
// import TrendingArticle from '../../store/trending/trending.schema';
// import Favorite from '../../store/favorite/favorite.schema';

// const Explore = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const {getCatories} = useCategory();
//   const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

//   const [showFilter, setShowFilter] = useState(false);
//   const allArticles = useGetArticles();
//   // console.log("allArticles==>>",allArticles)

//   const {toggleLike} = useToggleTrendingLike();

//   const favArticles = useGetFavArticles();
//   const [refreshing, setRefreshing] = useState(false);

//   const [trendingArticles, setTrendingArticles] = useState([]);
//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   const art = useQuery('Article');

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
//         console.log('aa', aa);
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
//         <Header
//           onPressFilter={() => {
//             setShowFilter(true);
//           }}
//         />
//         <ScrollView
//           refreshControl={
//             <RefreshControl
//               colors={[Colors.primary]}
//               refreshing={refreshing}
//               onRefresh={init}
//             />
//           }
//           showsVerticalScrollIndicator={false}>
//           <Categories />
//           {/* //latest new section */}

//           {allArticles.length > 0 && (
//             <CategorySection
//               prefixAtTitle={
//                 <LottieView
//                   source={Lottie.latest}
//                   autoPlay
//                   loop
//                   style={{width: moderateScale(30), height: moderateScale(30)}}
//                 />
//               }
//               title={'Latest News'}
//               titleStyle={style.title}
//               headerContainerStyle={style.header}
//               left={'View All'}
//               moreStyle={style.moreStyle}
//               onViewAllPress={() => {
//                 Nav.navigate('News', {
//                   title: 'Latest News',
//                   type: NewsListType.Latest,
//                   icon: (
//                     <LottieView
//                       source={Lottie.latest}
//                       autoPlay
//                       loop
//                       style={{
//                         width: moderateScale(30),
//                         height: moderateScale(30),
//                       }}
//                     />
//                   ),
//                 } as NewsPropType);
//               }}>
//               <ScrollView
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}>
//                 {allArticles.map((item, index) => {
//                   return (
//                     <Card
//                       key={index}
//                       onClick={() => {
//                         const id = item._id.toHexString();
//                         Nav.navigate('NewsDetail', {
//                           _id: id,
//                         } as NewsDetailsPropType);
//                       }}
//                       {...item}
//                     />
//                   );
//                 })}
//               </ScrollView>
//             </CategorySection>
//           )}

//           {/* //trending section */}
//           <CategorySection
//             prefixAtTitle={
//               <LottieView
//                 source={Lottie.trending}
//                 autoPlay
//                 loop
//                 style={{width: moderateScale(30), height: moderateScale(30)}}
//               />
//             }
//             title="Trending News"
//             titleStyle={style.title}
//             headerContainerStyle={style.header}
//             left="View All"
//             moreStyle={style.moreStyle}
//             onViewAllPress={() => Nav.navigate('ViewAll')}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {trendingArticlesFromRealm.map((item, index) => (
//                 <Card
//                   key={index}
//                   {...item}
//                   onClick={() => {
//                     let id;
//                     if (item._id) {
//                       id =
//                         typeof item._id.toHexString === 'function'
//                           ? item._id.toHexString()
//                           : item._id;
//                     } else {
//                       id = item.id;
//                     }

//                     Nav.navigate('Detailedtrend', {
//                       articleId: id,
//                     });
//                   }}
//                   onLike={() => {
//                     toggleLike(item?._id as any);
//                   }}
//                 />
//               ))}
//             </ScrollView>
//           </CategorySection>
//           {/* //favourite section */}
//           {favArticles.length > 0 && (
//             <CategorySection
//               prefixAtTitle={
//                 <Image
//                   tintColor={Colors.error}
//                   source={Icons.ic_love}
//                   style={{
//                     width: moderateScale(20),
//                     height: moderateScale(20),
//                     marginHorizontal: moderateScale(4),
//                   }}
//                 />
//               }
//               title={'Favorites News'}
//               titleStyle={style.title}
//               headerContainerStyle={style.header}
//               left={'View All'}
//               moreStyle={style.moreStyle}
//               onViewAllPress={() => {
//                 Nav.navigate('Favviewall', {
//                   title: 'Favorites News',
//                   type: NewsListType.Favourite,
//                   icon: (
//                     <Image
//                       tintColor={Colors.error}
//                       source={Icons.ic_love}
//                       style={{
//                         width: moderateScale(20),
//                         height: moderateScale(20),
//                         marginHorizontal: moderateScale(4),
//                       }}
//                     />
//                   ),
//                 } as NewsPropType);
//               }}>
//               <ScrollView
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}>
//                 {favArticles.map((item, index) => {
//                   return (
//                     <Card
//                       {...item}
//                       key={index}
//                       onClick={() => {
//                         const id = item._id.toHexString();
//                         Nav.navigate('NewsDetail', {
//                           _id: id,
//                         } as NewsDetailsPropType);
//                       }}
//                     />
//                   );
//                 })}
//               </ScrollView>
//             </CategorySection>
//           )}

//           <View style={{padding: moderateScale(55)}} />
//         </ScrollView>
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

// export default Explore;

//filter functionality by Filter Api
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   RefreshControl,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import CategorySection from '../../components/CategorySections';
// import Card from '../../components/AppComponents/card';
// import axios from 'axios';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {Colors} from '../../config/colors.config';
// import {moderateScale} from 'react-native-size-matters';

// interface Article {
//   _id: string;
//   article_id: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
//   content: string;
//   category: string;
//   status: string;
//   isActive: boolean;
//   isTrending: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// const Explore = () => {
//   const navigation = useNavigation<NavigationProp<any>>();
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);
//   const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const categories: string[] = ['Physical Health', 'Technology Health']; // Categories to choose from

//   // Fetch trending articles by default
//   const fetchTrendingArticles = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get<{data: {articles: Article[]}}>(
//         'http://15.206.16.230:4000/api/v1/android/trendingarticle',
//       );
//       if (response.data.data.length > 0) {
//         setTrendingArticles(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//       setTrendingArticles([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch articles by category
//   const fetchCategoryArticles = async (category: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.get<{data: {articles: Article[]}}>(
//         'http://15.206.16.230:4000/api/v1/android/filterData/',
//         {params: {category}},
//       );
//       if (response.data.data && response.data.data.articles) {
//         setCategoryArticles(response.data.data.articles);
//       } else {
//         setCategoryArticles([]);
//       }
//     } catch (error) {
//       console.error('Error fetching category articles:', error);
//       setCategoryArticles([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Apply Filter
//   const applyFilter = () => {
//     if (selectedCategory) {
//       fetchCategoryArticles(selectedCategory); // Fetch articles based on selected category
//     } else {
//       fetchTrendingArticles(); // If no category is selected, show trending articles
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//     setCategoryArticles([]); // Clear previous articles when a new category is selected
//     fetchTrendingArticles(); // Show trending articles first when a category is selected
//   };

//   // Handle deselecting category (set to null)
//   const handleCategoryDeselect = () => {
//     setSelectedCategory(null);
//     setCategoryArticles([]); // Clear articles when no category is selected
//     fetchTrendingArticles(); // Show trending articles
//   };

//   // Fetch trending articles when the component mounts
//   useEffect(() => {
//     fetchTrendingArticles();
//   }, []);

//   return (
//     <AppSafeAreaView>
//       {/* Category Buttons */}
//       <View style={styles.buttonContainer}>
//         {categories.map(cat => (
//           <TouchableOpacity
//             key={cat}
//             style={[
//               styles.categoryButton,
//               selectedCategory === cat && styles.activeCategoryButton,
//             ]}
//             onPress={() =>
//               selectedCategory === cat
//                 ? handleCategoryDeselect() // Deselect the category if it is already selected
//                 : handleCategorySelect(cat)
//             }>
//             <Text
//               style={[
//                 styles.categoryButtonText,
//                 selectedCategory === cat && styles.activeCategoryButtonText,
//               ]}>
//               {cat}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Apply Filter Button */}
//       <View style={styles.applyButtonContainer}>
//         <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
//           <Text style={styles.applyButtonText}>Apply Filter</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Main Content */}
//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             colors={[Colors.primary]}
//             refreshing={refreshing}
//             onRefresh={() => {
//               if (selectedCategory) {
//                 fetchCategoryArticles(selectedCategory);
//               } else {
//                 fetchTrendingArticles();
//               }
//             }}
//           />
//         }
//         showsVerticalScrollIndicator={false}>
//         <CategorySection
//           title={selectedCategory ? selectedCategory : 'Trending Articles'}>
//           {loading ? (
//             <Text>Loading...</Text>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {/* Display category articles if a category is selected or trending articles if no category is selected */}
//               {(selectedCategory ? categoryArticles : trendingArticles).length >
//               0 ? (
//                 (selectedCategory ? categoryArticles : trendingArticles).map(
//                   (item, index) => (
//                     <Card
//                       key={index}
//                       {...item}
//                       onClick={() => {
//                         navigation.navigate('Detailedtrend', {
//                           articleId: item._id,
//                         });
//                       }}
//                     />
//                   ),
//                 )
//               ) : (
//                 <ScrollView horizontal >
//                   {/* No articles for the selected category, display trending articles instead */}
//                   {trendingArticles.map((item, index) => (
//                     <Card

//                       key={index}
//                       {...item}
//                       onClick={() => {
//                         navigation.navigate('Detailedtrend', {
//                           articleId: item._id,
//                         });
//                       }}
//                     />
//                   ))}
//                 </ScrollView>
//               )}
//             </ScrollView>
//           )}
//         </CategorySection>
//         <View style={{padding: moderateScale(55)}} />
//       </ScrollView>
//     </AppSafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 40,
//   },
//   categoryButton: {
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: '#ccc',
//   },
//   activeCategoryButton: {
//     backgroundColor: '#007BFF',
//   },
//   categoryButtonText: {
//     color: '#000',
//     fontSize: 16,
//   },
//   activeCategoryButtonText: {
//     color: '#fff',
//   },
//   applyButtonContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   applyButton: {
//     backgroundColor: '#007BFF',
//     padding: 12,
//     borderRadius: 5,
//   },
//   applyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default Explore;
