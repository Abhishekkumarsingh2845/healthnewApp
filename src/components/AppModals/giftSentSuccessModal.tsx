import { Image, StyleSheet, Text, View } from "react-native";
import AppBlurModal, { AppBlurModalPropType } from "../AppBlurModal"
import { Images, SVG } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Fonts } from "../../config/font.config";
import { Colors } from "../../config/colors.config";
import AppButton from "../AppButton";
import { Style } from "../../config/style.config";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { GiftType } from "../../store/interfaces";
import LottieView from "lottie-react-native";


interface GiftSentSuccesModalPropType extends AppBlurModalPropType {
    giftId: string
}

const GiftSentSuccesModal = (props: GiftSentSuccesModalPropType) => {
    const giftStore = useSelector((state: RootState) => state.gifts);
    const gift: GiftType | undefined = useMemo(() => {
        if (props.giftId) {
            return giftStore.find((val) => val.id == props.giftId);
        }

    }, [props.giftId])
    return (
        <AppBlurModal {...props}
            blurType={'dark'}
            modalStyle={{
                backgroundColor: 'transparent'
            }}
        >
            <View style={style.contentConatainer}>
                <SVG.gift_box height={moderateScale(140)} width={'100%'} />
                <Text style={style.desc} >Gift successfully sent.</Text>
                <Text style={style.title}>₹{gift?.price}</Text>
                <LottieView
                    source={{ uri: gift?.image ?? "" }}
                    style={{
                        width: '100%',
                        height: moderateScale(144),
                    }}
                    autoPlay
                    loop
                />

                {/* <SVG.star_gift height={moderateScale(144)} width={'100%'} /> */}
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
    success: {
        height: moderateScale(180)
    },
    bold: {
        fontFamily: Fonts.semibold,
        color: Colors.black
    },
    line: {
        width: '90%',
        height: 1,
        marginTop: moderateScale(8),
        backgroundColor: '#EAECF0'
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: moderateScale(30),
        color: Colors.white,
        paddingVertical: moderateScale(4),

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
        width: '80%',
        fontFamily: Fonts.medium,
        fontSize: moderateScale(16),
        paddingVertical: moderateScale(4),
        color: Colors.white,
        textAlign: 'center',
        lineHeight: moderateScale(23)
    },
})
export default GiftSentSuccesModal;