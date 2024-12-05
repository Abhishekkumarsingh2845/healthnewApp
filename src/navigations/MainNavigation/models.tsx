import { NavigationProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { SearchPropType } from "../../screens/search"

import { NewsDetailsPropType } from "../../screens/newDetail"
import { NewsPropType } from "../../screens/news/types/interface"


export interface Screen {
    name: keyof RootStackParamList,
    screen: any,
    initailParams?: any,
    options?:any
}


export type RootStackParamList = {
    About:undefined,
    TermsConditions:undefined,
    PrivacyPolicy:undefined,
    BottomNavigation:undefined,
    Search:SearchPropType,
    News:NewsPropType,
    Notifications:undefined,
    NewsDetail:NewsDetailsPropType,
    WebViewScreen: { url: string }; 
}

export type RootNavigationProp = NavigationProp<
 StackNavigationProp<RootStackParamList>
>;

