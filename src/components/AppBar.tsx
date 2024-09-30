import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackButton from "./BackButton";
import { Size, Spacing } from "../config/size.config";
import { Colors } from "../config/colors.config";
import { Fonts } from "../config/font.config";
import { moderateScale, scale, } from 'react-native-size-matters';
import React, { ReactNode } from "react";
interface AppBarProps {
    title: string,
    onBackPress?: () => void,
    backIconColor?: string,
    containerStyle?: ViewStyle,
    actionsComponents?: ReactNode
}
const AppBar = (props: AppBarProps) => {
    const Nav = useNavigation();
    const { backIconColor = Colors.black } = props;
    return (
        <View style={[styles.container, props.containerStyle]}>
            <View style={[styles.titleContainer]}>
                <BackButton
                    color={backIconColor}
                    size={moderateScale(20)}
                    onPress={props.onBackPress}
                    style={styles.backBtn} />

                <Text numberOfLines={1} style={[, styles.title, { color: backIconColor }]} children={props.title} />
            </View>
            <View style={styles.actionContainer}>
                {
                    props.actionsComponents
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: moderateScale(4)

    },
    actionContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    backBtn: {
        position: 'relative',
        left: 0,
        backgroundColor: Colors.bgBackButton,
        borderRadius: 100,
        padding: moderateScale(10)
    },
    backIcon: {
        paddingHorizontal: 8
    },
    title: {
        width:"73%",
        fontFamily: Fonts.regular,
        fontSize: moderateScale(16),
        color: Colors.black,
        paddingHorizontal: moderateScale(8),
        textTransform: 'capitalize'
    },
    titleContainer: {
        // width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    }
})
export default AppBar;