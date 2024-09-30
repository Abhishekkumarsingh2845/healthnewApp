import { Image, ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AppBlurModal, { AppBlurModalPropType } from "../AppBlurModal"
import { Images, SVG } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Fonts } from "../../config/font.config";
import { Colors } from "../../config/colors.config";
import AppButton from "../AppButton";
import AppSafeAreaView from "../AppSafeAreaView";
import { Size, Spacing } from "../../config/size.config";
import AppBottomBar from "../AppBottomBar";
const OFFERS = ["Free Call", "Free Chat", 'Free Live Lessions'];
import Icons from 'react-native-vector-icons/Ionicons'
import { memo, useCallback, useMemo, useState } from "react";
import { AstrologerUserForType, RechargePlanType, RewardAstrologerType, RewardType } from "../../store/interfaces";
import RenderHTML from "react-native-render-html";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigations/MainNavigation/models";
import AppBottomSheet from "../AppBottomSheet";
import { FontStyle, Style } from "../../config/style.config";
import AppImage from "../AppImage";
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { checkIsAvailableForChat } from "../../store/astrologer.slice/network/astrologer.network";
import { KundliPropType } from "../../screens/kundli";
import { showToastMessage } from "../../utils/toast";
import RechargeModal from "./rechargeModal";
import ProceedToPay from "./proceedToPay";


interface RewardClaimModalPropType extends AppBlurModalPropType {
    // giftId: string
    rewardDetails: RewardType
}

const defaultPlan: RechargePlanType = {
    Discount: 0,
    Id: 0,
    Amount: 0,
    tag: ''
}
const RewardClaimModal = (props: RewardClaimModalPropType) => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>()
    const [payModal, setPayModal] = useState(false);
    const [showRechargeModal, setShowRecharegeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<RechargePlanType>(defaultPlan)
    const [astrologerListModalShow, setAstrologerListModalShow] = useState<boolean>(false)

    const rewardTitle = useMemo(() => {
        const data = {
            "0": "Call",
            "1": "Chat",
            "2": "Wallet Amount",
        }
        return data[props.rewardDetails.offerType as keyof typeof data];
    }, [props.rewardDetails])
    const offerType: AstrologerUserForType = useMemo(() => {
        const data = {
            "0": "call",
            "1": "chat",
        }
        return data[props.rewardDetails.offerType as keyof typeof data] as AstrologerUserForType;
    }, [props.rewardDetails])


    const onPlanSelect = useCallback((plan: RechargePlanType) => {
        setSelectedPlan(plan);
        setShowRecharegeModal(false);
        setPayModal(true);
    }, [])
    const onPaymentDone = useCallback(() => {
        props.modalClose(false);
        Nav.goBack();
    }, [])
    return (
        <>
            <Modal
                visible={props.modalOpenFlag}
                animationType={'slide'}


                >
                <AppSafeAreaView bgColor={Colors.white}>

                    <View style={style.contentConatainer}>
                        <View style={style.logo} >
                            <Image source={Images.appLogo} style={style.logoImg} resizeMode={'contain'} />
                        </View>
                        <ImageBackground
                            source={Images.bg_welcome_card}
                            style={style.cardContainer}

                            resizeMode={'cover'}
                        >
                            <Text style={style.cardTitle}>Congratulation</Text>
                            <Text style={style.cardDesc} >You Got <Text style={style.bgGreenText} >Free</Text>  <Text style={style.boldText}>{rewardTitle}</Text> </Text>
                            <OfferDetail details={props.rewardDetails.aboutOffer} />
                            <AppButton
                                btnstyle={{
                                    backgroundColor: Colors.secondary
                                }}
                                textStyle={{
                                    color: Colors.black,
                                    fontSize: moderateScale(14)
                                }}
                                loading={false}
                                onClick={() => {
                                    if (props.rewardDetails.offerType == '2') {
                                        setShowRecharegeModal(true);
                                    } else {
                                        setAstrologerListModalShow(true)
                                    }
                                    // console.log(props.modalOpenFlag, "Modal...")
                                }} label={'Claim Now'} />
                        </ImageBackground>
                    </View>
                </AppSafeAreaView>
                <AppBottomBar
                    btnstyle={style.actionBtn}
                    textStyle={style.actionBtnLabel}
                    loading={false}
                    onClick={() => {
                        props.modalClose(false);
                        Nav.goBack();
                        // pushNewScreen('DrawerNavigation')
                    }}
                    label={'Skip'} />
                {
                    (props.rewardDetails.offerType == '1') &&
                    <AtrologerList
                        offerType={offerType}
                        show={astrologerListModalShow}
                        setShow={setAstrologerListModalShow}
                        astrologers={props.rewardDetails.AstroData}
                        offerid={props.rewardDetails.Id}
                    />
                }
                {
                    (props.rewardDetails.offerType == '2') &&
                    <>
                        <RechargeModal
                            plans={props.rewardDetails.rechargeId}
                            onSelect={onPlanSelect}
                            modalVisible={showRechargeModal}
                            setModalVisible={setShowRecharegeModal} />
                        <ProceedToPay
                            modalVisible={payModal}
                            setModalVisible={setPayModal}
                            onPaymentDone={onPaymentDone}
                            plan={selectedPlan} />
                    </>
                }

            </Modal>

        </>
    )
}


