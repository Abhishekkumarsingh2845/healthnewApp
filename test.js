{/* <CategorySection
prefixAtTitle={
  <LottieView
    source={Lottie.trending}
    autoPlay
    loop
    style={{width: moderateScale(30), height: moderateScale(30)}}
  />
}
title={'Trending/Popular News'}
titleStyle={style.title}
headerContainerStyle={style.header}
left={'View All'}
moreStyle={style.moreStyle}
onViewAllPress={() => {
  Nav.navigate('News', {
    title: 'Trending/Popular News',
    icon: (
      <LottieView
        source={Lottie.trending}
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
</CategorySection> */}


































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
// } from '../../store/article/article.hooks';
// import {NewsDetailsPropType} from '../newDetail';
// import InfiniteList from '../../components/InfiniteList';
// import {ArticleType} from '../../store/article/article.interface';
// import {fetchLatestArticles} from '../../store/article/article.network';
// import {
//   deleteArticles,
//   saveManyArticles,
// } from '../../store/article/article.service';
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
//         {/* <ScrollView showsVerticalScrollIndicator={false}> */}
//         {/* <View style={[Style.flexRow, { alignItems: 'center', gap: moderateScale(3), marginTop: Spacing.topSpace, alignSelf: 'center', justifyContent: 'center', width: '100%' }]}>
//                     <BackButton color={Colors.black} size={moderateScale(20)}
//                         style={{
//                             left: 0
//                         }}
//                     />
//                     {params.icon}
//                     <Text style={[FontStyle.bold, { color: Colors.black }]} >{params.title}</Text>
//                 </View> 
//      */}

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
//                 <View style={{padding: '12%'}}></View>
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






















//manaual api trending fuction
 // const getTrendingArticles = async (page: number) => {
  //   try {
  //     const res = await axios.get(
  //       'http://15.206.16.230:4000/api/v1/android/trendingarticle',
  //     );
  //     if (res.data.status) {
  //       setTrendingArticles(res.data.data); // Save fetched data to state
  //     } else {
  //       errorLog(res.data.message);
  //     }
  //   } catch (error) {
  //     errorLog('Error fetching trending articles: ', error);
  //   }
  // };

  // await getTrendingArticles(1);





    {/* //manaual api trending  */}
          {/* {trendingArticles.length > 0 && (
            <CategorySection
              prefixAtTitle={
                <LottieView
                  source={Lottie.trending}
                  autoPlay
                  loop
                  style={{width: moderateScale(30), height: moderateScale(30)}}
                />
              }
              title={'Trending/Popular News'}
              titleStyle={style.title}
              headerContainerStyle={style.header}
              left={'View All'}
              moreStyle={style.moreStyle}
              onViewAllPress={() => {
                Nav.navigate('News', {
                  title: 'Trending/Popular News',
                  icon: (
                    <LottieView
                      source={Lottie.trending}
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
                {trendingArticles.map((item, index) => {
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
          )} */}






















// import React, {useEffect} from 'react';
// import {View, Text, FlatList, Button, StyleSheet} from 'react-native';
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
//         }
//       } catch (error) {
//         console.error('Error fetching articles:', error);
//       }
//     };

//     fetchArticles();
//   }, [realm]);

//   // Render the list of trending articles
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Trending Articles</Text>
//       <FlatList
//         data={trendingArticles}
//         keyExtractor={item => item._id}
//         renderItem={({item}) => (
//           <View style={styles.articleItem}>
//             <Text>{item.title}</Text>
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
// });

// export default IntailizeApp;






















// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   ScrollView,
//   RefreshControl,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import axios from 'axios';
// import {useRealm, useQuery} from '@realm/react';
// import {useNavigation} from '@react-navigation/native';
// import LottieView from 'lottie-react-native';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle} from '../../config/style.config';
// import {NewsListType, NewsPropType} from '../news/types/enum';
// import {NewsDetailsPropType} from '../newDetail';
// import {fetchLatestArticles} from '../../store/article/article.network';
// import {useCategory} from '../../store/category/category.hooks';
// import {
//   useToggleLikeArticle,
//   useGetArticles,
//   useGetFavArticles,
// } from '../../store/article/article.hooks';
// import {errorLog} from '../../utils/debug';
// import Card from '../../components/AppComponents/card';
// import CategorySection from '../../components/CategorySections';
// import FilterModal from '../../components/AppComponents/filterModal';
// import Header from './components/header';
// import Categories from '../../components/AppComponents/categories';
// import TrendingArticle from '../../store/trending/trending.schema';
// import { Lottie } from '../../generated/image.assets';

// const Explore = () => {
//   const Nav = useNavigation();
//   const realm = useRealm();
//   const {getCatories} = useCategory();
//   const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

//   // State
//   const [showFilter, setShowFilter] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [trendingArticles, setTrendingArticles] = useState([]); // For Trending Articles

//   const allArticles = useGetArticles(); // Latest Articles
//   const favArticles = useGetFavArticles(); // Favorite Articles

//   // Query for Trending Articles in Realm
//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   // Fetch Latest Articles from API
//   const getLatestArticle = async (page: number) => {
//     const res = await fetchLatestArticles({page, search: ''});
//     if (page === 1) {
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

