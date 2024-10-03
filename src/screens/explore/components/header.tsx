import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppImage from "../../../components/AppImage";
import { Icons, Images } from "../../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";

import { Size, Spacing } from "../../../config/size.config";
import { Colors } from "../../../config/colors.config";
import { Fonts } from "../../../config/font.config";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { FontStyle, Style } from "../../../config/style.config";
import { DrawerActions, NavigationProp, StackActions, useNavigation } from "@react-navigation/native";


import { useMemo } from "react";
import { currencyFormatter } from "../../../utils/number";
import SearchBar from "../../../components/SearchBar";
import { Touchable } from "react-native";
import { RootStackParamList } from "../../../navigations/MainNavigation/models";
import { SearchPropType } from "../../search";

interface HeaderPropType {

}

const Header = (prop: HeaderPropType) => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();

    function pushNewScreen(route: string, data: any = {}): void {
        const pushAction = StackActions.push(route, data);
        Nav.dispatch(pushAction);
    }



    // console.log(userStore.user.FirstName, 'name')
    return (
        <>
            <View style={style.headerContainer}>
                {/* Left Section */}
                <View style={[Style.flexRow]}>
                    <AppImage resizeMode={'contain'} source={Images.appLogo} style={style.logo} tintColor={Colors.primary} />
                </View>
                {/* Right Section */}
                <Pressable
                    onPress={() => {
                        Nav.navigate('Notifications')
                    }}
                >
                    <AppImage source={Icons.ic_bell} style={style.icon} />
                </Pressable>
            </View>
            <View style={[Style.flexRow, style.searchContainer ]}>
                <SearchBar
                    placholder={"Search"}
                    label={"Search"}
                    type={'block'}
                    labelStyle={{color: Colors.gray}}
                    right={<></>}
                    left={<>
                    <AppImage source={Icons.ic_search} style={style.searchIcon} />
                    </>}
                    onClick={()=>{
                        Nav.navigate('Search',{onSelect:(data:any)=>{}} as SearchPropType)
                    }}
                    containerStyle={style.search}

                />
                <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    padding: moderateScale(5),
                    borderRadius: moderateScale(5)
                }} >
                    <AppImage resizeMode={'contain'} source={Icons.ic_filter} style={{ width: moderateScale(24), height: moderateScale(24) }} />
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Header;


const style = StyleSheet.create({
    headerContainer: {
        paddingTop: Spacing.topSpace,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: moderateScale(15),

    },
    logo: {
        width: moderateScale(120),
        height: moderateScale(40)
    },
    icon: {
        marginTop: moderateScale(10),
        width: moderateScale(23),
        height: moderateScale(23)
    },
    searchContainer:{
        width:'100%',
        justifyContent: 'space-between'
    },
    search:{
        backgroundColor: '#9EA0A733',
        width: '86%',
        padding:moderateScale(9),
        justifyContent:'flex-start'
    },
    searchIcon:{
        width: moderateScale(20),
         height: moderateScale(20), 
         marginRight:moderateScale(4)
    }


})






