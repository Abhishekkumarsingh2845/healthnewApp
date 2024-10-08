import { ScrollView, Text, View } from "react-native"
import AppSafeAreaView from "../../components/AppSafeAreaView"
import Categories from "../../components/AppComponents/categories"
import CategorySection from "../../components/CategorySections"
import { moderateScale } from "react-native-size-matters"
import Card from "../../components/AppComponents/card"
import AppImage from "../../components/AppImage"
import { Icons } from "../../generated/image.assets"
import { FontStyle, Style } from "../../config/style.config"
import { Colors } from "../../config/colors.config"
import { Size, Spacing } from "../../config/size.config"
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParamList } from "../../navigations/MainNavigation/models"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ReactNode } from "react"
import BackButton from "../../components/BackButton"

export interface NewsPropType extends StackScreenProps<RootStackParamList, 'News'> {
    title: string,
    icon: ReactNode
}

const News = (props: NewsPropType) => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();
    const params = props.route.params;
    return (
        <>
            <AppSafeAreaView title={''}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[Style.flexRow, { alignItems: 'center', gap: moderateScale(3), marginTop: Spacing.topSpace, alignSelf: 'center', justifyContent: 'center', width: '100%' }]}>
                        <BackButton color={Colors.black} size={moderateScale(20)}
                            style={{
                                left: 0
                            }}
                        />
                        {params.icon}
                        <Text style={[FontStyle.bold, { color: Colors.black }]} >{params.title}</Text>
                    </View>
                    {/* <Categories /> */}
                    <View style={{ alignItems: 'center' }}>
                        {
                            new Array(5).fill('').map(() => {
                                return (
                                    <Card containerStyle={{
                                        width: Size.screenWidth * 0.9
                                    }}
                                        onClick={() => {
                                            Nav.navigate('NewsDetail')
                                        }}
                                    />
                                )
                            })
                        }
                    </View>
                    <View style={{ padding: moderateScale(55) }} />
                </ScrollView>
            </AppSafeAreaView>
        </>
    )
}

export default News;