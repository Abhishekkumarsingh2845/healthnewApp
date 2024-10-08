import { FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { memo, useCallback, useMemo, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigations/MainNavigation/models";
import { Switch } from "react-native-switch";
import Feather from 'react-native-vector-icons/Feather'
const Profile = () => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();
    const navigate = useCallback((route: string) => {
        Nav.navigate(route as any)
    }, [])
    const [isEnabled, setIsEnabled] = useState(false);
    const [toggle, setToggle] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    return (
        <>
            <AppSafeAreaView>

                <View style={[{
                    paddingTop: Spacing.topSpace
                },
                Style.flexMiddle

                ]}>
                    <Image source={Images.appLogo} style={{
                        width: moderateScale(160),
                        height: moderateScale(40)
                    }}
                        tintColor={Colors.primary}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={{ marginTop: moderateScale(20) }}>

                    <Card
                        containerStyle={{
                            justifyContent: 'space-between'
                        }}
                        onClick={()=>{
                            setToggle(!toggle);
                        }}
                        title="Push Notifications" icons={Icons.ic_notification}
                        right={<SwitchBtn toggle={toggle} setToggle={setToggle} />}
                    />
                    <Card title="About us" icons={Icons.ic_about}
                        onClick={() => { navigate('About') }}
                    />
                    <Card title="Privacy Policy" icons={Icons.ic_privacy}
                        onClick={() => { navigate('PrivacyPolicy') }}
                    />
                    <Card title="Term & Conditions" icons={Icons.ic_tnc}
                        onClick={() => { navigate('TermsConditions') }}
                    />
                </View>
                <View style={{ padding: moderateScale(55) }} />

            </AppSafeAreaView>
        </>
    )
}

const InnerCircle = memo(({ toggle }: { toggle: boolean }) => {
    return (
        <View style={[{ flex: 1, backgroundColor: Colors.white, width: '100%', height: '100%', borderRadius: moderateScale(100) }, Style.flexMiddle]}  >
            <Feather name={'check'} color={toggle ? Colors.primary : 'transparent'} size={moderateScale(14)} />
        </View>
    )
})

const SwitchBtn = memo(({ toggle, setToggle }: { toggle: boolean, setToggle: (val: any) => void }) => {
    return (
        <View style={{ marginHorizontal: moderateScale(4), }}>
            <Switch
                value={toggle}
                renderInsideCircle={() => (<InnerCircle toggle={toggle} />)}
                onValueChange={(val) => {}}
                activeText={'On'}
                inActiveText={'Off'}
                circleSize={moderateScale(25)}
                backgroundActive={Colors.primary}
                backgroundInactive={'#BCBCBC'}
                circleActiveColor={'#FFFFFF'}
                circleInActiveColor={'#FFFFFF'}
                circleBorderWidth={3}

                circleBorderActiveColor={Colors.primary}
                circleBorderInactiveColor={'#BCBCBC'}
                changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                renderActiveText={false}
                renderInActiveText={false}
            />
        </View>
    )
})

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