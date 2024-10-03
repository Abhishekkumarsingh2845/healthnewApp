import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import Header from "./components/header";
import Categories from "../../components/AppComponents/categories";
import CategorySection from "../../components/CategorySections";
import AppImage from "../../components/AppImage";
import { Icons, Images } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle } from "../../config/style.config";
import Card from "../../components/AppComponents/card";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const Explore = () => {
    return (
        <>
            <AppSafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Header />
                    <Categories />
                    <CategorySection
                        prefixAtTitle={<AppImage source={Icons.ic_latest} style={{ width: moderateScale(20), height: moderateScale(20) }} />}
                        title={"Latest News"}
                        titleStyle={style.title}
                        headerContainerStyle={style.header}
                        left={'View All'}
                        moreStyle={style.moreStyle}
                        onViewAllPress={() => {

                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map(()=>{
                                    return(
                                        <Card/>
                                    )
                                })
                            }
                        </ScrollView>
                        
                    </CategorySection>
                    <CategorySection
                        prefixAtTitle={<MaterialIcons name={'trending-up'} size={moderateScale(20)} color={Colors.primary} style={{marginRight: moderateScale(4)}} />}
                        title={"Trending/Popular News"}
                        titleStyle={style.title}
                        headerContainerStyle={style.header}
                        left={'View All'}
                        moreStyle={style.moreStyle}
                        onViewAllPress={() => {

                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map(()=>{
                                    return(
                                        <Card/>
                                    )
                                })
                            }
                        </ScrollView>
                        
                    </CategorySection>
                    <CategorySection
                        prefixAtTitle={<AppImage tintColor={Colors.error}  source={Icons.ic_love} style={{ width: moderateScale(20), height: moderateScale(20), marginHorizontal:moderateScale(4) }} />}
                        title={"Favorites News"}
                        titleStyle={style.title}
                        headerContainerStyle={style.header}
                        left={'View All'}
                        moreStyle={style.moreStyle}
                        onViewAllPress={() => {

                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map(()=>{
                                    return(
                                        <Card/>
                                    )
                                })
                            }
                        </ScrollView>
                        
                    </CategorySection>
                    <View style={{padding:moderateScale(55)}}  />
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

export default Explore;