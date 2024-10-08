import { Image, ScrollView, Text, View } from "react-native"
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
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { RootStackParamList } from "../../navigations/MainNavigation/models"

const Favorite = () => {
    const Nav = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <>
            <AppSafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[Style.flexRow, { alignItems: 'center', gap: moderateScale(3), paddingTop: Spacing.topSpace, alignSelf: 'center' }]}>
                        <Image source={Icons.ic_love} tintColor={Colors.error} style={{ width: moderateScale(25), height: moderateScale(25) }} resizeMode={'contain'} />
                        <Text style={[FontStyle.bold, { color: Colors.black }]} >Favorites News</Text>
                    </View>
                    <Categories />
                    <View style={{ alignItems: 'center' }}>
                        {
                            new Array(5).fill('').map((_,index) => {
                                return (
                                    <Card key={index} containerStyle={{
                                        width:Size.screenWidth * 0.9
                                    }} 
                                    onClick={()=>{
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

export default Favorite;