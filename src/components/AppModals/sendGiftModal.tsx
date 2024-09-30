
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppBottomSheet, { AppBottomSheetPropType } from "../AppBottomSheet";
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from "react-native-size-matters";
import { FontStyle, Style } from "../../config/style.config";
import { Fonts } from "../../config/font.config";
import { Size, Spacing } from "../../config/size.config";
import { Colors } from "../../config/colors.config";
import { SVG } from "../../generated/image.assets";
import { SvgProps } from "react-native-svg";
import { useState } from "react";
import AppButton from "../AppButton";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import LottieView from "lottie-react-native";
import { GiftType } from "../../store/interfaces";


const style = StyleSheet.create({
    modalContainerStyle: {
        padding: 0,
        borderTopLeftRadius: moderateScale(10),
        borderTopRightRadius: moderateScale(10),
        // paddingHorizontal: moderateScale(20),
        paddingVertical: Spacing.bottomSpace,
        width: '100%',
        paddingHorizontal: 0,
        height: Size.screenHeight * 0.37
    },
    crossbox: {
        position: 'absolute',
        top: -45,
    },
    cross: {
        borderRadius: 100,
        backgroundColor: Colors.white,
        padding: moderateScale(6)
    },
    rechargeAlert: {
        fontFamily: Fonts.bold,
        fontSize: moderateScale(18),

    },
    message: {
        textAlign: 'center',
        color: '#808D9E',
        marginVertical: moderateScale(12),
        width: '80%',
        alignSelf: 'center'
    },
    sectionTwo: {
        paddingVertical: moderateScale(8),
        borderTopWidth: 1,
        borderTopColor: '#EAECF0'
    },
    choosePack: {
        textAlign: 'center',
        color: '#808D9E',
        marginVertical: moderateScale(8)
    },
    btn: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: moderateScale(10),
        marginVertical: moderateScale(15),
    },
})
interface SendGiftModalPropType extends AppBottomSheetPropType {
    onSendGift: (data: GiftType) => Promise<void>
}
const SendGiftModal = (props: SendGiftModalPropType) => {
    const gifStore = useSelector((state: RootState) => state.gifts);
    const [value, setValue] = useState<null | number>(null);
    const [loading, setLoading] = useState(false);
    return (
        <>
            <AppBottomSheet  {...props}

                modalContainerStyle={style.modalContainerStyle}
            >
                <View style={style.crossbox}>
                    <Pressable style={style.cross} onPress={() => {
                        props.setModalVisible(false);
                    }} >
                        <AntDesign name={'close'} size={moderateScale(16)} />
                    </Pressable>
                </View>
                <View className="flex-1" style={[Style.flexOne, Style.fullWidth,]}>
                    <View className="py-4 " style={[Style.flexMiddle]}>
                        <Text style={[FontStyle.titleSemibold, style.rechargeAlert]} >Gifts</Text>
                    </View>


                    {/* Plans */}
                    <View style={[Style.flexRow, Style.fullWidth
                    ]}>
                        {
                            gifStore.map((item, index) => {
                                return (<GiftCard
                                    price={item.price}
                                    icon={item.image}
                                    key={index} isActive={(index == value)}
                                    onClick={() => {
                                        setValue(index)
                                    }}
                                />)
                            })
                        }

                    </View>
                    <AppButton
                        label={'Send Gifts'}
                        icon={
                            <View className="mx-2">
                                <SVG.ic_gift width={moderateScale(20)} />
                            </View>
                        }
                        loading={loading}
                        btnstyle={style.btn}
                        textStyle={{}}
                        onClick={async()=>{
                            setLoading(true);
                            await  props.onSendGift(gifStore[value??0])
                            setLoading(false);
                        }} />
                </View>
            </AppBottomSheet>
        </>
    )
}



interface PlanCardPropType {
    icon: string,
    price: number,
    isActive?: boolean,
    onClick?: () => void
}
const planStyle = StyleSheet.create({
    box: {
        overflow: 'hidden',
        width: '25%',
        borderWidth: 1,
        borderColor: Colors.borderColor,
        height: Size.screenWidth * 0.21,

    },
    planBox: {
        width: '100%',
        height: '100%'
    },
    price: {

        fontSize: moderateScale(12),
        paddingTop: moderateScale(8)

    },
    mostUsed: {
        position: 'absolute',
        bottom: moderateScale(4),
        color: '#F5851D',
        paddingVertical: moderateScale(4),
        fontSize: moderateScale(12)

    },
    extra: {

        position: 'absolute',
        width: '100%',
        color: '#0CAF60',
        backgroundColor: '#C3F5DD',
        textAlign: 'center',
        top: 0,
        fontSize: moderateScale(12),
        padding: moderateScale(4)

    }
})
const GiftCard = ({ price, icon, isActive, onClick }: PlanCardPropType) => {
    const Icon = SVG.star_gift;
    return (<>
        <Pressable style={planStyle.box} onPress={onClick}>

            <View style={[Style.flexMiddle, planStyle.planBox, (isActive) && { backgroundColor: Colors.primary, borderWidth: 0 }]}>
            <LottieView
            source={{uri:icon}}
            style={{
                width:'60%',
                height:'60%',
            }}
            autoPlay
            loop
          />
                <Text style={[planStyle.price, (isActive) && { color: Colors.white }]} >₹{price}</Text>
            </View>
        </Pressable>
    </>)
}

export default SendGiftModal;