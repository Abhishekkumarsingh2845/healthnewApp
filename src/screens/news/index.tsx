// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   SafeAreaView,
//   FlatList,
//   StyleSheet,
//   View,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Header from '../news/components/header';
// import FilterModal from '../../components/AppComponents/filterModal';
// import Card from '../../components/AppComponents/Card';
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
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import InfiniteList from '../../components/InfiniteList';

// const index = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const [activeCategory, setActiveCategory] = useState('All'); // Default to 'All'
//   const {toggleLike} = useToggleTrendingLike();

//   const [showFilter, setShowFilter] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//     loadingMore: false,
//   });

//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   // Filter articles based on activeCategory
//   const filteredTrendingArticles =
//     activeCategory === 'All'
//       ? trendingArticlesFromRealm
//       : trendingArticlesFromRealm.filter(
//           article => article.category === activeCategory,
//         );

//   const fetchTrendingArticles = async (page: number) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=${pagination.limit}&page=${page}`,
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

//         setPagination(prev => ({
//           ...prev,
//           totalPages: response.data.pagination?.totalPages || 1,
//           page: response.data.pagination?.currentPage || 1,
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onLoadMore = useCallback(async () => {
//     if (pagination.loadingMore || pagination.page >= pagination.totalPages)
//       return;

//     setPagination(prev => ({...prev, loadingMore: true}));
//     await fetchTrendingArticles(pagination.page + 1);
//     setPagination(prev => ({...prev, loadingMore: false}));
//   }, [pagination]);

//   useEffect(() => {
//     fetchTrendingArticles(1);
//   }, []);

//   const renderFooter = () => {
//     if (!pagination.loadingMore) return <></>;
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   };

//   useEffect(() => {
//     const fetchSelectedCategory = async () => {
//       try {
//         const category = await AsyncStorage.getItem('selectedCategory');
//         if (category !== null) {
//           setSelectedCategory(category);
//           setActiveCategory(category); // Set activeCategory to the retrieved category
//           console.log('Category retrieved from AsyncStorage:', category);
//         }
//       } catch (error) {
//         console.error('Failed to fetch category from AsyncStorage:', error);
//       }
//     };

//     fetchSelectedCategory();
//   }, []);

//   return (
//     <>
//       <AppSafeAreaView>
//         <SafeAreaView />

//         <Header icon={undefined} title={'Latest News'} />
//         <View style={{flex: 1}}>
//           <InfiniteList
//             data={Array.from(filteredTrendingArticles)}
//             totalPages={pagination.totalPages}
//             refreshControl={
//               <RefreshControl
//                 colors={[Colors.primary]}
//                 refreshing={loading}
//                 onRefresh={() => fetchTrendingArticles(1)}
//               />
//             }
//             onLoad={onLoadMore}
//             ListEmptyComponent={() => {
//               return <></>;
//             }}
//             ListFooterComponent={renderFooter}
//             renderItem={({item, index}: any) => {
//               return (
//                 <Card
//                   key={`CARD-${index}`}
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
//                   {...item}
//                 />
//               );
//             }}
//           />
//         </View>

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

// export default index;
























































































import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Header from '../news/components/header';
import FilterModal from '../../components/AppComponents/filterModal';
import Card from '../../components/AppComponents/Card';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfiniteList from '../../components/InfiniteList';

const IndexScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const [activeCategory, setActiveCategory] = useState('All');
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

  // Filter articles based on category
  const filteredTrendingArticles =
    activeCategory === 'All'
      ? trendingArticlesFromRealm
      : trendingArticlesFromRealm.filter(
          (article) => article.category === activeCategory
        ) || [];

  const fetchTrendingArticles = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=${pagination.limit}&page=${page}`
      );

      if (response.data.status && response.data.data.length > 0) {
        realm.write(() => {
          response.data.data.forEach((article: any) => {
            if (!article._id) {
              console.warn('Skipping article without _id:', article);
              return;
            }

            try {
              const articleId = new BSON.ObjectId(article._id);
              let data = { ...article, _id: articleId };

              const fav = realm
                .objects(Favorite.schema.name)
                .filtered(`articleId == $0`, articleId);
              data['isLiked'] = fav.length > 0;

              realm.create(
                TrendingArticle.schema.name,
                data,
                Realm.UpdateMode.Modified
              );
            } catch (err) {
              console.error('Invalid ObjectId:', article._id, err);
            }
          });
        });

        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination?.totalPages || 1,
          page: response.data.pagination?.currentPage || page,
        }));
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error);
    } finally {
      setLoading(false);
    }
  };
















  

  const onLoadMore = useCallback(async () => {
    if (
      pagination.loadingMore ||
      pagination.page >= pagination.totalPages ||
      filteredTrendingArticles.length === 0
    )
      return;

    const nextPage = pagination.page + 1;
    if (nextPage > pagination.totalPages) return;

    setPagination((prev) => ({ ...prev, loadingMore: true }));
    await fetchTrendingArticles(nextPage);
    setPagination((prev) => ({ ...prev, loadingMore: false }));
  }, [pagination, filteredTrendingArticles]);



















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
          setActiveCategory(category);
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
            keyExtractor={(item, index) =>
              item._id ? item._id.toHexString() : `CARD-${index}`
            }
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
              if (loading) return null;
              return (
                <View style={styles.emptyContainer}>
                  <Text>No articles found.</Text>
                </View>
              );
            }}
            ListFooterComponent={renderFooter}
            renderItem={({ item, index }: any) => {
              return (
                <Card
                  key={item._id ? item._id.toHexString() : `CARD-${index}`}
                  onClick={() => {
                    let id =
                      item._id && typeof item._id.toHexString === 'function'
                        ? item._id.toHexString()
                        : item._id;

                    Nav.navigate('Detailedtrend', { articleId: id });
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IndexScreen;