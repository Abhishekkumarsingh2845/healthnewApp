import { StyleSheet, Text, View } from "react-native";
import AppImage from "../AppImage";
import { Icons } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle, Style } from "../../config/style.config";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const Card = () => {
    const img = 'https://s3-alpha-sig.figma.com/img/c037/8a80/e3250b476a7f3a1d9749f5f222403e08?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NbJPPR4OEC7OLyEfAD6zHsL0nAEg4VB47tWL8PR5pWjpxk5Lw1x1Hv9k3f9dCypF5N1X8Qi4255Qrim~5WFW3qMVkG1IuXV09pZ961MzeUI1JNccNh6Qvbh3o3iUm1lwWt2igGRl8pxk4DaWDU6Im9nP7yjLsiTpy7V8pihCQVCOuHATGt7ILJWg0TESqACk3udqMzWEKEDNF17rP5xDg7WUYDDxPoQUOl4yflVuc~~OPWXs1ROUj2oh--bkuEIheGHI0nsVfYVKgfHcww2-5CRNbPGMBjf0VoDz71JYi8XrVjOK9HqfNcpNDeitRR8qRCFqjCaG11GP8rWsmjEDHg__'
    return (
        <>
            <View style={style.box}>
                <View style={style.container}>
                    <AppImage source={{ uri: img }} style={style.image} resizeMode={'stretch'} />
                    {/* Overlay */}
                    <View style={style.overlay}>
                        <View style={[Style.flexRow,{justifyContent:'space-between'}]}>
                            <View style={[Style.flexRow]}>
                                <View style={style.iconContainer}>
                                    <AppImage source={Icons.ic_fitness} style={style.icon} resizeMode={'contain'} tintColor={Colors.white} />
                                </View>
                                <Text style={[FontStyle.titleSemibold, style.label]}>Fitness</Text>
                            </View>
                            <View style={[Style.flexRow,{gap:moderateScale(7)}]}>
                                <View style={style.iconContainer}>
                                    <MaterialCommunityIcons name={'share'}  style={style.icon}  color={Colors.white} />
                                </View>
                                <View style={style.iconContainer}>
                                    <AppImage source={Icons.ic_fitness} style={style.icon} resizeMode={'contain'} tintColor={Colors.white} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const style = StyleSheet.create({
    box: {
        marginVertical: moderateScale(12),
        color: Colors.white,
        elevation: 2
    },
    container: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: moderateScale(15)
    },
    image: {
        width: '100%',
        height: moderateScale(180),

    },
    overlay: {
        padding: moderateScale(12),
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#0000004D'
    },
    icon: {
        width: moderateScale(16),
        height: moderateScale(16)
    },
    iconContainer: {
        backgroundColor: Colors.black,
        padding: moderateScale(6),
        borderRadius: moderateScale(100)
    },
    label: {
        paddingHorizontal: moderateScale(4),
        color: Colors.white
    }
})

export default Card;