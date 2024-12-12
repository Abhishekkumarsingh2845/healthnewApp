import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useGetFavArticles} from '../../store/article/article.hooks';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';
import Card from '../../components/AppComponents/card';
import Header from '../news/components/header';
import Categories from '../../components/AppComponents/categories';
import {usetrendingFavArticles} from '../../store/trending/trendinghook';
import AppSafeAreaView from '../../components/AppSafeAreaView';
const Favviewall = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  // const favArticles = useGetFavArticles();
  const [activeCategory, setActiveCategory] = useState('All');

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
  const filteredfavArticles =
    activeCategory === 'All'
      ? combinedFavArticles
      : combinedFavArticles.filter(
          article => article.category === activeCategory,
        );

  return (
    <AppSafeAreaView>
      <SafeAreaView />
      <Header icon={undefined} title={'Favorites News'} />

      <Categories onCategoryChange={setActiveCategory} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredfavArticles.map((item, index) => {
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
        <View style={{marginVertical: 60}}></View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default Favviewall;

const styles = StyleSheet.create({});
