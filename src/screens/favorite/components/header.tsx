import { Image, Text, View } from "react-native"
import { FontStyle, Style } from "../../../config/style.config"
import { moderateScale } from "react-native-size-matters"
import { Spacing } from "../../../config/size.config"
import { Icons } from "../../../generated/image.assets"
import { Colors } from "../../../config/colors.config"
import BackButton from "../../../components/BackButton"

const Header = () => {
    return (
        <View style={[Style.flexRow, { alignItems: 'center', gap: moderateScale(3), paddingTop: Spacing.topSpace, alignSelf: 'center' }]}>
                <BackButton
          color={Colors.black}
          size={moderateScale(20)}
          style={{position: 'relative',right:85}}
        />
            <Image source={Icons.ic_love} tintColor={Colors.error} style={{ width: moderateScale(25), height: moderateScale(25) }} resizeMode={'contain'} />
            <Text style={[FontStyle.bold, { color: Colors.black }]} >Favorites News</Text>
        
        </View>
    )
}

export default Header;