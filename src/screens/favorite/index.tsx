import {Image, RefreshControl, ScrollView, Text, View} from 'react-native';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import Categories from '../../components/AppComponents/categories';
import CategorySection from '../../components/CategorySections';
import {moderateScale} from 'react-native-size-matters';
import Card from '../../components/AppComponents/Card';
import AppImage from '../../components/AppImage';
import {Icons} from '../../generated/image.assets';
import {FontStyle, Style} from '../../config/style.config';
import {Colors} from '../../config/colors.config';
import {Size, Spacing} from '../../config/size.config';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigations/MainNavigation/models';
import {useGetFavArticles} from '../../store/article/article.hooks';
import InfiniteList from '../../components/InfiniteList';
import {NewsDetailsPropType} from '../newDetail';
import Header from './components/header';

const Favorite = () => {
  const Nav = useNavigation<NavigationProp<RootStackParamList>>();
  const Lists = useGetFavArticles();
  const [activeCategory, setActiveCategory] = useState('All');
  return (
    <>
      <AppSafeAreaView>
        <Header />
        <Categories onCategoryChange={setActiveCategory} />
        <View style={{alignItems: 'center'}}>
          <InfiniteList
            data={Lists as any}
            totalPages={1}
            ListFooterComponent={() => {
              return <View style={{padding: '30%'}} />;
            }}
            onLoad={() => {}}
            renderItem={({item, index}) => {
              return (
                <Card
                  {...item}
                  containerStyle={{
                    width: Size.screenWidth * 0.9,
                  }}
                  onClick={() => {
                    const _id = item._id.toHexString();
                    Nav.navigate('NewsDetail', {_id} as NewsDetailsPropType);
                  }}
                />
              );
            }}
          />
        </View>
        <View style={{padding: moderateScale(55)}} />
      </AppSafeAreaView>
    </>
  );
};

export default Favorite;
