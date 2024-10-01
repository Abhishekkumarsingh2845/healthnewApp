import { ScrollView, StyleSheet, Text } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import Header from "./components/header";
import Categories from "./components/categories";
import CategorySection from "../../components/CategorySections";
import AppImage from "../../components/AppImage";
import { Icons, Images } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle } from "../../config/style.config";
import Card from "../../components/AppComponents/Card";

const Explore = () => {
    return (
        <>
            <AppSafeAreaView>
                <ScrollView>
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
                        <Card/>
                    </CategorySection>
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