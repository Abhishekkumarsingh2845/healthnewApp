import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useGetFavArticles} from '../../store/article/article.hooks';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';
import Card from '../../components/AppComponents/card';
import Header from '../favorite/components/header';

const Favviewall = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const favArticles = useGetFavArticles();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Header  title={"favourite"}/>
      <ScrollView showsVerticalScrollIndicator={false}>
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
    </View>
  );
};

export default Favviewall;

const styles = StyleSheet.create({});
