import { NavigationProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { SearchPropType } from "../../screens/search"
import { NewsPropType } from "../../screens/news"


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
    NewsDetail:undefined,
}

export type RootNavigationProp = NavigationProp<
 StackNavigationProp<RootStackParamList>
>;

