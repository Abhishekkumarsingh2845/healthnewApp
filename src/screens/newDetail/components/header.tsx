import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import BackButton from '../../../components/BackButton';
import AppImage from '../../../components/AppImage';
import {Icons, Images} from '../../../generated/image.assets';
import {Style} from '../../../config/style.config';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../../config/colors.config';
import {Spacing} from '../../../config/size.config';
import {ArticleType} from '../../../store/article/article.interface';
import {
  useGetArticlesById,
  useToggleLikeArticle,
} from '../../../store/article/article.hooks';
import {BSON} from 'realm';
import {useQuery, useRealm} from '@realm/react';
import Article from '../../../store/article/article.schema';
import {useToggleTrendingLike} from '../../../store/trending/trendinghook';
import TrendingArticle from '../../../store/trending/trending.schema';
import {TrendingTypeArticle} from '../../../store/trending/trending.interface';

const Header = (props: ArticleType) => {
  const objId = new BSON.ObjectId(props._id);
  const realm = useRealm();
  console.log('HEADER>>>');
  const details = realm.objectForPrimaryKey(
    Article.schema.name,
    objId,
  ) as ArticleType;
  console.log('yyyyyyy', details);
  // const details = useGetArticlesById(new BSON.ObjectId(props._id)) as ArticleType;
  const {toggleLike} = useToggleLikeArticle();
  const dd = realm.objectForPrimaryKey(
    TrendingArticle.schema.name,
    objId,
  ) as TrendingTypeArticle;

  return (
    <SafeAreaView
      style={[
        Style.flexRow,
        {
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          // paddingTop: Spacing.topSpace,
        },
      ]}>
      <View
        style={[
          Style.flexRow,
          {alignItems: 'center', justifyContent: 'flex-start'},
        ]}>
        <BackButton
          color={Colors.black}
          size={moderateScale(20)}
          style={{position: 'relative'}}
        />
        <Image
          source={Images.appLogo}
          resizeMode={'contain'}
          tintColor={Colors.primary}
          style={{width: moderateScale(105), height: moderateScale(40)}}
        />
      </View>
      <View
        style={[
          Style.flexRow,
          {
            alignItems: 'center',
            gap: moderateScale(10),
            paddingTop: moderateScale(6),
          },
        ]}>
        <Pressable
          onPress={() => {
            toggleLike(props._id);
          }}>
          <Image
            resizeMode={'contain'}
            source={details.isLiked ? Icons.ic_active_love : Icons.ic_heart}
            style={style.icon}
            tintColor={details.isLiked ? Colors.primary : Colors.black}
          />
        </Pressable>

        {/* <Pressable
  onPress={() => {
    toggleLike(props._id); // Trigger your like toggle function
  }}
>
  <Image
    resizeMode={'contain'}
    source={
      (dd?.isLiked || details?.isLiked) // Check if either `dd` or `details` has `isLiked`
        ? Icons.ic_active_love
        : Icons.ic_heart
    }
    style={style.icon}
    tintColor={
      (dd?.isLiked || details?.isLiked) // Change the tint color based on `isLiked` status
        ? Colors.primary
        : Colors.black
    }
  /> */}
        {/* </Pressable> */}

        <Image
          resizeMode={'contain'}
          source={Icons.ic_move}
          style={style.icon}
          tintColor={Colors.black}
        />
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  icon: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
});
export default Header;

// import { StyleSheet, Text, TextInput, View } from 'react-native'
// import React, { useState } from 'react'

// const header = () => {
//   const data=["sncns","diosvisdhv"];
//   const [query,setquery] = useState("");
//   const search = data.filter(item=>item.includes(data));
//   return (

//     <View>
//       <TextInput value={query}
//       onChange={setquery}/>
//      {search.map((item,index)=>(
//      <View key={index}>
//      <Text>header</Text>
// <Text>ldnsvjnb</Text>
// </View>
//     ))}
//     </View>
//   )
// }

// export default header

// const styles = StyleSheet.create({})
