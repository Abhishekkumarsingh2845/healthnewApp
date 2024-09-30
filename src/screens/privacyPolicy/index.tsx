import { Image, StyleSheet, Text, View } from "react-native";
import AppImage from "../../components/AppImage";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import { Images } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle } from "../../config/style.config";
import { Fonts } from "../../config/font.config";

const PrivacyPolicy = () => {
    return (
        <>
            <AppSafeAreaView title="About Us">
                <Image source={Images.appLogo}
                    resizeMode={'contain'}
                    tintColor={Colors.primary}
                    style={styles.logo} />
                    <View  style={{margin: moderateScale(4)}}>

                <Text style={[FontStyle.regular, styles.date]} >Last update: 05/02/2023</Text>
                <Text style={[FontStyle.regular,styles.content]}  >Please read these privacy policy, carefully before using our app operated by us.</Text>
                <Text style={[FontStyle.bold,styles.heading]}  >Privacy Policy</Text>
                
                <Text style={[FontStyle.regular,styles.content]}  >There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. 
If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. 
All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. 
The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</Text>
                    </View>
            </AppSafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    logo: {
        height: moderateScale(40),
        width: moderateScale(120),
        marginVertical: moderateScale(3)
    },
    date: {
        marginVertical: moderateScale(5),
        color:Colors.gray
    },
    content:{
        marginVertical: moderateScale(5),
        color:Colors.black,
        fontSize: moderateScale(16),
        lineHeight: moderateScale(23)

    },
    heading:{
        color:Colors.primary,
        fontSize: moderateScale(19),
        marginVertical: moderateScale(5),
    }
})
export default PrivacyPolicy;