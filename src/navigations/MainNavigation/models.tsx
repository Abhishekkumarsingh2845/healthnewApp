import { NavigationProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { AstrologersPropType } from "../../screens/astrologers"
import { ChatWithAstrologerPropType } from "../../screens/chatWithAstrloger"
import { FreeReadingPropType } from "../../screens/freeReading"
import { SelectPlacePropType } from "../../screens/selectplace"
import { VerifyPropType } from "../../screens/verify"
import { MatchMakingReportPropType } from "../../screens/matchMakingReport"
import { CardPickingPropType } from "../../screens/cardPicking"
import { AboutYourSelfPropType } from "../../screens/aboutYourself"
import { BlogDetailPropType } from "../../screens/blogDetail"
import { KundliReportPropType } from "../../screens/kundliReport"
import { HoroscopePropType } from "../../screens/horoscope"
import { KundliPropType } from "../../screens/kundli"
import { SearchAstrologersPropType } from "../../screens/searchAstrologer"
import {  CallRequestPropType } from "../../screens/callRequest"
import { ChatPropType } from "../../screens/chat"
import { AstrologerDetailsPropType } from "../../screens/astrologerDetails"
import { AddKundliPropType } from "../../screens/addKundli"
import { FeedbacksPropType } from "../../screens/feedbacks"
import { ProductsPropType } from "../../screens/products"
import { ProductDetailPropType } from "../../screens/productDetail"
import { OrderSummaryPropType } from "../../screens/orderSummary"
import { AddAddressPropType } from "../../screens/addAddress"
import { RecommendationsPropType } from "../../screens/recommendations"
import { RewardScratchPropType } from "../../screens/rewardScratch"
import { RemedyDetailsPropType } from "../../screens/remedyDetails"
import { VideoPlayPropType } from "../../screens/videoPlay"
import { VideoCallPropType } from "../../screens/videoCall"
import { BookWithPropType } from "../../screens/bookWith"
import { PoojaFormPropType } from "../../screens/poojaForm"
import { SelectSlotPropType } from "../../screens/selectSlot"
import { LivePoojaPropType } from "../../screens/livePooja"
import { HelpSupportPropType } from "../../screens/help&Support"
import { SupportChatPropType } from "../../screens/supportChat"
import { GroupPoojaDetailsPropType } from "../../screens/groupPoojaDetails"
import { LivePropType } from "../../screens/live"

export interface Screen {
    name: keyof RootStackParamList,
    screen: any,
    initailParams?: any,
    options?:any
}


export type RootStackParamList = {
    Demo: undefined,
    YarnProductListing: undefined,
    YantraAddToCart: undefined,
    YantraOrderSummary: undefined,
    YantraAddress: undefined,
    Congratulations: undefined,
    SplashScreen: undefined,
    Onboarding: undefined,
    Login: undefined,
    Verify: VerifyPropType,
    LoginSuccess: undefined,
    Welcome: undefined,
    ConnectThrough: undefined,
    ConnectToWhom: undefined,
    PersonalDetails: undefined,
    FreeReading: FreeReadingPropType,
    CallRequest: CallRequestPropType,
    Chat: ChatPropType
    HealingBraceletProductList: undefined
    HealingBraceletAddToCart: undefined
    HealingBraceletOrderSummary: undefined
    HealingBraceletAddress: undefined
    HealingCandleProductList: undefined
    HealingCandleAddToCart: undefined
    HealingCandleOrderSummary: undefined
    HealingCandleAddress: undefined
    GpOrCmnPujaList: undefined
    GpOrCmnPujaBooking: undefined
    GroupPoojaDetails: GroupPoojaDetailsPropType,
    Home:undefined,
    GpOrCmnPujaOrderSummary: undefined
    GpOrCmnPujaAddress: undefined
    GpOrCmnPujaOrderHistory: undefined
    Wallet: undefined,
    Astrologers:AstrologersPropType,
    AstrologerDetails:AstrologerDetailsPropType,
    StartCardReading:undefined,
    AboutYourSelf:AboutYourSelfPropType,
    CardPicking:CardPickingPropType,
    LivePooja:LivePoojaPropType,
    Feedbacks:FeedbacksPropType,
    Live:LivePropType,
    BottomNavigation:undefined,
    Astroshop:undefined,
    Epooja:undefined,
    EpoojaDetails:undefined,
    BookWith:BookWithPropType,
    Kundli:KundliPropType,
    AddKundli:AddKundliPropType,
    ChatWithAstrologer:ChatWithAstrologerPropType,
    Remedy:undefined,
    BookWithTab:undefined,
    Recommendations:RecommendationsPropType,
    Horoscope:HoroscopePropType,
    SearchAstrologer:SearchAstrologersPropType,
    DrawerNavigation:undefined,
    LiveAstrologers:undefined,
    SupportVideo:undefined,
    Blogs:undefined,
    BlogDetail:BlogDetailPropType,
    OrderHistory:undefined,
    ChatWithAstrologers:undefined,
    Rewards:undefined,
    RewardScratch:RewardScratchPropType,
    KundliReport:KundliReportPropType,
    MatchMaking:undefined,
    NewMatchMaking:undefined,
    Profile:undefined,
    HelpSupport:HelpSupportPropType,
    NotificationSettings:undefined,
    RemedyDetails:RemedyDetailsPropType,
    MatchMakingReport:MatchMakingReportPropType,
    PrivacyPolicy:undefined,
    TermsConditions:undefined,
    AboutUs:undefined,
    DeleteAccount:undefined,
    PoojaForm:PoojaFormPropType,
    SelectSlot:SelectSlotPropType,
    Settings:undefined,
    SelectPlace:SelectPlacePropType,
    Products:ProductsPropType
    ProductDetail:ProductDetailPropType
    OrderSummary:OrderSummaryPropType,
    AddAddress:AddAddressPropType,
    Addresses:undefined,
    VideoPlay:VideoPlayPropType,
    VideoCall:VideoCallPropType,
    SupportChat:SupportChatPropType,
    RefundPolicy:undefined,

}

export type RootNavigationProp = NavigationProp<
 StackNavigationProp<RootStackParamList>
>;

