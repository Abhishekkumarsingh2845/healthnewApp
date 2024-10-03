import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";


import { moderateScale } from "react-native-size-matters";


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppImage from "../../../components/AppImage";
import { FontStyle, Style } from "../../../config/style.config";
import { Icons } from "../../../generated/image.assets";
import { Colors } from "../../../config/colors.config";
import { Size } from "../../../config/size.config";

interface CardPropType {
    containerStyle?: ViewStyle
}
const Card = (props: CardPropType) => {
    const img = 'https://s3-alpha-sig.figma.com/img/654b/d028/8e14ea136d4148145511922cc09e4767?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Tvaz5PXJUdTT~127ESe8nRn~KlLAe9SO1khl-6SuS-BoM0rQctv2Dq-mpdzkEu-nW3DnajeH~TiZftGl-aHYlhSFdOYNy2nu9t7cdI5PJUV1Oig1SAz0zWlHecVqvzBhFYISB48zIrUCIFuxUYRqc~-H5iA~Jlo4iF-8Hg8ziP983UHpi66cpEBfr4fuWsWiFoHGkIw-ANe43fpeMYecmAyP3reqXJev18wTB9uOPPRTz0-8zixJO1BVeI71q52N8Fcxyvel5Wrs8dMKo2-2zmmE42GmyyeFT85DjnxOiKUOf6Tltu9fF4CMoF11CXp2YB6SMw8gWS~cUhAW3P64wg__'
    return (
        <>
            <View style={[style.box]}>

                <View style={[Style.flexRow, { padding: moderateScale(2), alignItems: 'flex-start', gap: moderateScale(10) }]}>
                    <AppImage source={{uri:img}}
                    style={{
                        width: moderateScale(60),
                        height: moderateScale(60),
                        borderRadius: moderateScale(10)
                    }}
                    
                    />
                    <View style={[Style.flexOne, {gap: moderateScale(4)}]}>
                        <Text style={[FontStyle.bold, { color: Colors.black, justifyContent: 'space-between', fontSize: moderateScale(15) }]}>
                            Best whey protein for beginners: 10 top choices
                        </Text>
                        <View style={[Style.flexRow, { gap: moderateScale(5), margin: moderateScale(4) }]}>
                            <AppImage source={Icons.ic_nutrition} style={{
                                width: moderateScale(20),
                                height: moderateScale(20)
                            }} />
                            <Text>Nutrition</Text>
                        </View>
                    </View>
                    <View style={[Style.flexRow, { gap: moderateScale(4) }]}>

                        <Text style={[FontStyle.title, { color: Colors.gray }]} >2h ago</Text>
                    </View>
                </View>
            </View>
        </>
    )
}

const style = StyleSheet.create({
    box: {
        // width:Size.screenWidth * 0.85,
        // marginVertical: moderateScale(12),
        backgroundColor: Colors.white,
        padding: moderateScale(12),



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