import {Image, StyleSheet, Text, View, ViewStyle} from 'react-native';

import {moderateScale} from 'react-native-size-matters';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppImage from '../../../components/AppImage';
import {FontStyle, Style} from '../../../config/style.config';
import {Icons} from '../../../generated/image.assets';
import {Colors} from '../../../config/colors.config';
import {Size} from '../../../config/size.config';
import {ArticleType} from '../../../store/article/article.interface';
import moment from 'moment';
import {Fonts} from '../../../config/font.config';

interface CardPropType extends ArticleType {
  containerStyle?: ViewStyle;
}
const Banner = (props: CardPropType) => {
  const img =
    'https://s3-alpha-sig.figma.com/img/c037/8a80/e3250b476a7f3a1d9749f5f222403e08?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NbJPPR4OEC7OLyEfAD6zHsL0nAEg4VB47tWL8PR5pWjpxk5Lw1x1Hv9k3f9dCypF5N1X8Qi4255Qrim~5WFW3qMVkG1IuXV09pZ961MzeUI1JNccNh6Qvbh3o3iUm1lwWt2igGRl8pxk4DaWDU6Im9nP7yjLsiTpy7V8pihCQVCOuHATGt7ILJWg0TESqACk3udqMzWEKEDNF17rP5xDg7WUYDDxPoQUOl4yflVuc~~OPWXs1ROUj2oh--bkuEIheGHI0nsVfYVKgfHcww2-5CRNbPGMBjf0VoDz71JYi8XrVjOK9HqfNcpNDeitRR8qRCFqjCaG11GP8rWsmjEDHg__';
  return (
    <>
      <View style={[style.box, props.containerStyle]}>
        <View style={style.container}>
          <AppImage
            source={{uri: props.urlToImage}}
            style={style.image}
            resizeMode={'stretch'}
          />
          {/* <Text
            style={{
              position: 'absolute',
              top: 10,
              left: 20,
              fontFamily:Fonts.regular,
              fontWeight:"400",
              color: Colors.white,
              textTransform: 'capitalize',
              lineHeight:20,
              fontSize: 15,
            }}>
            {props.category}
          </Text> */}
          {/* <Text style={[FontStyle.titleSemibold, style.label]}>
                  {props.category}
                </Text> */}
          {/* Overlay */}
          <View style={style.overlay}>
            <View style={{position: 'absolute', bottom: '5%', left: '5%'}}>
              <View style={[Style.flexRow, {gap: moderateScale(3)}]}>
                <Ionicons
                  name={'time-outline'}
                  size={moderateScale(20)}
                  color={Colors.white}
                />
                <Text
                  style={[
                    FontStyle.regular,
                    {color: Colors.white, fontSize: moderateScale(12)},
                  ]}>
                  {moment(props.updatedAt).fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            Style.flexRow,
            {
              justifyContent: 'space-between',
              paddingTop: moderateScale(10),
              paddingHorizontal: moderateScale(4),
            },
          ]}>
          {/* <View style={[Style.flexRow]}>
            <View style={style.iconContainer}>
              <Image
                source={Icons.ic_fitness}
                style={style.icon}
                resizeMode={'contain'}
                tintColor={Colors.white}
              />
            </View>
            <Text
              style={[
                FontStyle.titleSemibold,
                style.label,
                {color: Colors.black},
              ]}>
              Fitness
            </Text>
          </View> */}
          {/* <View style={[Style.flexRow, { gap: moderateScale(4) }]}>
                        
                        <View style={{ borderWidth: 1, borderColor: Colors.borderColor, padding: moderateScale(6), borderRadius: moderateScale(20) }}>
                            <Image source={Icons.ic_like} resizeMode={'contain'} style={{ width: moderateScale(20), height: moderateScale(20) }} />
                        </View>
                        <Text style={[FontStyle.title, { color: Colors.gray, fontSize:moderateScale(23) }]} >2</Text>
                    </View> */}
        </View>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  box: {
    // width:Size.screenWidth * 0.85,
    marginVertical: moderateScale(12),
    // backgroundColor: Colors.white,
    // padding: moderateScale(12),
    // elevation: 3,
    borderRadius: moderateScale(20),
    // marginRight: moderateScale(12)
  },
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: moderateScale(15),
  },
  image: {
    width: '100%',
    height: moderateScale(170),
  },
  overlay: {
    padding: moderateScale(12),
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0000004D',
    justifyContent: 'space-between',
  },
  icon: {
    width: moderateScale(22),
    height: moderateScale(22),
  },
  iconContainer: {
    backgroundColor: Colors.black,
    padding: moderateScale(8),
    borderRadius: moderateScale(100),
  },
  label: {
    paddingHorizontal: moderateScale(6),
    color: Colors.white,
    fontSize: moderateScale(18),
  },
  otherIconsContainer: {
    backgroundColor: '#0000006D',
  },
});

export default Banner;
