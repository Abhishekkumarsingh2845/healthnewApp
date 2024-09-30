
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppBottomSheet, { AppBottomSheetPropType } from "../AppBottomSheet";
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from "react-native-size-matters";
import { FontStyle, Style } from "../../config/style.config";
import { Fonts } from "../../config/font.config";
import { Size } from "../../config/size.config";
import { Colors } from "../../config/colors.config";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { RechargePlanType } from "../../store/interfaces";
import { useMemo } from "react";


const style = StyleSheet.create({
    modalContainerStyle: {
        padding: 0,
        paddingHorizontal: moderateScale(20),
        minHeight: Size.screenHeight * 0.7
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
        color: '#F5851D'
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
    }
})
interface RechargeModalPropType extends AppBottomSheetPropType{
    onSelect:(data:RechargePlanType)=>void,
    plans?:Array<RechargePlanType>
}
const RechargeModal = (props: RechargeModalPropType) => {
    const rechargePlanStore = useSelector((state:RootState)=>state.rechargePlan)
    const plans:Array<RechargePlanType> = useMemo(()=>{
            // debugger
            return (props.plans!= undefined)?props.plans:rechargePlanStore
    },[props.plans, rechargePlanStore])
    return (
        <>
            <AppBottomSheet  {...props}
                modalContainerStyle={style.modalContainerStyle}
            >
                <View style={style.crossbox}>
                    <Pressable style={style.cross}
                    onPress={()=>{
                        props.setModalVisible(false);
                    }}
                    >
                        <AntDesign name={'close'} size={moderateScale(16)} />
                    </Pressable>
                </View>
                <View style={[Style.flexOne, Style.fullWidth]}>
                    <View style={[Style.flexMiddle]}>
                        <Foundation name={'alert'} size={moderateScale(60)} color={'#F5851D'} />
                        <Text style={[FontStyle.titleSemibold, style.rechargeAlert]} >Recharge Alert</Text>
                    </View>
                    {/* <Text
                        style={[FontStyle.regular, style.message]}
                    >To start chat with Aman now: Minimum ₹25 balance required.</Text> */}

                    <View className="mt-2" style={[Style.flexMiddle, style.sectionTwo]}>
                        <Text style={[FontStyle.titleSemibold, { fontFamily: Fonts.bold, }]} >Recharge Packs</Text>
                        <Text
                            style={[FontStyle.regular, style.choosePack]}
                        >choose from the available recharge packs</Text>
                    </View>

                    {/* Plans */}
                    <View style={[Style.flexRow,
                    {
                        paddingBottom: "10%",
                        gap: Size.screenWidth * 0.04
                    }
                    ]}>
                        
                        {
                            plans.map((item, index) => {
                                return (<PlanCard {...item} key={index} onSelect={props.onSelect} />)
                            })
                        }

                    </View>
                </View>
            </AppBottomSheet>
        </>
    )
}

const planStyle = StyleSheet.create({
    box: {
        overflow: 'hidden',
        borderRadius: moderateScale(8),
    },
    planBox: {
        width: Size.screenWidth * 0.26,
        height: Size.screenWidth * 0.26,
        borderRadius: moderateScale(8),
        backgroundColor: '#F2F4F7',
        borderWidth: 1,
        borderColor: '#EAECF0',
        position: 'relative'
    },
    price: {

        fontSize: moderateScale(24),
        paddingTop: moderateScale(4)

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


interface PlanCardPropType extends  RechargePlanType {
    onSelect:(data:RechargePlanType)=>void
}
const PlanCard = (props:PlanCardPropType) => {
    return (<>
        <Pressable onPress={()=>{
            props.onSelect(props)
        }}  style={planStyle.box}>

            <View style={[Style.flexMiddle, planStyle.planBox]}>

                <Text style={[
                    FontStyle.titleSemibold,
                    planStyle.price
                ]}>₹{props.Amount}</Text>
                {
                    (props?.tag?.trim()?.length>1) &&
                    <Text style={[FontStyle.titleSemibold, planStyle.mostUsed]}>
                       {props.tag}
                    </Text>
                }


                {
                    (props.Discount>0) &&
                    <Text style={[FontStyle.title, planStyle.extra]}>
                        {props.Discount}% Extra
                    </Text>
                }
            </View>
        </Pressable>
    </>)
}

export default RechargeModal;