//   // Fetch Trending Articles from API and store in Realm
//   const fetchTrendingArticles = async () => {
//     try {
//       const response = await axios.get(
//         'http://15.206.16.230:4000/api/v1/android/trendingarticle',
//       );
//       if (response.data.status && response.data.data.length > 0) {
//         realm.write(() => {
//           response.data.data.forEach((article: any) => {
//             realm.create(
//               'TrendingArticle',
//               {
//                 _id: article._id,
//                 article_id: article.article_id,
//                 title: article.title,
//                 description: article.description,
//                 url: article.url,
//                 urlToImage: article.urlToImage,
//                 publishedAt: article.publishedAt,
//                 content: article.content,
//                 category: article.category,
//                 status: article.status,
//                 isActive: article.isActive,
//                 isTrending: article.isTrending,
//               },
//               'modified',
//             );
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     }
//   };

//   const init = async () => {
//     setRefreshing(true);
//     await getLatestArticle(1);
//     await fetchTrendingArticles();
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     getCatories();
//     init();
//   }, []);

//   return (
//     <>
//       <View style={styles.container}>
//         <Header onPressFilter={() => setShowFilter(true)} />
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

//           {/* Latest News Section */}
//           {allArticles.length > 0 && (
//             <CategorySection
//               prefixAtTitle={
//                 <LottieView
//                 source={Lottie.latest}
//                   autoPlay
//                   loop
//                   style={styles.lottie}
//                 />
//               }
//               title="Latest News"
//               titleStyle={styles.title}
//               headerContainerStyle={styles.header}
//               left="View All"
//               moreStyle={styles.moreStyle}
//               onViewAllPress={() =>
//                 Nav.navigate('News', {
//                   title: 'Latest News',
//                   type: NewsListType.Latest,
//                 })
//               }>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {allArticles.map((item, index) => (
//                   <Card
//                     key={index}
//                     {...item}
//                     onClick={() =>
//                       Nav.navigate('NewsDetail', {_id: item._id.toHexString()})
//                     }
//                   />
//                 ))}
//               </ScrollView>
//             </CategorySection>
//           )}

//           {/* Trending News Section */}
//           <CategorySection
//             prefixAtTitle={
//               <LottieView
//               source={Lottie.latest}
//                 autoPlay
//                 loop
//                 style={styles.lottie}
//               />
//             }
//             title="Trending News"
//             titleStyle={styles.title}
//             headerContainerStyle={styles.header}
//             left="View All"
//             moreStyle={styles.moreStyle}
//             onViewAllPress={() =>
//               Nav.navigate('News', {
//                 title: 'Trending News',
//                 type: NewsListType.Trending,
//               })
//             }>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {trendingArticlesFromRealm.map((item, index) => (
//                 <Card
//                   key={index}
//                   {...item}
//                   onClick={() =>
//                     Nav.navigate('NewsDetail', {_id: item._id.toHexString()})
//                   }
//                 />
//               ))}
//             </ScrollView>
//           </CategorySection>

//           {/* Favorite News Section */}
//           {favArticles.length > 0 && (
//             <CategorySection
//               prefixAtTitle={
//                 <Image
                
                
                
//                 />
//               }
//               title="Favorite News"
//               titleStyle={styles.title}
//               headerContainerStyle={styles.header}
//               left="View All"
//               moreStyle={styles.moreStyle}
//               onViewAllPress={() =>
//                 Nav.navigate('News', {
//                   title: 'Favorite News',
//                   type: NewsListType.Favorite,
//                 })
//               }>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {favArticles.map((item, index) => (
//                   <Card
//                     key={index}
//                     {...item}
//                     onClick={() =>
//                       Nav.navigate('NewsDetail', {_id: item._id.toHexString()})
//                     }
//                   />
//                 ))}
//               </ScrollView>
//             </CategorySection>
//           )}

//           <View style={{padding: moderateScale(55)}} />
//         </ScrollView>
//         <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
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
//   lottie: {
//     width: moderateScale(30),
//     height: moderateScale(30),
//   },
//   icon: {
//     width: moderateScale(20),
//     height: moderateScale(20),
//     marginHorizontal: moderateScale(4),
//   },
// });

