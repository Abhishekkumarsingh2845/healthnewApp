import { ScrollView } from "react-native";
import AppSafeAreaView from "./AppSafeAreaView";
import { Text } from "react-native-paper";
import { BG_COLOR } from "../config/colors";
import { Font } from "../config/typography";
import { s } from "react-native-wind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/MainNavigation/models";
import { RouteProp } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect } from "react";
import RenderHTML from "react-native-render-html";
import { SCREEN_WIDTH } from "../config/constants";
export interface CommonPagePropType extends StackScreenProps<RootStackParamList, 'About'> {
    title: string,
    heading: string,
    content: string
}
const CommonPage = (props: CommonPagePropType) => {
    const { title, heading, content } = props.route.params;

    return (
        <AppSafeAreaView title={title} bgColor={BG_COLOR}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Text style={[Font.titleMedium, s`pt-2`]} >{heading}</Text>
                <RenderHTML
                    contentWidth={SCREEN_WIDTH}
                    source={{
                        html: heading
                    }}
                />
                {/* <Text style={[Font.bodyMedium, s`pt-2`]} >{content}</Text> */}
            </ScrollView>
        </AppSafeAreaView>
    )
}
export default CommonPage;