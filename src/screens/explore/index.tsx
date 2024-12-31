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

const Explore = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const {getCatories} = useCategory();
  const {saveManyArticles, deleteArticles} = useToggleLikeArticle();
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const allArticles = useGetArticles();
  console.log('allArticles==>>', allArticles);
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
  console.log('TYPE OF THE fav', typeof combinedFavArticles);
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
      } else {
        console.log('no artilces');
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error);
    }
  };

  // const fetchTrendingArticles = async () => {
  //   try {
  //     const response = await axios.get(
  //       'http://15.206.16.230:4000/api/v1/android/trendingarticle',
  //     );

  //     // Check if the response contains valid data
  //     if (response.data.status && response.data.data.length == 0) {
  //       const fetchedArticleIds = response.data.data.map(
  //         (article: any) => article._id,
  //       );

  //       realm.write(() => {
  //         // Update Realm with the latest fetched articles
  //         response.data.data.forEach((article: any) => {
  //           const articleId = new BSON.ObjectId(article._id);
  //           let data = {
  //             ...article,
  //             _id: articleId,
  //           };

  //           const fav = realm
  //             .objects(Favorite.schema.name)
  //             .filtered(`articleId == $0`, articleId);
  //           data['isLiked'] = fav.length > 0;

  //           // Create or modify the trending article in Realm
  //           realm.create(
  //             TrendingArticle.schema.name,
  //             data,
  //             Realm.UpdateMode.Modified,
  //           );
  //         });

  //         // Handle deleting articles from Realm that are not in the fetched data
  //         const currentArticles = realm.objects(TrendingArticle.schema.name);
  //         currentArticles.forEach((currentArticle: any) => {
  //           if (!fetchedArticleIds.includes(currentArticle._id.toString())) {
  //             realm.delete(currentArticle); // Delete the article from Realm DB
  //           }
  //         });
  //       });

  //       // Now you can use the fetched data to update your UI
  //       setTrendingArticles(response.data.data); // Use state or context to store this data
  //     } else {
  //       // If no data is available from the API, clear the UI or show no data message
  //       setTrendingArticles([]); // Assuming you use a state to store and show the data
  //       console.log("No articles available from API");
  //     }
  //   } catch (error) {
  //     console.error('Error fetching trending articles:', error);
  //     // Handle the error (e.g., show an error message)
  //   }
  // };

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
  // const ffv =
  //   activeCategory === 'All'
  //     ? combinedFavArticles
  //     : combinedFavArticles.filter(
  //         article => article.category === activeCategory,
  //       );
  // console.log('');
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
  // console.log('data in the dateschema', d);
  console.log('startdate ->>>', startDa);
  console.log('endate ->>>>>>', endDa);

  //real filter for the latest new
  // const fi =
  //   activeCategory === 'All'
  //     ? nameret.length > 0
  //       ? allArticles.filter(article => nameret.includes(article.category)) // Filter by nameret if it's not empty
  //       : allArticles // Show all articles if nameret is empty
  //     : allArticles.filter(article => article.category === activeCategory);





//  same date filter
  const normalizeDate = (date: string | number | Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Set time to midnight to compare only the date part
    return d;
  };
  // const fi = allArticles.filter(article => {
  //   const updatedAtDate = normalizeDate(article.updatedAt);
  //   const startDate = startDa ? normalizeDate(startDa) : null; // Set to null if no start date
  //   const endDate = endDa ? normalizeDate(endDa) : null; // Set to null if no end date
  
  //   // Check if the date is within the range only if both startDate and endDate are provided
  //   const isWithinDateRange = startDate && endDate
  //     ? updatedAtDate >= startDate && updatedAtDate <= endDate
  //     : true; // If either startDate or endDate is empty, don't filter by date
  
  //   // Execute the category match logic if startDate and endDate are empty
  //   const isCategoryMatch =
  //     (startDate === null && endDate === null) ||
  //     activeCategory === 'All'
  //       ? nameret.length > 0
  //         ? nameret.includes(article.category)
  //         : true
  //       : article.category === activeCategory;
  
  //   // Return articles based on the conditions: valid date range and category match
  //   return isWithinDateRange && isCategoryMatch;
  // });


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
// original filter
  // const fi = allArticles.filter(article => {
  //   const updatedAt = new Date(article.updatedAt).getTime();
  //   const startDate = startDa ? new Date(startDa).getTime() : -Infinity;
  //   const endDate = endDa ? new Date(endDa).getTime() : Infinity;

  //   const isWithinDateRange = updatedAt >= startDate && updatedAt <= endDate;

  //   const isCategoryMatch =
  //     activeCategory === 'All'
  //       ? nameret.length > 0
  //         ? nameret.includes(article.category)
  //         : true
  //       : article.category === activeCategory;

  //   return isWithinDateRange && isCategoryMatch;
  // });

  
  //real filter for the trending new
  // const fl =
  //   activeCategory === 'All'
  //     ? nameret.length > 0
  //       ? trendingArticlesFromRealm.filter(article =>
  //           nameret.includes(article.category),
  //         ) // Filter by nameret if it's not empty
  //       : trendingArticlesFromRealm // Show all articles if nameret is empty
  //     : trendingArticlesFromRealm.filter(
  //         article => article.category === activeCategory,
  //       );

  // filter by sortdate for trending


