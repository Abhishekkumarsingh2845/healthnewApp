import { RefreshControl, ScrollView, Text, View } from "react-native"
import AppSafeAreaView from "../../components/AppSafeAreaView"
import Categories from "../../components/AppComponents/categories"
import CategorySection from "../../components/CategorySections"
import { moderateScale } from "react-native-size-matters"
import Card from "../../components/AppComponents/card"
import AppImage from "../../components/AppImage"
import { Icons } from "../../generated/image.assets"
import { FontStyle, Style } from "../../config/style.config"
import { Colors } from "../../config/colors.config"
import { Size, Spacing } from "../../config/size.config"
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParamList } from "../../navigations/MainNavigation/models"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import BackButton from "../../components/BackButton"
import { NewListType } from "./types/enum"
import { useGetArticles } from "../../store/article/article.hooks"
import { NewsDetailsPropType } from "../newDetail"
import InfiniteList from "../../components/InfiniteList"
import { ArticleType } from "../../store/article/article.interface"
import { fetchLatestArticles } from "../../store/article/article.network"
import { deleteArticles, saveManyArticles } from "../../store/article/article.service"
import { errorLog } from "../../utils/debug"
import { ActivityIndicator } from "react-native-paper"
import { NewsPropType } from "./types/interface"
import Header from "./components/header"


const News = (props: NewsPropType) => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();
    const params = props.route.params;
    const latest = useGetArticles();
    const [paginationDetails, setPaginationDetails] = useState({
        page: 1,
        totalPages: 0,
        refreshing: false,
        loadMore: false
    })
    const Lists = useMemo(() => {
        switch (params.type) {
            case NewListType.Latest:
                return latest
            case NewListType.Favourite:
                return latest
            case NewListType.Trending:
                return latest
            default: return []
        }
    }, [params.type])

    const changePaginationValues = useCallback((key: keyof typeof paginationDetails, value: boolean | number) => {
        setPaginationDetails((prev) => ({ ...prev, key: value }))
    }, [])
    const changePageNumbe = useCallback((key: keyof typeof paginationDetails, value: boolean) => {
        setPaginationDetails((prev) => ({ ...prev, key: value }))
    }, [])
    const getLatestArticle = useCallback(async (page: number) => {
        changePaginationValues('refreshing', true)
        const res = await fetchLatestArticles({ page });
        if (page == 1) {
            deleteArticles();
        }
        if (res.status) {
            if (res?.response?.articles) {
                saveManyArticles(res?.response?.articles)
                const pagination = res?.response?.pagination;
                changePaginationValues('totalPages', pagination?.totalPages ?? 1)
            }
        } else {
            errorLog(res.message);
        }
        changePaginationValues('refreshing', false)
    }, [])
    const onLoadMore = async () => {
        // console.log('load more....')
        if (Lists.length > 0) {
            changePaginationValues('loadMore', true)
            const updatedPage = paginationDetails.page + 1;
            changePaginationValues('page', updatedPage);
            await getLatestArticle(updatedPage)
            changePaginationValues('loadMore', false)
        }
    }
    const init = useCallback(() => {
        switch (params.type) {
            case NewListType.Latest: getLatestArticle(1)
                break;
            case NewListType.Favourite: getLatestArticle(1)
                break;
            case NewListType.Trending: getLatestArticle(1)
                break;
        }
    }, [params.type])

    useEffect(() => {
        init()
    }, [])
    return (
        <>
            <AppSafeAreaView title={''}>
                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                {/* <View style={[Style.flexRow, { alignItems: 'center', gap: moderateScale(3), marginTop: Spacing.topSpace, alignSelf: 'center', justifyContent: 'center', width: '100%' }]}>
                    <BackButton color={Colors.black} size={moderateScale(20)}
                        style={{
                            left: 0
                        }}
                    />
                    {params.icon}
                    <Text style={[FontStyle.bold, { color: Colors.black }]} >{params.title}</Text>
                </View> */}
                {/* <Categories /> */}
                <Header  {...params}/>
                <View style={{ alignItems: 'center' }}>

                    <InfiniteList
                        data={Lists as any}
                        totalPages={paginationDetails.totalPages}
                        refreshControl={<RefreshControl
                            colors={[Colors.primary]}
                            refreshing={paginationDetails.refreshing}
                            onRefresh={init} />}
                        onLoad={onLoadMore}
                        ListFooterComponent={() => {

                            return (paginationDetails.loadMore) ? <View style={{ padding: "12%" }}  >
                                <ActivityIndicator
                                    size={moderateScale(30)}
                                    color={Colors.primary}
                                />
                            </View> :
                                <View style={{ padding: "12%" }} />

                        }}
                        renderItem={({ item, index }) => {
                            return (
                                    <Card
                                        {...item}
                                        containerStyle={{
                                            width: Size.screenWidth * 0.9
                                        }}
                                        onClick={() => {
                                            const _id = item._id.toHexString();
                                            Nav.navigate('NewsDetail', { _id } as NewsDetailsPropType)
                                        }}
                                    />
                                    
                                

                            )
                        }}
                    />
                </View>
                <View style={{ padding: moderateScale(55) }} />
                {/* </ScrollView> */}
            </AppSafeAreaView>
        </>
    )
}

export default News;