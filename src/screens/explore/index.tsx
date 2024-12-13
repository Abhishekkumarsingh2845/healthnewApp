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

const Explore = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const {getCatories} = useCategory();
  const {saveManyArticles, deleteArticles} = useToggleLikeArticle();
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const allArticles = useGetArticles();
  // console.log('allArticles==>>', allArticles);
  const {toggleLike} = useToggleTrendingLike();

  const [favArticless, setFavArticles] = useState([]);

  const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
  const latestFavArticles = useGetFavArticles();
  const combinedFavArticlesMap = new Map();
  trendingFavArticles.forEach(article => {
    const id = article._id?.toString() || article.id;
    combinedFavArticlesMap.set(id, article);
  });
  latestFavArticles.forEach(article => {
    const id = article._id?.toString() || article.id;
    combinedFavArticlesMap.set(id, article);
  });

  const combinedFavArticles = Array.from(combinedFavArticlesMap.values());

  // console.log('qpqpqppqppqppqpqpqpqpppppqpq', combinedFavArticles);
  // const favArticles = combinedFavArticles.filter((article, index, self) => {
  //   return (
  //     index ===
  //     self.findIndex(
  //       t => t._id === article._id || t.id === article.id, // Compare article IDs
  //     )
  //   );
  // });
  // console.log('fav->>>', favArticles);
  // const favArticles = usetrendingFavArticles();
  // const favArticles = useGetFavArticles();
  const [refreshing, setRefreshing] = useState(false);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const trendingArticlesFromRealm = useQuery('TrendingArticle');
  // console.log('schema data of treding', trendingArticlesFromRealm.toJSON());
  const art = useQuery('Article');

  // console.log('schema data of latest', art.toJSON());

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
  //two for Favorite
  const filteredfavArticles =
    activeCategory === 'All'
      ? combinedFavArticles
      : combinedFavArticles.filter(
          article => article.category === activeCategory,
        );

  // Determine which articles to show
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

  const fi =
    activeCategory === 'All'
      ? nameret.length > 0
        ? allArticles.filter(article => nameret.includes(article.category)) // Filter by nameret if it's not empty
        : allArticles // Show all articles if nameret is empty
      : allArticles.filter(article => article.category === activeCategory);

  const fl =
    activeCategory === 'All'
      ? nameret.length > 0
        ? trendingArticlesFromRealm.filter(article =>
            nameret.includes(article.category),
          ) // Filter by nameret if it's not empty
        : trendingArticlesFromRealm // Show all articles if nameret is empty
      : trendingArticlesFromRealm.filter(
          article => article.category === activeCategory,
        );

  const ffv =
    activeCategory === 'All'
      ? nameret.length > 0
        ? combinedFavArticles.filter(article =>
            nameret.includes(article.category),
          ) // Filter by nameret if it's not empty
        : combinedFavArticles // Show all articles if nameret is empty
      : combinedFavArticles.filter(
          article => article.category === activeCategory,
        );

  useEffect(() => {
    console.log('RUN/');
    getCatories();
    init();
  }, []);
  console.log(
    'combinedFavArticles------>',
    JSON.stringify(combinedFavArticles),
  );

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
          <Categories onCategoryChange={setActiveCategory} />
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

          {/* //trending section */}

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
          {filteredfavArticles.length > 0 && (
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
























// import {StyleSheet, Image, Text, View} from 'react-native';
// import {RefreshControl, ScrollView} from 'react-native';
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
// import {useRealm, useQuery} from '@realm/react';
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

// // import {useRealm, useQuery} from '@realm/react';

// import {
//   useToggleTrendingLike,
//   usetrendingFavArticles,
//   useDeleteTrendingArticles,
// } from '../../store/trending/trendinghook';
// import {BSON} from 'realm';
// import TrendingArticle from '../../store/trending/trending.schema';
// import Favorite from '../../store/favorite/favorite.schema';
// import axios from 'axios';
// import FilterCategory from '../../store/filtercategory/filtercatergory.schema';

// const Explore = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const {getCatories} = useCategory();
//   const {saveManyArticles, deleteArticles} = useToggleLikeArticle();
//   const [showFilter, setShowFilter] = useState(false);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const allArticles = useGetArticles();

//   const {toggleLike} = useToggleTrendingLike();

//   const trendingFavArticles = usetrendingFavArticles();
//   const latestFavArticles = useGetFavArticles();
//   const combinedFavArticlesMap = new Map();
//   trendingFavArticles.forEach(article => {
//     const id = article._id?.toString() || article.id;
//     combinedFavArticlesMap.set(id, article);
//   });
//   latestFavArticles.forEach(article => {
//     const id = article._id?.toString() || article.id;
//     combinedFavArticlesMap.set(id, article);
//   });

//   const combinedFavArticles = Array.from(combinedFavArticlesMap.values());

//   const [refreshing, setRefreshing] = useState(false);
//   const [trendingArticles, setTrendingArticles] = useState([]);
//   const trendingArticlesFromRealm = useQuery('TrendingArticle');

//   const art = useQuery('Article');

//   const fetchTrendingArticles = async () => {
//     try {
//       const response = await axios.get(
//         'http://15.206.16.230:4000/api/v1/android/trendingarticle',
//       );

//       const aa = response.data;

//       if (response.data.status && response.data.data.length > 0) {
//         const currentArticles = realm.objects(TrendingArticle.schema.name);

//         const fetchedArticleIds = response.data.data.map(
//           (article: any) => article._id,
//         );

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

//           currentArticles.forEach((currentArticle: any) => {
//             if (!fetchedArticleIds.includes(currentArticle._id.toString())) {
//               realm.delete(currentArticle);
//             }
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     }
//   };

//   const filteredTrendingArticles =
//     activeCategory === 'All'
//       ? trendingArticlesFromRealm
//       : trendingArticlesFromRealm.filter(
//           article => article.category === activeCategory,
//         );
//   //two for Favorite
//   const filteredfavArticles =
//     activeCategory === 'All'
//       ? combinedFavArticles
//       : combinedFavArticles.filter(
//           article => article.category === activeCategory,
//         );

//   // Determine which articles to show
//   const init = async () => {

//     await fetchTrendingArticles();
//     setRefreshing(false);
//   };

//   const flt = useQuery(FilterCategory);

//   useEffect(() => {}, [flt]);

//   const nameret = flt.map(xx => xx.name);

//   const fl =
//     activeCategory === 'All'
//       ? nameret.length > 0
//         ? trendingArticlesFromRealm.filter(article =>
//             nameret.includes(article.category),
//           ) // Filter by nameret if it's not empty
//         : trendingArticlesFromRealm // Show all articles if nameret is empty
//       : trendingArticlesFromRealm.filter(
//           article => article.category === activeCategory,
//         );

//   const ffv =
//     activeCategory === 'All'
//       ? nameret.length > 0
//         ? combinedFavArticles.filter(article =>
//             nameret.includes(article.category),
//           )
//         : combinedFavArticles
//       : combinedFavArticles.filter(
//           article => article.category === activeCategory,
//         );

//   useEffect(() => {
//     console.log('RUN/');
//     getCatories();
//     init();
//   }, []);

//   return (
//     <>
//       <AppSafeAreaView>
//

//           {filteredfavArticles.length > 0 && (
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

// import {StyleSheet, Image, Text, View} from 'react-native';
// import {RefreshControl, ScrollView} from 'react-native';
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
// import {useRealm, useQuery} from '@realm/react';
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

// // import {useRealm, useQuery} from '@realm/react';

// // import {useDeleteTrendingArticles} from '../../store/trending/trendinghook';

// import {
//   useToggleTrendingLike,
//   usetrendingFavArticles,
// } from '../../store/trending/trendinghook';
// import {BSON} from 'realm';
// import TrendingArticle from '../../store/trending/trending.schema';
// import Favorite from '../../store/favorite/favorite.schema';
// import axios from 'axios';

// const Explore = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const realm = useRealm();
//   const {getCatories} = useCategory();
//   const {deleteArticles, saveManyArticles} = useToggleLikeArticle();
//   const [showFilter, setShowFilter] = useState(false);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const allArticles = useGetArticles();
//   // console.log("allArticles==>>",allArticles)
//   const {toggleLike} = useToggleTrendingLike();
//   const [favArticless, setFavArticles] = useState([]);
//   const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
//   const latestFavArticles = useGetFavArticles();
//   // const combinedFavArticles = [
//   //   ...trendingFavArticles,
//   //   ...latestFavArticles,
//   // ].filter(
//   //   (article, index, self) =>
//   //     index ===
//   //     self.findIndex(
//   //       t => t._id?.toString() === article._id?.toString() || t.id === article.id // Compare using the same identifier
//   //     )
//   // );

//   const combinedFavArticlesMap = new Map();

//   // Add articles from trendingFavArticles
//   trendingFavArticles.forEach(article => {
//     const id = article._id?.toString() || article.id;
//     combinedFavArticlesMap.set(id, article);
//   });

//   // Add articles from latestFavArticles
//   latestFavArticles.forEach(article => {
//     const id = article._id?.toString() || article.id;
//     combinedFavArticlesMap.set(id, article);
//   });

//   // Convert Map back to array
//   const combinedFavArticles = Array.from(combinedFavArticlesMap.values());

//   // console.log('qpqpqppqppqppqpqpqpqpppppqpq', combinedFavArticles);
//   const favArticles = combinedFavArticles.filter((article, index, self) => {
//     return (
//       index ===
//       self.findIndex(
//         t => t._id === article._id || t.id === article.id, // Compare article IDs
//       )
//     );
//   });
//   // console.log('fav->>>', favArticles);
//   // const favArticles = usetrendingFavArticles();
//   // const favArticles = useGetFavArticles();
//   const [refreshing, setRefreshing] = useState(false);
//   const [trendingArticles, setTrendingArticles] = useState([]);
//   const trendingArticlesFromRealm = useQuery('TrendingArticle');
//   // console.log('treding new ->>>', trendingArticlesFromRealm.toJSON());
//   const art = useQuery('Article');

//   // console.log("latest new ->>>",art.toJSON());
//   // const {deleteTrendingArticles} = useDeleteTrendingArticles();
//   //new treding articles fetching with data delte admin panel
//   const fetchTrendingArticles = async () => {
//     try {
//       const response = await axios.get(
//         'http://15.206.16.230:4000/api/v1/android/trendingarticle',
//       );

//       if (response.data.status && response.data.data.length > 0) {
//         const currentArticles = realm.objects(TrendingArticle.schema.name);

//         const fetchedArticleIds = response.data.data.map(
//           (article: any) => article._id,
//         );

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

//             // Create or modify the trending article in the Realm database
//             realm.create(
//               TrendingArticle.schema.name,
//               data,
//               Realm.UpdateMode.Modified,
//             );
//           });

//           // Loop through the current articles in the Realm DB
//           // Remove articles that are not present in the fetched list (deleted by admin)
//           currentArticles.forEach((currentArticle: any) => {
//             if (!fetchedArticleIds.includes(currentArticle._id.toString())) {
//               realm.delete(currentArticle); // Delete the article from Realm DB
//             }
//           });
//         });
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

//   const filteredArticles =
//     activeCategory === 'All'
//       ? allArticles
//       : allArticles.filter(article => article.category === activeCategory);

//   const filteredTrendingArticles =
//     activeCategory === 'All'
//       ? trendingArticlesFromRealm
//       : trendingArticlesFromRealm.filter(
//           article => article.category === activeCategory,
//         );

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
//           <Categories onCategoryChange={setActiveCategory} />
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
//                 {filteredArticles.map((item, index) => {
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

// top catergory filter
// import React, {useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   RefreshControl,
//   TouchableOpacity,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import Header from './components/header';
// import Categories from '../../components/AppComponents/categories';
// import CategorySection from '../../components/CategorySections';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle} from '../../config/style.config';
// import Card from '../../components/AppComponents/card';
// import {useNavigation, NavigationProp} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';
// import {fetchLatestArticles} from '../../store/article/article.network';
// import {useGetArticles} from '../../store/article/article.hooks';
// import {NewsDetailsPropType} from '../newDetail';
// import {NewsListType} from '../news/types/enum';
// import {NewsPropType} from '../news/types/interface';

// const Explore = () => {
//   const Nav = useNavigation<NavigationProp<RootStackParamList>>();
//   const allArticles = useGetArticles();
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeCategory, setActiveCategory] = useState('All');