// original filter
  // const fl = trendingArticlesFromRealm.filter(article => {
  //   const updatedAt = new Date(article.updatedAt).getTime();
  //   const startDate = startDa ? new Date(startDa).getTime() : -Infinity; // Default to earliest possible date
  //   const endDate = endDa ? new Date(endDa).getTime() : Infinity; // Default to latest possible date

  //   const isWithinDateRange = updatedAt >= startDate && updatedAt <= endDate;
  //   const isCategoryMatch =
  //     activeCategory === 'All'
  //       ? nameret.length > 0
  //         ? nameret.includes(article.category)
  //         : true // Show all articles if nameret is empty
  //       : article.category === activeCategory;
  //   return isWithinDateRange && isCategoryMatch;
  // });
  
  const fl = trendingArticlesFromRealm.filter(article => {
    const updatedAtDate = normalizeDate(article.updatedAt);
    const startDate = startDa ? normalizeDate(startDa) : null; // Set to null if no start date
    const endDate = endDa ? normalizeDate(endDa) : null; // Set to null if no end date
  
    // Check if the date is within the range only if both startDate and endDate are provided
    const isWithinDateRange = startDate && endDate
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
  





  //real filter for the favorrite  new
  // const ffv =
  //   activeCategory === 'All'
  //     ? nameret.length > 0
  //       ? combinedFavArticles.filter(article =>
  //           nameret.includes(article.category),
  //         ) // Filter by nameret if it's not empty
  //       : combinedFavArticles // Show all articles if nameret is empty
  //     : combinedFavArticles.filter(
  //         article => article.category === activeCategory,
  //       );






// original filter
  // const ffv = combinedFavArticles.filter(article => {
  //   const updatedAt = new Date(article.updatedAt).getTime();
  //   const startDate = startDa ? new Date(startDa).getTime() : -Infinity; // Default to earliest possible date
  //   const endDate = endDa ? new Date(endDa).getTime() : Infinity; // Default to latest possible date
  //   const isWithinDateRange = updatedAt >= startDate && updatedAt <= endDate;
  //   const isCategoryMatch =
  //     activeCategory === 'All'
  //       ? nameret.length > 0
  //         ? nameret.includes(article.category)
  //         : true // Show all articles if nameret is empty
  //       : article.category === activeCategory;
  //   return isWithinDateRange && isCategoryMatch;
  // });

  const ffv = combinedFavArticles.filter(article => {
    const updatedAtDate = normalizeDate(article.updatedAt);
    const startDate = startDa ? normalizeDate(startDa) : null; // Set to null if no start date
    const endDate = endDa ? normalizeDate(endDa) : null; // Set to null if no end date
  
    // Check if the date is within the range only if both startDate and endDate are provided
    const isWithinDateRange = startDate && endDate
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
    init();
  }, []);
  // console.log(
  //   'combinedFavArticles------>',
  //   JSON.stringify(combinedFavArticles),
  // );
  const dateschemcheck = useQuery(Datesch);
  const aa = realm.objects('Datesch');

  // console.log('->', aa);
  // console.log('->>', dateschemcheck);

  // firebase notififcation
  // messaging().setBackgroundMessageHandler(
  //     async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  //       console.log('Background notification:', remoteMessage);

  //     }
  //   );

  //   useEffect(() => {
  //   const requestPermission = async () => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       getFCMToken();
  //       console.log('Notification permission granted.');
  //     } else {
  //       console.log('Notification permission denied.');
  //     }
  //   };
  //   const getFCMToken = async () => {
  //     const token = await messaging().getToken();
  //     console.log('FCM Token:', token);
  //   };
  //   requestPermission();

  //   const unsubscribe = messaging().onMessage(
  //     async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  //       console.log('Foreground notification:', remoteMessage);
  //       if (remoteMessage.notification) {
  //         Alert.alert(
  //           remoteMessage.notification.title ?? 'No Title',
  //           remoteMessage.notification.body ?? 'No Body'
  //         );
  //       }
  //     }
  //   );
  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   const fetchDeviceInfo = async () => {
  //     const uniqueId = await DeviceInfo.getUniqueId();
  //     console.log("deviceid",uniqueId);
  //   };
  //   fetchDeviceInfo();
  // }, []);

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
