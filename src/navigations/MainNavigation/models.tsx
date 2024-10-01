import { NavigationProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"


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
    BottomNavigation:undefined
}

export type RootNavigationProp = NavigationProp<
 StackNavigationProp<RootStackParamList>
>;

