import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useGetFavArticles} from '../../store/article/article.hooks';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';
import Card from '../../components/AppComponents/Card';
import Header from '../favorite/components/header';
import Categories from '../../components/AppComponents/categories';
import {
  useToggleTrendingLike,
  usetrendingFavArticles,
} from '../../store/trending/trendinghook';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import {Icons} from '../../generated/image.assets';
const Favviewall = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  // const favArticles = useGetFavArticles();
  const [activeCategory, setActiveCategory] = useState('All');

  const trendingFavArticles = usetrendingFavArticles(); // Trending favorites
  const latestFavArticles = useGetFavArticles();
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

  const filteredfavArticles =
    activeCategory === 'All'
      ? combinedFavArticles
      : combinedFavArticles.filter(
          article => article.category === activeCategory,
        );

  const trendingArticlesSource = combinedFavArticles
    .filter(article => article.source === 'trending')
    .map(article => article.source); // This will store an array of "trending"
  console.log('variable', trendingArticlesSource);

  const {toggleLike} = useToggleTrendingLike();
  return (
    <AppSafeAreaView>
      {/* <SafeAreaView /> */}
      <Header />

      <Categories onCategoryChange={setActiveCategory} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* {filteredfavArticles.map((item, index) => {
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
              // onLike={() => {
              //   toggleLike(item?._id as any);
              // }}
            />
          );
        })} */}
        {filteredfavArticles.map((item, index) => {
          const isTrending = item.source === 'trending'; // Check if the source is 'trending'
          return (
            <Card
              {...item}
              key={index}
              onClick={() => {
                const id = item._id.toHexString();
                Nav.navigate(
                  isTrending
                    ? 'Detailedtrend' // Navigate to 'Detailedtrend' if trending
                    : 'NewsDetail', // Otherwise navigate to 'NewsDetail'
                  {
                    ...(isTrending
                      ? {articleId: id} // Pass articleId for trending articles
                      : {_id: id}), // Pass _id for other articles
                  } as NewsDetailsPropType,
                );
              }}
              {...(trendingArticlesSource.length > 0 && {
                onLike: () => toggleLike(item?._id as any),
              })}
            />
          );
        })}

        <View style={{marginVertical: 60}}></View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default Favviewall;

const styles = StyleSheet.create({});
