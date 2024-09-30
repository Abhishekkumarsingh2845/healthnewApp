
import { Pressable, StyleSheet, Text, TextStyle, View } from "react-native";
import AppBottomSheet, { AppBottomSheetPropType } from "../AppBottomSheet";
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from "react-native-size-matters";
import { FontStyle, Style } from "../../config/style.config";
import { Fonts } from "../../config/font.config";
import { Size } from "../../config/size.config";
import { Colors } from "../../config/colors.config";
import AppButton from "../AppButton";
import { RechargePlanType } from "../../store/interfaces";
import { useMemo, useState } from "react";
import { fetchOrderRazorPayOrderId } from "../../store/wallet.slice/network/wallet.network";
import { showToastMessage } from "../../utils/toast";
import { razorPayCheckoutFun } from "../../utils/razorpay";
import { ServiceResponse } from "../../utils/interfaces";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigations/MainNavigation/models";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getWallet } from "../../store/wallet.slice";

interface ProceedToPayPropType extends AppBottomSheetPropType {
    plan: RechargePlanType,
    onPaymentDone?:()=>void
}

const ProceedToPay = (props: ProceedToPayPropType) => {
    const [loader, setLoader] = useState(false);
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();
    const Dispatch = useDispatch<AppDispatch>()
    const details: Array<OrderDetailType> = useMemo(() => {
        const plan = props.plan;
        const tax = (plan.Amount) * 0.18;
        const discountAmount = (plan.Amount) * (plan.Discount / 100)
        return [
            {
                name: 'Amount',
                value: plan.Amount
            },
            {
                name: 'GST @18%',
                value: tax,

            },
            {
                name: 'Extra Talktime',
                value: discountAmount,
                prefix: '+ ',
                nameStyle: style.textGreenBold,
                valueStyle: style.textGreenBold
            },
            {
                name: 'Total Talktime',
                value: plan.Amount + tax + discountAmount
            },
            {
                name: 'amount to pay',
                value: plan.Amount + tax
            }

        ]
    }, [props.plan])

    const proceedToPay = async () => {
        setLoader(true);
        const res = await fetchOrderRazorPayOrderId({
            amount: details[details.length - 1].value,
            offerid: '',
            notWallet: false
        })
        if (res.status) {
            showToastMessage(res.message, 'success')
            // @ts-ignore
            razorPayCheckoutFun({
                 // @ts-ignore
                options: {
                    name: "MyAstroGuruJi",
                    description: '',
                    image: 'https://new-myastroguruji.s3.ap-south-1.amazonaws.com/1720504642966-Layer_1%20%285%29.png',
                    amount: details[details.length - 1].value,
                },
                onSuccess: (res: ServiceResponse) => {
                    // console.log(res, "Success Res")
                    showToastMessage(res.message, 'success');
                    setLoader(false);  
                    props.setModalVisible(false);
                    if(props.onPaymentDone){
                        props.onPaymentDone();
                    }
                    // @ts-ignore

                },
                onFailed: (res: ServiceResponse) => {
                    // console.log(res, "Failed Res")
                    setLoader(false);
                }
            })
        } else {
            showToastMessage(res.message, 'error')
        }
        setLoader(false);
    }



    return (
        <>
            <AppBottomSheet  {...props}
                modalContainerStyle={style.modalContainerStyle}
            >
                <View style={style.crossbox}>
                    <Pressable style={style.cross} onPress={()=>{
                        props.setModalVisible(false);
                    }}>
                        <AntDesign name={'close'} size={moderateScale(16)} />
                    </Pressable>
                </View>
                <View style={[Style.flexOne, Style.fullWidth]}>


                    <View style={[Style.flexMiddle, style.sectionTwo]}>
                        <Text style={[FontStyle.titleSemibold, { fontFamily: Fonts.bold, fontSize: moderateScale(16) }]} >Recharge Packs</Text>
                        <Text
                            style={[FontStyle.regular, style.choosePack]}
                        >choose from the available recharge packs</Text>
                    </View>
                    <View style={[Style.flexMiddle, { paddingBottom: moderateScale(12) }]}>
                        <Text style={[FontStyle.titleSemibold,
                        style.price]} >₹{details[details.length - 1].value.toFixed(0)}</Text>
                        <Text style={[FontStyle.titleSemibold, { fontFamily: Fonts.bold, fontSize: moderateScale(16) }]} >Payment Details</Text>
                    </View>

                    {/* OrderDetails */}
                    <View style={[
                        {
                            paddingBottom: "10%",
                            width: '100%',
                            alignSelf: 'center'
                        }
                    ]}>
                        <OrderDetails
                            details={details}
                        />
                        <AppButton btnstyle={style.btn} label={'Proceed To Pay'} loading={loader} onClick={proceedToPay}
                        />

                    </View>
                </View>
            </AppBottomSheet>
        </>
    )
}

interface OrderDetailType {
    name: string,
    value: number,
    nameStyle?: TextStyle,
    valueStyle?: TextStyle,
    prefix?: string
}
interface OrderDetailsPropType {
    details: Array<OrderDetailType>
}
const OrderDetails = (props: OrderDetailsPropType) => {
    return (
        <>
            {
                props.details.slice(0, props.details.length - 1).map((item, index) => {
                    return (
                        <View key={index} style={[Style.flexRow, { justifyContent: 'space-between', paddingBottom: moderateScale(12) }]}>
                            <Text style={[style.orderText, item.nameStyle]} >{item.name}</Text>
                            <Text style={[[style.orderText, { color: Colors.black }, item.valueStyle]]} ><Text style={{ color: Colors.black }} >{item.prefix}</Text>₹ {parseFloat(item.value.toString()).toFixed(1)}</Text>
                        </View>
                    )
                })

            }
            <View style={[Style.flexRow, style.totalContainer]}>
                <Text style={[style.total,]} >Total Payable Amount</Text>
                <Text style={[[style.total, { color: Colors.black },]]} >₹ {props.details[props.details.length - 1].value.toFixed(1)}</Text>
            </View>
        </>
    )
}


const style = StyleSheet.create({
    modalContainerStyle: {
        padding: 0,
        paddingHorizontal: moderateScale(20),
        maxHeight: Size.screenHeight * 0.6,
        minHeight: Size.screenHeight * 0.52
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
        paddingTop: moderateScale(16),
        borderTopWidth: 1,
        borderTopColor: '#EAECF0'
    },
    choosePack: {
        textAlign: 'center',
        color: '#808D9E',
        marginVertical: moderateScale(8)
    },
    price: {
        fontSize: moderateScale(30),
        paddingVertical: moderateScale(8)

    },
    textGreenBold: {
        color: '#0CAF60',
        fontFamily: Fonts.semibold
    },
    orderText: {
        fontSize: moderateScale(15),
        color: '#555555',
        fontFamily: Fonts.medium
    },
    total: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.semibold
    },
    totalContainer: {
        justifyContent: 'space-between',
        paddingBottom: moderateScale(12),
        borderTopColor: '#E8E8E8',
        borderTopWidth: 1,
        paddingTop: moderateScale(12),
    },
    btn: {
        marginTop: moderateScale(8),
        borderRadius: moderateScale(12),

    }
})



export default ProceedToPay;