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






















import React, {useEffect} from 'react';
import {View, Text, FlatList, Button, StyleSheet} from 'react-native';
import axios from 'axios';
import {useRealm, useQuery} from '@realm/react';
import TrendingArticle from '../../store/trending/trending.schema';

const IntailizeApp = () => {
  const realm = useRealm();

  // Query to get all TrendingArticles stored in Realm
  const trendingArticles = useQuery('TrendingArticle');

  // Fetch data from API and store it in Realm
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          'http://15.206.16.230:4000/api/v1/android/trendingarticle',
        );
        if (response.data.status && response.data.data.length > 0) {
          // Store fetched articles into Realm
          realm.write(() => {
            response.data.data.forEach((article: any) => {
              realm.create(
                'TrendingArticle',
                {
                  _id: article._id,
                  article_id: article.article_id,
                  title: article.title,
                  description: article.description,
                  url: article.url,
                  urlToImage: article.urlToImage,
                  publishedAt: article.publishedAt,
                  content: article.content,
                  category: article.category,
                  status: article.status,
                  isActive: article.isActive,
                  isTrending: article.isTrending,
                },
                'modified',
              ); // 'modified' to update existing entries
            });
          });
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, [realm]);

  // Render the list of trending articles
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending Articles</Text>
      <FlatList
        data={trendingArticles}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.articleItem}>
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  articleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default IntailizeApp;






















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