import { Image, StyleSheet, View } from "react-native";
import BackButton from "../../../components/BackButton";
import AppImage from "../../../components/AppImage";
import { Icons, Images } from "../../../generated/image.assets";
import { Style } from "../../../config/style.config";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../../config/colors.config";
import { Spacing } from "../../../config/size.config";

const Header = () => {
    return (
        <View style={[Style.flexRow, { alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.topSpace }]}>
            <View style={[Style.flexRow, { alignItems: 'center', justifyContent:'flex-start' }]} >
                <BackButton color={Colors.black} size={moderateScale(20)} style={{ position: 'relative' }} />
                <Image source={Images.appLogo} resizeMode={'contain'} tintColor={Colors.primary} style={{ width: moderateScale(105), height: moderateScale(40) }} />
            </View>
            <View style={[Style.flexRow, { alignItems: 'center', gap: moderateScale(10), paddingTop: moderateScale(6) }]}>
                <Image resizeMode={'contain'} source={Icons.ic_heart} style={style.icon} tintColor={Colors.black} />
                <Image resizeMode={'contain'} source={Icons.ic_move} style={style.icon} tintColor={Colors.black} />
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    icon: {
        width: moderateScale(24),
        height: moderateScale(24),
    }
    
})
export default Header;