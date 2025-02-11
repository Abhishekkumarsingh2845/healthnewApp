// original code
import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
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
import Card from '../../components/AppComponents/Card';
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
import {useRoute} from '../../context/initialRoute';

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
  const [isLoading, setIsLoading] = useState(true);

  const {isGettingInitialRoute} = useRoute();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Disable the loader after 15 seconds
    }, 8000); // 15 seconds

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);
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

  const combinedFavArticles = Array.from(combinedFavArticlesMap.values());

  // combinedFavArticles.forEach(article => {
  //   console.log(
  //     `Article ID: ${article._id || article.id}, Source: ${article.source}`,
  //   );
  // });

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

  // useEffect(() => {
  //   // Fetch trending articles immediately when the component mounts
  //   fetchTrendingArticles();

  //   // Set up an interval to fetch trending articles every 5 seconds
  //   const intervalId = setInterval(fetchTrendingArticles, 100000);

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);

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
      ? firstFiveArticles
      : firstFiveArticles.filter(
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

  const fl = firstFiveArticles.filter(article => {
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

  console.log("activeCategory::",activeCategory,nameret)

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
    AsyncStorage.removeItem('reveersefilter');
    AsyncStorage.removeItem('selectedCategory');
    realm.write(() => {
      realm.delete(realm.objects(FilterCategory));
    });
    
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

  // console.log("->>state name",activeCategory);
  const setActiveCategoryAndStore = async (category: string) => {
    console.log('->>>>', category);
    setActiveCategory(category); // Update the state
    try {
      await AsyncStorage.setItem('selectedCategory', category); 
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

  // console.log('->>state isFetching', isGettingInitialRoute);

  return (
    <>
      <AppSafeAreaView>
        <Header
          onPressFilter={() => {
            setShowFilter(true);
          }}
        />
        {isLoading || isGettingInitialRoute ? (
          <View style={style.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            <ScrollView
              refreshControl={
                <RefreshControl
                  colors={[Colors.primary]}
                  refreshing={refreshing}
                  onRefresh={init}
                />
              }
              showsVerticalScrollIndicator={false}>
              <>
                <Categories
                  activecat={activeCategory}
                  onCategoryChange={setActiveCategoryAndStore}
                />

                {filteredArticles.length > 0 && (
                  <CategorySection
                    prefixAtTitle={
                      <LottieView
                        source={Lottie.latest}
                        autoPlay
                        loop
                        style={{
                          width: moderateScale(30),
                          height: moderateScale(30),
                        }}
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
                    {/* //scrollview content  */}
                    {/* <ScrollView
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
              </ScrollView> */}
                    <FlatList
                      horizontal
                      pagingEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      data={fi}
                      keyExtractor={(item, index) => item._id.toHexString()} // Use unique id from your data as key
                      renderItem={({item}) => (
                        <Card
                          onClick={() => {
                            const id = item._id.toHexString();
                            Nav.navigate('NewsDetail', {
                              _id: id,
                            } as NewsDetailsPropType);
                          }}
                          {...item}
                        />
                      )}
                    />
                  </CategorySection>
                )}

                {filteredTrendingArticles.length > 0 && (
                  <CategorySection
                    prefixAtTitle={
                      <LottieView
                        source={Lottie.trending}
                        autoPlay
                        loop
                        style={{
                          width: moderateScale(30),
                          height: moderateScale(30),
                        }}
                      />
                    }
                    title="Trending News"
                    titleStyle={style.title}
                    headerContainerStyle={style.header}
                    left="View All"
                    moreStyle={style.moreStyle}
                    onViewAllPress={() => Nav.navigate('ViewAll')}>
                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
    </ScrollView> */}

                    <FlatList
                      horizontal
                      pagingEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      data={fl}
                      keyExtractor={(item, index) =>
                        item._id ? item._id.toHexString() : item.id.toString()
                      } // Use a unique key for each item
                      renderItem={({item}) => (
                        <Card
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
                      )}
                    />
                  </CategorySection>
                )}
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
                    {/* <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
      {ffv.map((item, index) => {
        return (
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
    </ScrollView> */}
                    <FlatList
                      horizontal
                      pagingEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      data={ffv}
                      keyExtractor={(item, index) =>
                        item._id ? item._id.toHexString() : item.id.toString()
                      }
                      renderItem={({item}) => (
                        <Card
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
                      )}
                    />
                  </CategorySection>
                )}
                <View style={{padding: moderateScale(55)}} />
              </>
            </ScrollView>
          </>
        )}

        <FilterModal
          selectedDate={selectedStartDate}
          todate={selectedEndDate}
          setSelectedDate={setSelectedStartDate}
          tosetdate={setSelectedEndDate}
          modalOpenFlag={showFilter}
          modalClose={setShowFilter}
          onApplyfilter={filterdata => {
            console.log('filterd data->>>', filterdata);
            setActiveCategoryAndStore(filterdata);
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Explore;
