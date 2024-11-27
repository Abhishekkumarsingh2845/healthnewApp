import { Text, View } from "react-native"
import BackButton from "../../../components/BackButton"
import { FontStyle, Style } from "../../../config/style.config"
import { Colors } from "../../../config/colors.config"
import { moderateScale } from "react-native-size-matters"
import { Spacing } from "../../../config/size.config"
import { HeaderPropType } from "../types/interface"

const Header = (props:HeaderPropType) => {
    return (
        <>
            <View style={[Style.flexRow, { alignItems: 'center', gap: moderateScale(3), marginTop: Spacing.topSpace, alignSelf: 'center', justifyContent: 'center', width: '100%', paddingBottom:'2%' }]}>
                <BackButton color={Colors.black} size={moderateScale(20)}
                    style={{
                        left: 0
                    }}
                />
                {props.icon}
                <Text style={[FontStyle.bold, { color: Colors.black }]} >{props.title}</Text>
            </View>
        </>
    )
}

export default Header;