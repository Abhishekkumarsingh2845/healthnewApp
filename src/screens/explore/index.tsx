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
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigations/MainNavigation/models";
import { NewsPropType } from "../news";
import FilterModal from "../../components/AppComponents/filterModal";
import { useState } from "react";

const Explore = () => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();
    const [showFilter, setShowFilter] = useState(false);
    return (
        <>
            <AppSafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Header onPressFilter={()=>{
                        setShowFilter(true);
                    }} />
                    <Categories />
                    <CategorySection
                        prefixAtTitle={<AppImage source={Icons.ic_latest} style={{ width: moderateScale(20), height: moderateScale(20) }} />}
                        title={"Latest News"}
                        titleStyle={style.title}
                        headerContainerStyle={style.header}
                        left={'View All'}
                        moreStyle={style.moreStyle}
                        onViewAllPress={() => {
                            Nav.navigate('News',{title:'Latest News'}as NewsPropType)
                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map((item, index)=>{
                                    return(
                                        <Card key={index} onClick={()=>{
                                            Nav.navigate('NewsDetail')
                                        }} />
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
                            Nav.navigate('News',{title:'Trending/Popular News'}as NewsPropType)
                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map((_,index)=>{
                                    return(
                                        <Card
                                        key={index}
                                        onClick={()=>{
                                            Nav.navigate('NewsDetail')
                                        }}
                                        />
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
                            
                                Nav.navigate('News',{title:'Favorites News'}as NewsPropType)
                            
                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map((item,index)=>{
                                    return(
                                        <Card
                                        key={index}
                                        onClick={()=>{
                                            Nav.navigate('NewsDetail')
                                        }}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                        
                    </CategorySection>
                    <View style={{padding:moderateScale(55)}}  />
                </ScrollView>
                <FilterModal modalOpenFlag={showFilter} modalClose={setShowFilter}/>
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