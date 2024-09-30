import { Image, StyleSheet, View, Text } from "react-native"


import { SvgProps } from "react-native-svg"
import { Size } from "../../config/size.config"
import { moderateScale } from "react-native-size-matters"
import { Icons, SVG } from "../../generated/image.assets"
import Animated, { FadeIn } from "react-native-reanimated"
import { Fonts } from "../../config/font.config"
import { FontStyle } from "../../config/style.config"
import { Colors } from "../../config/colors.config"

export interface TabIconProps {
    label: String,
    icon: React.FC<SvgProps>,
    activeIcon: React.FC<SvgProps>,
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
            <View style={{
                width: '100%',
                paddingTop: moderateScale(12)
            }}>
                {
                    (isActive) ?
                        <>
                            <ActiveIcon width={'100%'} height={moderateScale(20)} />
                            <Text className="text-[#FFF212] text-center" style={[FontStyle.title, { fontSize: moderateScale(11) }]} >
                                {props.label}
                            </Text>
                        </> :
                        <Icon width={'100%'} height={moderateScale(20)} />
                }
            </View>
            {
                isActive &&
                <ActiveBGLayer/>
            }


        </View>
    </>
}

const ActiveBGLayer = () => {
    return (
        <View
            style={{
                overflow: 'hidden',
                position: 'absolute',
                zIndex: -1,
            }}
        >
            <SVG.ac_bt_bg
                width={Size.screenWidth * 0.23}
                height={moderateScale(55)}
                color={Colors.primary}
                style={{
                    transform:[{scale:1.1,},{translateX: -1}],
                    
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contianer: {
        // paddingHorizontal: 4,
        width: Size.screenWidth * 0.23,
        height: moderateScale(55),
        alignItems: 'center',
        justifyContent: 'center',
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