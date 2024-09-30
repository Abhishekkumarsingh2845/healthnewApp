import { StyleSheet, Text, View } from "react-native"

import { moderateScale } from "react-native-size-matters"
import AppBottomSheet, { AppBottomSheetPropType } from "../AppBottomSheet"
import { FontStyle } from "../../config/style.config"
import AppButton from "../AppButton"
import { Fonts } from "../../config/font.config"
import { Colors } from "../../config/colors.config"


interface DeleteReportModalPropType extends AppBottomSheetPropType{
    onConfirm:()=>void
}
const LogoutModal  = (props:DeleteReportModalPropType)=>{
    return(
        <>
            <AppBottomSheet modalVisible={props.modalVisible} setModalVisible={props.setModalVisible}>
                <View style={{
                    width: '100%',
                }} >
                    <Text className="text-center" style={[FontStyle.titleSemibold,{fontSize: moderateScale(20)}]} >Logout</Text>
                    <Text style={style.confrimMessage} >Are you sure you want to Logout your account?</Text>
                    <AppButton btnstyle={style.solidBtn} textStyle={{ fontSize: moderateScale(13) }} label={"No"} loading={false} onClick={() => { props.setModalVisible(false) }} />
                    <AppButton btnstyle={style.borderedBtn} textStyle={{ color: Colors.black, fontSize: moderateScale(13) }} label={"Yes"} loading={false} onClick={() => {
                        // pushNewScreen('Chat')
                        props.onConfirm();
                      }} />
                </View>
            </AppBottomSheet>
        </>
    )
}

const style = StyleSheet.create({
    confrimMessage: {
        width: '80%',
        fontFamily: Fonts.regular,
        fontSize: moderateScale(12),
        paddingBottom: moderateScale(14),
        textAlign: 'center',
        alignSelf: 'center',
        lineHeight: moderateScale(26)
    },
    solidBtn: {
        marginBottom: moderateScale(14),
        borderRadius: moderateScale(10),
        minHeight: moderateScale(30)
    },
    borderedBtn: {
        marginBottom: moderateScale(14),
        borderRadius: moderateScale(10),
        minHeight: moderateScale(30),
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.black
    }
})
export default LogoutModal;