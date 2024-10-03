import { ScrollView, StyleSheet, Text } from "react-native"
import AppSafeAreaView from "../../components/AppSafeAreaView"
import Banner from "./components/banner"
import Header from "./components/header"
import { FontStyle } from "../../config/style.config"
import { moderateScale } from "react-native-size-matters"
import { Colors } from "../../config/colors.config"
import CategorySection from "../../components/CategorySections"
import AppImage from "../../components/AppImage"
import { Icons } from "../../generated/image.assets"
import Card from "../../components/AppComponents/card"
import { Size } from "../../config/size.config"

const NewsDetail = () => {
    return (
        <>
            <AppSafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Header />
                    <Banner />
                    <Text
                        style={[FontStyle.bold, { color: Colors.black, marginVertical: moderateScale(10) }]}
                    >Can this fish exercise reshape your waist? Fitness expert shares his two cents</Text>
                    <Text
                        style={[FontStyle.regular, { lineHeight: moderateScale(24) }]}
                    >Attention, fitness and yoga enthusiasts! There’s an exciting new exercise that promises to accelerate your weight loss journey, strengthen your joints, and improve your gut health. Intrigued? So were we. According to therapeutic exercise and Qigong expert Bama Kim, this “fish exercise” or the fish pose helps improve intestinal health, spine alignment, and offers joint relief. Kim claims that this exercise not only supports weight loss but also helps reshape your waistline. Indianexpress.com spoke to Dr Dharmesh Shah, fitness expert, founder and director of Holistica World, Surat, to understand whether this exercise truly does what it is being claimed. “Yes, the fish exercise does offer benefits, but since it doesn’t involve heavy weights, its impact on the waistline might be limited,” he said. Allow the crown of your head to lightly touch the floor, but ensure that most of your weight is supported by your forearms rather than your head. Keep your legs straight and together, with your feet pointing outward.</Text>

<CategorySection
                        prefixAtTitle={<AppImage source={Icons.ic_latest} style={{ width: moderateScale(20), height: moderateScale(20) }} />}
                        title={"Related"}
                        titleStyle={style.title}
                        headerContainerStyle={style.header}
                        // left={'View All'}
                        moreStyle={style.moreStyle}
                        onViewAllPress={() => {

                        }}
                    >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                new Array(5).fill('').map(()=>{
                                    return(
                                        <Card 
                                        containerStyle={{
                                            width: Size.screenWidth * 0.8,
                                            
                                        }}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                        
                    </CategorySection>
                
                </ScrollView>

            </AppSafeAreaView>
        </>
    )
}

const style = StyleSheet.create({
    title: {
        color: Colors.black,
    },
    header: {
        paddingHorizontal: moderateScale(0)
    },
    moreStyle: {
        color: Colors.primary,
        ...FontStyle.titleSemibold
    }
})

export default NewsDetail