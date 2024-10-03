import { FlatList, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import Categories from "../../components/AppComponents/categories";
import CategorySection from "../../components/CategorySections";
import AppImage from "../../components/AppImage";
import { Icons, Images } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle, Style } from "../../config/style.config";
import Card from "./components/card";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Spacing } from "../../config/size.config";
import { ToggleButton } from "react-native-paper";

const Profile = () => {
    return (
        <>
            <AppSafeAreaView>

                <View style={[{
                    paddingTop: Spacing.topSpace
                },
                Style.flexMiddle

                ]}>
                    <AppImage source={Images.appLogo} style={{
                        width: moderateScale(160),
                        height: moderateScale(40)
                    }}
                        tintColor={Colors.primary}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={{marginTop: moderateScale(20)}}>

                    <Card
                        containerStyle={{
                            justifyContent: 'space-between'
                        }}
                        title="Push Notifications" icons={Icons.ic_notification}
                        right={
                            <View style={{ marginHorizontal: moderateScale(4) }}>
                                <Switch />
                            </View>
                        }
                    />
                    <Card title="About us" icons={Icons.ic_about} />
                    <Card title="Privacy Policy" icons={Icons.ic_privacy} />
                    <Card title="Term & Conditions" icons={Icons.ic_tnc} />
                </View>
                <View style={{ padding: moderateScale(55) }} />

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

export default Profile;