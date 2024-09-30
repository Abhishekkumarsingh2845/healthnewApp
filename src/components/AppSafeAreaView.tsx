import { ReactNode } from "react"
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View, FlatList } from "react-native"
import BgDesign from "./BgDesign"
import AppBar from "./AppBar"
import { ViewStyle } from "react-native"
import React from "react"
import { Colors } from "../config/colors.config"
import { Spacing } from "../config/size.config"
import { moderateScale } from "react-native-size-matters"


// import { useSelector } from "react-redux"
// import { RootState } from "@store/index"
// import { getThemeColorByUserType } from "@utils/colorFun"

interface AppSafeAreaViewProps {
    children: ReactNode,
    title?: string
    withBg?: boolean,
    bgColor?: string,
    noPadding?: boolean
    containerStyle?: ViewStyle,
    appBarContainerStyle?: ViewStyle,
    backButtonIconColor?: string,
    bottomViewBgColor?: string
    footerComponent?: ReactNode,
    actionComponents?:ReactNode
    onBackPress?: () => void,
}
const AppSafeAreaView = (props: AppSafeAreaViewProps) => {
    const { appBarContainerStyle = { backgroundColor: Colors.white }, backButtonIconColor = Colors.black } = props;
    return (
        <>
            <StatusBar barStyle={'dark-content'} translucent={true}
                backgroundColor={'transparent'}
            />
            <KeyboardAvoidingView style={styles.keyboardAvoidViewStyle} behavior={Platform.OS == 'android' ? 'height' : 'padding'} >
                <View style={[styles.safeViewStyle, { backgroundColor: (props.bgColor) ? props.bgColor : 'white', }]}  >
                    {
                        props.title && (<><View  style={[{ paddingTop: Platform.OS == 'android' ? "12%" : Spacing.topSpace, paddingHorizontal: moderateScale(14) }, appBarContainerStyle]} ><AppBar backIconColor={backButtonIconColor} title={props.title} onBackPress={(props.onBackPress) && props.onBackPress} actionsComponents={props.actionComponents} /></View></>)
                    }
                    <View style={[{ paddingTop: 0, paddingHorizontal: props.noPadding ? 0 : moderateScale(14), overflow: 'hidden', flex: 1, ...props.containerStyle },]}>
                        {
                            props.children
                        }
                    </View>
                    {
                        props.footerComponent
                    }


                </View>
            </KeyboardAvoidingView>
            {
                Platform.OS == 'ios' && <View style={{ height: Spacing.bottomSpace, width: '100%', backgroundColor: props.bottomViewBgColor ? props.bottomViewBgColor : 'white' }} />
            }

        </>

    )
}
const styles = StyleSheet.create({
    safeViewStyle: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
        // marginTop: (Platform.OS == 'android') ? StatusBar.currentHeight  : 0,
        paddingBottom: (Platform.OS == 'android') ? 0 : 0
    },
    keyboardAvoidViewStyle: {
        flex: 1
    }
})
export default AppSafeAreaView;