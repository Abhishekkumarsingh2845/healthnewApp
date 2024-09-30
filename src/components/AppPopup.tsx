import { Modal, Text, View, TextInput, TouchableOpacity, Pressable, ViewStyle, StyleSheet } from "react-native"

import FormField from "./FormField"

import AppButton from "./AppButton"
import Icons from 'react-native-vector-icons/AntDesign'
import { ReactNode, memo } from "react";
import { Colors } from "../config/colors.config";
import { moderateScale } from "react-native-size-matters";

interface AppPopupProps {
    visable: boolean,
    setVisable: (visable: boolean) => void,
    children: ReactNode,
    isPermenent?: boolean,
    icon?: ReactNode,
    title?: string,
    containerStyle?:ViewStyle,
    disablePressable?:boolean
}
const AppPopup = (props: AppPopupProps) => {
    return (
        <>
            <Modal visible={props.visable} transparent={true} animationType={'fade'} >
                <Pressable style={[style.container, { backgroundColor: 'rgba(0,0,0,0.2)' }]} onPress={() => { (!props.disablePressable)&&props.setVisable(false) }}>
                    <View style={[style.modal,props.containerStyle]} >
                        {
                            (!props.isPermenent) &&
                            <TouchableOpacity style={[style.cross, { zIndex: 2 }]} onPress={() => { props.setVisable(false) }}>
                                <Icons name={'close'} size={18} color={'white'} />
                            </TouchableOpacity>
                        }
                        {/* <View style={[s`flex-row items-center justify-center p-2  `,]} >
                            <Text style={[s`text-base   px-2 text-white text-lg font-semibold `]} children={props.title} />
                        </View> */}
                        {props.children}
                    </View>
                </Pressable>
            </Modal>
        </>
    )
}

const style= StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    // w-10/12  bg-white rounded-xl  rounded-xl 
    modal:{
        width:'80%',
        backgroundColor:Colors.white,
        borderRadius: moderateScale(10)
    },
    cross:{
        // s`absolute right-0  p-3`,
        position:'absolute',
        right:0,
        padding: moderateScale(3)
    }
})
export default memo(AppPopup)