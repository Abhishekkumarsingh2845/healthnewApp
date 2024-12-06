// original code of explore after garv fix
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

import {useToggleTrendingLike} from '../../store/trending/trendinghook';
import {BSON} from 'realm';
import TrendingArticle from '../../store/trending/trending.schema';
import Favorite from '../../store/favorite/favorite.schema';

const Explore = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const {getCatories} = useCategory();
  const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

  const [showFilter, setShowFilter] = useState(false);
  const allArticles = useGetArticles();
  // console.log("allArticles==>>",allArticles)

  const {toggleLike} = useToggleTrendingLike();

  const favArticles = useGetFavArticles();
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
        console.log('aa', aa);
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
          {/* //latest new section */}

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
                Nav.navigate('News', {
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