// export default Explore;












  {/* ///here is the original categories of trending section
          <CategorySection
            prefixAtTitle={
              <LottieView
                source={Lottie.trending}
                autoPlay
                loop
                style={{width: moderateScale(30), height: moderateScale(30)}}
              />
            }
            title={'Trending/Popular News'}
            titleStyle={style.title}
            headerContainerStyle={style.header}
            left={'View All'}
            moreStyle={style.moreStyle}
            onViewAllPress={() => {
              Nav.navigate('News', {
                title: 'Trending/Popular News',
                icon: (
                  <LottieView
                    source={Lottie.trending}
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









  //new treding articles fetching without data delte admin panel
  // const fetchTrendingArticles = async () => {
  //   try {
  //     const response = await axios.get(
  //       'http://15.206.16.230:4000/api/v1/android/trendingarticle',
  //     );
  //     if (response.data.status && response.data.data.length > 0) {
  //       realm.write(() => {
  //         response.data.data.forEach((article: any) => {
  //           const articleId = new BSON.ObjectId(article._id);
  //           let data = {
  //             ...article,
  //             _id: articleId,
  //           };
  //           const fav = realm
  //             .objects(Favorite.schema.name)
  //             .filtered(`articleId == $0`, articleId);

  //           if (fav.length > 0) {
  //             data['isLiked'] = true;
  //           } else {
  //             data['isLiked'] = false;
  //           }

  //           realm.create(
  //             TrendingArticle.schema.name,
  //             data,
  //             Realm.UpdateMode.Modified,
  //           );
  //         });
  //       });
  //       const aa = realm.objects('TrendingArticle');
  //       // console.log('aa', aa);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching trending articles:', error);
  //   }
  // };








   // favourite functionality  with duplicate
  // const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
  // const latestFavArticles = useGetFavArticles();
  // const favArticles = [...trendingFavArticles, ...latestFavArticles];














import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput } from 'react-native';

const PublishedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Make the API request when the component mounts
    fetch('http://15.206.16.230:4000/api/v1/android/published-articles?search=test')
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setArticles(data.data.articles); // Set the articles from the response
          setFilteredArticles(data.data.articles); // Initially display all articles
        }
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter articles based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredArticles(articles); // Show all articles if search query is empty
    } else {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // Show a loading text while fetching data
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Published Articles</Text>
       Search Bar 
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.articleContainer}>
            <Image source={{ uri: item.urlToImage }} style={styles.articleImage} />
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleDescription}>{item.description}</Text>
            <Text style={styles.articleCategory}>Category: {item.category}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 8,
  },
  articleContainer: {
    marginBottom: 20,
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  articleDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  articleCategory: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
});

export default PublishedArticles;














































show  latest new by deafult and filter wise 


import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Header from './components/header';
import Categories from '../../components/AppComponents/categories';
import CategorySection from '../../components/CategorySections';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../../config/colors.config';
import { FontStyle } from '../../config/style.config';
import Card from '../../components/AppComponents/card';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchLatestArticles } from '../../store/article/article.network';
import { useCategory } from '../../store/category/category.hooks';
import { Lottie } from '../../generated/image.assets';
const Explore = () => {
  const Nav = useNavigation();
  const { getCatories } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState(''); // Default is an empty string
  const [allArticles, setAllArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticles = async () => {
    const res = await fetchLatestArticles({ page: 1, search: '' });
    if (res.status) {
      setAllArticles(res.response.articles);
    }
  };

  // If no category is selected, show all articles
  const filteredArticles = selectedCategory
    ? allArticles.filter(item => item.category === selectedCategory)
    : allArticles; // Show all articles if no category is selected

  const init = async () => {
    setRefreshing(true);
    await fetchArticles();
    setRefreshing(false);
  };

  useEffect(() => {
    getCatories();
    init();
  }, []);

  const toggleCategorySelection = (category) => {
    // If the same category is selected again, unselect it (reset to show all articles)
    setSelectedCategory(prevCategory => prevCategory === category ? '' : category);
  };

  return (
    <AppSafeAreaView>
      <Header />
      <View style={style.categoryButtonsContainer}>
        <TouchableOpacity
          style={style.categoryButton}
          onPress={() => toggleCategorySelection('Technology Health')}>
          <Text style={style.categoryButtonText}>Technology Health</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.categoryButton}
          onPress={() => toggleCategorySelection('Physical Health')}>
          <Text style={style.categoryButtonText}>Physical Health</Text>
        </TouchableOpacity>
      </View>
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

        <CategorySection
          prefixAtTitle={
            <LottieView
              source={Lottie.latest}
              autoPlay
              loop
              style={{ width: moderateScale(30), height: moderateScale(30) }}
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
            });
          }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {filteredArticles.map((item, index) => (
              <Card
                key={index}
                onClick={() => {
                  Nav.navigate('NewsDetail', {
                    _id: item._id.toHexString(),
                  });
                }}
                {...item}
              />
            ))}
          </ScrollView>
        </CategorySection>
      </ScrollView>
    </AppSafeAreaView>
  );
};



const style = StyleSheet.create({
  categoryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(20),
    paddingHorizontal: moderateScale(20),
  },
  categoryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(5),
  },
  categoryButtonText: {
    color: Colors.white,
    fontSize: moderateScale(14),
    ...FontStyle.titleSemibold,
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

export default Explore;




























































































































































































import React from 'react';
import {StyleSheet, Image, Text, View, StatusBar} from 'react-native';
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
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
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
// import messaging, {
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
import {
  useToggleTrendingLike,
  usetrendingFavArticles,
  useDeleteTrendingArticles,
} from '../../store/trending/trendinghook';
import {BSON} from 'realm';
import TrendingArticle from '../../store/trending/trending.schema';
import Favorite from '../../store/favorite/favorite.schema';
import axios from 'axios';
import FilterCategory from '../../store/filtercategory/filtercatergory.schema';
import Datesch from '../../store/trending/datee/date.schema';
import {Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {getMessaging} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const Explore = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const {getCatories} = useCategory();
//   const {saveManyArticles, deleteArticles} = useToggleLikeArticle();
//   const [showFilter, setShowFilter] = useState(false);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [selectedStartDate, setSelectedStartDate] = useState('');
//   const [selectedEndDate, setSelectedEndDate] = useState('');
//   const [fetchedCategory, setFetchedCategory] = useState<string | null>(null);
//   const allArticles = useGetArticles();
//   const isFocus = useIsFocused();
//   // console.log('allArticles==>>', allArticles);
//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const storedCategory = await AsyncStorage.getItem('reveersefilter');
//         if (storedCategory !== null) {
//           setFetchedCategory(storedCategory); // Update the state with the fetched category
//           setActiveCategoryAndStore(storedCategory); // Also update the active category
//         }
//       } catch (error) {
//         console.error('Failed to fetch category from AsyncStorage:', error);
//       }
//     };

//     fetchCategory();
//   }, []);
//   // console.log('->>>>> top 10', allArticles);
//   // console.log('allart', allArticles);
//   const {toggleLike} = useToggleTrendingLike();

//   const [favArticless, setFavArticles] = useState([]);

//   const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
//   const latestFavArticles = useGetFavArticles();

//   const combinedFavArticlesMap = new Map();

//   trendingFavArticles.forEach(article => {
//     const id = article._id?.toString() || article.id;
//     combinedFavArticlesMap.set(id, {...article, source: 'trending'}); // Add source
//   });

//   latestFavArticles.forEach(article => {
//     const id = article._id?.toString() || article.id;
//     combinedFavArticlesMap.set(id, {...article, source: 'latest'}); // Add source
//   });

//   const saveTokenToApi = async (deviceId, fcmToken) => {
//     try {
//       const response = await axios.post(
//         'http://15.206.16.230:4000/api/v1/android/savingtokendata',
//         {
//           deviceId: deviceId,
//           fcmToken: fcmToken,
//         },
//       );
//       console.log('Response:', response.data);
//       // if (response.data.message) {
//       //   Alert.alert('Success', response.data.message);
//       // }
//     } catch (error) {
//       console.error('Error saving token to API:', error);
//       Alert.alert('Error', 'Failed to save token to API');
//     }
//   };

//   const getFCMToken = async () => {
//     try {
//       // Register the device for remote messages
//       await getMessaging().registerDeviceForRemoteMessages();

//       // Now retrieve the FCM token
//       const fcmToken = await getMessaging().getToken();
//       console.log('FCM Token:', fcmToken);

//       const deviceId = await DeviceInfo.getUniqueId();
//       console.log('Device ID:', deviceId);

//       // Save the token to the API
//       saveTokenToApi(deviceId, fcmToken);
//     } catch (error) {
//       console.error('Error initializing FCM:', error);
//     }
//   };
//   // Convert map to array
//   const combinedFavArticles = Array.from(combinedFavArticlesMap.values());
//   // console.log('vvv-----------------------', combinedFavArticles);
//   // console.log('-0000', typeof combinedFavArticles);
//   // Console log the source of each article
//   combinedFavArticles.forEach(article => {
//     console.log(
//       `Article ID: ${article._id || article.id}, Source: ${article.source}`,
//     );
//   });

//   const trendingArticlesSource = combinedFavArticles
//     .filter(article => article.source === 'trending')
//     .map(article => article.source); // This will store an array of "trending"
//   // console.log('variable', trendingArticlesSource);
//   // console.log(
//   //   'type of thetrendingArticlesSource ->>>>>>>>',
//   //   typeof trendingArticlesSource,
//   // );
//   const [refreshing, setRefreshing] = useState(false);
//   const [trendingArticles, setTrendingArticles] = useState([]);
//   const trendingArticlesFromRealm = useQuery('TrendingArticle').sorted(
//     'updatedAt',
//     true,
//   );
//   // console.log('schema data of treding', trendingArticlesFromRealm.toJSON());
//   const firstFiveArticles = trendingArticlesFromRealm.toJSON().slice(0, 10);
//   // console.log('First Five Articles:', firstFiveArticles);
//   const art = useQuery('Article');

//   // console.log('schema data of latest', art.toJSON());

//   const startDate = new Date('2024-12-17T06:43:40.179Z');
//   const endDate = new Date('2024-12-17T06:49:07.000Z');
//   const fsss = allArticles.filter(article => {
//     const updatedAt = new Date(article.updatedAt).getTime();
//     return updatedAt >= startDate.getTime() && updatedAt <= endDate.getTime();
//   });
//   // console.log('Filtered Articles:', fsss);

//   //new treding articles fetching with data delte admin panel
//   const fetchTrendingArticles = async () => {
//     // const {deleteTrendingArticles} = useDeleteTrendingArticles();
//     try {
//       // deleteTrendingArticles();
//       const response = await axios.get(
//         'http://15.206.16.230:4000/api/v1/android/trendingarticle',
//       );
//       // deleteTrendingArticles();
//       const aa = response.data;
//       // console.log('Api data of the trending response', aa);

//       if (response.data.status && response.data.data.length > 0) {
//         const currentArticles = realm.objects(TrendingArticle.schema.name);

//         const fetchedArticleIds = response.data.data.map(
//           (article: any) => article._id,
//         );

//         realm.write(() => {
//           // deleteTrendingArticles();
//           response.data.data.forEach((article: any) => {
//             const articleId = new BSON.ObjectId(article._id);
//             let data = {
//               ...article,
//               _id: articleId,
//               category: article.category || 'defaultCategory', //his i have chnaged
//             };

//             const fav = realm
//               .objects(Favorite.schema.name)
//               .filtered(`articleId == $0`, articleId);
//             data['isLiked'] = fav.length > 0;

//             // Create or modify the trending article in the Realm database
//             realm.create(
//               TrendingArticle.schema.name,
//               data,
//               Realm.UpdateMode.Modified,
//             );
//           });

//           currentArticles.forEach((currentArticle: any) => {
//             if (!fetchedArticleIds.includes(currentArticle._id.toString())) {
//               realm.delete(currentArticle); // Delete the article from Realm DB
//             }
//           });
//         });
//       } else {
//         console.log('no artilces');
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     }
//   };

//   const getLatestArticle = async (page: number) => {
//     const res = await fetchLatestArticles({page, search: ''});
//     // console.log('first:', res);
//     if (page == 1) {
//       deleteArticles();
//     }
//     if (res.status) {
//       if (res?.response?.articles) {
//         const ss = res?.response?.articles;
//         // console.log('Api data of the latest', ss);
//         saveManyArticles(res?.response?.articles);
//         // console.log('datattttattatatatatta', saveManyArticles);
//       }
//     } else {
//       errorLog(res.message);
//     }
//   };

//   //two for Latest
//   const filteredArticles =
//     activeCategory === 'All'
//       ? allArticles
//       : allArticles.filter(article => article.category === activeCategory);
//   //two for Trending
//   const filteredTrendingArticles =
//     activeCategory === 'All'
//       ? trendingArticlesFromRealm
//       : trendingArticlesFromRealm.filter(
//           article => article.category === activeCategory,
//         );

//   const init = async () => {
//     // setRefreshing(true);
//     await getLatestArticle(1);
//     await fetchTrendingArticles();
//     setRefreshing(false);
//   };

//   const flt = useQuery(FilterCategory);

//   useEffect(() => {}, [flt]);
//   // console.log('xxxxx', flt);
//   const nameret = flt.map(xx => xx.name);
//   // console.log('-----', nameret);
//   const oo = allArticles;
//   // console.log('000-', oo);
//   const ll = typeof nameret;
//   // console.log('types of the vair', ll);

//   const filtercat = allArticles.filter(article =>
//     nameret.includes(article.category),
//   );
//   // console.log('Filtered Articles:', filtercat);

//   const [startDa, setStartDa] = useState<string>('');
//   const [endDa, setEndDa] = useState<string>('');
//   useEffect(() => {
//     const fetchDates = async () => {
//       const dates = realm.objects(Datesch);

//       if (dates.length > 0 && dates[0].isButtonPressed) {
//         setStartDa(dates[0].startDate);
//         setEndDa(dates[0].endDate);
//       } else {
//         // Reset state if Datesch is empty
//         setStartDa('');
//         setEndDa('');
//       }
//     };
//     fetchDates();
//     const listener = () => fetchDates();
//     realm.objects(Datesch).addListener(listener);

//     return () => {
//       // Cleanup listener when component unmounts
//       realm.objects(Datesch).removeListener(listener);
//     };
//   }, []);
//   const d = realm.objects(Datesch);

//   const normalizeDate = (date: string | number | Date) => {
//     const d = new Date(date);
//     d.setHours(0, 0, 0, 0); // Set time to midnight to compare only the date part
//     return d;
//   };

//   const fi = allArticles.filter(article => {
//     const updatedAtDate = normalizeDate(article.updatedAt);
//     const startDate = startDa ? normalizeDate(startDa) : null;
//     const endDate = endDa ? normalizeDate(endDa) : null;
//     // Check date range
//     const isWithinDateRange =
//       startDate && endDate
//         ? updatedAtDate >= startDate && updatedAtDate <= endDate
//         : true;
//     // Check category
//     const isCategoryMatch =
//       activeCategory === 'All'
//         ? nameret.length > 0
//           ? nameret.includes(article.category)
//           : true
//         : article.category === activeCategory;
//     return isWithinDateRange && isCategoryMatch;
//   });

//   const fl = trendingArticlesFromRealm.filter(article => {
//     const updatedAtDate = normalizeDate(article.updatedAt);
//     const startDate = startDa ? normalizeDate(startDa) : null; // Set to null if no start date
//     const endDate = endDa ? normalizeDate(endDa) : null; // Set to null if no end date

//     // Check if the date is within the range only if both startDate and endDate are provided
//     const isWithinDateRange =
//       startDate && endDate
//         ? updatedAtDate >= startDate && updatedAtDate <= endDate
//         : true; // If either startDate or endDate is empty, don't filter by date

//     // Execute the category match logic if startDate and endDate are empty
//     const isCategoryMatch =
//       activeCategory === 'All'
//         ? nameret.length > 0
//           ? nameret.includes(article.category)
//           : true
//         : article.category === activeCategory;
//     return isWithinDateRange && isCategoryMatch;
//   });

//   const ffv = combinedFavArticles.filter(article => {
//     const updatedAtDate = normalizeDate(article.updatedAt);
//     const startDate = startDa ? normalizeDate(startDa) : null; // Set to null if no start date
//     const endDate = endDa ? normalizeDate(endDa) : null; // Set to null if no end date

//     // Check if the date is within the range only if both startDate and endDate are provided
//     const isWithinDateRange =
//       startDate && endDate
//         ? updatedAtDate >= startDate && updatedAtDate <= endDate
//         : true; // If either startDate or endDate is empty, don't filter by date

//     // Execute the category match logic if startDate and endDate are empty
//     const isCategoryMatch =
//       activeCategory === 'All'
//         ? nameret.length > 0
//           ? nameret.includes(article.category)
//           : true
//         : article.category === activeCategory;
//     return isWithinDateRange && isCategoryMatch;
//   });

//   useEffect(() => {
//     console.log('RUN/');
//     getCatories();
//     // getFCMToken();

//     init();
//   }, []);
 
//   const dateschemcheck = useQuery(Datesch);
//   const aa = realm.objects('Datesch');

//   const getstoredfilter = async () => {
//     try {
//       const storedFilter = await AsyncStorage.getItem('reveersefilter');
//       console.log(
//         'reverese filter received from the reveersefilter',
//         storedFilter,
//       );
//     } catch (error) {
//       console.error('Error retrieving filter:', error);
//     }
//   };

//   const setActiveCategoryAndStore = async (category: string) => {
//     setActiveCategory(category); // Update the state
//     try {
//       await AsyncStorage.setItem('selectedCategory', category); // Save to AsyncStorage
//       console.log('Category saved to AsyncStorage:', category);
//     } catch (error) {
//       console.error('Failed to save category to AsyncStorage:', error);
//     }
//   };
//   useEffect(() => {
//     if (isFocus) {
//       getstoredfilter();
//     }
//   }, [isFocus]);
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
//           <Categories onCategoryChange={setActiveCategoryAndStore} />

//           {filteredArticles.length > 0 && (
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
//                   activeCategory: activeCategory,
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
//                 {fi.map((item, index) => {
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

//           {filteredTrendingArticles.length > 0 && (
//             <CategorySection
//               prefixAtTitle={
//                 <LottieView
//                   source={Lottie.trending}
//                   autoPlay
//                   loop
//                   style={{width: moderateScale(30), height: moderateScale(30)}}
//                 />
//               }
//               title="Trending News"
//               titleStyle={style.title}
//               headerContainerStyle={style.header}
//               left="View All"
//               moreStyle={style.moreStyle}
//               onViewAllPress={() => Nav.navigate('ViewAll')}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {fl.map((item, index) => (
//                   <Card
//                     key={index}
//                     {...item}
//                     onClick={() => {
//                       let id;
//                       if (item._id) {
//                         id =
//                           typeof item._id.toHexString === 'function'
//                             ? item._id.toHexString()
//                             : item._id;
//                       } else {
//                         id = item.id;
//                       }

//                       Nav.navigate('Detailedtrend', {
//                         articleId: id,
//                       });
//                     }}
//                     onLike={() => {
//                       toggleLike(item?._id as any);
//                     }}
//                   />
//                 ))}
//               </ScrollView>
//             </CategorySection>
//           )}

//           {/* //favourite section */}
//           {ffv.length > 0 && (
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
//                 {ffv.map((item, index) => {
//                   return (
//                     // <Card
//                     //   {...item}
//                     //   key={index}
//                     //   onClick={() => {
//                     //     const id = item._id.toHexString();
//                     //     Nav.navigate('NewsDetail', {
//                     //       _id: id,
//                     //     } as NewsDetailsPropType);
//                     //   }}
//                     //   {...(trendingArticlesSource.length > 0 && {
//                     //     onLike: () => toggleLike(item?._id as any),
//                     //   })}
//                     // />
//                     <Card
//                       {...item}
//                       key={index}
//                       onClick={() => {
//                         let id;
//                         if (item._id) {
//                           id =
//                             typeof item._id.toHexString === 'function'
//                               ? item._id.toHexString()
//                               : item._id;
//                         } else {
//                           id = item.id;
//                         }

