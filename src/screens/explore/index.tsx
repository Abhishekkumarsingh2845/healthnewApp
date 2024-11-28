import { Image, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import Header from "./components/header";
import Categories from "../../components/AppComponents/categories";
import CategorySection from "../../components/CategorySections";
import AppImage from "../../components/AppImage";
import { Icons, Images, Lottie } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle } from "../../config/style.config";
import Card from "../../components/AppComponents/card";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigations/MainNavigation/models";

import FilterModal from "../../components/AppComponents/filterModal";
import { useCallback, useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import { fetchLatestArticles } from "../../store/article/article.network";
import { deleteArticles, saveManyArticles } from "../../store/article/article.service";
import { errorLog, infoLog } from "../../utils/debug";
import { useGetArticles, useGetFavArticles } from "../../store/article/article.hooks";
import { NewsDetailsPropType } from "../newDetail";
import { NewsListType } from "../news/types/enum";
import { NewsPropType } from "../news/types/interface";
import { useCategory } from "../../store/category/category.hooks";

const Explore = () => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();
    const {getCatories} = useCategory();
    const [showFilter, setShowFilter] = useState(false);
    const allArticles = useGetArticles();
    const favArticles = useGetFavArticles();
    const [refreshing, setRefreshing] = useState(false);
    const getLatestArticle = useCallback(async (page: number) => {
        const res = await fetchLatestArticles({ page, search:'' });
        if (page == 1) {
            deleteArticles();
        }
        if (res.status) {
            if (res?.response?.articles) {
                saveManyArticles(res?.response?.articles)
            }
        } else {
            errorLog(res.message);
        }
    }, [])
    const init = async () => {
        setRefreshing(true);
        await getLatestArticle(1)
        setRefreshing(false);
    }

    useEffect(() => {
        console.log("RUN/")
        getCatories();
        init()
    }, [])
    return (
        <>
            <AppSafeAreaView>
                
                    <Header onPressFilter={() => {
                        setShowFilter(true);
                    }} />
                    <ScrollView
                    refreshControl={<RefreshControl colors={[Colors.primary]} refreshing={refreshing} onRefresh={init} />}
                    showsVerticalScrollIndicator={false}>
                    <Categories />
                    {
                        allArticles.length > 0 &&
                        <CategorySection
                            prefixAtTitle={<LottieView source={Lottie.latest} autoPlay loop style={{ width: moderateScale(30), height: moderateScale(30) }} />}
                            title={"Latest News"}
                            titleStyle={style.title}
                            headerContainerStyle={style.header}
                            left={'View All'}
                            moreStyle={style.moreStyle}
                            onViewAllPress={() => {
                                Nav.navigate('News', {
                                    title: 'Latest News',
                                    type: NewsListType.Latest,
                                    icon: <LottieView source={Lottie.latest} autoPlay loop style={{ width: moderateScale(30), height: moderateScale(30) }} />

                                } as NewsPropType)
                            }}
                        >
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    allArticles.map((item, index) => {
                                        return (
                                            <Card key={index} onClick={() => {
                                                const id = item._id.toHexString();
                                                Nav.navigate('NewsDetail', { _id: id } as NewsDetailsPropType)
                                            }} {...item} />
                                        )
                                    })
                                }
                            </ScrollView>

                        </CategorySection>
                    }
                    {/* <CategorySection
                        prefixAtTitle={<LottieView source={Lottie.trending} autoPlay loop style={{ width: moderateScale(30), height: moderateScale(30) }} />}
                        title={"Trending/Popular News"}
                        titleStyle={style.title}
                        headerContainerStyle={style.header}
                        left={'View All'}
                        moreStyle={style.moreStyle}
                        onViewAllPress={() => {
                            Nav.navigate('News', { title: 'Trending/Popular News', icon: <LottieView source={Lottie.trending} autoPlay loop style={{ width: moderateScale(30), height: moderateScale(30) }} /> } as NewsPropType)
                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map((_, index) => {
                                    return (
                                        <Card
                                            key={index}
                                            onClick={() => {
                                                Nav.navigate('NewsDetail')
                                            }}
                                        />
                                    )
                                })
                            }
                        </ScrollView>

                    </CategorySection> */}
                    {
                        favArticles.length > 0 &&
                        <CategorySection
                            prefixAtTitle={<Image tintColor={Colors.error} source={Icons.ic_love} style={{ width: moderateScale(20), height: moderateScale(20), marginHorizontal: moderateScale(4) }} />}
                            title={"Favorites News"}
                            titleStyle={style.title}
                            headerContainerStyle={style.header}
                            left={'View All'}
                            moreStyle={style.moreStyle}
                            onViewAllPress={() => {

                                Nav.navigate('News', {
                                    title: 'Favorites News',
                                    type:NewsListType.Favourite,
                                    icon: <Image tintColor={Colors.error} source={Icons.ic_love} style={{ width: moderateScale(20), height: moderateScale(20), marginHorizontal: moderateScale(4) }} />
                                } as NewsPropType)

                            }}
                        >
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    favArticles.map((item, index) => {
                                        return (
                                            <Card
                                                {...item}
                                                key={index}
                                                onClick={() => {
                                                    const id = item._id.toHexString();
                                                    Nav.navigate('NewsDetail',{_id:id} as NewsDetailsPropType)
                                                }}
                                            />
                                        )
                                    })
                                }
                            </ScrollView>

                        </CategorySection>
                    }
                    <View style={{ padding: moderateScale(55) }} />
                </ScrollView>
                <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter} />
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

export default Explore;