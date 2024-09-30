import { Image, ImageBackground, StatusBar, View } from "react-native";
import { StyleSheet } from "react-native";
import { Size } from "../../config/size.config";
import { Colors } from "../../config/colors.config";
import { Images } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import AppSafeAreaView from "../../components/AppSafeAreaView";


const StatusBarHeight = StatusBar.currentHeight??0;
const SplashScreen = ()=>{
    return(
        <>
        <AppSafeAreaView bgColor={Colors.primary}  bottomViewBgColor={Colors.primary}  noPadding={true} >
            <View 
            style={styles.bgContainer}
            >
                <Image source={Images.appLogo} style={styles.logo} resizeMode={'contain'} />
            </View>
        </AppSafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    logo:{
        width:Size.screenWidth * 0.8
    },
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    bgContainer:{
        flex:1,
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    
})

export default SplashScreen;