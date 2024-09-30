import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, ImageSourcePropType, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import { DrawerActions, StackActions, useNavigation } from "@react-navigation/native";
import AppPopup from "../../components/AppPopup";
import { useEffect, useMemo, useState } from "react";
import AppButton from "../../components/AppButton";
import { Size } from "../../config/size.config";
import { Images, SVG } from "../../generated/image.assets";
import { Colors } from "../../config/colors.config";
import { FontStyle, Style } from "../../config/style.config";
import AppImage from "../../components/AppImage";
import { Source } from "react-native-fast-image";
import { moderateScale } from "react-native-size-matters";
import { SvgProps } from "react-native-svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store";


const userImage = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const MainSize = 50;
const CustomDrawerContent = (props: any) => {
    const Nav = useNavigation();
    const userStore = useSelector((store: RootState) => store.user);
    const [showDelete, setShowDelete] = useState(false);
    const DrawerList = [
        {
            name: 'My Wallet',
            icon: SVG.my_wallet,
            key: 'Wallet'
        },
        {
            name: 'Chat with Astrologers',
            icon: SVG.chat_astro,
            key: 'Astrologers',
            intaialParmes: { title: 'Chat with Astrologers', type: 'chat',showTitleHeader:true }
        },
        {
            name: 'Talk with Astrologers',
            icon: SVG.talk_astro,
            key: 'Astrologers',
            intaialParmes: { title: 'Talk with Astrologers', type: 'call',showTitleHeader:true }
        },
        {
            name: 'Video Call with Astrologers',
            icon: SVG.video_astro,
            key: 'Astrologers',
            intaialParmes: { title: 'Video with Astrologers', type: 'call',showTitleHeader:true }

        },
        {
            name: 'Live Session',
            icon: SVG.order_history,
            key: 'Live'
        },
        {
            name: 'Order History',
            icon: SVG.order_history,
            key: 'OrderHistory'
        },
        // {
        //     name: 'Remedy',
        //     icon: SVG.order_history,
        //     key: 'Remedy'
        // },
        {
            name: 'Rewards',
            icon: SVG.rewards,
            key: 'Rewards'
        },
        {
            name: 'Daily Horoscope',
            icon: SVG.daily_horoscope,
            key: 'Horoscope'
        },
        {
            name: 'Free kundli',
            icon: SVG.daily_horoscope,
            key: 'Kundli',
            intaialParmes: { for: 'report' }
        },
        {
            name: 'Video for you',
            icon: SVG.video_4_u,
            key: 'SupportVideo'
        },
        {
            name: 'Customer Support',
            icon: SVG.support,
            key: 'HelpSupport'
        },
        {
            name: 'Astroshop',
            icon: SVG.shop,
            key: 'Astroshop'
        },
        {
            name: 'Blogs',
            icon: SVG.blog,
            key: 'Blogs'
        },
        {
            name: 'Settings',
            icon: SVG.blog,
            key: 'Settings'
        },



    ]

    const { name, profileImg } = {
        name: `${userStore.user.FirstName ?? ""} ${userStore.user.LastName ?? ""}`,
        profileImg: { uri: userStore.user.image1 } ?? Images.astroProfile
    }
    



    return (
        <>
            <SafeAreaView className="flex-1 " style={[, { paddingTop: Size.screenHeight * 0.05 }]} >

                <View style={{
                    flex: 1,
                    padding: 8,
                    justifyContent: 'space-between'

                }}>
                    <Pressable >

                        <Profile name={name} profileImg={profileImg}
                            onClosePress={()=>{
                                Nav.dispatch(DrawerActions.closeDrawer())
                            }}
                            onEditPress={() => {
                                Nav.dispatch(DrawerActions.closeDrawer())
                                // @ts-ignore
                                Nav.navigate('Profile');
                            }}
                        />
                    </Pressable>
                    <ScrollView style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            DrawerList.map((_item: any, index: number) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => {
                                        {
                                            Nav.dispatch(DrawerActions.closeDrawer())
                                            // @ts-ignore
                                            Nav.navigate(_item.key, _item.intaialParmes);
                                        }
                                    }}>
                                        <ListTile key={_item.key} name={_item.name} icon={_item.icon} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                    <View className="w-full py-1 items-center">
                        <Text className="text-white" style={[FontStyle.regular]} >Available On</Text>
                        <View className="flex-row py-2">
                            {
                                [1, 2, 3, 4, 5].map((item,index) => {
                                    return (
                                        <View key={index} style={
                                            {
                                                width: moderateScale(30),
                                                height: moderateScale(30),
                                                backgroundColor: '#D9D9D9',
                                                borderRadius: moderateScale(30),
                                                margin: moderateScale(4)
                                            }
                                        } />
                                    )
                                })
                            }
                        </View>
                        <Text className="text-white" style={[FontStyle.regular]} >Version: 1.026</Text>
                    </View>

                </View>
            </SafeAreaView>
        </>
    )
}
interface ProfilePropType {
    name: string,
    profileImg: Source,
    onEditPress?: () => void,
    onClosePress?:()=>void
}
const Profile = ({ name, profileImg, onEditPress, onClosePress }: ProfilePropType) => {

    return (
        <>

            <View style={styles.container}>
                <View className="flex-row items-center  justify-between items-center pb-4" style={[{ width: '100%', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.5)' }]}>
                    <AppImage source={profileImg} style={[styles.profile,Style.imagePlaceholderStyle]} />
                    <View className="mx-2 my-1 flex-1">
                        <Text className="text-white " style={[FontStyle.title, { fontSize: moderateScale(13) }]} >Hello</Text>
                        <Text className="text-white " style={[FontStyle.bold, { fontSize: moderateScale(14) }]} >{name}</Text>
                    </View>
                    <TouchableOpacity className="rounded-full "
                        style={styles.icon}
                        onPress={() => {
                            if (onEditPress) {
                                onEditPress()
                            }
                        }}
                    >
                        <Feather name={'edit'} color={Colors.white} size={moderateScale(14)} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={()=>{
                            if (onClosePress) {
                                onClosePress()
                            }
                        }}
                        className="rounded-full ">
                        <MaterialIcons name={'close'} color={Colors.white} size={moderateScale(15)} />
                    </TouchableOpacity>

                </View>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingBottom: 8
    },
    profile: {
        width: MainSize,
        height: MainSize,
        borderRadius: MainSize,
    },
    logo: {
        height: MainSize,
        resizeMode: 'contain'
    },
    notification: {

    },
    ctaBtn: {
        width: '45%',
        backgroundColor: 'rgba(252, 52, 0, 1)'

    },
    ctaBtnLabel: {
        fontWeight: "600"
    },
    ctaIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginHorizontal: 8
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: moderateScale(30),
        height: moderateScale(30),
        borderWidth: 1,
        marginLeft: moderateScale(10),
        borderColor: Colors.white

    }
})
const delelModalStyle = StyleSheet.create({
    container: {
        height: Size.screenHeight * 0.3,
    },
    box: {

    },
    img: {
        resizeMode: 'contain',
        width: Size.screenWidth * 0.4,
        height: Size.screenWidth * 0.4,
        marginBottom: 8
    },
    title: {


        paddingVertical: 8
    },
    desc: {
        // ...Font.bodyMedium,
        paddingBottom: 8,
        textAlign: 'center',
        width: '70%',
        color: 'rgba(143, 143, 143, 1)'
    },
    iconContainer: {
        padding: 15,
        backgroundColor: '#EFF4FF',
        borderRadius: 40,
    },
    icon: {
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },

})
const ListTile = (props: {
    name: string,
    icon: React.FC<SvgProps>
}) => {
    const Icon = props.icon;
    return (
        <>
            <View className="flex-row items-center p-2 pb-3">
                <Icon width={moderateScale(25)} height={moderateScale(25)} />
                <Text className="px-3" style={[FontStyle.titleSemibold, { color: 'white', fontSize: moderateScale(15) }]}>{props.name}</Text>
            </View>
        </>
    )
}
export default CustomDrawerContent;