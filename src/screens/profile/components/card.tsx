import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";


import { moderateScale } from "react-native-size-matters";


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppImage from "../../../components/AppImage";
import { FontStyle, Style } from "../../../config/style.config";
import { Icons } from "../../../generated/image.assets";
import { Colors } from "../../../config/colors.config";
import { Size } from "../../../config/size.config";
import { ReactNode } from "react";
import { Source } from "react-native-fast-image";

interface CardPropType {
    containerStyle?: ViewStyle,
    title:string,
    icons:Source,
    right?:ReactNode,
    
}
const Card = (props: CardPropType) => {
    const img = 'https://s3-alpha-sig.figma.com/img/654b/d028/8e14ea136d4148145511922cc09e4767?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Tvaz5PXJUdTT~127ESe8nRn~KlLAe9SO1khl-6SuS-BoM0rQctv2Dq-mpdzkEu-nW3DnajeH~TiZftGl-aHYlhSFdOYNy2nu9t7cdI5PJUV1Oig1SAz0zWlHecVqvzBhFYISB48zIrUCIFuxUYRqc~-H5iA~Jlo4iF-8Hg8ziP983UHpi66cpEBfr4fuWsWiFoHGkIw-ANe43fpeMYecmAyP3reqXJev18wTB9uOPPRTz0-8zixJO1BVeI71q52N8Fcxyvel5Wrs8dMKo2-2zmmE42GmyyeFT85DjnxOiKUOf6Tltu9fF4CMoF11CXp2YB6SMw8gWS~cUhAW3P64wg__'
    return (
        <>
            <TouchableOpacity 
               style={[style.container, props.containerStyle]}>
                <AppImage source={props.icons} style={{ width: moderateScale(24), height: moderateScale(24), marginHorizontal: moderateScale(3) }} />
                <Text numberOfLines={1} style={[FontStyle.title, { color: Colors.black,flex:1 }]} >{props.title}</Text>
                {
                    props.right
                }
            </TouchableOpacity>
        </>
    )
}

const style = StyleSheet.create({

    
    container: {
        flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: moderateScale(2),
                    borderRadius: moderateScale(4),
                    gap: moderateScale(4),
                    paddingVertical: moderateScale(10)

    },
    
})

export default Card;