const OfferDetail =  memo((props: { details: string }) => {
    const content = useMemo(() => {
        return `<body>${atob(props.details)}</body>`
    }, [props.details])

    const targetStyle = {
        body: {
            color: 'white'
        }
    }
    return (
        <View style={{
            paddingBottom: moderateScale(20),
        }}>
            <RenderHTML
                source={{ html: content }}
                contentWidth={Size.screenWidth * 0.5}
                tagsStyles={targetStyle}
            />
        </View>
    )
})

interface AtrologerListPropType {
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    astrologers: Array<RewardAstrologerType>,
    offerType: AstrologerUserForType,
    offerid: string
}
const AtrologerList = (props: AtrologerListPropType) => {

    return (
        <>
            <AppBottomSheet modalVisible={props.show} setModalVisible={props.setShow}
                modalContainerStyle={astrologerListStyle.modalContainerStyle}
            >
                <View style={astrologerListStyle.crossbox}>
                    <Pressable style={astrologerListStyle.cross}
                        onPress={() => {
                            props.setShow(false);
                        }}
                    >
                        <AntDesign name={'close'} size={moderateScale(16)} />
                    </Pressable>
                </View>
                <View style={[Style.flexOne, Style.fullWidth,]}>
                    <View className="my-2" style={[Style.flexMiddle,]}>
                        <Text style={[FontStyle.title, { fontFamily: Fonts.bold, fontSize: moderateScale(18) }]} >Select Astrologers</Text>
                    </View>
                    <ScrollView>
                        {
                            props.astrologers.map((item, index) => {
                                return (<AstrologerCard {...item} offerType={props.offerType} offerid={props.offerid} />)
                            })
                        }
                    </ScrollView>
                </View>
            </AppBottomSheet>
        </>
    )
}



interface AstrologerCardPropType extends RewardAstrologerType {
    offerType: AstrologerUserForType,
    offerid: string
}
const AstrologerCard = (props: AstrologerCardPropType) => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>()
    const [loading, setLoading] = useState(false);
    const languages = useMemo(() => {
        return props.language.join(', ')
    }, [props.skillsData])
    const expertises = useMemo(() => {
        return props.skillsData.join(', ')
    }, [props.skillsData])

    const isAstrologerAvailFun = async () => {

        setLoading(true);
        const res = await checkIsAvailableForChat({
            type: props.offerType,
            astroid: props.astroid.toString(),
            waiting: true,
            orderType: 'P'
        });
        if (res.status) {
            if (res.response.internetStatus == "0") {
                Nav.navigate('Kundli', {
                    astroId: props.astroid.toString(),
                    isPromotional: false,
                    orderType: 'chat',
                    orderPromoType: "O",
                    for: 'chat',
                    offerid: props.offerid
                } as unknown as KundliPropType)
            } else {
                showToastMessage(res.message, 'success');
            }
        } else {
            showToastMessage(res.message, 'error');
        }
        setLoading(false)
    }

    return (
        <>
            <View style={astrologerCard.cardBox}>
                <View style={[Style.flexRow, astrologerCard.conPadding]}>

                    <View style={{ position: 'relative', paddingVertical: moderateScale(8), }}>
                        <View style={{ position: 'relative' }}>
                            <AppImage source={{ uri: props.image1 }} style={astrologerCard.img} resizeMode={'cover'} />
                            <View style={[astrologerCard.status, (props.Status == "0") && { backgroundColor: '#F5851D' }]} />
                        </View>
                    </View>

                    <View style={[{ padding: moderateScale(6), flex: 1, gap: moderateScale(5) }]} >
                        <Text style={astrologerCard.name} >{props.fullname}</Text>
                        <SVG.verified width={moderateScale(20)} color={'#10D547'} style={{ position: 'absolute', right: 0, top: moderateScale(6) }} />
                        <View style={[Style.flexRow,]}>

                            <View style={[Style.flexRow, Style.flexOne]}>
                                <SVG.lang width={moderateScale(18)} color={'#808D9E'} />
                                <Text style={astrologerCard.text}>{languages}</Text>
                            </View>
                        </View>

                        <Text style={astrologerCard.expertise}>{expertises}</Text>
                    </View>
                </View>
                <AppButton
                    label={'Select'}
                    loading={loading}

                    btnstyle={astrologerCard.btn}
                    textStyle={astrologerCard.btnText}
                    onClick={() => {
                        isAstrologerAvailFun();
                    }}
                />

            </View>
        </>
    )
}

