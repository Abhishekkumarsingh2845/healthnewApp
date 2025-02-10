
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
import Card from '../../components/AppComponents/Card';
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
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ViewAll = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const { toggleLike } = useToggleTrendingLike();

//   const [showFilter, setShowFilter] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10); // Fixed limit
//   const [isLoading, setIsLoading] = useState(false);
//   const [articles, setArticles] = useState<any[]>([]); 
//   const [hasMore, setHasMore] = useState(true); 

//   const trendingArticlesFromRealm = useQuery('TrendingArticle');
//   console.log("->---------------trending realm in viewall",trendingArticlesFromRealm);

//   // Filter articles based on activeCategory
//   const filteredTrendingArticles =
//     selectedCategory === 'All' || !selectedCategory
//       ? articles
//       : articles.filter((article) => article.category === selectedCategory);

//   const fetchTrendingArticles = async (pageNum = 1) => {
//     if (isLoading || !hasMore) return; 
//     setIsLoading(true);

//     try {
//       const response = await axios.get(
//         `http://15.206.16.230:4000/api/v1/android/trendingarticle?limit=${limit}&page=${pageNum}`
//       );

//       if (response.data?.status && Array.isArray(response.data.data)) {
//         const newArticles = response.data.data.map((article: any) => ({
//           ...article,
//           _id: new BSON.ObjectId(article._id),
//           isLiked: realm
//             .objects(Favorite.schema.name)
//             .filtered(`articleId == $0`, new BSON.ObjectId(article._id)).length > 0,
//         }));

//         // Save to Realm
//         realm.write(() => {
//           newArticles.forEach((article) => {
//             realm.create(
//               TrendingArticle.schema.name,
//               article,
//               Realm.UpdateMode.Modified
//             );
//           });
//         });

//         // Append without duplicates
//         setArticles((prev) => [
//           ...prev,
//           ...newArticles.filter(
//             (item) => !prev.some((existing) => existing._id.equals(item._id))
//           ),
//         ]);

//         if (newArticles.length < limit) setHasMore(false); // No more data
//       } else {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchMoreArticles = () => {
//     if (!isLoading && hasMore) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   useEffect(() => {
//     fetchTrendingArticles(page);
//   }, [page]);

//   useEffect(() => {
//     const fetchSelectedCategory = async () => {
//       try {
//         const category = await AsyncStorage.getItem('selectedCategory');
//         if (category) setSelectedCategory(category);
//       } catch (error) {
//         console.error('Failed to fetch category:', error);
//       }
//     };
//     fetchSelectedCategory();
//   }, []);

//   const renderFooter = () =>
//     isLoading ? (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     ) : null;

//   return (
//     <AppSafeAreaView>
//       <SafeAreaView />
//       <Header icon={undefined} title={'Trending/Popular News'} />

//       <FlatList
//         data={filteredTrendingArticles}
//         keyExtractor={(item, index) =>
//           item._id ? item._id.toHexString() : `${index}`
//         }
//         renderItem={({ item }) => (
//           <Card
//             {...item}
//             onClick={() =>
//               Nav.navigate('Detailedtrend', { articleId: item._id.toHexString() })
//             }
//             onLike={() => toggleLike(item._id)}
//           />
//         )}
//         onEndReached={fetchMoreArticles}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={renderFooter}
//         showsVerticalScrollIndicator={false}
//       />

//       <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
//     </AppSafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     paddingVertical: moderateScale(10),
//     alignItems: 'center',
//   },
// });

// export default ViewAll;





