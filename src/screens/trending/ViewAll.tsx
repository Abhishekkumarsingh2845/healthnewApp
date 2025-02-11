// import React, { useCallback, useEffect, useState } from 'react';
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
// import Card from '../../components/AppComponents/Card';
// import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { RootStackParamList } from '../../navigations/MainNavigation/models';
// import axios from 'axios';
// import { useRealm, useQuery } from '@realm/react';
// import { BSON } from 'realm';
// import TrendingArticle from '../../store/trending/trending.schema';
// import Favorite from '../../store/favorite/favorite.schema';
// import { useToggleTrendingLike } from '../../store/trending/trendinghook';
// import { Colors } from '../../config/colors.config';
// import { moderateScale } from 'react-native-size-matters';
// import { FontStyle } from '../../config/style.config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ViewAll = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const [activeCategory, setActiveCategory] = useState('All'); // Default to 'All'
//   const { toggleLike } = useToggleTrendingLike();

//   const [showFilter, setShowFilter] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [isLoading, setIsLoading] = useState(false);

//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   // Filter articles based on activeCategory
//   const filteredTrendingArticles =
//     activeCategory === 'All'
//       ? trendingArticlesFromRealm
//       : trendingArticlesFromRealm.filter(
//           (article) => article.category === activeCategory,
//         );

//         const fetchTrendingArticles = async () => {
//           try {
//             setIsLoading(true);
//             const response = await axios.get(
//               `http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=${limit}&page=${page}`,
//             );

//             console.log('API Response:', response.data); // Log full response

//             // Ensure response.data exists and is an array
//             if (!response.data?.data || !Array.isArray(response.data.data)) {
//               console.error('Invalid response structure:', response.data);
//               return;
//             }

//             if (response.data.status && response.data.data.length > 0) {
//               realm.write(() => {
//                 response.data.data.forEach((article: any) => {
//                   const articleId = new BSON.ObjectId(article._id);
//                   let data = {
//                     ...article,
//                     _id: articleId,
//                   };
//                   const fav = realm
//                     .objects(Favorite.schema.name)
//                     .filtered(`articleId == $0`, articleId);
//                   data['isLiked'] = fav.length > 0;
//                   realm.create(
//                     TrendingArticle.schema.name,
//                     data,
//                     Realm.UpdateMode.Modified,
//                   );
//                 });
//               });
//             }
//           } catch (error) {
//             console.error('Error fetching trending articles:', error);
//           } finally {
//             setIsLoading(false);
//           }
//         };

//   const fetchMoreArticles = useCallback(async () => {
//     setPage((prevPage) => prevPage + 1);
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
//         <Header icon={undefined} title={'Trending/Popular News'} />

//         {/* Use filteredTrendingArticles as data */}
//         <FlatList
//         maxToRenderPerBatch={10}
//           data={filteredTrendingArticles.slice(0,10)}
//           keyExtractor={(item, index) =>
//             item._id ? item._id.toHexString() : `${index}`
//           }
//           renderItem={({ item }) => (
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
//           onEndReachedThreshold={0.5}
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









import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Header from '../news/components/header';
import FilterModal from '../../components/AppComponents/filterModal';
import Card from '../../components/AppComponents/Card';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';
import axios from 'axios';
import {useRealm, useQuery} from '@realm/react';
import {BSON} from 'realm';
import TrendingArticle from '../../store/trending/trending.schema';
import Favorite from '../../store/favorite/favorite.schema';
import {useToggleTrendingLike} from '../../store/trending/trendinghook';
import {Colors} from '../../config/colors.config';
import {moderateScale} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox} from 'react-native';

const ViewAll = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const {toggleLike} = useToggleTrendingLike();

  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed limit
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]); // Store articles in state
  const [hasMore, setHasMore] = useState(true); // Check if more data is available

  const trendingArticlesFromRealm = useQuery('TrendingArticle');

  // Filter articles based on activeCategory
  const filteredTrendingArticles =
    selectedCategory === 'All' || !selectedCategory
      ? articles
      : articles.filter(article => article.category === selectedCategory);

  const fetchTrendingArticles = async (pageNum = 1) => {
    if (isLoading || !hasMore) return; // Prevent duplicate calls
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=${limit}&page=${pageNum}`,
      );
      console.log(limit, pageNum);

      if (response.data?.status && Array.isArray(response.data.data)) {
        console.log(
          'kevin',
          response?.data?.data?.forEach(item => console.log(item._id)),
        );
        // const trendingArticlesFromRealm = useQuery('TrendingArticle').sorted(
        //   'updatedAt',
        //   true,
        // );
        const newArticles = response.data.data.map((article: any) => ({
          ...article,
          _id: new BSON.ObjectId(article._id),
          isLiked:
            realm
              .objects(Favorite.schema.name)
              .filtered(`articleId == $0`, new BSON.ObjectId(article._id))
              .length > 0,
        }));
        // const newArticles = trendingArticlesFromRealm;

        // Save to Realm
        realm.write(() => {
          newArticles.forEach(article => {
            realm.create(
              TrendingArticle.schema.name,
              article,
              Realm.UpdateMode.Modified,
            );
          });
        });

        // Append without duplicates
        setArticles(prev => [
          ...prev,
          ...newArticles.filter(
            item => !prev.some(existing => existing._id.equals(item._id)),
          ),
        ]);

        if (newArticles.length < limit) setHasMore(false); // No more data
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreArticles = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchTrendingArticles(page);
  }, [page]);

  useEffect(() => {
    const fetchSelectedCategory = async () => {
      try {
        const category = await AsyncStorage.getItem('selectedCategory');
        if (category) setSelectedCategory(category);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    };
    fetchSelectedCategory();
  }, []);

  const renderFooter = () =>
    isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    ) : null;

  return (
    <AppSafeAreaView>
      <SafeAreaView />
      <Header icon={undefined} title={'Trending/Popular News'} />

      <FlatList
        data={filteredTrendingArticles}
        keyExtractor={(item, index) =>
          item._id ? item._id.toHexString() : `${index}`
        }
        renderItem={({item}) => (
          <Card
            {...item}
            onClick={() =>
              Nav.navigate('Detailedtrend', {articleId: item._id.toHexString()})
            }
            onLike={() => toggleLike(item._id)}
          />
        )}
        onScrollEndDrag={fetchMoreArticles}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: moderateScale(10),
    alignItems: 'center',
  },
});

export default ViewAll;
