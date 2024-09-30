import { Image, StyleSheet, Text, View } from "react-native";
import AppBlurModal, { AppBlurModalPropType } from "../AppBlurModal"
import { Images } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Fonts } from "../../config/font.config";
import { Colors } from "../../config/colors.config";
import AppButton from "../AppButton";
import { Style } from "../../config/style.config";
import AppImage from "../AppImage";
import { useCallback, useState } from "react";

interface CancelCallModalPropType extends AppBlurModalPropType{
    onProceed:()=> Promise<void>,
    onCancel:()=>void,
    name:string,
    img:string,
    type:"call" | 'chat'
}



const CancelCallModal = (props: CancelCallModalPropType) => {
    const [loading, setLoading] = useState(false);
    const onProceed = async()=>{
        setLoading(true);
        await props.onProceed()
        setLoading(false);
    }
    return (
        <AppBlurModal {...props}
        
        >
            <View style={style.contentConatainer}>


                <Text style={style.desc} >Do you want to end the {props.type??'chat'} with {props.name}?</Text>
                {/* <View style={style.line} /> */}

                <View style={Style.flexMiddle}>
                    <AppImage source={{uri:props.img}} style={[style.profile, Style.imagePlaceholderStyle ]} />
                </View>
                
                
                <View style={[Style.flexRow, { gap: moderateScale(12), paddingTop: moderateScale(16) }]} >
                    <AppButton label={'No'} btnstyle={style.btnStyle} loading={false} onClick={props.onCancel} />
                    <AppButton label={'Yes'} loaderColor={Colors.black} btnstyle={{ ...style.btnStyle, ...style.borderedBtn }} textStyle={{ color: Colors.black }} loading={loading} onClick={onProceed} />
                </View>
            </View>
        </AppBlurModal>
    )
}

const style = StyleSheet.create({
    contentConatainer: {
        // flex:1,
        paddingHorizontal: moderateScale(4),
        paddingVertical: moderateScale(25),
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red',

    },
    btnStyle: {
        width: '40%',
        borderRadius: moderateScale(10),

    },
    borderedBtn: {
        borderWidth: 1,
        borderColor: Colors.black,
        backgroundColor: 'transparent'
    },
    desc: {
        width: '60%',
        fontFamily: Fonts.regular,
        fontSize: moderateScale(14),
        paddingVertical: moderateScale(4),
        color: '#555555',
        textAlign: 'center',
        lineHeight: moderateScale(23),

    },
    profile:{
        width:moderateScale(80),
        height:moderateScale(80),
        borderRadius:moderateScale(60),
        marginTop:moderateScale(16),
        marginBottom:moderateScale(12)
    }
})
export default CancelCallModal;