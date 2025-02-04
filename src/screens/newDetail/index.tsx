import React, {useEffect, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Banner from './components/banner';
import Header from './components/header';
import {FontStyle} from '../../config/style.config';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {Fonts} from '../../config/font.config';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';
import {StackScreenProps} from '@react-navigation/stack';
import {useQuery} from '@realm/react';
import Card from '../../components/AppComponents/card';
import Article from '../../store/article/article.schema';
import CategorySection from '../../components/CategorySections';
import LottieView from 'lottie-react-native';
import {Lottie} from '../../generated/image.assets';
import {Image} from 'react-native';
import {useToggleTrendingLike} from '../../store/trending/trendinghook';
import {SvgUri} from 'react-native-svg';

export interface NewsDetailsPropType
  extends StackScreenProps<RootStackParamList, 'NewsDetail'> {
  _id: string;
}

const NewsDetail = (props: NewsDetailsPropType) => {
  const getCategoryImageUrl = category => {
    if (category === 'Technology Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064797756-670133860.svg';
    } else if (category === 'Physical Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064965405-364083487.svg';
    } else if (category === 'Financial Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064860342-573612613.svg';
    } else if (category === 'Community Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064797756-670133860.svg';
    } else if (category === 'Occupational Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064937602-511736322.svg';
    } else if (category === 'Environmental Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064837345-385825304.svg';
    } else if (category === 'Medical Health') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738064912322-473747556.svg';
    } else if (category === 'Wholesome Originals') {
      return 'https://mobileapplications.s3.ap-south-1.amazonaws.com/uploads/catImageblack-1738142554199-252424239.svg';
    }
    return null;
  };

  const {toggleLike} = useToggleTrendingLike();
  const params = props.route.params || {}; // Safely handle missing params
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();

  const articles = useQuery(Article); // Fetch all articles
  const objId = params._id; // Assuming _id is passed directly as a string
  console.log('artilces stored in the lastest', articles);
  // Optional: Fetch individual article details
  const details = articles.find(article => article._id.toString() === objId);

  return (
    <View style={{paddingHorizontal: 20}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Render header and banner */}
        {details && (
          <>
            <Header {...details} />
            <View style={{marginTop: 10}}></View>
            <Banner {...details} />
            {/* <Text
              style={[
                FontStyle.bold,
                {
                  color: '#000000',

                  fontFamily: Fonts.light,
                  fontWeight: 400,
                  fontSize: moderateScale(14),
                  lineHeight: 16,
                },
              ]}>
              {details.category}
            </Text> */}

            <View
              style={{
                alignItems: 'center',
                // marginVertical: moderateScale(10),
                flexDirection: 'row',
              }}>
              <SvgUri
                uri={getCategoryImageUrl(details.category)}
                onError={() => console.log('error svg')}
                width="35"
                height="35"
              />
              <Text
                style={[
                  FontStyle.bold,
                  {
                    color: '#000000',
                    // marginVertical: moderateScale(10),
                    fontFamily: Fonts.bold,
                    fontWeight: 400,
                    marginLeft: 10,
                    fontSize: moderateScale(14),

                    lineHeight: 16,
                  },
                ]}>
                {details.category}
              </Text>
            </View>

            <Text
              style={[
                FontStyle.bold,
                {
                  color: '#000000',
                  marginVertical: moderateScale(10),
                  fontFamily: Fonts.bold,
                  fontWeight: 700,
                  fontSize: moderateScale(25),
                  lineHeight: 30,
                },
              ]}>
              {details.title}
            </Text>
            <Text
              style={[
                FontStyle.regular,
                {
                  fontWeight: '400',
                  fontFamily: Fonts.light,
                  lineHeight: moderateScale(23),
                  fontSize: moderateScale(15),
                  color: '#1D1D1D',
                },
              ]}>
              {details.content}
            </Text>

            {details.url ? (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(details.url);
                }}>
                <Text
                  style={[
                    FontStyle.regular,
                    {
                      fontWeight: '400',
                      fontFamily: Fonts.light,
                      lineHeight: moderateScale(23),
                      fontSize: moderateScale(15),
                      textAlign: 'right',
                      color: Colors.primary,
                    },
                  ]}>
                  Show Original
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={style.showdoccontainer}></TouchableOpacity>
          </>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <Image
            source={require('../../../assets/images/rn.png')}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
              marginRight: 5,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              color: '#000000',
              fontFamily: Fonts.bold,
              fontWeight: 700,
            }}>
            Related New
          </Text>
        </View>

        {articles && articles.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: moderateScale(0)}}>
            {articles
              .filter(article => article._id.toString() !== objId) // Exclude the current article by its _id
              .map((item, index) => (
                <Card
                  onClick={() => {
                    const id = item._id.toHexString();
                    Nav.navigate('NewsDetail', {
                      _id: id,
                    } as NewsDetailsPropType);
                  }}
                  key={item._id.toString()}
                  title={item.title}
                  // Passing isLiked state to Card component
                  content={item.content}
                  category={item.category}
                  updatedAt={item.updatedAt}
                  // isLiked={item.isLiked}
                  urlToImage={item.urlToImage} // Pass `urlToImage` as a prop
                  description={item.description} // Pass `description` as a prop
                  style={{marginRight: moderateScale(10)}}
                  onLike={() => {
                    toggleLike(item?._id as any);
                  }}
                />
              ))}
          </ScrollView>
        ) : (
          <Text style={style.noDataText}>No articles available</Text>
        )}
        <View style={{marginVertical: 15}}></View>
      </ScrollView>
    </View>
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
  showdoccontainer: {
    width: '100%',
    marginTop: Platform.OS === 'android' ? 12 : 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  showdocumenttxt: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: moderateScale(16),
    color: Colors.gray,
  },
});

export default NewsDetail;
