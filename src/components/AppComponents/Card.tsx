import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import AppImage from "../AppImage";
import { Icons } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle, Style } from "../../config/style.config";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Size } from "../../config/size.config";
interface CardPropType{
    containerStyle?:ViewStyle
}
const Card = (props:CardPropType) => {
    const img = 'https://s3-alpha-sig.figma.com/img/c037/8a80/e3250b476a7f3a1d9749f5f222403e08?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NbJPPR4OEC7OLyEfAD6zHsL0nAEg4VB47tWL8PR5pWjpxk5Lw1x1Hv9k3f9dCypF5N1X8Qi4255Qrim~5WFW3qMVkG1IuXV09pZ961MzeUI1JNccNh6Qvbh3o3iUm1lwWt2igGRl8pxk4DaWDU6Im9nP7yjLsiTpy7V8pihCQVCOuHATGt7ILJWg0TESqACk3udqMzWEKEDNF17rP5xDg7WUYDDxPoQUOl4yflVuc~~OPWXs1ROUj2oh--bkuEIheGHI0nsVfYVKgfHcww2-5CRNbPGMBjf0VoDz71JYi8XrVjOK9HqfNcpNDeitRR8qRCFqjCaG11GP8rWsmjEDHg__'
    return (
        <>
            <View style={[style.box,props.containerStyle]}>
                <View style={style.container}>
                    <AppImage source={{ uri: img }} style={style.image} resizeMode={'stretch'} />
                    {/* Overlay */}
                    <View style={style.overlay}>
                        <View style={[Style.flexRow, { justifyContent: 'space-between' }]}>
                            <View style={[Style.flexRow]}>
                                <View style={style.iconContainer}>
                                    <AppImage source={Icons.ic_fitness} style={style.icon} resizeMode={'contain'} tintColor={Colors.white} />
                                </View>
                                <Text style={[FontStyle.titleSemibold, style.label]}>Fitness</Text>
                            </View>
                            <View style={[Style.flexRow, { gap: moderateScale(7) }]}>
                                
                                <View style={[style.iconContainer, style.otherIconsContainer]}>
                                    <AppImage source={Icons.ic_share} style={style.icon} resizeMode={'contain'} tintColor={Colors.white} />
                                </View>
                                <View style={[style.iconContainer, style.otherIconsContainer]}>
                                    <AppImage source={Icons.ic_love} style={style.icon} resizeMode={'contain'} tintColor={Colors.white} />
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={[Style.flexRow, { gap: moderateScale(3) }]}>
                                <Ionicons name={'time-outline'} size={moderateScale(20)} color={Colors.white} />
                                <Text style={[FontStyle.regular, { color: Colors.white, fontSize: moderateScale(12) }]}>20 minutes ago</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[Style.flexRow, { padding: moderateScale(5), alignItems: 'center', gap: moderateScale(10) }]}>
                    <Text style={[FontStyle.bold, { color: Colors.black, width: '80%', justifyContent: 'space-between' }]}>
                        Best whey protein for beginners: 10 top choices
                    </Text>
                    <View style={[Style.flexRow, { gap: moderateScale(4) }]}>
                        <View style={{ borderWidth: 1, borderColor: Colors.borderColor, padding: moderateScale(6), borderRadius: moderateScale(20) }}>
                            <Image source={Icons.ic_like} resizeMode={'contain'} style={{ width: moderateScale(16), height: moderateScale(16) }} />
                        </View>
                        <Text style={[FontStyle.title, { color: Colors.gray }]} >2</Text>
                    </View>
                </View>
                <Text style={[FontStyle.regular, { padding: moderateScale(3), lineHeight: moderateScale(20) }]}>
                    The best whey protein for beginners can help to support your fitness goals. So, check out the top-rated options and optimise your workout.
                    <Text style={[FontStyle.bold, { color: Colors.primary, fontSize: moderateScale(14) }]}>Read more</Text>
                </Text>
            </View>
        </>
    )
}

const style = StyleSheet.create({
    box: {
        width:Size.screenWidth * 0.85,
        marginVertical: moderateScale(12),
        backgroundColor: Colors.white,
        padding: moderateScale(12),
        elevation: 3,
        borderRadius: moderateScale(20),
        marginRight: moderateScale(12)

    },
    container: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: moderateScale(15),

    },
    image: {
        width: '100%',
        height: moderateScale(170),
    },
    overlay: {
        padding: moderateScale(12),
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#0000004D',
        justifyContent: 'space-between'
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
    },
    otherIconsContainer: {
        backgroundColor: '#0000006D'
    }
})

export default Card;