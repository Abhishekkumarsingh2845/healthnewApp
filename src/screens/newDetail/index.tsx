import { ScrollView, StyleSheet, Text } from "react-native"
import AppSafeAreaView from "../../components/AppSafeAreaView"
import Banner from "./components/banner"
import Header from "./components/header"
import { FontStyle } from "../../config/style.config"
import { moderateScale } from "react-native-size-matters"
import { Colors } from "../../config/colors.config"
import CategorySection from "../../components/CategorySections"
import AppImage from "../../components/AppImage"
import { Icons } from "../../generated/image.assets"
import Card from "../../components/AppComponents/card"
import { Size } from "../../config/size.config"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { RootStackParamList } from "../../navigations/MainNavigation/models"
import { Fonts } from "../../config/font.config"
import { StackScreenProps } from "@react-navigation/stack"
import { BSON } from "realm"
import { ArticleType } from "../../store/article/article.interface"
import { useGetArticlesById } from "../../store/article/article.hooks"
import { useRealm } from "@realm/react"
import Article from "../../store/article/article.schema"
export interface NewsDetailsPropType extends StackScreenProps<RootStackParamList, 'NewsDetail'> {
    _id: string
}
const NewsDetail = (props: NewsDetailsPropType) => {
    const params = props.route.params;
    const realm = useRealm();
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();
    console.log(params._id, "ID...")
    const objId = new BSON.ObjectId(params._id)
    const details = useGetArticlesById(objId) as ArticleType;
    console.log(details, "SINGLE");
    // const details = realm.objectForPrimaryKey(Article.schema.name,objId) as ArticleType;
    return (
        <>
            <AppSafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Header {...details} />
                    <Banner {...details} />
                    <Text
                        style={[FontStyle.bold,
                        {
                            color: Colors.black,
                            marginVertical: moderateScale(10),
                            fontFamily: Fonts.bold,
                            fontSize: moderateScale(24),
                        }]}
                    >{details.title}</Text>
                    <Text
                        style={[FontStyle.regular,
                        {
                            lineHeight: moderateScale(27),
                            fontSize: moderateScale(17),
                            color: '#1D1D1D'
                        }]}
                    >{details.content}</Text>

                    {/* <CategorySection
                        prefixAtTitle={<AppImage source={Icons.ic_latest} style={{ width: moderateScale(20), height: moderateScale(20) }} />}
                        title={"Related News"}
                        titleStyle={style.title}
                        headerContainerStyle={style.header}
                        // left={'View All'}
                        moreStyle={style.moreStyle}
                        onViewAllPress={() => {

                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map((_, index) => {
                                    return (
                                        <Card
                                            containerStyle={{
                                                width: Size.screenWidth * 0.8,

                                            }}
                                            key={`Related-${index}`}
                                            onClick={() => {
                                                Nav.navigate('NewsDetail')
                                            }}
                                        />
                                    )
                                })
                            }
                        </ScrollView>

                    </CategorySection> */}

                </ScrollView>

            </AppSafeAreaView>
        </>
    )
}

const style = StyleSheet.create({
    title: {
        color: Colors.black,
    },
    header: {
        paddingHorizontal: moderateScale(0)
    },
    moreStyle: {
        color: Colors.primary,
        ...FontStyle.titleSemibold
    }
})

export default NewsDetail