const style = StyleSheet.create({
    topView: {
        padding: Spacing.topSpace
    },
    backBtn: {
        backgroundColor: '#F6F7F999',
        width: moderateScale(43),
        height: moderateScale(43),
        position: 'relative',
        borderRadius: 40
    },
    logo: {
        height: moderateScale(75),
        width: moderateScale(75),
        padding: moderateScale(4),
        marginVertical: moderateScale(4),
        backgroundColor: Colors.primary

    },
    logoImg: {
        width: '100%',
        height: '100%',
    },
    contentConatainer: {
        flex: 1,
        paddingHorizontal: moderateScale(4),
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardContainer: {
        marginTop: moderateScale(20),
        borderRadius: moderateScale(30),
        padding: moderateScale(24),
        overflow: 'hidden',
        width: Size.screenWidth * 0.8,
    },
    cardTitle: {
        fontFamily: Fonts.bold,
        fontSize: moderateScale(20),
        paddingVertical: moderateScale(4),
        color: Colors.white,
    },
    cardDesc: {
        fontFamily: Fonts.regular,
        fontSize: moderateScale(33),
        paddingVertical: moderateScale(4),
        color: Colors.white,
    },
    bgGreenText: {
        backgroundColor: '#0CAF60'
    },
    boldText: {
        fontFamily: Fonts.bold,
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: moderateScale(30),
        paddingVertical: moderateScale(4),
        textAlign: 'center'

    },
    actionBtn: {
        marginVertical: moderateScale(4),
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: moderateScale(10)
    },
    actionBtnLabel: {
        color: Colors.black
    },
    desc: {
        width: '80%',
        fontFamily: Fonts.regular,
        fontSize: moderateScale(16),
        paddingVertical: moderateScale(4),
        color: '#555555',
        textAlign: 'center'
    },
});

const astrologerListStyle = StyleSheet.create({

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

    choosePack: {
        textAlign: 'center',
        color: '#808D9E',
        marginVertical: moderateScale(8)
    }
})

const astrologerCard = StyleSheet.create({
    cardBox: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        marginVertical: moderateScale(8),
        // padding: moderateScale(12),
        borderRadius: moderateScale(8),
        overflow: 'hidden'
    },
    container: {
        width: moderateScale(120),
        padding: moderateScale(8),
        borderRadius: moderateScale(8),
        overflow: 'hidden',
        marginTop: moderateScale(12),
        marginRight: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#FFD7001A'
    },
    img: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(50)
    },
    starContainer: {
        backgroundColor: Colors.white,
        padding: moderateScale(3),
        width: moderateScale(50),
        justifyContent: 'center',
        borderRadius: moderateScale(100),
        position: 'absolute',
        bottom: moderateScale(-5),
        alignSelf: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 5,
        backgroundColor: '#717171',
        marginHorizontal: moderateScale(4)
    },
    status: {
        width: moderateScale(10),
        height: moderateScale(10),
        borderRadius: moderateScale(10),
        backgroundColor: '#10D547',
        position: 'absolute',
        right: moderateScale(3),
        top: moderateScale(8),
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: moderateScale(14),
        color: '#141414',
        marginHorizontal: moderateScale(4)
    },
    name: {
        fontFamily: Fonts.bold,
        fontSize: moderateScale(18),
        color: Colors.black
    },
    expertise: {
        fontFamily: Fonts.semibold,
        fontSize: moderateScale(12),
        color: Colors.black,
        marginTop: moderateScale(2)
    },
    btn: {
        width: '90%',
        marginBottom: moderateScale(8),
        marginTop: moderateScale(4),
        minHeight: moderateScale(31),
        height: moderateScale(38),
        paddingVertical: moderateScale(0),
        borderRadius: moderateScale(6),
        alignSelf: 'center'
    },
    busybtn: {
        backgroundColor: '#F5851D'
    },
    btnText: {
        fontSize: moderateScale(14)
    },
    discountRate: {
        fontFamily: Fonts.semibold,
        fontSize: moderateScale(16),
        marginHorizontal: moderateScale(4)
    },
    conPadding: {
        paddingHorizontal: moderateScale(12)
    },
    baseRate: {
        fontFamily: Fonts.regular,
        fontSize: moderateScale(14),
        color: '#808D9E',
        textDecorationLine: 'line-through',
        marginHorizontal: moderateScale(4)
    },
    bottomSection: {
        justifyContent: 'space-between',
        marginTop: moderateScale(15),
        paddingVertical: moderateScale(8),
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
    },
    star: { fontFamily: Fonts.regular, marginLeft: 2, color: Colors.black },
    alertBox: {
        backgroundColor: '#FFF0E2',
        paddingVertical: moderateScale(2)
    },
    alertText: {
        fontFamily: Fonts.regular,
        textAlign: 'center',
        fontSize: moderateScale(10),
        color: '#F5851D',
    }
})



export default memo(RewardClaimModal);


