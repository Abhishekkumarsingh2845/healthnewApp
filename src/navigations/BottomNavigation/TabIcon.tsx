import { Image, StyleSheet, View, Text, ImageSourcePropType } from "react-native"


import { Size } from "../../config/size.config"
import { moderateScale } from "react-native-size-matters"
import { Icons } from "../../generated/image.assets"
import { Fonts } from "../../config/font.config"
import { FontStyle } from "../../config/style.config"
import { Colors } from "../../config/colors.config"
import { ReactNode } from "react"

export interface TabIconProps {
    label: String,
    icon: ImageSourcePropType,
    activeIcon: ImageSourcePropType,
    isActive?: boolean,
    isStartIndex?: boolean
    isLastIndex?: boolean
}
const TabIcon = (props: TabIconProps) => {
    const { label, icon, isActive, activeIcon, isLastIndex, isStartIndex } = props;
    const Icon = icon;
    const ActiveIcon = activeIcon;
    return <>
        <View style={[styles.contianer, (!isActive) && styles.activeContainer, (isStartIndex) && styles.leftCurve, isLastIndex && styles.rightCurve]} >
            <View style={styles.box}>
                {
                        <>
                            <Image source={props.icon} resizeMode={'contain'} style={{width:moderateScale(25), height:moderateScale(25)}} />
                            <Text  style={[FontStyle.titleSemibold, { fontSize: moderateScale(12), color:Colors.white }]} >
                                {props.label}
                            </Text>
                        </> 
                        
                }
            </View>
            


        </View>
    </>
}



const styles = StyleSheet.create({
    contianer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    box:{
        width: '100%',
                alignItems:'center',
                justifyContent:'center',
                gap:moderateScale(3)
    },
    leftCurve: {
        borderTopLeftRadius: moderateScale(15)
    },
    rightCurve: {
        borderTopRightRadius: moderateScale(15)
    },
    activeContainer: {
        backgroundColor: Colors.primary
    },
    imgStyle: {
        height: 22,
        width: 22
    },
    labelStyle: {
        color: 'white',
        fontSize: 10,
        marginVertical: 2
    },
    activeBar: {
        borderRadius: 20,
        width: "65%",
        padding: 2,
    }
})
export default TabIcon