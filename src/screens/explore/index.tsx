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

  // const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
  // const latestFavArticles = useGetFavArticles();
  // const combinedFavArticlesMap = new Map();
  // trendingFavArticles.forEach(article => {
  //   const id = article._id?.toString() || article.id;
  //   combinedFavArticlesMap.set(id, article);
  // });
  // latestFavArticles.forEach(article => {
  //   const id = article._id?.toString() || article.id;
  //   combinedFavArticlesMap.set(id, article);
  // });

  // const combinedFavArticles = Array.from(combinedFavArticlesMap.values());

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

  // Convert map to array
  const combinedFavArticles = Array.from(combinedFavArticlesMap.values());
  console.log('vvv', combinedFavArticles);
  // Console log the source of each article
  combinedFavArticles.forEach(article => {
    console.log(
      `Article ID: ${article._id || article.id}, Source: ${article.source}`,
    );
  });

  const trendingArticlesSource = combinedFavArticles
    .filter(article => article.source === 'trending')
    .map(article => article.source); // This will store an array of "trending"
  console.log('variable', trendingArticlesSource);

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
//   // console.log('allArticles==>>', allArticles);
//   const {toggleLike} = useToggleTrendingLike();

//   const [favArticless, setFavArticles] = useState([]);

//   //  const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
//   // const latestFavArticles = useGetFavArticles();
//   // const combinedFavArticlesMap = new Map();
//   // trendingFavArticles.forEach(article => {
//   //   const id = article._id?.toString() || article.id;
//   //   combinedFavArticlesMap.set(id, article);
//   // });
//   // latestFavArticles.forEach(article => {
//   //   const id = article._id?.toString() || article.id;
//   //   combinedFavArticlesMap.set(id, article);
//   // });

//   // const combinedFavArticles = Array.from(combinedFavArticlesMap.values());

//   const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
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
//   // console.log('schema data of treding', trendingArticlesFromRealm.toJSON());
//   const art = useQuery('Article');

//   // console.log('schema data of latest', art.toJSON());

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
//   //two for Favorite
//   const filteredfavArticles =
//     activeCategory === 'All'
//       ? combinedFavArticles
//       : combinedFavArticles.filter(
//           article => article.category === activeCategory,
//         );

//   // Determine which articles to show
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

//   const fi =
//     activeCategory === 'All'
//       ? nameret.length > 0
//         ? allArticles.filter(article => nameret.includes(article.category)) // Filter by nameret if it's not empty
//         : allArticles // Show all articles if nameret is empty
//       : allArticles.filter(article => article.category === activeCategory);

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
//           ) // Filter by nameret if it's not empty
//         : combinedFavArticles // Show all articles if nameret is empty
//       : combinedFavArticles.filter(
//           article => article.category === activeCategory,
//         );

//   useEffect(() => {
//     console.log('RUN/');
//     getCatories();
//     init();
//   }, []);
//   console.log(
//     'combinedFavArticles------>',
//     JSON.stringify(combinedFavArticles),
//   );

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

//           {/* //trending section */}

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