//   const filteredArticles =
//     activeCategory === 'All'
//       ? allArticles
//       : allArticles.filter(article => article.category === activeCategory);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchLatestArticles({page: 1, search: ''});
//     setRefreshing(false);
//   };

//   return (
//     <>
//       <AppSafeAreaView>
//         <Header />
//         <ScrollView
//           refreshControl={
//             <RefreshControl
//               colors={[Colors.primary]}
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//             />
//           }
//           showsVerticalScrollIndicator={false}>
//           {/* Pass category filter callback */}
//           <Categories onCategoryChange={setActiveCategory} />

//           {/* Latest News Section */}
//           <CategorySection
//             title="Latest News"
//             titleStyle={style.title}
//             headerContainerStyle={style.header}
//             left="View All"
//             moreStyle={style.moreStyle}
//             onViewAllPress={() => {
//               Nav.navigate('News', {
//                 title: 'Latest News',
//                 type: NewsListType.Latest,
//               } as NewsPropType);
//             }}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {filteredArticles.map((item, index) => (
//                 <Card
//                   key={index}
//                   onClick={() => {
//                     const id = item._id.toHexString();
//                     Nav.navigate('NewsDetail', {
//                       _id: id,
//                     } as NewsDetailsPropType);
//                   }}
//                   {...item}
//                 />
//               ))}
//             </ScrollView>
//           </CategorySection>
//         </ScrollView>
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
//   filterButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: moderateScale(10),
//   },
//   filterButton: {
//     padding: moderateScale(10),
//     borderRadius: moderateScale(5),
//     backgroundColor: 'red',
//   },
//   filterButtonText: {
//     color: Colors.white,
//     fontWeight: 'bold',
//   },
// });
// export default Explore;

// //filter functionality by Filter Api
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