//                         // Navigate based on whether the article is from a "trending" source
//                         if (trendingArticlesSource.includes(item.source)) {
//                           Nav.navigate('Detailedtrend', {
//                             articleId: id,
//                           });
//                         } else {
//                           Nav.navigate('NewsDetail', {
//                             _id: id,
//                           } as NewsDetailsPropType);
//                         }
//                       }}
//                       {...(trendingArticlesSource.length > 0 && {
//                         onLike: () => toggleLike(item?._id as any),
//                       })}
//                     />
//                   );
//                 })}
//               </ScrollView>
//             </CategorySection>
//           )}

//           <View style={{padding: moderateScale(55)}} />
//         </ScrollView>


//         <FilterModal
//           selectedDate={selectedStartDate}
//           todate={selectedEndDate}
//           setSelectedDate={setSelectedStartDate}
//           tosetdate={setSelectedEndDate}
//           modalOpenFlag={showFilter}
//           modalClose={setShowFilter}
//           onApplyfilter={a => {
//             console.log('filterd data->>>', a);
//           }}
//         />
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







//code original
import React from 'react';
import {StyleSheet, Image, Text, View, StatusBar} from 'react-native';
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
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
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
// import messaging, {
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
import {
  useToggleTrendingLike,
  usetrendingFavArticles,
  useDeleteTrendingArticles,
} from '../../store/trending/trendinghook';
import {BSON} from 'realm';
import TrendingArticle from '../../store/trending/trending.schema';
import Favorite from '../../store/favorite/favorite.schema';
import axios from 'axios';
import FilterCategory from '../../store/filtercategory/filtercatergory.schema';
import Datesch from '../../store/trending/datee/date.schema';
import {Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {getMessaging} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Explore = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const {getCatories} = useCategory();
  const {saveManyArticles, deleteArticles} = useToggleLikeArticle();
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [fetchedCategory, setFetchedCategory] = useState<string | null>(null);
  const allArticles = useGetArticles();
  const isFocus = useIsFocused();
  // console.log('allArticles==>>', allArticles);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const storedCategory = await AsyncStorage.getItem('reveersefilter');
        if (storedCategory !== null) {
          setFetchedCategory(storedCategory); // Update the state with the fetched category
          setActiveCategoryAndStore(storedCategory); // Also update the active category
        }
      } catch (error) {
        console.error('Failed to fetch category from AsyncStorage:', error);
      }
    };

    fetchCategory();
  }, []);
  // console.log('->>>>> top 10', allArticles);
  // console.log('allart', allArticles);
  const {toggleLike} = useToggleTrendingLike();

  const [favArticless, setFavArticles] = useState([]);

  const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
  const latestFavArticles = useGetFavArticles();

  const combinedFavArticlesMap = new Map();

  trendingFavArticles.forEach(article => {
    const id = article._id?.toString() || article.id;
    combinedFavArticlesMap.set(id, {...article, source: 'trending'}); // Add source
  });

  latestFavArticles.forEach(article => {
    const id = article._id?.toString() || article.id;
    combinedFavArticlesMap.set(id, {...article, source: 'latest'}); // Add source
  });

  const saveTokenToApi = async (deviceId, fcmToken) => {
    try {
      const response = await axios.post(
        'http://15.206.16.230:4000/api/v1/android/savingtokendata',
        {
          deviceId: deviceId,
          fcmToken: fcmToken,
        },
      );
      console.log('Response:', response.data);
      // if (response.data.message) {
      //   Alert.alert('Success', response.data.message);
      // }
    } catch (error) {
      console.error('Error saving token to API:', error);
      Alert.alert('Error', 'Failed to save token to API');
    }
  };

  const getFCMToken = async () => {
    try {
      // Register the device for remote messages
      await getMessaging().registerDeviceForRemoteMessages();

      // Now retrieve the FCM token
      const fcmToken = await getMessaging().getToken();
      console.log('FCM Token:', fcmToken);

      const deviceId = await DeviceInfo.getUniqueId();
      console.log('Device ID:', deviceId);

      // Save the token to the API
      saveTokenToApi(deviceId, fcmToken);
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  };
  // Convert map to array
  const combinedFavArticles = Array.from(combinedFavArticlesMap.values());
  // console.log('vvv-----------------------', combinedFavArticles);
  // console.log('-0000', typeof combinedFavArticles);
  // Console log the source of each article
  combinedFavArticles.forEach(article => {
    console.log(
      `Article ID: ${article._id || article.id}, Source: ${article.source}`,
    );
  });

  const trendingArticlesSource = combinedFavArticles
    .filter(article => article.source === 'trending')
    .map(article => article.source); // This will store an array of "trending"
  // console.log('variable', trendingArticlesSource);
  // console.log(
  //   'type of thetrendingArticlesSource ->>>>>>>>',
  //   typeof trendingArticlesSource,
  // );
  const [refreshing, setRefreshing] = useState(false);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const trendingArticlesFromRealm = useQuery('TrendingArticle').sorted(
    'updatedAt',
    true,
  );
  // console.log('schema data of treding', trendingArticlesFromRealm.toJSON());
  const firstFiveArticles = trendingArticlesFromRealm.toJSON().slice(0, 10);
  // console.log('First Five Articles:', firstFiveArticles);
  const art = useQuery('Article');

  // console.log('schema data of latest', art.toJSON());

  const startDate = new Date('2024-12-17T06:43:40.179Z');
  const endDate = new Date('2024-12-17T06:49:07.000Z');
  const fsss = allArticles.filter(article => {
    const updatedAt = new Date(article.updatedAt).getTime();
    return updatedAt >= startDate.getTime() && updatedAt <= endDate.getTime();
  });
  // console.log('Filtered Articles:', fsss);

  //new treding articles fetching with data delte admin panel
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

  const getLatestArticle = async (page: number) => {
    const res = await fetchLatestArticles({page, search: ''});
    // console.log('first:', res);
    if (page == 1) {
      deleteArticles();
    }
    if (res.status) {
      if (res?.response?.articles) {
        const ss = res?.response?.articles;
        // console.log('Api data of the latest', ss);
        saveManyArticles(res?.response?.articles);
        // console.log('datattttattatatatatta', saveManyArticles);
      }
    } else {
      errorLog(res.message);
    }
  };

  //two for Latest
  const filteredArticles =
    activeCategory === 'All'
      ? allArticles
      : allArticles.filter(article => article.category === activeCategory);
  //two for Trending
  const filteredTrendingArticles =
    activeCategory === 'All'
      ? trendingArticlesFromRealm
      : trendingArticlesFromRealm.filter(
          article => article.category === activeCategory,
        );

  const init = async () => {
    // setRefreshing(true);
    await getLatestArticle(1);
    await fetchTrendingArticles();
    setRefreshing(false);
  };

  const flt = useQuery(FilterCategory);

  useEffect(() => {}, [flt]);
  // console.log('xxxxx', flt);
  const nameret = flt.map(xx => xx.name);
  // console.log('-----', nameret);
  const oo = allArticles;
  // console.log('000-', oo);
  const ll = typeof nameret;
  // console.log('types of the vair', ll);

  const filtercat = allArticles.filter(article =>
    nameret.includes(article.category),
  );
  // console.log('Filtered Articles:', filtercat);

  const [startDa, setStartDa] = useState<string>('');
  const [endDa, setEndDa] = useState<string>('');
  useEffect(() => {
    const fetchDates = async () => {
      const dates = realm.objects(Datesch);

      if (dates.length > 0 && dates[0].isButtonPressed) {
        setStartDa(dates[0].startDate);
        setEndDa(dates[0].endDate);
      } else {
        // Reset state if Datesch is empty
        setStartDa('');
        setEndDa('');
      }
    };
    fetchDates();
    const listener = () => fetchDates();
    realm.objects(Datesch).addListener(listener);

    return () => {
      // Cleanup listener when component unmounts
      realm.objects(Datesch).removeListener(listener);
    };
  }, []);
  const d = realm.objects(Datesch);

  const normalizeDate = (date: string | number | Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Set time to midnight to compare only the date part
    return d;
  };

  const fi = allArticles.filter(article => {
    const updatedAtDate = normalizeDate(article.updatedAt);
    const startDate = startDa ? normalizeDate(startDa) : null;
    const endDate = endDa ? normalizeDate(endDa) : null;
    // Check date range
    const isWithinDateRange =
      startDate && endDate
        ? updatedAtDate >= startDate && updatedAtDate <= endDate
        : true;
    // Check category
    const isCategoryMatch =
      activeCategory === 'All'
        ? nameret.length > 0
          ? nameret.includes(article.category)
          : true
        : article.category === activeCategory;
    return isWithinDateRange && isCategoryMatch;
  });

  const fl = trendingArticlesFromRealm.filter(article => {
    const updatedAtDate = normalizeDate(article.updatedAt);
    const startDate = startDa ? normalizeDate(startDa) : null; // Set to null if no start date
    const endDate = endDa ? normalizeDate(endDa) : null; // Set to null if no end date

    // Check if the date is within the range only if both startDate and endDate are provided
    const isWithinDateRange =
      startDate && endDate
        ? updatedAtDate >= startDate && updatedAtDate <= endDate
        : true; // If either startDate or endDate is empty, don't filter by date

    // Execute the category match logic if startDate and endDate are empty
    const isCategoryMatch =
      activeCategory === 'All'
        ? nameret.length > 0
          ? nameret.includes(article.category)
          : true
        : article.category === activeCategory;
    return isWithinDateRange && isCategoryMatch;
  });

  const ffv = combinedFavArticles.filter(article => {
    const updatedAtDate = normalizeDate(article.updatedAt);
    const startDate = startDa ? normalizeDate(startDa) : null; // Set to null if no start date
    const endDate = endDa ? normalizeDate(endDa) : null; // Set to null if no end date

    // Check if the date is within the range only if both startDate and endDate are provided
    const isWithinDateRange =
      startDate && endDate
        ? updatedAtDate >= startDate && updatedAtDate <= endDate
        : true; // If either startDate or endDate is empty, don't filter by date

    // Execute the category match logic if startDate and endDate are empty
    const isCategoryMatch =
      activeCategory === 'All'
        ? nameret.length > 0
          ? nameret.includes(article.category)
          : true
        : article.category === activeCategory;
    return isWithinDateRange && isCategoryMatch;
  });

  useEffect(() => {
    console.log('RUN/');
    getCatories();
    // getFCMToken();

    init();
  }, []);
 
  const dateschemcheck = useQuery(Datesch);
  const aa = realm.objects('Datesch');

  const getstoredfilter = async () => {
    try {
      const storedFilter = await AsyncStorage.getItem('reveersefilter');
      console.log(
        'reverese filter received from the reveersefilter',
        storedFilter,
      );
    } catch (error) {
      console.error('Error retrieving filter:', error);
    }
  };

  const setActiveCategoryAndStore = async (category: string) => {
    setActiveCategory(category); // Update the state
    try {
      await AsyncStorage.setItem('selectedCategory', category); // Save to AsyncStorage
      console.log('Category saved to AsyncStorage:', category);
    } catch (error) {
      console.error('Failed to save category to AsyncStorage:', error);
    }
  };
  useEffect(() => {
    if (isFocus) {
      getstoredfilter();
    }
  }, [isFocus]);
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
          <Categories onCategoryChange={setActiveCategoryAndStore} />

          {filteredArticles.length > 0 && (
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
                  activeCategory: activeCategory,
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
                {fi.map((item, index) => {
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

          {filteredTrendingArticles.length > 0 && (
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
                {fl.map((item, index) => (
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
          )}

          {/* //favourite section */}
          {ffv.length > 0 && (
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
                {ffv.map((item, index) => {
                  return (
                    // <Card
                    //   {...item}
                    //   key={index}
                    //   onClick={() => {
                    //     const id = item._id.toHexString();
                    //     Nav.navigate('NewsDetail', {
                    //       _id: id,
                    //     } as NewsDetailsPropType);
                    //   }}
                    //   {...(trendingArticlesSource.length > 0 && {
                    //     onLike: () => toggleLike(item?._id as any),
                    //   })}
                    // />
                    <Card
                      {...item}
                      key={index}
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

                        // Navigate based on whether the article is from a "trending" source
                        if (trendingArticlesSource.includes(item.source)) {
                          Nav.navigate('Detailedtrend', {
                            articleId: id,
                          });
                        } else {
                          Nav.navigate('NewsDetail', {
                            _id: id,
                          } as NewsDetailsPropType);
                        }
                      }}
                      {...(trendingArticlesSource.length > 0 && {
                        onLike: () => toggleLike(item?._id as any),
                      })}
                    />
                  );
                })}
              </ScrollView>
            </CategorySection>
          )}

          <View style={{padding: moderateScale(55)}} />
        </ScrollView>


        <FilterModal
          selectedDate={selectedStartDate}
          todate={selectedEndDate}
          setSelectedDate={setSelectedStartDate}
          tosetdate={setSelectedEndDate}
          modalOpenFlag={showFilter}
          modalClose={setShowFilter}
          onApplyfilter={a => {
            console.log('filterd data->>>', a);
          }}
        />
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
