import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";

import Categories from "../../components/AppComponents/categories";
import CategorySection from "../../components/CategorySections";
import AppImage from "../../components/AppImage";
import { Icons, Images } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle } from "../../config/style.config";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Card from "./components/card";

const Notifications = () => {
    return (
        <>
            <AppSafeAreaView title="Notifications">

                {/* <Header /> */}
                <Categories />
                <FlatList
                    data={new Array(10).fill('')}
                    renderItem={() => {
                        return (<Card />)
                    }}

                />


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

export default Notifications;